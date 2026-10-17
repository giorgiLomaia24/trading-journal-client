import React from "react";

export default function Tag({ 
  children, 
  variant = "neutral" // success, danger, warning, info, neutral
}) {
  
  // დინამიური ფერების პალიტრა (იასამნისფერი შეცვლილია ნეიტრალური მუქი აქცენტით)
  const variants = {
    // მწვანე (Win / BUY)
    success: "bg-[#0ecb81]/10 text-[#0ecb81] border border-[#0ecb81]/20",
    
    // წითელი (Loss / SELL)
    danger: "bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20",
    
    // ყვითელი (Breakeven)
    warning: "bg-[#eab308]/10 text-[#eab308] border border-[#eab308]/20",
    
    // ნეიტრალური მუქი (სიმბოლოებისთვის E.G. MNQ)
    info: "bg-[#1f2023] text-[#f3f4f6] border border-[#2f3036]",
    
    // ნაცრისფერი (სტრატეგიებისთვის E.G. BREAKOUT)
    neutral: "bg-[#0d0d0e] text-[#6b7280] border border-[#1f2023]"
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase ${variants[variant]}`}>
      {children}
    </span>
  );
}
