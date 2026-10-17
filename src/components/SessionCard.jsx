// ==================== SESSIONCARD COMPONENT ====================
import React from "react";

export default function SessionCard({
  sessionName,
  sessionDesc,
  tradesCount = 0,
  openTrades = 0,
  closedTrades = 0,
  winRate = 0,
  avgRr = "N/A",
  pnl = 0,
  winsCount = 0,
  lossesCount = 0
}) {
  const isLoss = pnl < 0;
  const isProfit = pnl > 0;
  
  // P&L ტექსტის ფორმატირება
  const pnlFormatted = isLoss ? `-$${Math.abs(pnl).toFixed(2)}` : `+$${pnl.toFixed(2)}`;
  const pnlColor = isLoss ? "text-[#ef4444]" : isProfit ? "text-[#0ecb81]" : "text-[#9ca3af]";

  return (
    <div className="bg-[#0d0d0e] border border-[#1f2023] hover:border-[#2f3036] rounded-xl p-5 text-left font-sans flex flex-col justify-between w-full transition-all">
      
      {/* 1. ჰედერი: სესიის სახელი, აღწერა და პატარა საათის აიქონი */}
      <div className="flex items-start justify-between border-b border-[#1f2023]/60 pb-3">
        <div className="flex flex-col gap-0.5">
          <h4 className="text-sm font-black text-[#f3f4f6] tracking-tight">{sessionName}</h4>
          <span className="text-[11px] font-semibold text-[#4b5563]">{sessionDesc}</span>
        </div>
        <span className="text-xs text-[#4b5563]">🕒</span>
      </div>

      {/* 2. მონაცემების შუა ბლოკი (ხაზოვანი სტრუქტურა სქრინშოტის მიხედვით) */}
      <div className="py-4 space-y-3 text-xs font-semibold">
        {/* ხაზი: Trades */}
        <div className="flex items-center justify-between text-[#6b7280]">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px]">📊</span>
            <span className="uppercase tracking-wide">Trades</span>
          </div>
          <span className="text-[#f3f4f6] font-black">{tradesCount}</span>
        </div>
        
        {/* ხაზი: Open / Closed სტატუსი */}
        <div className="text-[10px] text-[#4b5563] font-bold uppercase tracking-wider pl-4 flex items-center gap-1.5">
          <span>{openTrades} open</span>
          <span>•</span>
          <span>{closedTrades} closed</span>
        </div>

        {/* ხაზი: Win Rate */}
        <div className="flex items-center justify-between text-[#6b7280]">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px]">🎯</span>
            <span className="uppercase tracking-wide">Win Rate</span>
          </div>
          <span className={winRate > 0 ? "text-[#0ecb81] font-black" : "text-[#ef4444] font-black"}>
            {winRate.toFixed(1)}%
          </span>
        </div>

        {/* ხაზი: Avg RR */}
        <div className="flex items-center justify-between text-[#6b7280]">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px]">📈</span>
            <span className="uppercase tracking-wide">Avg RR</span>
          </div>
          <span className={avgRr !== "N/A" ? "text-[#eab308] font-black" : "text-[#4b5563] font-black"}>
            {avgRr}
          </span>
        </div>
      </div>

      {/* 3. ქვედა ფინალური სექცია: სრული P&L და მოგება-წაგების დაშლა */}
      <div className="pt-3 border-t border-[#1f2023]/60 space-y-2.5">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold text-[#4b5563] uppercase tracking-wider">Total P&L</span>
          <span className={`text-md font-black tracking-tight ${pnlColor}`}>
            {pnlFormatted}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-[#4b5563] uppercase tracking-wider">W/L Breakdown</span>
          <div className="flex items-center justify-between text-[11px] font-bold bg-[#040405]/40 border border-[#1f2023]/60 p-2 rounded-lg font-mono">
            <span className="text-[#0ecb81]">{winsCount} wins</span>
            <span className="text-[#ef4444]">{lossesCount} losses</span>
          </div>
        </div>
      </div>

    </div>
  );
}
