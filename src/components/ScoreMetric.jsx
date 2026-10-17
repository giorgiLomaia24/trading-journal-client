// ==================== SCORE METRIC COMPONENT ====================
import React from "react";

export default function ScoreMetric({ score = 35.00 }) {
  // ისრის პოზიციის პროცენტული კალკულაცია უსაფრთხოებისთვის (0-დან 100-მდე)
  const pointerPosition = Math.min(Math.max(score, 0), 100);

  return (
    <div className="w-full bg-[#09090b] border border-[#1f2023] rounded-xl p-5 text-left font-sans">
      <span className="text-[10px] font-black text-[#4b5563] uppercase tracking-wider block mb-3">
        Your Performance Score
      </span>

      <div className="flex items-center gap-6">
        {/* დიდი ციფრული ინდიკატორი (დაბალი ქულის გამო ანათებს წითლად) */}
        <div className="flex flex-col">
          <h2 className="text-3xl font-black tracking-tight text-[#ef4444] drop-shadow-[0_0_6px_rgba(239,68,68,0.15)]">
            {score.toFixed(2)}
          </h2>
        </div>

        {/* გრადიენტული ზოლი თავისი მოძრავი ისრით */}
        <div className="flex-1 relative pt-4 pb-2">
          {/* პატარა სამკუთხა ისარი, რომელიც ქულის მიხედვით მოძრაობს (Left დინამიურია) */}
          <div 
            className="absolute top-1.5 -ml-1 text-xs text-[#9ca3af] transition-all duration-500 select-none"
            style={{ left: `${pointerPosition}%` }}
          >
            ▼
          </div>

          {/* თავად ზოლი წითლიდან მწვანეში გარდამავალი გრადიენტით */}
          <div className="w-full h-2.5 rounded-full bg-gradient-to-r from-[#ef4444] via-[#eab308] to-[#0ecb81] border border-[#1f2023]/40" />

          {/* ზოლის ქვედა მანიშნებელი ციფრები სქრინშოტის იდენტურად */}
          <div className="flex justify-between items-center text-[9px] font-bold text-[#4b5563] mt-2 font-mono">
            <span>0</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
            <span>100</span>
          </div>
        </div>
      </div>
    </div>
  );
}
