// ==================== PREMIUM ANALYTICSCARD - PART 1 ====================
import React from "react";
import Tag from "./Tag";

export default function AnalyticsCard({
  title,
  value,
  tagText,
  tagVariant = "neutral",
  variant = "neutral", // success, danger, neutral, ან ახალი: pnl, winrate, trades, avgwl
  badgeIcon,
  className = "",
  isPremium = false,   // 🎯 ოპციონალური თეგი - სხვა გვერდების დასაცავად!
}) {
  
  // 1. ძველი კლასიკური რეჟიმის სტილები (Overview და Patterns ფეიჯებისთვის)
  const valueColors = {
    success: "text-[#0ecb81]",
    danger: "text-[#ef4444]",
    neutral: "text-[#f3f4f6]"
  };

  const classicBgs = {
    success: "bg-[#0d1c14]/20 border-[#0ecb81]/20 hover:border-[#0ecb81]/30",
    danger: "bg-[#1c0d0d]/20 border-[#ef4444]/20 hover:border-[#ef4444]/40",
    neutral: "bg-[#09090b] border-[#1f2023] hover:border-[#2f3036]"
  };

  // 2. ახალი პრემიუმ რეჟიმის თემები (მხოლოდ დეშბორდის ზედა 4 ქარდისთვის)
  const premiumThemes = {
    pnl: {
      bg: "bg-[#1c1214] border-[#ef4444]/15 hover:border-[#ef4444]/25 shadow-sm shadow-[#ef4444]/2",
      iconBg: "bg-[#29171a] text-[#ef4444]",
      icon: "$",
      stroke: "#ef4444",
      path: "M0 10 Q 15 25, 30 18 T 60 32 T 90 28" // ნამდვილი წითელი დაღმავალი მინი-ხაზი
    },
    winrate: {
      bg: "bg-[#14121f] border-[#a855f7]/15 hover:border-[#a855f7]/25 shadow-sm shadow-[#a855f7]/2",
      iconBg: "bg-[#1d1733] text-[#a855f7]",
      icon: "⎋",
      stroke: "#a855f7",
      path: "M0 30 Q 15 25, 30 32 T 60 12 T 90 8" // ნამდვილი იასამნისფერი აღმავალი ხაზი
    },
    trades: {
      bg: "bg-[#11161b] border-[#06b6d4]/15 hover:border-[#06b6d4]/25 shadow-sm shadow-[#06b6d4]/2",
      iconBg: "bg-[#14232a] text-[#06b6d4]",
      icon: "⌁",
      stroke: "#06b6d4",
      path: "M0 20 Q 15 10, 30 25 T 60 12 T 90 22" // ლურჯი ტრენდ-ლაინი
    },
    avgwl: {
      bg: "bg-[#191512] border-[#f97316]/15 hover:border-[#f97316]/25 shadow-sm shadow-[#f97316]/2",
      iconBg: "bg-[#271d17] text-[#f97316]",
      icon: "↗",
      stroke: "#f97316",
      path: "M0 12 Q 15 28, 30 10 T 60 22 T 90 18" // ნარინჯისფერი ტრენდ-ლაინი
    }
  };
// ==================== PREMIUM ANALYTICSCARD - PART 2 ====================
  // 1. რენდერი თუ აქტიურია ოპციონალური პრემიუმ ვერსია (მთავარი დეშბორდისთვის)
  if (isPremium) {
    const theme = premiumThemes[variant] || premiumThemes.pnl;
    
    return (
      <div className={`relative border rounded-xl p-4 sm:p-5 flex flex-col justify-between min-h-[120px] text-left font-sans transition-all overflow-hidden ${theme.bg} ${className}`}>
        
        {/* მარჯვენა ზედა კუთხის ფერადი აიქონის კონტეინერი და მინი SVG ხაზი */}
        <div className="absolute right-4 top-4 flex flex-col items-end gap-3.5 select-none">
          <div className={`w-7 w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs ${theme.iconBg}`}>
            {theme.icon}
          </div>
          {/* მინი ტრენდ-ლაინი ზუსტად სქრინშოტის იერით */}
          <svg className="w-16 h-8 opacity-75" viewBox="0 0 90 40" fill="none">
            <path d={theme.path} stroke={theme.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* კონტენტი: სათაური და დიდი ციფრი */}
        <div className="space-y-1.5 max-w-[65%]">
          <span className="text-[10px] font-black text-[#6b7280] tracking-widest uppercase block">
            {title}
          </span>
          <h3 className="text-lg sm:text-xl font-black tracking-tight text-[#f3f4f6]">
            {value}
          </h3>
        </div>

        {/* ქვედა თეგი */}
        {tagText && (
          <div className="mt-4">
            <Tag variant={tagVariant}>{tagText}</Tag>
          </div>
        )}

      </div>
    );
  }

  // 2. დეფოლტ კლასიკური რენდერი (სხვა გვერდების დასაცავად - ძველი კოდი)
  const classicBg = classicBgs[variant] || classicBgs.neutral;
  const classicColor = valueColors[variant] || valueColors.neutral;

  return (
    <div className={`border rounded-xl p-4 sm:p-5 flex flex-col justify-between min-h-[115px] text-left font-sans transition-all ${classicBg} ${className}`}>
      <div className="flex items-center justify-between w-full">
        <span className="text-[10px] font-black text-[#4b5563] tracking-widest uppercase">
          {title}
        </span>
        {badgeIcon && <span className="text-xs flex items-center justify-center">{badgeIcon}</span>}
      </div>

      <div className="mt-3 flex items-baseline">
        <h3 className={`text-lg sm:text-xl font-black tracking-tight ${classicColor}`}>
          {value}
        </h3>
      </div>

      {tagText && (
        <div className="mt-2.5">
          <Tag variant={tagVariant}>{tagText}</Tag>
        </div>
      )}
    </div>
  );
}
