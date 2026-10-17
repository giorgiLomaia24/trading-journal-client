import React from "react";

export default function CalendarCell({
  dayNumber,
  pnl = 0,
  tradesCount = 0,
  isCurrentMonth = true,
  isToday = false,
  isWeekSummary = false, // გამოიყენება მარჯვენა სვეტის კვირის ჯამისთვის
  onClick,
}) {
  const hasActivity = tradesCount > 0;
  const isLoss = pnl < 0;
  const isProfit = pnl > 0;

  // ==================== ქეისი 1: კვირის ჯამური უჯრა (მარჯვენა ვერტიკალური სვეტი) ====================
  if (isWeekSummary) {
    return (
      <div className="bg-[#0f0e13]/30 border border-[#1f2023] rounded-xl p-3 flex flex-col justify-center items-center aspect-square text-center font-sans w-full select-none">
        {!hasActivity ? (
          <span className="text-[10px] sm:text-[11px] font-bold text-[#374151] uppercase tracking-wide">
            No activity
          </span>
        ) : (
          <div className="space-y-1">
            <span className={`text-xs sm:text-sm font-black tracking-tight ${isLoss ? "text-[#ef4444]" : "text-[#0ecb81]"}`}>
              {isLoss ? `-$${Math.abs(pnl).toFixed(0)}` : `+$${pnl.toFixed(0)}`}
            </span>
            <span className="text-[9px] sm:text-[10px] text-[#4b5563] font-bold block">
              {tradesCount} trades
            </span>
          </div>
        )}
      </div>
    );
  }

  // ==================== ქეისი 2: ჩვეულებრივი კალენდარული დღის უჯრა ====================
  let cellStyles = "bg-[#09090b] border border-[#1f2023] hover:border-[#2f3036] text-[#f3f4f6]";
  
  if (!isCurrentMonth) {
    cellStyles = "bg-[#040405]/40 border border-[#1f2023]/40 text-[#2e3035] pointer-events-none";
  } else if (isToday) {
    // დღევანდელი დღე - იასამნისფერი ჩანაცვლებულია ჩვენი საფირმო მწვანე აქცენტით
    cellStyles = "bg-[#09090b] border-2 border-[#0ecb81] text-[#f3f4f6] shadow-sm shadow-[#0ecb81]/5";
  } else if (hasActivity && isLoss) {
    // წაგებიანი დღე (ნაზი მუქი წითელი ფონი, როგორც სქრინშოტზეა)
    cellStyles = "bg-[#1c0d0d]/40 border border-[#ef4444]/20 hover:border-[#ef4444]/40 text-[#f3f4f6]";
  } else if (hasActivity && isProfit) {
    // მოგებიანი დღე (ნაზი მუქი მწვანე ფონი)
    cellStyles = "bg-[#0d1c14]/40 border border-[#0ecb81]/20 hover:border-[#0ecb81]/40 text-[#f3f4f6]";
  }

  return (
    <div
      onClick={isCurrentMonth ? onClick : undefined}
      className={`relative p-2.5 sm:p-3 flex flex-col justify-between aspect-square rounded-xl transition-all text-left font-sans ${cellStyles} ${
        isCurrentMonth ? "cursor-pointer" : ""
      }`}
    >
      {/* ზედა ხაზი: დღის რიცხვი და მიმდინარე დღის პატარა მწვანე ინდიკატორი */}
      <div className="flex items-center justify-between w-full">
        <span className={`text-xs font-bold ${!isCurrentMonth ? "text-[#2e3035]" : "text-[#9ca3af]"}`}>
          {dayNumber}
        </span>
        {isToday && isCurrentMonth && (
          <span className="w-1.5 h-1.5 rounded-full bg-[#0ecb81] animate-pulse" />
        )}
      </div>

      {/* ქვედა ხაზი: P&L და აქტივობა (დინამიური რესპონსივ რეჟიმებით) */}
      {isCurrentMonth && hasActivity && (
        <div className="flex flex-col gap-0.5 mt-auto w-full">
          
          {/* 1. დესკტოპის ვიზუალი (ჩანს მხოლოდ md: ეკრანებზე და ზემოთ) */}
          <span className={`text-[11px] font-black tracking-tight hidden md:inline ${isLoss ? "text-[#ef4444]" : "text-[#0ecb81]"}`}>
            {isLoss ? `-$${Math.abs(pnl).toFixed(2)}` : `+$${pnl.toFixed(2)}`}
          </span>
          <span className="text-[9px] text-[#4b5563] font-bold uppercase tracking-wider hidden md:inline">
            {tradesCount} trades
          </span>

          {/* 2. მობილურის ვიზუალი (ჩანს მხოლოდ პატარა ეკრანებზე, ზუსტად ბოლო ფოტოს მსგავსად) */}
          <div 
            className="md:hidden w-full h-[18px] flex items-center justify-center text-[9px] font-black text-center rounded px-1 font-mono tracking-tighter select-none"
            style={{ 
              backgroundColor: isLoss ? "rgba(239, 68, 68, 0.15)" : "rgba(14, 203, 129, 0.15)", 
              color: isLoss ? "#ef4444" : "#0ecb81" 
            }}
          >
            {isLoss ? `-${Math.abs(pnl).toFixed(0)}` : `+${pnl.toFixed(0)}`}
          </div>

        </div>
      )}

      {/* ტირე "—" თუ აქტივობა არ არის (მობილურზე იმალება სისუფთავისთვის) */}
      {isCurrentMonth && !hasActivity && (
        <span className="text-[10px] text-[#2f3036] font-bold mt-auto select-none hidden md:inline">—</span>
      )}
    </div>
  );
}
