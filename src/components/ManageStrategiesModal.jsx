// ==================== MANAGE STRATEGIES MODAL ====================
import React, { useState, useEffect } from "react";
import InputField from "./InputField";
import Button from "./Button";
import Tag from "./Tag";
import { useStrategyStore } from "../store/useStrategyStore";
import useScrollLock from "../hooks/useScrollLock";
import ConfirmDelete from "./ConfirmDelete";

// ახალი წესის უნიკალური ID. არსებულ წესებს ID არასდროს ეცვლება
const newRuleId = () => `rule-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export default function ManageStrategiesModal({ isOpen, onClose }) {
  const { strategies, fetchStrategies, createStrategy, updateStrategy, deleteStrategy, loading } = useStrategyStore();

  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [selectedStrategyId, setSelectedStrategyId] = useState(null);

  const [strategyName, setStrategyName] = useState("");
  const [description, setDescription] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // თითოეული წესი: { ruleId, text }. ახალი წესისთვის ruleId = null (ინახება შენახვისას)
  const [checklistItems, setChecklistItems] = useState([]);
  const [newRuleInput, setNewRuleInput] = useState("");
  const [error, setError] = useState("");

  useScrollLock(isOpen);

  // სტრატეგიების ჩატვირთვა მოდალის გახსნისას
  useEffect(() => {
    if (isOpen) fetchStrategies();
  }, [isOpen, fetchStrategies]);

  // ფორმის შევსება მხოლოდ არჩევანის შეცვლისას. `strategies`-ის განახლება
  // (მაგ. შენახვის შემდეგ) ხელით შეყვანილ ტექსტს აღარ გადაწერს
  useEffect(() => {
    if (!isOpen) return;

    if (isCreatingNew) {
      setStrategyName("");
      setDescription("");
      setChecklistItems([]);
      setNewRuleInput("");
    } else if (selectedStrategyId) {
      const found = strategies.find((s) => s._id === selectedStrategyId);
      if (found) {
        setStrategyName(found.strategyName || "");
        setDescription(found.description || "");
        setChecklistItems((found.rules || []).map((r) => ({ ruleId: r.ruleId, text: r.text })));
        setNewRuleInput("");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStrategyId, isCreatingNew, isOpen]);

  // მოდალის დახურვისას მდგომარეობის გასუფთავება
  useEffect(() => {
    if (!isOpen) {
      setIsCreatingNew(false);
      setSelectedStrategyId(null);
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedStrat = strategies.find((s) => s._id === selectedStrategyId);
  const showForm = isCreatingNew || !!selectedStrat;

  const handleAddRule = (e) => {
    if (e) e.preventDefault();
    const text = newRuleInput.trim();
    if (!text) return;
    setChecklistItems([...checklistItems, { ruleId: null, text }]);
    setNewRuleInput("");
  };

  const buildPayload = () => ({
    strategyName: strategyName.trim(),
    description: description.trim(),
    color: "#0ecb81",
    // არსებული ruleId რჩება, ახალს მხოლოდ ახალი წესი იღებს
    rules: checklistItems.map((item) => ({
      ruleId: item.ruleId || newRuleId(),
      text: item.text
    }))
  });

  const storeErrorOr = (fallback) => useStrategyStore.getState().error || fallback;

  const handleCreateStrategy = async () => {
    if (!strategyName.trim()) {
      setError("Strategy name is required");
      return;
    }
    setError("");

    const success = await createStrategy(buildPayload());
    if (success) {
      setStrategyName("");
      setDescription("");
      setChecklistItems([]);
      setIsCreatingNew(false);
    } else {
      setError(storeErrorOr("ვერ მოხერხდა სტრატეგიის შექმნა. სცადეთ თავიდან."));
    }
  };

  const handleUpdateStrategy = async () => {
    if (!selectedStrat) return;
    if (!strategyName.trim()) {
      setError("Strategy name is required");
      return;
    }
    setError("");

    const success = await updateStrategy(selectedStrat._id, buildPayload());
    if (!success) {
      setError(storeErrorOr("ვერ მოხერხდა სტრატეგიის განახლება."));
    }
  };

 const handleDelete = async (id) => {
  if (!id) return; // უსაფრთხოებისთვის, თუ ID არ არსებობს, ფუნქცია გაჩერდეს
  
  const success = await deleteStrategy(id);
  if (success) {
    setSelectedStrategyId(null);
    setIsDeleteModalOpen(false); // წაშლის შემდეგ დასტურის მოდალიც ავტომატურად დაიხუროს
  }
};


  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto overscroll-contain cursor-zoom-out animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl h-[580px] bg-[#09090b] border border-[#1f2023] rounded-xl p-5 sm:p-6 shadow-2xl relative my-auto cursor-default flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 text-left font-sans text-[#f3f4f6]"
      >
        {/* ზედა ჰედერი */}
        <div className="border-b border-[#1f2023]/60 pb-3.5 relative flex-shrink-0">
          <button onClick={onClose} className="absolute top-0 right-0 text-[#4b5563] hover:text-[#0ecb81] transition-colors cursor-pointer text-sm font-bold">✕</button>
          <h2 className="text-md font-black tracking-tight text-[#f3f4f6] flex items-center gap-2">
            <span className="text-[#0ecb81]">📁</span> Trading Strategies
          </h2>
          <p className="text-[11px] text-[#6b7280] font-semibold mt-0.5">Manage your trading strategies and their pre-trade checklists.</p>
        </div>

        {error && (
          <div className="mt-2 p-2 bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-lg text-xs text-[#ef4444] font-medium text-center flex-shrink-0">
            {error}
          </div>
        )}

        {/* მთავარი ორპანელიანი სამუშაო ზონა */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start flex-1 overflow-hidden pt-4 h-full">

          {/* --- მარცხენა პანელი: სტრატეგიების სია --- */}
          <div className="md:col-span-1 border-r border-[#1f2023]/60 pr-4 space-y-3 h-full overflow-y-auto overscroll-contain scrollbar-none flex-shrink-0">
            <button
              type="button"
              onClick={() => {
                setIsCreatingNew(true);
                setSelectedStrategyId(null);
                setError("");
              }}
              className={`w-full text-center px-4 py-2.5 rounded-xl text-xs font-black transition-all border cursor-pointer ${
                isCreatingNew
                  ? "bg-[#0ecb81] text-[#040405] border-[#0ecb81] shadow-md shadow-[#0ecb81]/10"
                  : "bg-[#0d0d0e] border-[#1f2023] text-[#0ecb81] hover:bg-[#0ecb81]/5 hover:border-[#0ecb81]/30"
              }`}
            >
              ＋ New Strategy
            </button>

            <div className="space-y-2.5 pt-1">
              {strategies.length === 0 ? (
                <p className="text-[10px] text-[#4b5563] text-center pt-4 font-semibold">სტრატეგიები არ არის.</p>
              ) : (
                strategies.map((strat) => {
                  const isSelected = selectedStrategyId === strat._id && !isCreatingNew;
                  return (
                    <div
                      key={strat._id}
                      onClick={() => {
                        setIsCreatingNew(false);
                        setSelectedStrategyId(strat._id);
                        setError("");
                      }}
                      className={`p-3.5 border rounded-xl text-left cursor-pointer transition-all select-none space-y-2 ${
                        isSelected
                          ? "bg-[#0ecb81]/5 border-[#0ecb81] shadow-sm shadow-[#0ecb81]/5"
                          : "bg-[#0d0d0e]/60 border-[#1f2023] hover:border-[#2f3036]"
                      }`}
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className={`text-xs font-black tracking-tight ${isSelected ? "text-[#0ecb81]" : "text-[#f3f4f6]"}`}>
                          {strat.strategyName}
                        </span>
                        <span className="text-[10px] font-bold text-[#4b5563] truncate uppercase max-w-[170px]">
                          {strat.description || "No description"}
                        </span>
                      </div>
                      <div className="pt-1">
                        <Tag variant="neutral">📋 {strat.rules?.length || 0} Items</Tag>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* --- მარჯვენა პანელი: ფორმა (შექმნა/ედიტი) ან ცარიელი სტატუსი --- */}
          <div className="md:col-span-2 h-full flex flex-col justify-between overflow-hidden">
            {showForm ? (
              <div className="flex flex-col justify-between h-full overflow-hidden animate-in fade-in duration-200">
                <div className="space-y-4 flex-1 overflow-y-auto overscroll-contain pr-1 pb-4 scrollbar-thin scrollbar-thumb-[#1f2023]">
                  <InputField
                    label="Strategy Name *"
                    type="text"
                    placeholder={isCreatingNew ? "e.g., Scalping, Trend Following, Breakout..." : "Strategy Name"}
                    value={strategyName}
                    onChange={setStrategyName}
                  />

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black text-[#6b7280] uppercase tracking-widest block">
                      Description (Optional)
                    </span>
                    <textarea
                      rows={2}
                      placeholder="Enter strategy logic, market behavior..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-[#0d0d0e] text-[#f3f4f6] text-xs border border-[#1f2023] rounded-xl p-3 placeholder-[#4b5563] focus:outline-none focus:border-[#0ecb81] transition-all resize-none leading-relaxed"
                    />
                  </div>

                  {/* Checklist */}
                  <div className="space-y-3 pt-1">
                    <div className="flex items-center justify-between border-b border-[#1f2023]/40 pb-1.5">
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-[#6b7280] uppercase tracking-widest">
                        <span>📋</span> {isCreatingNew ? "Pre-Trade Checklist" : "Strategy Checklist Rules"}
                      </div>
                      <span className="text-[9px] bg-[#141517] text-[#9ca3af] px-1.5 py-0.5 rounded font-bold font-mono">
                        {checklistItems.length} items
                      </span>
                    </div>

                    <div className="flex gap-2 items-center w-full">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Add a checklist item and press Enter..."
                          value={newRuleInput}
                          onChange={(e) => setNewRuleInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAddRule(e)}
                          className="w-full bg-[#0d0d0e] text-[#f3f4f6] text-xs border border-[#1f2023] rounded-xl px-4 py-2 placeholder-[#4b5563] focus:outline-none focus:border-[#0ecb81] transition-all"
                        />
                      </div>
                      <Button
                        variant="solid"
                        onClick={handleAddRule}
                        className="!text-xs !py-2 !px-4 !bg-[#0ecb81] !text-[#040405] font-black"
                      >
                        ＋ Add
                      </Button>
                    </div>

                    <div className="space-y-2 pt-1 max-h-[140px] overflow-y-auto overscroll-contain pr-0.5 scrollbar-thin">
                      {checklistItems.map((item, idx) => (
                        <div
                          key={item.ruleId || `new-${idx}`}
                          className="w-full bg-[#0d0d0e] border border-[#1f2023] rounded-xl px-3 py-2 flex items-center justify-between text-xs text-[#9ca3af] font-bold hover:border-[#2f3036] transition-all animate-in fade-in duration-150"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded bg-[#141517] border border-[#1f2023] text-[9px] font-mono text-[#4b5563] flex items-center justify-center font-bold">
                              {idx + 1}
                            </span>
                            <span>{item.text}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setChecklistItems(checklistItems.filter((_, i) => i !== idx))}
                            className="text-[#ef4444] opacity-40 hover:opacity-100 transition-opacity p-1 cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ქვედა მართვის ზოლი */}
                {isCreatingNew ? (
                  <div className="pt-3 border-t border-[#1f2023]/60 flex items-center justify-end gap-3 w-full bg-[#09090b] flex-shrink-0">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreatingNew(false)}
                      className="!text-xs !py-2.5 px-5"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="solid"
                      onClick={handleCreateStrategy}
                      disabled={loading || !strategyName.trim()}
                      className="!bg-[#0ecb81] !text-[#040405] font-black hover:!bg-[#0bb572] !text-xs !py-2.5 px-6 shadow-lg disabled:opacity-40 disabled:pointer-events-none"
                    >
                      {loading ? "Creating..." : "+ Create"}
                    </Button>
                  </div>
                ) : (
                  <div className="pt-3 border-t border-[#1f2023]/60 flex items-center justify-between w-full bg-[#09090b] flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="text-xs bg-[#ef4444]/10 hover:bg-[#ef4444] text-[#ef4444] hover:text-[#040405] font-black px-4 py-2 rounded-lg transition-all cursor-pointer active:scale-95"
                    >
                      🗑️ Delete Strategy
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={onClose}
                        className="text-xs border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/20 text-emerald-400 font-bold px-4 py-2 rounded-lg transition-all cursor-pointer active:scale-95"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleUpdateStrategy}
                        disabled={loading || !strategyName.trim()}
                        className="text-xs bg-emerald-600 hover:bg-emerald-500 text-[#09090b] font-black px-4 py-2 rounded-lg transition-all cursor-pointer active:scale-95 shadow-lg shadow-emerald-600/10 disabled:opacity-40 disabled:pointer-events-none"
                      >
                        {loading ? "Updating..." : "Update Strategy"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center my-auto space-y-3 h-full animate-in fade-in duration-200 select-none">
                <div className="w-11 h-11 rounded-full bg-[#0d0d0e] border border-[#1f2023] flex items-center justify-center text-md text-[#4b5563]">
                  📑
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-[#f3f4f6]">Select a strategy to view</h4>
                  <p className="text-[10px] text-[#4b5563] font-medium max-w-[220px] leading-relaxed mx-auto">
                    Choose an existing strategy from the sidebar or create a new one to get started.
                  </p>
                </div>
              </div>
            )}
          </div>
          <ConfirmDelete 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={() => handleDelete(selectedStrat?._id)}

        message="Are you sure you want to delete this strategy? All trades related to this strategy will be deleted as well. This won't be reversed."
      />
        </div>
      </div>
    </div>
  );
}




