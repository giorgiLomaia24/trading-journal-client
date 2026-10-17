// ==================== RADAR PERFORMANCE COMPONENT ====================
import React from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

export default function RadarPerformance({ 
  data = [
    { name: "Win %", value: 50, fullMark: 100 },
    { name: "Profit factor", value: 40, fullMark: 100 },
    { name: "Avg win/loss", value: 65, fullMark: 100 },
    { name: "Recovery factor", value: 35, fullMark: 100 },
    { name: "Max drawdown", value: 80, fullMark: 100 },
    { name: "Consistency", value: 55, fullMark: 100 },
  ] 
}) {
  return (
    <div className="w-full bg-[#09090b] border border-[#1f2023] rounded-xl p-5 text-left font-sans flex flex-col justify-between">
      {/* სათაური */}
      <div className="flex items-center gap-2 text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-2">
        <span className="text-[#0ecb81]">🌐</span> Performance Score
        <span className="text-[10px] text-[#4b5563] font-medium tracking-normal lowercase ml-auto">Your trading metrics</span>
      </div>

      {/* რადარის კონტეინერი */}
      <div className="w-full h-[220px] flex items-center justify-center mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            {/* უკანა ფონის ქსელის ხაზები */}
            <PolarGrid stroke="#1f2023" />
            
            {/* 🚀 კუთხეების ტექსტური დასახელებები - გასწორდა "name"-ზე ბექენდის შესაბამისად */}
            <PolarAngleAxis 
              dataKey="name" 
              stroke="#6b7280" 
              fontSize={10} 
              fontWeight="bold"
            />
            
            {/* რადიუსის ღერძი (ციფრები დამალულია სისუფთავისთვის) */}
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            
            {/* თავად ტრეიდერის ქსელის შევსება */}
            <Radar
              name="Metrics"
              dataKey="value"
              stroke="#0ecb81"
              fill="#0ecb81"
              fillOpacity={0.15}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
