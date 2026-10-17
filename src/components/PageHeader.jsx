// ==================== PAGEHEADER COMPONENT ====================
import React from "react";

export default function PageHeader({ title, description, icon, children }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-[#1f2023] pb-5 gap-4 text-left w-full">
      {/* მარცხენა მხარე: აიქონი, სათაური და აღწერა */}
      <div className="flex items-start gap-3">
        {icon && (
          <div className="text-xl p-2 bg-[#0d0d0e] border border-[#1f2023] rounded-xl text-[#0ecb81] min-w-[40px] flex items-center justify-center">
            {icon}
          </div>
        )}
        <div>
          <h2 className="text-lg font-black tracking-tight text-[#f3f4f6]">
            {title}
          </h2>
          {description && (
            <p className="text-xs text-[#4b5563] mt-0.5 font-medium">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* მარჯვენა მხარე: დინამიური ღილაკები (Toolbar), რომლებსაც გარედან გადავცემთ */}
      {children && (
        <div className="flex flex-wrap items-center gap-2">
          {children}
        </div>
      )}
    </div>
  );
}
