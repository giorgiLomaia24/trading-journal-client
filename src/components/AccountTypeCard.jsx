// ==================== ACCOUNT TYPE CARD COMPONENT ====================
import React from "react";

export default function AccountTypeCard({
  title,
  description,
  icon,
  isSelected,
  onClick
}) {
  return (
    <div
      onClick={onClick}
      className={`w-full border rounded-xl p-3.5 flex items-center justify-between text-left font-sans transition-all duration-200 cursor-pointer select-none ${
        isSelected
          ? "bg-[#0ecb81]/5 border-[#0ecb81] shadow-sm shadow-[#0ecb81]/5"
          : "bg-[#0d0d0e] border-[#1f2023] hover:border-[#2f3036]"
      }`}
    >
      {/* მარცხენა მხარე: აიქონი, სათაური და აღწერა */}
      <div className="flex items-center gap-3.5">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm ${
          isSelected ? "bg-[#0ecb81]/10 text-[#0ecb81]" : "bg-[#141517] text-[#6b7280]"
        }`}>
          {icon}
        </div>
        <div className="flex flex-col">
          <span className={`text-xs font-black tracking-tight transition-colors ${
            isSelected ? "text-[#0ecb81]" : "text-[#f3f4f6]"
          }`}>
            {title}
          </span>
          <span className="text-[10px] font-semibold text-[#4b5563] mt-0.5">
            {description}
          </span>
        </div>
      </div>

      {/* მარჯვენა მხარე: Selected პატარა თეგი (მხოლოდ მონიშნულზე!) */}
      {isSelected && (
        <span className="text-[9px] bg-[#0ecb81] text-[#040405] font-black uppercase tracking-wider px-2 py-0.5 rounded-full animate-in zoom-in-95 duration-150">
          Selected
        </span>
      )}
    </div>
  );
}
