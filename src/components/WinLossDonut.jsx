// ==================== WIN/LOSS DONUT CHART - PART 1 ====================
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function WinLossDonut({ wins = 1, losses = 1 }) {
  const total = wins + losses;
  const winRate = total > 0 ? ((wins / total) * 100).toFixed(1) : "0.0";

  // Recharts-ისთვის მონაცემების სტრუქტურა (სქრინშოტის ფერებით)
  const data = [
    { name: "Wins", value: wins, color: "#0ecb81" }, // ჩვენი საფირმო მწვანე
    { name: "Losses", value: losses, color: "#ef4444" } // წითელი
  ];

  // თუ საერთოდ არ არის ტრეიდები, ვარენდერებთ პლეისჰოლდერს
  if (total === 0) {
    return (
      <div className="w-full h-[300px] bg-[#09090b] border border-[#1f2023] rounded-xl flex items-center justify-center text-xs text-[#4b5563] font-medium font-sans">
        No win/loss data available
      </div>
    );
  }
// ==================== WIN/LOSS DONUT CHART - PART 2 ====================
  return (
    <div className="w-full bg-[#09090b] border border-[#1f2023] rounded-xl p-5 text-left font-sans flex flex-col justify-between">
      {/* სათაური სქრინშოტის მიხედვით */}
      <div className="flex items-center gap-2 text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-2">
        <span className="text-[#a855f7]">🟣</span> Win/Loss Analysis
      </div>

      {/* გრაფიკისა და ცენტრალური ტექსტის ერთიანი კონტეინერი */}
      <div className="relative w-full h-[220px] flex items-center justify-center">
        
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70} // ქმნის დონატის (წრის) ეფექტს
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* აბსოლუტურად ცენტრირებული პროცენტის ბლოკი */}
        <div className="absolute flex flex-col items-center justify-center text-center select-none">
          <span className="text-2xl font-black tracking-tight text-[#f3f4f6]">
            {winRate}%
          </span>
          <span className="text-[10px] font-bold text-[#4b5563] uppercase tracking-wider mt-0.5">
            Win Rate
          </span>
        </div>
      </div>

      {/* ქვედა ლეგენდის ბლოკი (ინდიკატორები - სქრინშოტის ზუსტი ასლი) */}
      <div className="flex items-center justify-center gap-4 pt-2 border-t border-[#1f2023]/40 text-[11px] font-bold">
        <div className="flex items-center gap-2 text-[#9ca3af]">
          <span className="w-2 h-2 rounded-full bg-[#0ecb81]" />
          <span>{wins} wins</span>
        </div>
        <div className="flex items-center gap-2 text-[#9ca3af]">
          <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
          <span>{losses} losses</span>
        </div>
      </div>

    </div>
  );
}
