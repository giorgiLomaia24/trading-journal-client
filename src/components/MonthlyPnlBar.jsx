// ==================== MONTHLY PNL BAR CHART ====================
import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";

const CustomBarTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const isProfit = value >= 0;
    return (
      <div className="bg-[#09090b] border border-[#1f2023] rounded-xl p-3 shadow-2xl text-left font-sans">
        <p className="text-[10px] font-black text-[#4b5563] uppercase tracking-wider mb-1">
          {payload[0].payload.month}
        </p>
        <p className={`text-sm font-black tracking-tight ${isProfit ? "text-[#0ecb81]" : "text-[#ef4444]"}`}>
          P&L: {isProfit ? `+$${value}` : `-$${Math.abs(value)}`}
        </p>
      </div>
    );
  }
  return null;
};

export default function MonthlyPnlBar({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[280px] bg-[#09090b] border border-[#1f2023] rounded-xl flex items-center justify-center text-xs text-[#4b5563] font-sans">
        No monthly P&L data available
      </div>
    );
  }

  return (
    <div className="w-full bg-[#09090b] border border-[#1f2023] rounded-xl p-5 text-left font-sans">
      <div className="flex items-center gap-2 text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-6">
        <span className="text-[#0ecb81]">📊</span> Monthly P&L
      </div>

      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2023" vertical={false} />
            <XAxis dataKey="month" stroke="#4b5563" fontSize={10} fontWeight="bold" tickLine={false} dy={10} />
            {/* ✅ სწორი და გასწორებული ხაზი */}
            <YAxis stroke="#4b5563" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
            <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
            <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? "#0ecb81" : "#ef4444"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
