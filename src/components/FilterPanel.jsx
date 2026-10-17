// // ==================== FILTERPANEL - PART 1 ====================
// import React from "react";
// import InputField from "./InputField";
// import Button from "./Button";

// export default function FilterPanel({ isOpen, state, setState, onClear }) {
//   // თუ ფილტრების პანელი არ არის ღია, საერთოდ არ ვარენდერებთ
//   if (!isOpen) return null;

//   return (
//     <div className="w-full bg-[#09090b] border border-[#1f2023] rounded-xl p-5 text-left space-y-5 animate-in fade-in slide-in-from-top-2 duration-150">
      
//       {/* ხაზი 1: ძირითადი დროპდაუნები */}
//       <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
//         <InputField
//           label="Status"
//           type="select"
//           value={state.status}
//           onChange={(val) => setState({ ...state, status: val })}
//           options={[{ label: "All", value: "all" }, { label: "Open", value: "open" }, { label: "Closed", value: "closed" }]}
//         />
//         <InputField
//           label="Type"
//           type="select"
//           value={state.type}
//           onChange={(val) => setState({ ...state, type: val })}
//           options={[{ label: "All Types", value: "all" }, { label: "Buy", value: "buy", dotColor: "#0ecb81" }, { label: "Sell", value: "sell", dotColor: "#ef4444" }]}
//         />
      
//         <InputField
//           label="Session"
//           type="select"
//           value={state.session}
//           onChange={(val) => setState({ ...state, session: val })}
//           options={[{ label: "All Sessions", value: "all" }, { label: "NY AM", value: "ny_am" }, { label: "LONDON", value: "london" }]}
//         />
//       </div>

//       {/* ხაზი 2: თარიღები და კალკულაციები */}
//       <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
//         <InputField
//           label="From Date"
//           type="date"
//           value={state.fromDate}
//           onChange={(val) => setState({ ...state, fromDate: val })}
//         />
//         <InputField
//           label="To Date"
//           type="date"
//           value={state.toDate}
//           onChange={(val) => setState({ ...state, toDate: val })}
//         />
//         <InputField
//           label="Min P&L ($)"
//           type="number"
//           placeholder="0.00"
//           value={state.minPnl}
//           onChange={(val) => setState({ ...state, minPnl: val })}
//         />
//         <InputField
//           label="Max P&L ($)"
//           type="number"
//           placeholder="0.00"
//           value={state.maxPnl}
//           onChange={(val) => setState({ ...state, maxPnl: val })}
//         />
//       </div>
//       {/* ხაზი 3: შედეგების (Result) ტაბები */}
//       <InputField
//         label="Result"
//         type="tabs"
//         value={state.results}
//         onChange={(val) => setState({ ...state, results: val })}
//         options={[
//           { label: "Win", value: "win", dotColor: "#0ecb81" },
//           { label: "Loss", value: "loss", dotColor: "#ef4444" },
//           { label: "Breakeven", value: "breakeven", dotColor: "#eab308" },
//           { label: "Partial", value: "partial", dotColor: "#a855f7" },
//         ]}
//       />

//       {/* ხაზი 4: Tags და Emotions მულტისელექტები */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <InputField
//           label="Tags"
//           type="select"
//           isMulti={true}
//           placeholder="Add tag filter"
//           value={state.tags}
//           onChange={(val) => setState({ ...state, tags: val })}
//           options={[
//             { label: "High Risk", value: "high_risk" },
//             { label: "FOMO", value: "fomo" },
//             { label: "A+ Setup", value: "a_plus" }
//           ]}
//         />
//         <InputField
//           label="Emotions"
//           type="select"
//           isMulti={true}
//           placeholder="Add emotion filter"
//           value={state.emotions}
//           onChange={(val) => setState({ ...state, emotions: val })}
//           options={[
//             { label: "Calm", value: "calm" },
//             { label: "Anxious", value: "anxious" },
//             { label: "Greedy", value: "greedy" }
//           ]}
//         />
//       </div>

//       {/* ხაზი 5: ფილტრების გასუფთავება და აქტიური ფილტრების რაოდენობა */}
//       <div className="pt-2 border-t border-[#1f2023]/60 flex items-center justify-between">
//         <Button variant="outline" onClick={onClear} className="!text-xs !py-2">
//           Clear All Filters
//         </Button>
        
//         <span className="text-xs text-[#4b5563] font-medium">
//           1 active filters
//         </span>
//       </div>

//     </div>
//   );
// }

// ==================== FILTERPANEL ====================
import React, { useEffect, useState } from "react";
import InputField from "./InputField";
import Button from "./Button";
import { useSessionStore } from "../store/useSessionStore";
import { AVAILABLE_EMOTIONS } from "../constants/emotions"; // ტრეიდის დამატებისას შემოთავაზებული ემოციების სია

// "scalp, news,  " -> ["scalp", "news"]
const parseTags = (text) =>
  Array.from(new Set(text.split(",").map((t) => t.trim()).filter(Boolean)));

const hasValue = (v) => v !== "" && v !== null && v !== undefined;

// აქტიური ფილტრების რეალური რაოდენობა (ადრე ყოველთვის "1" ეწერა)
const countActiveFilters = (f) => {
  let n = 0;
  ["status", "type", "strategy", "session"].forEach((k) => { if (f[k] && f[k] !== "all") n++; });
  ["fromDate", "toDate", "minPnl", "maxPnl"].forEach((k) => { if (hasValue(f[k])) n++; });
  ["results", "tags", "emotions"].forEach((k) => { if (f[k]?.length) n++; });
  return n;
};

