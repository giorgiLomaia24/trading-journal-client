import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

// 🚀 თულთიპი, რომელიც ადაპტირდება არჩეული თაბის მიხედვით
// const CustomTooltip = ({ active, payload, activeTab }) => {
//   if (active && payload && payload.length) {
//     const value = payload[0].value;

//     let formattedValue = value;
//     let labelColor = "text-[#0ecb81]";

//     if (activeTab === "WinRate") {
//       formattedValue = `${value}%`;
//       labelColor = "text-[#3b82f6]"; // ლურჯი ფერი მოგების პროცენტისთვის
//     } else {
//       // EquityCurve ან DailyP&L რეჟიმი
//       const isProfit = value >= 0;
//       formattedValue = isProfit ? `+$${value}` : `-$${Math.abs(value)}`;
//       labelColor = isProfit ? "text-[#0ecb81]" : "text-[#ef4444]";
//     }

//     return (
//       <div className="bg-[#09090b] border border-[#1f2023] rounded-xl p-3 shadow-2xl text-left font-sans">
//         <p className="text-[10px] font-black text-[#4b5563] uppercase tracking-wider mb-1">
//           {payload[0].payload.date}
//         </p>
//         <p className={`text-sm font-black tracking-tight ${labelColor}`}>
//           {activeTab}: {formattedValue}
//         </p>
//       </div>
//     );
//   }
//   return null;
// };

const CustomTooltip = ({ active, payload, activeTab }) => {
  if (active && payload && payload.length) {
    const raw = Number(payload[0].value) || 0;
    const value = Math.round(raw * 100) / 100;

    let formattedValue;
    let labelColor;

    if (activeTab === "WinRate") {
      formattedValue = `${value}%`;
      labelColor = "text-[#3b82f6]";
    } else {
      const isProfit = value >= 0;
      formattedValue = `${isProfit ? "+" : "-"}$${Math.abs(value).toFixed(2)}`;
      labelColor = isProfit ? "text-[#0ecb81]" : "text-[#f6465d]";
    }

    return (
      <div className="bg-[#09090b] border border-[#1f2023] rounded-xl p-3 shadow-2xl text-left font-sans">
        <p className="text-[10px] font-black text-[#4b5563] uppercase tracking-wider mb-1">
          {payload[0].payload.date}
        </p>
        <p className={`text-sm font-black tracking-tight ${labelColor}`}>
          {activeTab}: {formattedValue}
        </p>
      </div>
    );
  }
  return null;
};

// 🚀 დაემატა activeTab პროპსების დესტრუქტურიზაციაში
export default function PerformanceChart({ data = [], activeTab = "EquityCurve", isEmbedded = false }) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[250px] bg-[#09090b] border border-[#1f2023] rounded-xl flex items-center justify-center text-xs text-[#4b5563] font-sans">
        No performance timeline data available
      </div>
    );
  }

  const containerStyles = isEmbedded
    ? "w-full p-0 bg-transparent border-none text-left font-sans"
    : "w-full bg-[#09090b] border border-[#1f2023] rounded-xl p-5 text-left font-sans";

  // დინამიური გრადიენტის ფერები სხვადასხვა თაბისთვის
  const gradientColor = activeTab === "WinRate" ? "#3b82f6" : "#0ecb81";

  return (
    <div className={containerStyles}>
      {!isEmbedded && (
        <div className="flex items-center gap-2 text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-6">
          <span className="text-[#0ecb81]">📈</span> Performance Timeline ({activeTab})
        </div>
      )}

      <div className="w-full h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradientColor} stopOpacity={0.12} />
                <stop offset="95%" stopColor={gradientColor} stopOpacity={0.00} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1f2023" vertical={false} />

            <XAxis
              dataKey="date"
              stroke="#4b5563"
              fontSize={10}
              fontWeight="bold"
              tickLine={false}
              dy={10}
            />

            {/* <YAxis 
              stroke="#4b5563" 
              fontSize={10} 
              fontWeight="bold"
              tickLine={false} 
              axisLine={false}
              tickFormatter={(v) => activeTab === "WinRate" ? `${v}%` : `$${v}`}
            /> */}
            <YAxis
              stroke="#4b5563"
              fontSize={10}
              fontWeight="bold"
              tickLine={false}
              axisLine={false}
              width={52}
              domain={activeTab === "WinRate" ? [0, 100] : ["auto", "auto"]}
              tickFormatter={(v) => (activeTab === "WinRate" ? `${v}%` : `$${v}`)}
            />

            {/* 🚀 გადავცემთ activeTab-ს თულთიპს შიგნით გამოსაყენებლად */}
            <Tooltip content={<CustomTooltip activeTab={activeTab} />} />

            <Area
              type="monotone"
              dataKey={activeTab} // 🚀 ახლა კითხულობს დინამიურად "EquityCurve"-ს, "WinRate"-ს ან "DailyP&L"-ს!
              stroke={gradientColor}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#chartGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
