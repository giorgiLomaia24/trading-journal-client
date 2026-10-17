// ==================== RULEPROGRESS COMPONENT ====================
import React from "react";

export default function RuleProgress({ ruleNumber, percentage }) {
  // დინამიური ფერები პროცენტის მიხედვით (100% - მწვანე, დაბალი - ყვითელი)
  const isPerfect = percentage === 100;
  const barColor = isPerfect ? "bg-[#0ecb81]" : "bg-[#eab308]";
  const shadowColor = isPerfect ? "shadow-[#0ecb81]/20" : "shadow-[#eab308]/20";
  const textColor = isPerfect ? "text-[#0ecb81]" : "text-[#eab308]";

  return (
    <div className="space-y-1.5 w-full font-sans text-left">
      {/* ზედა ხაზი: წესის ნომერი და პროცენტი */}
      <div className="flex justify-between items-center text-xs font-bold font-mono">
        <span className="text-[#4b5563]">{ruleNumber}</span>
        <span className={`${textColor}`}>{percentage}%</span>
      </div>

      {/* პროგრეს ბარის ჰორიზონტალური კონტეინერი */}
      <div className="w-full h-2 bg-[#121214] border border-[#1f2023]/40 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 shadow-sm ${barColor} ${shadowColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
