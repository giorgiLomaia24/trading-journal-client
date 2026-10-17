import React from "react";

export default function StatCard({ 
  title, 
  value, 
  trend = "neutral", // "up" (მწვანე), "down" (წითელი), "neutral" (ნაცრისფერი)
  icon 
}) {
  
  // ტრენდის მიხედვით ფერების განსაზღვრა (იასამნისფერის გარეშე!)
  const trendColors = {
    up: "text-[#0ecb81]",
    down: "text-[#ef4444]",
    neutral: "text-[#9ca3af]"
  };

  return (
    <div className="bg-[#0d0d0e] border border-[#1f2023] rounded-xl p-5 flex flex-col justify-between min-h-[110px] w-full text-left transition-all hover:border-[#1f2023]/80">
      {/* ზედა ხაზი: სათაური და პატარა აიქონი/ინდიკატორი */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#6b7280] tracking-wide">
          {title}
        </span>
        {icon && (
          <span className="text-[#4b5563] text-sm">
            {icon}
          </span>
        )}
      </div>

      {/* ქვედა ხაზი: ძირითადი ციფრი/მნიშვნელობა */}
      <div className="mt-4 flex items-baseline justify-between">
        <h3 className={`text-xl font-bold tracking-tight ${trendColors[trend]}`}>
          {value}
        </h3>
        
        {/* პატარა დინამიური ისარი ტრენდისთვის */}
        {trend !== "neutral" && (
          <span className={`text-xs ${trendColors[trend]}`}>
            {trend === "up" ? "↗" : "↘"}
          </span>
        )}
      </div>
    </div>
  );
}
