// ==================== ACTIVITY HEATMAP COMPONENT ====================
import React, { useMemo } from "react";

const DAYS_LABELS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const WEEKS = 4;

const pad = (n) => String(n).padStart(2, "0");
// ლოკალური YYYY-MM-DD, იგივე დროის ზონით, რომლითაც ბექენდს ვუგზავნით (tz პარამეტრი)
const toKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fmtMoney = (n) => `${n >= 0 ? "+" : "-"}$${Math.abs(n).toFixed(2)}`;

export default function ActivityHeatmap({ data = [] }) {
  // ბადეც და ქვედა ციფრებიც ერთი და იმავე უჯრებიდან ითვლება, ამიტომ ერთმანეთს ვერ დაუპირისპირდება
  const { cells, stats } = useMemo(() => {
    const byDate = new Map(data.map((item) => [item.date, item]));
    const now = new Date();
    const todayKey = toKey(now);

    // ბადე იწყება კვირას, 3 სრული კვირით უკან (SUN-SAT სვეტებთან დასაზუსტებლად)
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (7 * (WEEKS - 1) + now.getDay()));

    const built = [];
    let maxAbs = 0;

    for (let i = 0; i < WEEKS * 7; i++) {
      const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      const key = toKey(d);
      const isFuture = key > todayKey;
      const found = isFuture ? null : byDate.get(key);

      if (found) maxAbs = Math.max(maxAbs, Math.abs(Number(found.pnl) || 0));

      built.push({
        key,
        isFuture,
        isToday: key === todayKey,
        displayDate: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        status: found ? found.status : null,
        pnl: found ? Number(found.pnl) || 0 : null,
        count: found ? found.count : 0
      });
    }

    // ინტენსივობა: დიდი |P&L| = უფრო მკვეთრი ფერი
    const cellsWithIntensity = built.map((c) => ({
      ...c,
      opacity:
        (c.status === "Win" || c.status === "Loss") && maxAbs > 0
          ? 0.45 + 0.55 * (Math.abs(c.pnl) / maxAbs)
          : 1
    }));

    const active = cellsWithIntensity.filter((c) => c.status);
    return {
      cells: cellsWithIntensity,
      stats: {
        activeDays: active.length,
        winDays: active.filter((c) => c.status === "Win").length,
        lossDays: active.filter((c) => c.status === "Loss").length,
        breakevenDays: active.filter((c) => c.status === "Breakeven").length
      }
    };
  }, [data]);

  const getSquareClass = (c) => {
    if (c.isFuture) return "border border-dashed border-[#1f2023]/60 opacity-40 cursor-default";
    if (c.status === "Win") return "bg-[#0ecb81] shadow-sm shadow-[#0ecb81]/20 hover:scale-110 cursor-pointer";
    if (c.status === "Loss") return "bg-[#ef4444] shadow-sm shadow-[#ef4444]/20 hover:scale-110 cursor-pointer";
    if (c.status === "Breakeven") return "bg-[#eab308] shadow-sm shadow-[#eab308]/20 hover:scale-110 cursor-pointer";
    return "bg-[#141517] border border-[#1f2023]/40 hover:scale-110 cursor-pointer";
  };

  const getTitle = (c) => {
    if (c.isFuture) return c.displayDate;
    if (!c.status) return `${c.displayDate}: No trades`;
    return `${c.displayDate}: ${c.status} (${fmtMoney(c.pnl)}, ${c.count} trade${c.count === 1 ? "" : "s"})`;
  };

  return (
    <div className="w-full bg-[#09090b] border border-[#1f2023] rounded-xl p-5 text-left font-sans flex flex-col justify-between h-full">

      {/* ჰედერი და ლეგენდა */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1f2023]/40 pb-3">
        <div className="flex flex-col gap-0.5">
          <h4 className="text-xs font-bold text-[#f3f4f6] tracking-tight flex items-center gap-1.5">
            <span>📅</span> Trading Activity
          </h4>
          <span className="text-[10px] text-[#4b5563] font-semibold uppercase tracking-wider">Last 4 weeks</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-[9px] font-bold text-[#6b7280] font-mono">
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#141517] border border-[#1f2023]" /> None</div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#0ecb81]" /> Win</div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#ef4444]" /> Loss</div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#eab308]" /> B/E</div>
        </div>
      </div>

      {/* კვირის დღეები */}
      <div className="grid grid-cols-7 text-center gap-2 text-[9px] font-black text-[#4b5563] tracking-wider mt-4 mb-2">
        {DAYS_LABELS.map((lbl) => (
          <span key={lbl}>{lbl}</span>
        ))}
      </div>

      {/* 28 უჯრა */}
      <div className="grid grid-cols-7 gap-2">
        {cells.map((c) => (
          <div
            key={c.key}
            title={getTitle(c)}
            aria-label={getTitle(c)}
            style={c.status === "Win" || c.status === "Loss" ? { opacity: c.opacity } : undefined}
            className={
              "aspect-square rounded-[4px] transition-all duration-300 " +
              getSquareClass(c) +
              (c.isToday ? " ring-1 ring-[#f3f4f6]/70 ring-offset-1 ring-offset-[#09090b]" : "")
            }
          />
        ))}
      </div>

      {/* ქვედა ციფრები (იგივე 28 დღიდან) */}
      <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-[#1f2023]/40 mt-4 text-center">
        <div className="bg-[#1c0d2e]/10 border border-[#a855f7]/10 p-2.5 rounded-lg flex flex-col items-center justify-center gap-0.5">
          <span className="text-[9px] font-bold text-[#4b5563] uppercase tracking-wide">Active Days</span>
          <span className="text-sm font-black text-[#f3f4f6]">{stats.activeDays}</span>
          <span className="text-[8px] text-[#4b5563] font-medium font-mono">
            {stats.breakevenDays > 0 ? `${stats.breakevenDays} break-even` : "trading days"}
          </span>
        </div>

        <div className="bg-[#0d1c14]/30 border border-[#0ecb81]/10 p-2.5 rounded-lg flex flex-col items-center justify-center gap-0.5">
          <span className="text-[9px] font-bold text-[#4b5563] uppercase tracking-wide">Win Days</span>
          <span className="text-sm font-black text-[#0ecb81]">{stats.winDays}</span>
          <span className="text-[8px] text-[#4b5563] font-medium font-mono">profitable</span>
        </div>

        <div className="bg-[#1c0d0d]/30 border border-[#ef4444]/10 p-2.5 rounded-lg flex flex-col items-center justify-center gap-0.5">
          <span className="text-[9px] font-bold text-[#4b5563] uppercase tracking-wide">Loss Days</span>
          <span className="text-sm font-black text-[#ef4444]">{stats.lossDays}</span>
          <span className="text-[8px] text-[#4b5563] font-medium font-mono">unprofitable</span>
        </div>
      </div>
    </div>
  );
}