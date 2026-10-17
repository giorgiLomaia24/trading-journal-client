// ==================== DAY DETAIL MODAL - PART 1 ====================
import React, { useState, useEffect } from "react";
import Tag from "./Tag";
import InputField from "./InputField";

export default function DayDetailModal({ isOpen, onClose, dateStr, trades = [] }) {
  const [filterType, setFilterType] = useState("all");
  const [filterTime, setFilterTime] = useState("time");

  // ESC ღილაკზე დაჭერით მოდალის დახურვა
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);
   useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // ==================== ახალი კოდი: უკანა ფონის სქროლვის დაბლოკვა ====================
  useEffect(() => {
    if (isOpen) {
      // როცა მოდალი იხსნება, იბლოკება მთლიანი გვერდის სქროლვა
      document.body.style.overflow = "hidden";
    } else {
      // როცა იხურება, სქროლვა ისევ ჩვეულებრივად მუშაობს
      document.body.style.overflow = "unset";
    }

    // ეფექტის გასუფთავება (Clean-up), თუ კომპონენტი მოულოდნელად დაიხურა
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // მათემატიკური გამოთვლები დღიური სტატისტიკისთვის
  const totalTrades = trades.length;
  const wins = trades.filter((t) => t.pnl >= 0).length;
  const losses = totalTrades - wins;
  const totalPnl = trades.reduce((sum, t) => sum + t.pnl, 0);
  const winRate = totalTrades > 0 ? ((wins / totalTrades) * 100).toFixed(1) : 0;

  const isLoss = totalPnl < 0;
  const pnlColor = isLoss ? "text-[#ef4444]" : "text-[#0ecb81]";
  const dayNumber = dateStr ? new Date(dateStr).getDate() : "";

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150 cursor-zoom-out"
    >
      {/* მოდალის ძირითადი კონტეინერი */}
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="w-full max-w-xl bg-[#09090b] border border-[#1f2023] rounded-xl p-5 sm:p-6 shadow-2xl relative text-left font-sans cursor-default animate-in zoom-in-95 duration-150"
      >
        {/* დახურვის პატარა X კნოპკა (როგორც სურათზეა) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[#4b5563] hover:text-[#0ecb81] transition-colors cursor-pointer text-sm font-bold"
        >
          ✕
        </button>

        {/* 1. ზედა სექცია: დღის წითელი/მწვანე დიდი კვადრატი და სათაური */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className={`w-11 h-11 rounded-lg flex items-center justify-center font-black text-sm text-black shadow-lg ${isLoss ? "bg-[#ef4444] shadow-[#ef4444]/10" : "bg-[#0ecb81] shadow-[#0ecb81]/10"}`}>
            {dayNumber}
          </div>
          <div className="flex flex-col gap-0.5">
            <h2 className="text-md font-black tracking-tight text-[#f3f4f6]">
              {dateStr ? new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : ""}
            </h2>
            <div className="flex items-center gap-1.5 text-[11px] text-[#6b7280] font-semibold">
              <span>{totalTrades} trades</span>
              <span className="text-[#1f2023]">•</span>
              <span className={isLoss ? "text-[#ef4444]" : "text-[#0ecb81]"}>{winRate}% win</span>
            </div>
          </div>
        </div>

        {/* 2. შუა სექცია: დიდი სტატისტიკის ბლოკი Win/Loss/P&L მაჩვენებლებით */}
        <div className="bg-[#0d0d0e] border border-[#1f2023] rounded-xl p-4 space-y-4 mb-5">
          <div className="grid grid-cols-3 text-center items-center">
            <div className="flex flex-col gap-0.5">
              <span className="text-[15px] font-black text-[#0ecb81]">{wins}</span>
              <span className="text-[10px] text-[#4b5563] font-bold uppercase tracking-wider">Wins</span>
            </div>
            <div className="flex flex-col gap-0.5 border-x border-[#1f2023]">
              <span className="text-[15px] font-black text-[#ef4444]">{losses}</span>
              <span className="text-[10px] text-[#4b5563] font-bold uppercase tracking-wider">Losses</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className={`text-[15px] font-black ${pnlColor}`}>
                {isLoss ? `-$${Math.abs(totalPnl).toFixed(2)}` : `+$${totalPnl.toFixed(2)}`}
              </span>
              <span className="text-[10px] text-[#4b5563] font-bold uppercase tracking-wider">Total P&L</span>
            </div>
          </div>

          {/* ულამაზესი მწვანე პროგრეს ბარი Win Rate-ისთვის */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[10px] font-bold text-[#6b7280]">
              <span className="uppercase tracking-wider">Win Rate</span>
              <span className="text-[#f3f4f6]">{winRate}%</span>
            </div>
            <div className="w-full h-2 bg-[#1f2023] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#0ecb81] rounded-full transition-all duration-500 shadow-sm shadow-[#0ecb81]/40"
                style={{ width: `${winRate}%` }}
              />
            </div>
          </div>
        </div>
        {/* 3. შიდა ფილტრების პანელი (სკრინშოტის იდენტური) */}
        <div className="flex items-center gap-2 mb-4 w-full">
          <span className="text-xs text-[#4b5563]"></span>
          <div className="w-45 text-xs font-semibold">
            <InputField
              type="select"
              value={filterType}
              onChange={(val) => setFilterType(val)}
              options={[
                { label: "All", value: "all" },
                { label: "Wins Only", value: "wins" },
                { label: "Losses Only", value: "losses" }
              ]}
            />
          </div>
          <div className="w-45 text-xs font-semibold">
            <InputField
              type="select"
              value={filterTime}
              onChange={(val) => setFilterTime(val)}
              options={[
                { label: "By Time", value: "time" },
                { label: "By P&L", value: "pnl" }
              ]}
            />
          </div>
        </div>

        {/* 4. ტრეიდების დინამიური სია (Trades List) */}
        <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
          {trades
            .filter((t) => {
              if (filterType === "wins") return t.pnl >= 0;
              if (filterType === "losses") return t.pnl < 0;
              return true;
            })
            .map((t) => {
              const tradeWin = t.pnl >= 0;
              const borderStyles = tradeWin 
                ? "border-l-4 border-l-[#0ecb81] border-[#1f2023]" 
                : "border-l-4 border-l-[#ef4444] border-[#1f2023]";
              
              return (
                <div 
                  key={t.id} 
                  className={`bg-[#0d0d0e] border rounded-lg p-3.5 space-y-2 text-xs font-sans ${borderStyles}`}
                >
                  {/* ტრეიდის თეგები და ინფორმაცია */}
                  <div className="flex items-center justify-between w-full">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Tag variant={tradeWin ? "success" : "danger"}>
                        {t.type} {t.symbol}
                      </Tag>
                      <Tag variant="neutral">{t.strategy}</Tag>
                      <Tag variant="info">{t.session}</Tag>
                    </div>
                    
                    {/* დრო და P&L */}
                    <div className="flex items-center gap-3">
                      <span className="text-[#4b5563] flex items-center gap-1 font-medium">
                        🕒 {t.time || "00:00"}
                      </span>
                      <span className={`font-black text-sm tracking-tight ${tradeWin ? "text-[#0ecb81]" : "text-[#ef4444]"}`}>
                        {tradeWin ? `+$${t.pnl.toFixed(2)}` : `-$${Math.abs(t.pnl).toFixed(2)}`}
                      </span>
                    </div>
                  </div>

                  {/* ტრეიდის ნოტების პატარა ველი */}
                  {t.notes && (
                    <div className="w-full bg-[#040405]/50 border border-[#1f2023]/60 rounded-md p-2 text-[#6b7280] font-medium flex items-start gap-1.5">
                      <span className="text-[10px] pt-0.5">💬</span>
                      <p className="leading-relaxed">{t.notes}</p>
                    </div>
                  )}
                </div>
              );
            })}

          {trades.length === 0 && (
            <div className="text-center py-6 text-xs text-[#4b5563] font-medium">
              No trades recorded for this day.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
