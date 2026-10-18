// ==================== ADD / EDIT TRADE MODAL ====================
import React, { useState, useEffect, useRef } from "react";
import InputField from "./InputField";
import Button from "./Button";
import { useAccountStore } from "../store/useAccountStore";
import { useStrategyStore } from "../store/useStrategyStore";
import { useTradeStore } from "../store/useTradeStore";
import { useSessionStore } from "../store/useSessionStore";
import AddSessionModal from "./AddSessionModal";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

// ⚠️ შენი არსებული ქვემოდალები. ბილიკები/სახელები შეასწორე შენი ფაილების მიხედვით
import ManageStrategiesModal from "./ManageStrategiesModal";
import CreateAccountModal from "./CreateAccountModal";


const MAX_SCREENSHOTS = 6;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const AVAILABLE_EMOTIONS = [
  "Confident", "Anxious", "Excited", "Fearful",
  "Calm", "Frustrated", "Euphoric", "Regretful", "Focused", "Impulsive"
];

const VALID_RESULTS = ["win", "loss", "breakeven", "partial"];

const pad = (n) => String(n).padStart(2, "0");

// ლოკალური თარიღი YYYY-MM-DD (UTC გარეშე, რომ დღე არ გადაიწიოს)
const toLocalDateStr = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const toLocalTimeStr = (d) => `${pad(d.getHours())}${pad(d.getMinutes())}`;
const defaultDateFor = (acc) =>
  acc?.accountType === "Backtest" && acc.anchorDate
    ? toLocalDateStr(new Date(acc.anchorDate))
    : toLocalDateStr(new Date());

const mapRules = (rules = [], checkedIds = []) =>
  rules.map((r) => ({ id: r.ruleId, text: r.text, checked: checkedIds.includes(r.ruleId) }));

// ბაზიდან მოსული result-ის (სტრინგი ან მასივი) ან P&L-ის მიხედვით შედეგის განსაზღვრა
const resolveResult = (trade) => {
  const raw = Array.isArray(trade.result) ? trade.result[0] : trade.result;
  const normalized = typeof raw === "string" ? raw.toLowerCase() : "";
  if (VALID_RESULTS.includes(normalized)) return normalized;
  const p = Number(trade.pnl) || 0;
  return p > 0 ? "win" : p < 0 ? "loss" : "breakeven";
};

