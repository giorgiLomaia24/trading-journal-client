import React, { useMemo } from "react";
import AnalyticsCard from "./AnalyticsCard";
import SessionCard from "./SessionCard";
import DataBlock from "./DataBlock";

const DAYS_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const DAYS_SHORT = { Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed", Thursday: "Thu", Friday: "Fri" };

// უსაფრთხო პარსერი: "+12.50", "-3.2", "50.0%", undefined, null -> რიცხვი
const num = (v) => {
  const n = parseFloat(String(v ?? "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
};
const fmtSigned = (n) => (n >= 0 ? "+" : "-") + Math.abs(n).toFixed(2);

const SESSION_DESC = {
  "NY AM": "NY Morning",
  "NY PM": "NY Afternoon"
};

export default function PatternsView({ dayData = [], sessionData = [], summary = null }) {
  // ჯამები: ბექენდის ზუსტი summary, ხოლო თუ არ მოვიდა, fallback დღეების მონაცემებზე
  const totals = useMemo(() => {
    if (summary) {
      const trades = num(summary.totalTrades);
      const wins = num(summary.wins);
      const rrCount = num(summary.rrCount);
      return {
        trades,
        pnl: num(summary.pnl),
        winRate: trades > 0 ? (wins / trades) * 100 : 0,
        avgRr: rrCount > 0 ? num(summary.rrSum) / rrCount : 0
      };
    }

    let trades = 0, pnl = 0, wins = 0, rrWeighted = 0, rrTrades = 0;
    dayData.forEach((d) => {
      const t = num(d.tradesCount);
      trades += t;
      pnl += num(d.totalPnL);
      wins += d.wins !== undefined ? num(d.wins) : Math.round((t * num(d.winRate)) / 100);
      if (num(d.avgRR) > 0) {
        rrWeighted += num(d.avgRR) * t; // შეწონილი საშუალო
        rrTrades += t;
      }
    });
    return {
      trades,
      pnl,
      winRate: trades > 0 ? (wins / trades) * 100 : 0,
      avgRr: rrTrades > 0 ? rrWeighted / rrTrades : 0
    };
  }, [summary, dayData]);

  return (
    <div className="w-full space-y-6 text-left font-sans animate-in fade-in duration-200">

      {/* ==================== Day of Week Performance ==================== */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#6b7280] uppercase tracking-wider">
          <span>📅</span> Day of Week Performance
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {DAYS_ORDER.map((dayName) => {
            const found = dayData.find((d) => d.day === dayName);
            const shortName = DAYS_SHORT[dayName];

            if (!found || !found.hasTrades) {
              return (
                <AnalyticsCard
                  key={dayName}
                  title={shortName}
                  value={dayName}
                  tagText="No trades"
                  tagVariant="neutral"
                  variant="neutral"
                  className="!min-h-[140px]"
                />
              );
            }

            const pnlNum = num(found.totalPnL);
            const isProfit = pnlNum >= 0;
            const wr = num(found.winRate);

            return (
              <div
                key={dayName}
                className={
                  "bg-[#0d0d0e] border " +
                  (isProfit ? "border-[#0ecb81]/20" : "border-[#f6465d]/20") +
                  " rounded-xl p-4 flex flex-col justify-between min-h-[140px] text-left"
                }
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-black text-[#f3f4f6] tracking-widest uppercase">{shortName}</span>
                  <span className="text-[11px] font-semibold text-[#4b5563]">{dayName}</span>
                </div>

                <div className="space-y-1.5 my-3 text-xs font-semibold">
                  <div className="flex justify-between text-[#6b7280]">
                    <span>Trades</span>
                    <span className="text-[#f3f4f6] font-black">{found.tradesCount}</span>
                  </div>
                  <div className="flex justify-between text-[#6b7280]">
                    <span>Win Rate</span>
                    <span className={(wr >= 50 ? "text-[#0ecb81]" : "text-[#f6465d]") + " font-black"}>{found.winRate}</span>
                  </div>
                  <div className="flex justify-between text-[#6b7280]">
                    <span>Avg RR</span>
                    <span className="text-[#f3f4f6] font-black">{found.avgRR}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#1f2023]/60 flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold text-[#4b5563] uppercase tracking-wider">Total P&L</span>
                  <span className={"text-xs font-black " + (isProfit ? "text-[#0ecb81]" : "text-[#f6465d]")}>
                    {fmtSigned(pnlNum)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#09090b] border border-[#1f2023] p-4 rounded-xl text-center md:text-left">
          <DataBlock label="Total Trades" value={totals.trades.toString()} />
          <DataBlock
            label="Overall Win Rate"
            value={totals.winRate.toFixed(1) + "%"}
            variant={totals.winRate >= 50 ? "success" : "danger"}
          />
          <DataBlock label="Overall Avg RR" value={totals.avgRr.toFixed(2)} />
          <DataBlock
            label="Total P&L"
            value={fmtSigned(totals.pnl)}
            variant={totals.pnl >= 0 ? "success" : "danger"}
          />
        </div>
      </div>

      {/* ==================== Session Performance ==================== */}
      <div className="space-y-4 pt-4 border-t border-[#1f2023]/60">
        <div className="flex items-center gap-2 text-xs font-bold text-[#6b7280] uppercase tracking-wider">
          <span>🕒</span> Session Performance
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sessionData.length === 0 ? (
            <div className="sm:col-span-2 bg-[#09090b] border border-[#1f2023] rounded-xl p-6 text-center text-xs text-[#4b5563] font-black uppercase tracking-widest">
              No session data logged yet
            </div>
          ) : (
            sessionData.map((s) => (
              <SessionCard
                key={s.session}
                sessionName={s.session || "N/A"}
                sessionDesc={SESSION_DESC[s.session] || "Trading Session"}
                tradesCount={s.tradesCount}
                openTrades={0}
                closedTrades={s.tradesCount}
                winRate={num(s.winRate)}
                avgRr={s.avgRR}
                pnl={num(s.totalPnL)}
                winsCount={s.wins}
                lossesCount={s.losses}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}