export default function FilterPanel({ isOpen, state, setState, onClear }) {
  // ჰუკები return-მდე უნდა იყოს (რენდერებს შორის ჰუკების რაოდენობა არ უნდა შეიცვალოს)
  const sessions = useSessionStore((s) => s.sessions) || [];
  const fetchSessions = useSessionStore((s) => s.fetchSessions);

  // ტეგები ჩვეულებრივი ტექსტური ველია. ტექსტი ცალკე ინახება, რომ ბოლო მძიმე/ინტერვალი არ "შეჭამოს"
  const [tagsText, setTagsText] = useState((state.tags || []).join(", "));

  // გახსნისას მომხმარებლის სესიები იტვირთება
  useEffect(() => {
    if (isOpen && sessions.length === 0) fetchSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // გარედან გასუფთავებისას (Clear All Filters) ტეგების ველიც ცარიელდება
  useEffect(() => {
    const fromText = parseTags(tagsText).join(",");
    const fromState = (state.tags || []).join(",");
    if (fromText !== fromState) setTagsText((state.tags || []).join(", "));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.tags]);

  // თუ ფილტრების პანელი არ არის ღია, საერთოდ არ ვარენდერებთ
  if (!isOpen) return null;

  const activeCount = countActiveFilters(state);

  // სესიები: მხოლოდ მომხმარებლის მიერ შენახულები. სახელი ინახება ტრეიდში, ამიტომ value = სახელი.
  // თუ არჩეული სესია სიაში აღარ არის, ის მაინც ჩანს, რომ ფილტრი "უხილავი" არ დარჩეს
  const sessionOptions = [
    { label: "All Sessions", value: "all" },
    ...sessions.map((s) => ({ label: s.sessionName, value: s.sessionName })),
    ...(state.session && state.session !== "all" && !sessions.some((s) => s.sessionName === state.session)
      ? [{ label: state.session, value: state.session }]
      : [])
  ];

  // ემოციები: ყველა, რასაც ტრეიდის დამატებისას ვთავაზობთ
  const emotionOptions = AVAILABLE_EMOTIONS.map((e) => ({ label: e, value: e }));

  return (
    <div className="w-full bg-[#09090b] border border-[#1f2023] rounded-xl p-5 text-left space-y-5 animate-in fade-in slide-in-from-top-2 duration-150">

      {/* ხაზი 1: ძირითადი დროპდაუნები */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <InputField
          label="Status"
          type="select"
          value={state.status}
          onChange={(val) => setState({ ...state, status: val })}
          options={[{ label: "All", value: "all" }, { label: "Open", value: "open" }, { label: "Closed", value: "closed" }]}
        />
        <InputField
          label="Type"
          type="select"
          value={state.type}
          onChange={(val) => setState({ ...state, type: val })}
          options={[{ label: "All Types", value: "all" }, { label: "Buy", value: "buy", dotColor: "#0ecb81" }, { label: "Sell", value: "sell", dotColor: "#ef4444" }]}
        />

        <InputField
          label="Session"
          type="select"
          value={state.session}
          onChange={(val) => setState({ ...state, session: val })}
          options={sessionOptions}
          hint={sessions.length === 0 ? "No saved sessions yet. Add one when logging a trade." : undefined}
        />
      </div>

      {/* ხაზი 2: თარიღები და კალკულაციები */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <InputField
          label="From Date"
          type="date"
          value={state.fromDate}
          onChange={(val) => setState({ ...state, fromDate: val })}
        />
        <InputField
          label="To Date"
          type="date"
          value={state.toDate}
          onChange={(val) => setState({ ...state, toDate: val })}
        />
        <InputField
          label="Min P&L ($)"
          type="number"
          placeholder="0.00"
          value={state.minPnl}
          onChange={(val) => setState({ ...state, minPnl: val })}
        />
        <InputField
          label="Max P&L ($)"
          type="number"
          placeholder="0.00"
          value={state.maxPnl}
          onChange={(val) => setState({ ...state, maxPnl: val })}
        />
      </div>

      {/* ხაზი 3: შედეგების (Result) ტაბები */}
      <InputField
        label="Result"
        type="tabs"
        value={state.results}
        onChange={(val) => setState({ ...state, results: val })}
        options={[
          { label: "Win", value: "win", dotColor: "#0ecb81" },
          { label: "Loss", value: "loss", dotColor: "#ef4444" },
          { label: "Breakeven", value: "breakeven", dotColor: "#eab308" },
          { label: "Partial", value: "partial", dotColor: "#a855f7" },
        ]}
      />

      {/* ხაზი 4: Tags (ჩვეულებრივი ინფუთი) და Emotions (მულტისელექტი) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="Tags"
          type="text"
          placeholder="e.g. scalp, news, fomo"
          value={tagsText}
          onChange={(val) => {
            setTagsText(val);
            setState({ ...state, tags: parseTags(val) });
          }}
          hint="Separate multiple tags with commas"
        />
        <InputField
          label="Emotions"
          type="select"
          isMulti={true}
          placeholder="Add emotion filter"
          value={state.emotions}
          onChange={(val) => setState({ ...state, emotions: val })}
          options={emotionOptions}
        />
      </div>

      {/* ხაზი 5: ფილტრების გასუფთავება და აქტიური ფილტრების რაოდენობა */}
      <div className="pt-2 border-t border-[#1f2023]/60 flex items-center justify-between">
        <Button variant="outline" onClick={onClear} className="!text-xs !py-2">
          Clear All Filters
        </Button>

        <span className="text-xs text-[#4b5563] font-medium">
          {activeCount} active {activeCount === 1 ? "filter" : "filters"}
        </span>
      </div>

    </div>
  );
}