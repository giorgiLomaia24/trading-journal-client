// ==================== MINISTAT COMPONENT ====================
import React from "react";

export default function MiniStat({ label, value, variant = "neutral" }) {
  // დინამიური ფერები მნიშვნელობისთვის (იასამნისფერის გარეშე!)
  const textColors = {
    neutral: "text-[#9ca3af]",
    success: "text-[#0ecb81]",
    danger: "text-[#ef4444]",
  };

  return (
    <div className="bg-[#0d0d0e] border border-[#1f2023] rounded-lg px-3 py-1.5 flex items-center gap-1.5 text-xs font-bold font-sans">
      <span className="text-[#4b5563] uppercase tracking-wide">{label}:</span>
      <span className={textColors[variant]}>{value}</span>
    </div>
  );
}
