import React from "react";

// მარჯვენა ბრენდინგ პანელი (Forgot/Reset გვერდებისთვის, რომ კოდი აღარ დუბლირდეს)
export default function AuthBrandPanel() {
  return (
    <div className="hidden md:flex flex-1 flex-col justify-center items-center relative overflow-hidden bg-gradient-to-br from-[#0a0d14] via-[#0b0e11] to-[#0f141c] border-l border-[#1f2023] px-12">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#0ecb81]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="absolute top-20 left-28 bg-[#181a20]/90 border border-[#2b2f36] rounded-xl p-4 shadow-2xl min-w-[140px]">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#848e9c] uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0ecb81]" />Win Rate
        </div>
        <div className="text-2xl font-black text-[#0ecb81] mt-0.5 tracking-tight">87.3%</div>
        <div className="text-[10px] text-[#0ecb81] font-medium mt-0.5">+12.4% this month</div>
      </div>

      <div className="absolute top-32 right-28 bg-[#181a20]/90 border border-[#2b2f36] rounded-xl p-4 shadow-2xl min-w-[140px]">
        <div className="text-[10px] font-bold text-[#848e9c] uppercase tracking-wider">Total P&L</div>
        <div className="text-xl font-black text-[#0ecb81] mt-0.5 tracking-tight">+$24,567</div>
        <div className="text-[10px] text-[#848e9c] font-semibold mt-0.5 font-mono">• +18.2%</div>
      </div>

      <div className="max-w-xl text-center space-y-4 z-10">
        <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
          Transform Your <br />
          <span className="text-[#0ecb81] drop-shadow-[0_0_20px_rgba(14,203,129,0.2)]">Trading Journey</span>
        </h1>
        <p className="text-xs lg:text-sm text-[#848e9c] leading-relaxed max-w-sm mx-auto">
          Join thousands of traders using data-driven insights to achieve{" "}
          <span className="text-[#0ecb81] font-semibold">consistent profitability</span> and{" "}
          <span className="text-[#0ecb81] font-semibold">better psychology</span>.
        </p>
      </div>
    </div>
  );
}