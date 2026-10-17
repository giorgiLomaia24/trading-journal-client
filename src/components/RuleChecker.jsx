// ==================== RULECHECKER COMPONENT ====================
import React from "react";

export default function RuleChecker({ 
  title = "tradeView.rulesFollowed", 
  rules = [] // [{ id: 1, text: "1", followed: true }]
}) {
  return (
    <div className="w-full bg-[#0d0d0e]/40 border border-[#1f2023] rounded-xl overflow-hidden text-left font-sans">
      {/* ჰედერი პატარა სამიზნის/კომპასის აიქონით */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#0d0d0e] border-b border-[#1f2023] text-xs font-semibold text-[#6b7280]">
        <svg className="w-3.5 h-3.5 text-[#6b7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{title}</span>
      </div>

      {/* წესების სია კოდის სისუფთავისთვის */}
      <div className="divide-y divide-[#1f2023]/50">
        {rules.map((rule) => (
          <div 
            key={rule.id} 
            className="flex items-center gap-3 px-4 py-3 text-xs font-bold transition-colors hover:bg-[#141517]/30"
          >
            {/* პატარა წერტილი (ინდიკატორი) */}
            <span 
              className={`w-2 h-2 rounded-full flex-shrink-0 transition-all ${
                rule.followed 
                  ? "bg-[#0ecb81] shadow-sm shadow-[#0ecb81]/40" 
                  : "bg-[#2e3035]"
              }`} 
            />
            {/* წესის ნომერი ან აღწერა */}
            <span className={rule.followed ? "text-[#f3f4f6]" : "text-[#4b5563]"}>
              {rule.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