export default function AddTradeModal({ isOpen, onClose, onSave, tradeToEdit = null }) {
  const { accounts, activeAccount, fetchAccounts } = useAccountStore();
  const { strategies, fetchStrategies } = useStrategyStore();
  const { logTrade, updateTrade } = useTradeStore();
  const { sessions, fetchSessions } = useSessionStore();
  const [showSessionModal, setShowSessionModal] = useState(false);
  const navigate = useNavigate();

  const [symbol, setSymbol] = useState("");
  const [tradeType, setTradeType] = useState("BUY");
  const [result, setResult] = useState("win");
  const [quantity, setQuantity] = useState("100");
  const [pnl, setPnl] = useState("550.00");
  const [risk, setRisk] = useState("100.00");
  const [riskCurrency, setRiskCurrency] = useState("USD");
  const [tradeDate, setTradeDate] = useState(toLocalDateStr(new Date()));
  const [entryTime, setEntryTime] = useState("0930");
  const [exitTime, setExitTime] = useState("1600");
  const [session, setSession] = useState("");

  const [strategy, setStrategy] = useState("");
  const [account, setAccount] = useState("");
  const [notes, setNotes] = useState("");

  const [screenshotFiles, setScreenshotFiles] = useState([]); // ახალი ფაილები ასატვირთად
  const [screenshots, setScreenshots] = useState([]); // პრევიუები: http ლინკები + blob URL-ები

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [rules, setRules] = useState([]);
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const dateTouched = useRef(false);

  // ქვემოდალები (Add Strategy / Add Account)
  const [showStrategyModal, setShowStrategyModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);

  // ედიტის რეჟიმში სტრატეგიის/წესების ჩასმა უნდა მოხდეს მხოლოდ ერთხელ გახსნაზე
  const editStrategyResolved = useRef(false);

  // ---------- 1) გახსნისას: scroll lock + სიების განახლება ----------
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setError("");
      fetchAccounts();
      fetchStrategies();
      fetchSessions();
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen, fetchAccounts, fetchStrategies, fetchSessions]);

  useEffect(() => {
  if (isOpen) dateTouched.current = false;
  }, [isOpen, tradeToEdit]);
  
  useEffect(() => {
  if (!isOpen || tradeToEdit || dateTouched.current) return;
  const acc = accounts.find((a) => a._id === account);
  if (acc) setTradeDate(defaultDateFor(acc));
}, [isOpen, tradeToEdit, account, accounts]);

  // ---------- 2) ფორმის შევსება/გასუფთავება მხოლოდ გახსნისას ან სხვა ტრეიდზე გადასვლისას ----------
  useEffect(() => {
    if (!isOpen) return;

    editStrategyResolved.current = false;
    setScreenshotFiles([]);
    setTagInput("");

    if (tradeToEdit) {
      setSymbol(tradeToEdit.symbol || "");
      setTradeType(tradeToEdit.type?.toUpperCase() || "BUY");
      setResult(resolveResult(tradeToEdit));
      setQuantity(tradeToEdit.quantity?.toString() || "1");
      setPnl(tradeToEdit.pnl !== undefined && tradeToEdit.pnl !== null ? String(tradeToEdit.pnl) : "0");
      setRisk(tradeToEdit.risk?.toString() || "0");
      setRiskCurrency(tradeToEdit.riskType?.toUpperCase() || "USD");
      setSession(tradeToEdit.session || "");
      setNotes(tradeToEdit.notes || "");
      setSelectedEmotions(tradeToEdit.emotions || []);
      setTags(tradeToEdit.tags || []);
      // account შეიძლება იყოს ObjectId სტრინგი ან populate-ს შემდეგ ობიექტი
      setAccount(tradeToEdit.account?._id || tradeToEdit.account || "");
      setScreenshots(tradeToEdit.images || []);

      if (tradeToEdit.entryDate) {
        const d = new Date(tradeToEdit.entryDate);
        setTradeDate(toLocalDateStr(d));
        setEntryTime(toLocalTimeStr(d));
      }
      if (tradeToEdit.exitDate) {
        setExitTime(toLocalTimeStr(new Date(tradeToEdit.exitDate)));
      }
    } else {
      // ახალი თრეიდი: სუფთა საწყისი მნიშვნელობები
      setSymbol("");
      setTradeType("BUY");
      setResult("win");
      setQuantity("100");
      setPnl("550.00");
      setRisk("100.00");
      setRiskCurrency("USD");
      setTradeDate(toLocalDateStr(new Date()));
      setEntryTime("0930");
      setExitTime("1600");
      setSession("");
      setNotes("");
      setSelectedEmotions([]);
      setTags([]);
      setScreenshots([]);
      setStrategy("");
      setAccount("");
      setRules([]);
    }
  }, [isOpen, tradeToEdit]);

  // ---------- 3) ანგარიშისა და სტრატეგიის განსაზღვრა სიების ჩამოსვლის შემდეგ ----------
  useEffect(() => {
    if (!isOpen) return;

    if (tradeToEdit) {
      if (!editStrategyResolved.current && strategies.length > 0) {
        const foundStrat = strategies.find(
          (s) => s._id === tradeToEdit.strategy || s.strategyName === tradeToEdit.strategy
        );
        if (foundStrat) {
          setStrategy(foundStrat._id);
          setRules(mapRules(foundStrat.rules, tradeToEdit.checkedRules || []));
        }
        editStrategyResolved.current = true;
      }
    } else {
      // დეფოლტი მხოლოდ მაშინ, როცა მიმდინარე არჩევანი არასწორია
      if (accounts.length > 0 && !accounts.some((a) => a._id === account)) {
        setAccount(activeAccount?._id || accounts[0]._id);
      }
      if (strategies.length > 0 && !strategies.some((s) => s._id === strategy)) {
        setStrategy(strategies[0]._id);
        setRules(mapRules(strategies[0].rules));
      }
      if (sessions.length > 0) {
        setSession((prev) =>
          sessions.some((s) => s.sessionName === prev) ? prev : sessions[0].sessionName
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, accounts, strategies, activeAccount, tradeToEdit]);

  // ---------- Result <-> P&L ----------
  const handleResultChange = (val) => {
    const next = Array.isArray(val) ? val[val.length - 1] : val;
    if (!next) return; // იგივე ღილაკზე განმეორებითი დაჭერა არჩევანს არ აუქმებს
    setResult(next);

    const abs = Math.abs(parseFloat(pnl));
    if (next === "breakeven") setPnl("0");
    else if (next === "loss" && abs > 0) setPnl(String(-abs));
    else if (next === "win" && abs > 0) setPnl(String(abs));
    // partial: P&L უცვლელია, შეიძლება ორივე ნიშნის იყოს
  };

  const handlePnlChange = (val) => {
    setPnl(val);
    const n = parseFloat(val);
    if (result === "partial" || !Number.isFinite(n)) return;
    setResult(n > 0 ? "win" : n < 0 ? "loss" : "breakeven");
  };

  // საბოლოო P&L, რომელიც რეალურად ინახება (result-ის მიხედვით ნიშნის გასწორებით)
  const computeFinalPnl = () => {
    const raw = Math.abs(parseFloat(pnl)) || 0;
    if (result === "loss") return -raw;
    if (result === "win") return raw;
    if (result === "breakeven") return 0;
    return parseFloat(pnl) || 0; // partial
  };

  const calculateRR = () => {
    const r = parseFloat(risk);
    if (!r) return "—";
    return `${(computeFinalPnl() / r).toFixed(2)}:1`;
  };

  // ---------- სტრატეგია ----------
  const handleStrategyChange = (stratId) => {
    if (stratId === "ADD_NEW") return;
    setStrategy(stratId);
    const found = strategies.find((s) => s._id === stratId);
    setRules(found?.rules ? mapRules(found.rules) : []);
  };

  // ---------- ემოციები / ტეგები ----------
  const handleEmotionToggle = (emotion) => {
    setSelectedEmotions((prev) =>
      prev.includes(emotion) ? prev.filter((e) => e !== emotion) : [...prev, emotion]
    );
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const t = tagInput.trim();
      if (!tags.includes(t)) setTags([...tags, t]);
      setTagInput("");
    }
  };

  // ---------- სქრინშოტები ----------
  const handleFilesSelected = (e) => {
    const picked = Array.from(e.target.files || []);
    e.target.value = ""; // რომ იგივე ფაილის ხელახლა არჩევა შესაძლებელი იყოს
    if (picked.length === 0) return;

    const remaining = MAX_SCREENSHOTS - screenshots.length;
    if (remaining <= 0) {
      setError(`მაქსიმუმ ${MAX_SCREENSHOTS} ფოტოა დაშვებული.`);
      return;
    }

    const valid = picked.filter((f) => f.size <= MAX_FILE_SIZE).slice(0, remaining);
    if (valid.length < picked.length) {
      setError("ზოგი ფაილი გამოტოვებულია: ზომა მაქსიმუმ 5MB, სულ მაქსიმუმ 6 ფოტო.");
    } else {
      setError("");
    }

    setScreenshotFiles((prev) => [...prev, ...valid]);
    setScreenshots((prev) => [...prev, ...valid.map((f) => URL.createObjectURL(f))]);
  };

  const handleRemoveScreenshot = (index) => {
    const src = screenshots[index];
    if (!src.startsWith("http")) {
      // ახალი (blob) ფოტო: ვაშორებთ screenshotFiles-იდანაც, ინდექსი blob-ებს შორის
      const localIndex = screenshots.slice(0, index).filter((s) => !s.startsWith("http")).length;
      setScreenshotFiles((prev) => prev.filter((_, i) => i !== localIndex));
      URL.revokeObjectURL(src);
    }
    setScreenshots((prev) => prev.filter((_, i) => i !== index));
  };

  // ---------- შენახვა ----------
  const handleSave = async () => {
    if (!symbol.trim()) {
      setError("Symbol is required");
      return;
    }
    if (!account) {
      setError("Please select a trading account");
      return;
    }

    if (!session) {
      setError("Please select a trading session, or add a new one");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. ფოტოები: ძველი ლინკები რჩება, ახალი იტვირთება
      let uploadedImages = screenshots.filter((src) => src.startsWith("http"));

      if (screenshotFiles.length > 0) {
        const mediaFormData = new FormData();
        screenshotFiles.forEach((file) => mediaFormData.append("images", file));

        const uploadRes = await axiosInstance.post("/upload/trade-images", mediaFormData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        uploadedImages = [...uploadedImages, ...(uploadRes.data.imageUrls || [])].slice(0, MAX_SCREENSHOTS);
      }

      // 2. თარიღები (ლოკალური დრო -> ISO)
      const entryHours = entryTime.slice(0, 2).padStart(2, "0") || "00";
      const entryMinutes = entryTime.slice(2, 4).padEnd(2, "0") || "00";
      const exitHours = exitTime.slice(0, 2).padStart(2, "0") || "00";
      const exitMinutes = exitTime.slice(2, 4).padEnd(2, "0") || "00";

      const combinedEntryDate = new Date(`${tradeDate}T${entryHours}:${entryMinutes}:00`);
      let combinedExitDate = new Date(`${tradeDate}T${exitHours}:${exitMinutes}:00`);

      if (Number.isNaN(combinedEntryDate.getTime()) || Number.isNaN(combinedExitDate.getTime())) {
        setError("არასწორი თარიღი ან დრო (მაგ. 0930).");
        setLoading(false);
        return;
      }
      // თუ გასვლის დრო შესვლაზე ადრეა, ტრეიდი შუაღამეს გადაჭრია
      if (combinedExitDate < combinedEntryDate) {
        combinedExitDate = new Date(combinedExitDate.getTime() + 24 * 60 * 60 * 1000);
      }

      // 3. P&L და RR result-ის მიხედვით
      const finalPnl = computeFinalPnl();
      const riskNum = parseFloat(risk) || 0;
      const rrValue = finalPnl && riskNum ? parseFloat((finalPnl / riskNum).toFixed(2)) : 0;
      const foundStrat = strategies.find((s) => s._id === strategy);

      const tradeData = {
        account,
        symbol: symbol.toUpperCase().trim(),
        type: tradeType.toLowerCase(),
        quantity: parseInt(quantity) || 1,
        entryPrice: null,
        exitPrice: null,
        entryDate: combinedEntryDate.toISOString(),
        exitDate: combinedExitDate.toISOString(),
        pnl: finalPnl,
        risk: riskNum,
        riskType: riskCurrency.toLowerCase(),
        riskRewardRatio: rrValue,
        session,
        // ახლა ისევ სახელით ინახება (შემდეგ ეტაპზე _id-ზე გადავიყვანთ)
        strategy: foundStrat ? foundStrat.strategyName : strategy,
        checkedRules: rules.filter((r) => r.checked).map((r) => r.id),
        notes,
        emotions: selectedEmotions,
        tags,
        images: uploadedImages
      };

      // 4. შექმნა ან განახლება
      const success = tradeToEdit
        ? await updateTrade(tradeToEdit._id, tradeData)
        : await logTrade(tradeData);

      if (success) {
        if (onSave) onSave({ ...tradeData, id: Date.now() });
        onClose();
        navigate("/journal");
      } else {
        setError(tradeToEdit ? "ვერ მოხერხდა თრეიდის განახლება ბაზაში." : "ვერ მოხერხდა თრეიდის შენახვა ბაზაში.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "შეცდომა მონაცემების დამუშავებისას ან ბაზასთან კავშირისას.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const sessionOptions = [
    ...sessions.map((s) => ({ label: s.sessionName, value: s.sessionName })),
    // ძველი ტრეიდის სესია, რომელიც სიაში აღარ არის, რომ ედიტისას არ დაიკარგოს
    ...(session && !sessions.some((s) => s.sessionName === session)
      ? [{ label: session, value: session }]
      : []),
    { label: "＋ Add Trading Session", value: "ADD_SESSION", isAction: true, textColor: "#0ecb81" }
  ];

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto cursor-zoom-out animate-in fade-in duration-150"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl bg-[#09090b] border border-[#1f2023] rounded-xl p-5 sm:p-6 shadow-2xl relative my-auto cursor-default space-y-6 max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-150 scrollbar-thin scrollbar-thumb-[#1f2023] text-left"
        >
          {/* ჰედერი */}
          <div className="border-b border-[#1f2023]/60 pb-3.5 relative">
            <button onClick={onClose} className="absolute top-0 right-0 text-[#4b5563] hover:text-[#0ecb81] transition-colors cursor-pointer text-sm font-bold">✕</button>
            <h2 className="text-md font-black tracking-tight text-[#f3f4f6] flex items-center gap-2">
              <span className="text-[#0ecb81]">{tradeToEdit ? "📝" : "↗"}</span>
              {tradeToEdit ? "Edit Existing Trade" : "Add New Trade"}
            </h2>
            <p className="text-[11px] text-[#6b7280] font-semibold mt-0.5">
              {tradeToEdit
                ? "Modify the recorded trade details and update your journal database."
                : "Record a new trade to track your performance and analyze your strategy."}
            </p>
          </div>

          {error && (
            <div className="p-3 bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-lg text-xs text-[#ef4444] font-medium text-center">
              {error}
            </div>
          )}

          {/* სექცია 1: Trade Basics */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-[#0ecb81] uppercase tracking-wider flex items-center gap-1.5">// Trade Basics</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Symbol" type="text" placeholder="E.G., MNQ, MES" value={symbol} onChange={setSymbol} />
              <InputField
                label="Trade Type"
                type="select"
                value={tradeType}
                onChange={setTradeType}
                options={[
                  { label: "Buy", value: "BUY", dotColor: "#0ecb81" },
                  { label: "Sell", value: "SELL", dotColor: "#ef4444" }
                ]}
              />
            </div>

            <InputField
              label="Result"
              type="tabs"
              value={[result]}
              onChange={handleResultChange}
              options={[
                { label: "Win", value: "win", dotColor: "#0ecb81" },
                { label: "Loss", value: "loss", dotColor: "#ef4444" },
                { label: "Breakeven", value: "breakeven", dotColor: "#eab308" },
                { label: "Partial", value: "partial", dotColor: "#0ecb81" }
              ]}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Quantity" type="number" placeholder="100" value={quantity} onChange={setQuantity} />
              <InputField
                label="P&L"
                type="number"
                placeholder="550.00"
                value={pnl}
                onChange={handlePnlChange}
                hint={result === "loss" ? "Loss is saved as a negative amount" : undefined}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              <div className="w-full">
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <InputField label="Risk" type="number" placeholder="100.00" value={risk} onChange={setRisk} />
                  </div>
                  <div>
                    <InputField
                      type="select"
                      value={riskCurrency}
                      onChange={setRiskCurrency}
                      options={[{ label: "USD", value: "USD" }, { label: "%", value: "%" }]}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Risk amount in {riskCurrency}</p>
              </div>

              <InputField
                label="R:R Ratio"
                type="text"
                value={calculateRR()}
                disabled={true}
                hint="Auto-calculated from P&L and Risk"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* <InputField label="Trade Date" type="date" value={tradeDate} onChange={setTradeDate} /> */}
                            <InputField label="Trade Date" type="date" value={tradeDate} onChange={(v) => { dateTouched.current = true; setTradeDate(v); }} />

              <InputField label="Entry Time" type="time" placeholder="0930" value={entryTime} onChange={setEntryTime} hint="Just type numbers (e.g., 0930)" />
              <InputField label="Exit Time" type="time" placeholder="1600" value={exitTime} onChange={setExitTime} hint="Just type numbers (e.g., 1600)" />
            </div>

            <div className="w-full sm:max-w-md">
              <InputField
                label="Trading Session"
                type="select"
                placeholder="Select a session"
                value={session}
                onChange={(v) => v !== "ADD_SESSION" && setSession(v)}
                onAction={(v) => v === "ADD_SESSION" && setShowSessionModal(true)}
                options={sessionOptions}
              />
            </div>
          </div>

          {/* სექცია 2: Strategy & Trade Context */}
          <div className="space-y-4 pt-4 border-t border-[#1f2023]/60">
            <h3 className="text-xs font-black text-[#0ecb81] uppercase tracking-wider flex items-center gap-1.5">// Strategy & Trade Context</h3>

            <div className="w-full sm:max-w-md">
              <InputField
                label="Strategy"
                type="select"
                value={strategy}
                onChange={handleStrategyChange}
                onAction={(v) => v === "ADD_NEW" && setShowStrategyModal(true)}
                options={[
                  ...strategies.map((s) => ({ label: `✓ ${s.strategyName}`, value: s._id })),
                  { label: "＋ Add New Strategy", value: "ADD_NEW", isAction: true, textColor: "#0ecb81" }
                ]}
              />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black text-[#6b7280] uppercase tracking-widest block">⁝⁝ Strategy Rules</span>
              <div className="bg-[#0d0d0e] border border-[#1f2023] rounded-xl overflow-hidden divide-y divide-[#1f2023]/50">
                {rules.length === 0 ? (
                  <div className="text-xs text-[#4b5563] font-bold px-4 py-3">ამ სტრატეგიას წესები არ აქვს.</div>
                ) : (
                  rules.map((rule) => (
                    <label
                      key={rule.id}
                      className="flex items-center gap-3.5 px-4 py-3 text-xs text-[#9ca3af] font-bold cursor-pointer select-none group hover:bg-[#141517]/30 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={rule.checked}
                        onChange={() => setRules(rules.map((r) => (r.id === rule.id ? { ...r, checked: !r.checked } : r)))}
                        className="w-4 h-4 rounded border-[#1f2023] bg-[#040405] text-[#0ecb81] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#0ecb81]"
                      />
                      <span className="group-hover:text-[#f3f4f6] transition-colors">{rule.text}</span>
                    </label>
                  ))
                )}

                <div className="text-[10px] text-[#4b5563] font-bold uppercase tracking-wider px-4 py-3 bg-[#0a0a0c]/50">
                  {rules.filter((r) => r.checked).length} / {rules.length} rules met
                </div>
              </div>
            </div>

            <div className="w-full sm:max-w-md">
              <InputField
                label="Account"
                type="select"
                value={account}
                onChange={(id) => id !== "ADD_ACCOUNT" && setAccount(id)}
                onAction={(v) => v === "ADD_ACCOUNT" && setShowAccountModal(true)}
                options={[
                  ...accounts.map((acc) => ({
                    label: `📌 ${acc.accountName} ${acc.currency} ${acc.initialBalance.toLocaleString()} • ${acc.accountType.toLowerCase()}`,
                    value: acc._id
                  })),
                  { label: "＋ Add New Account", value: "ADD_ACCOUNT", isAction: true, textColor: "#0ecb81" }
                ]}
              />
            </div>

            {/* ტეგები */}
            <div className="space-y-2">
              <span className="text-[10px] font-black text-[#6b7280] uppercase tracking-widest block">Tags</span>
              <input
                type="text"
                placeholder="Add tags (press Enter)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="w-full bg-[#0d0d0e] text-[#f3f4f6] text-xs border border-[#1f2023] rounded-lg px-4 py-2.5 placeholder-[#4b5563] focus:outline-none focus:border-[#0ecb81] transition-all"
              />
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {tags.map((tg) => (
                    <span key={tg} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1f2023] text-xs font-bold text-[#9ca3af] border border-[#2f3036]">
                      {tg}
                      <button type="button" onClick={() => setTags(tags.filter((t) => t !== tg))} className="text-[#ef4444] hover:text-[#f3f4f6] font-bold">✕</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* ემოციები */}
            <div className="space-y-2">
              <span className="text-[10px] font-black text-[#6b7280] uppercase tracking-widest block">Emotions</span>
              <div className="bg-[#0d0d0e] border border-[#1f2023] rounded-xl p-4 flex flex-wrap gap-2">
                {AVAILABLE_EMOTIONS.map((emotion) => {
                  const isSelected = selectedEmotions.includes(emotion);
                  return (
                    <button
                      key={emotion}
                      type="button"
                      onClick={() => handleEmotionToggle(emotion)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${isSelected
                          ? "bg-[#0ecb81]/10 border-[#0ecb81] text-[#0ecb81] shadow-sm shadow-[#0ecb81]/5"
                          : "bg-[#040405] border-[#1f2023] text-[#9ca3af] hover:text-[#f3f4f6] hover:border-[#2f3036]"
                        }`}
                    >
                      {emotion}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* სექცია 3: Screenshots */}
          <div className="space-y-3 pt-4 border-t border-[#1f2023]/60">
            <span className="text-[10px] font-black text-[#6b7280] uppercase tracking-widest block">
              Screenshots ({screenshots.length}/{MAX_SCREENSHOTS})
            </span>
            <div className="w-full bg-[#0d0d0e] border border-[#1f2023] rounded-xl p-5 text-center relative group min-h-[140px] flex flex-col justify-center items-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFilesSelected}
                className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center gap-1.5 text-[#4b5563]">
                <span className="text-xl group-hover:text-[#0ecb81] transition-colors select-none">📷</span>
                <div className="space-y-0.5">
                  <h5 className="text-xs font-bold text-[#f3f4f6]">Choose Files / Upload chart screenshots</h5>
                  <p className="text-[10px] text-[#4b5563] font-medium leading-relaxed max-w-sm mx-auto">
                    Click above to add chart screenshots (max 6 images, 5MB each)
                  </p>
                </div>
              </div>
            </div>

            {screenshots.length > 0 && (
              <div className="grid grid-cols-5 gap-2.5 mt-3 animate-in fade-in duration-200">
                {screenshots.map((src, index) => (
                  <div key={src} className="relative aspect-square bg-[#141517] rounded-lg overflow-hidden border border-[#1f2023]">
                    <img src={src} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveScreenshot(index)}
                      className="absolute top-1 right-1 bg-black/80 border border-[#1f2023] text-[#ef4444] hover:text-white rounded-md w-5 h-5 flex items-center justify-center text-[10px] font-bold transition-colors z-20 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* სექცია 4: Notes */}
          <div className="space-y-3 pt-4 border-t border-[#1f2023]/60">
            <h3 className="text-xs font-black text-[#0ecb81] uppercase tracking-wider flex items-center gap-1.5">// Notes</h3>
            <textarea
              rows={4}
              placeholder="Market conditions, rationale, lessons learned..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#0d0d0e] text-[#f3f4f6] text-sm border border-[#1f2023] rounded-xl p-4 placeholder-[#4b5563] focus:outline-none focus:border-[#0ecb81] transition-all resize-none leading-relaxed"
            />
            <span className="text-[10px] text-[#4b5563] font-medium block pl-0.5">
              Record your thoughts, market analysis, and key learnings from this trade.
            </span>
          </div>

          {/* ქვედა მართვის ზოლი */}
          <div className="pt-4 border-t border-[#1f2023]/60 flex items-center justify-between">
            <Button variant="outline" onClick={onClose} className="!text-xs !py-2.5">
              Cancel
            </Button>
            <Button
              variant="solid"
              disabled={loading}
              className="!bg-[#0ecb81] !text-[#040405] font-black hover:!bg-[#0bb572] !text-xs !py-2.5 shadow-lg shadow-[#0ecb81]/5 active:scale-[0.98]"
              onClick={handleSave}
            >
              {loading ? "Processing..." : tradeToEdit ? "Save Changes" : "+ Save Trade"}
            </Button>
          </div>
        </div>
      </div>

      {/* ქვემოდალები გარე overlay-ის გარეთაა, რომ მათზე კლიკმა Add Trade არ დახუროს. მათ z-[60] სჭირდებათ */}
      {showStrategyModal && (
        <ManageStrategiesModal
          isOpen
          onClose={() => setShowStrategyModal(false)}
          onSaved={async (created) => {
            await fetchStrategies();
            if (created?._id) {
              setStrategy(created._id);
              setRules(mapRules(created.rules));
            }
            setShowStrategyModal(false);
          }}
        />
      )}

      {showAccountModal && (
        <CreateAccountModal
          isOpen
          onClose={() => setShowAccountModal(false)}
          onSaved={async (created) => {
            await fetchAccounts();
            if (created?._id) setAccount(created._id);
            setShowAccountModal(false);
          }}
        />
      )}

      {showSessionModal && (
        <AddSessionModal
          isOpen
          onClose={() => setShowSessionModal(false)}
          onSaved={(created) => {
            setSession(created.sessionName);
            setShowSessionModal(false);
          }}
        />
      )}
    </>
  );
}