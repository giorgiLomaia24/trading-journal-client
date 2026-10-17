import React, { useMemo, useState } from "react";
import PerformanceChart from "./PerformanceChart";
import MonthlyPnlBar from "./MonthlyPnlBar";
import WinLossDonut from "./WinLossDonut";

const PALETTE = ["#0ecb81", "#3b82f6", "#a855f7", "#eab308", "#f6465d", "#06b6d4", "#f97316"];

// "Breakout (50%)" -> "Breakout"
const cleanName = (name = "") => String(name).replace(/\s*\(\d+%\)\s*$/, "");

export default function ChartsView({
  timelineData = [],
  monthlyData = [],
  wins = 0,
  losses = 0,
  strategyDonut = []
}) {
  const [chartTab, setChartTab] = useState("EquityCurve");

  const segments = useMemo(() => {
    const total = strategyDonut.reduce((s, x) => s + (Number(x.value) || 0), 0);
    let offset = 0;
    const items = strategyDonut.map((x, i) => {
      const value = Number(x.value) || 0;
      const pct = total > 0 ? (value / total) * 100 : 0;
      const seg = {
        name: cleanName(x.name),
        value,
        pct,
        color: PALETTE[i % PALETTE.length],
        dash: `${pct} ${100 - pct}`,
        offset: -offset
      };
      offset += pct;
      return seg;
    });
    return { total, items };
  }, [strategyDonut]);

  return (
    <div className="w-full space-y-5 text-left font-sans animate-in fade-in duration-200">
      {/* ზედა ხაზი */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Performance Timeline */}
        <div className="w-full bg-[#09090b] border border-[#1f2023] rounded-xl p-5">
          <div className="flex items-center gap-1 mb-4">
            {[
              { key: "EquityCurve", label: "Equity" },
              { key: "DailyP&L", label: "Daily P&L" },
              { key: "WinRate", label: "Win Rate" }
            ].map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setChartTab(t.key)}
                className={
                  "px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors " +
                  (chartTab === t.key
                    ? "bg-[#1f2023] text-[#f3f4f6]"
                    : "text-[#6b7280] hover:text-[#f3f4f6]")
                }
              >
                {t.label}
              </button>
            ))}
          </div>
          <PerformanceChart data={timelineData} activeTab={chartTab} isEmbedded={true} />
        </div>

        {/* Monthly P&L */}
        <MonthlyPnlBar data={monthlyData} />
      </div>

      {/* ქვედა ხაზი */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Win/Loss */}
        <div className="w-full bg-[#09090b] border border-[#1f2023] rounded-xl p-5">
          <WinLossDonut wins={wins} losses={losses} />
        </div>

        {/* Strategy Breakdown */}
        <div className="w-full bg-[#09090b] border border-[#1f2023] rounded-xl p-5 flex flex-col justify-between text-left">
          <div className="flex items-center gap-2 text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-2">
            <span>🔮</span> Strategy Breakdown
          </div>

          {segments.total === 0 ? (
            <div className="h-[220px] flex items-center justify-center text-xs text-[#4b5563] font-black uppercase tracking-widest">
              No strategy data
            </div>
          ) : (
            <>
              <div className="relative w-full h-[220px] flex items-center justify-center">
                <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#1f2023" strokeWidth="2.5" />
                  {segments.items.map((s) => (
                    <circle
                      key={s.name}
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="transparent"
                      stroke={s.color}
                      strokeWidth="2.5"
                      strokeDasharray={s.dash}
                      strokeDashoffset={s.offset}
                    />
                  ))}
                </svg>

                <div className="absolute flex flex-col items-center justify-center text-center select-none">
                  <span className="text-2xl font-black tracking-tight text-[#f3f4f6]">{segments.total}</span>
                  <span className="text-[10px] font-bold text-[#4b5563] uppercase tracking-wider mt-0.5">
                    Total Trades
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-3 border-t border-[#1f2023]/40 text-[11px] font-bold">
                {segments.items.map((s) => (
                  <div key={s.name} className="flex items-center gap-2 text-[#9ca3af]">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="uppercase">{s.name} ({s.pct.toFixed(0)}%)</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}