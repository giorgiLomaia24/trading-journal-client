// ==================== DATABLOCK COMPONENT ====================
import React from "react";

export default function DataBlock({ 
  label, 
  value, 
  icon, 
  variant = "neutral" // neutral, success (მწვანე), danger (წითელი)
}) {
  
  // მნიშვნელობის დინამიური ფერები
  const valueColors = {
    neutral: "text-[#f3f4f6]",
    success: "text-[#0ecb81]",
    danger: "text-[#ef4444]"
  };

  return (
    <div className="flex flex-col gap-1.5 text-left font-sans">
      {/* ზედა ნაწილი: ნაზი ნაცრისფერი სათაური და აიქონი */}
      <div className="flex items-center gap-1.5 text-[#6b7280]">
        {icon && <span className="text-xs flex items-center justify-center">{icon}</span>}
        <span className="text-xs font-semibold tracking-wide uppercase">{label}</span>
      </div>

      {/* ქვედა ნაწილი: ძირითადი ტექსტი/მნიშვნელობა */}
      <div className={`text-sm font-bold tracking-tight ${valueColors[variant]}`}>
        {value}
      </div>
    </div>
  );
}
