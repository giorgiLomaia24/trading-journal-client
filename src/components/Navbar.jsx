// ==================== PREMIUM NAVBAR COMPONENT - PART 1 ====================
import React from "react";
import { useLocation } from "react-router-dom";

export default function Navbar({ activeAccount = "ACCOUNT IS MANDATORY", currency = "emp" }) {
  const location = useLocation();

  // ფუნცქია, რომელიც ბრაუზერის მისამართის მიხედვით აბრუნებს გვერდის ლამაზ სახელს
  const getPageName = () => {
    const path = location.pathname;
    if (path === "/") return "Dashboard";
    if (path === "/journal") return "Journal";
    if (path === "/calendar") return "Calendar";
    if (path === "/statistics") return "Statistics";
    if (path.startsWith("/trade/")) return "Trade Detail";
    if (path === "/reports") return "Reports";
    if (path === "/achievements") return "Achievements";
    if (path === "/inner-space") return "Inner Space";
    return "Dashboard";
  };

  return (
    <header className="w-full h-14 bg-[#040405] border-b border-[#1f2023] px-6 flex items-center justify-between sticky top-0 z-30 font-sans text-left select-none">
      
      {/* მარცხენა მხარე: დინამიური Breadcrumbs ჩვენს მწვანე აქცენტთან ერთად */}
      <div className="flex items-center gap-1.5 text-xs font-bold font-mono tracking-tight">
        <span className="text-[#4b5563] hover:text-[#f3f4f6] transition-colors cursor-pointer">
          Yonko
        </span>
        <span className="text-[#1f2023] text-[10px] font-sans">/</span>
        <span className="text-[#0ecb81] font-black filter drop-shadow-[0_0_3px_rgba(14,203,129,0.2)]">
          {getPageName()}
        </span>
      </div>
      
      {/* ცენტრალური მხარე: აქტიური ანგარიშის მწკრივი (სქრინშოტის ზუსტი ასლი) */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-[#0d0d0e] border border-[#1f2023] px-3 py-1.5 rounded-full select-none">
        {/* პატარა მწვანე აქტიური წერტილი (ინდიკატორი) */}
        <span className="w-1.5 h-1.5 rounded-full bg-[#0ecb81] shadow-sm shadow-[#0ecb81]/40 animate-pulse" />
        
        {/* ანგარიშის სახელი */}
        <span className="text-[11px] font-black text-[#f3f4f6] tracking-tight">
          {activeAccount}
        </span>
        
        {/* ვალუტის პატარა ნაცრისფერი თეგი */}
        <span className="text-[9px] font-black text-[#6b7280] font-mono tracking-wider ml-0.5">
          {currency}
        </span>
      </div>

      {/* მარჯვენა მხარე სრულიად ცარიელია სისუფთავისთვის (ყველა ნოტიფიკაცია და თემა 100%-ით ამოგდებულია!) */}
      <div className="w-12 h-2" />

    </header>
  );
}
