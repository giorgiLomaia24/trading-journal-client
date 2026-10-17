// // ==================== STRATEGIES VIEW - PART 1 ====================
// import React from "react";
// import DataBlock from "./DataBlock";
// import SessionCard from "./SessionCard";
// import RuleProgress from "./RuleProgress";
// import WinLossDonut from "./WinLossDonut";

// export default function StrategiesView() {
//   return (
//     <div className="w-full space-y-6 text-left font-sans animate-in fade-in duration-200">

//       {/* ==================== სექცია 1: Strategy Performance ==================== */}
//       <div className="space-y-4">
//         <div className="flex items-center gap-2 text-xs font-bold text-[#6b7280] uppercase tracking-wider">
//           <span>⚡</span> Strategy Performance
//         </div>

//         {/* ზედა ჰორიზონტალური ცხრილისებრი ზოლი */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#09090b] border border-[#1f2023] p-4 rounded-xl text-center md:text-left items-center">
//           <DataBlock label="Strategy" value="BREAKOUT" />
//           <DataBlock label="Win Rate" value="50.0%" variant="success" />
//           <DataBlock label="Total P&L" value="-$35" variant="danger" />
//           <DataBlock label="Avg RR" value="2.33" />
//         </div>

//         {/* სტრატეგიის დეტალური ვერტიკალური ქარდი */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="md:col-span-1">
//             <SessionCard
//               sessionName="BREAKOUT"
//               sessionDesc="⚡ Volatility expansion Strategy"
//               tradesCount={2}
//               openTrades={0}
//               closedTrades={2}
//               winRate={50.0}
//               avgRr="2.33"
//               pnl={-35.00}
//               winsCount={1}
//               lossesCount={1}
//             />
//           </div>
//           <div className="hidden md:block md:col-span-2"></div> {/* ბალანსისთვის */}
//         </div>
//       </div>


//       {/* ==================== სექცია 2: Rule Adherence ==================== */}
//       <div className="space-y-4 pt-4 border-t border-[#1f2023]/60">
//         <div className="flex items-center justify-between w-full border-b border-[#1f2023]/30 pb-2">
//           <div className="flex items-center gap-2 text-xs font-bold text-[#6b7280] uppercase tracking-wider">
//             <span>🎯</span> Rule Adherence
//           </div>
//           <span className="text-[10px] text-[#4b5563] font-bold uppercase tracking-wider">2 trades</span>
//         </div>

//         <div className="bg-[#0d0d0e] border border-[#1f2023] rounded-xl p-5 space-y-4">
//           <span className="text-[11px] font-black text-[#9ca3af] uppercase tracking-wide block mb-1">
//             BREAKOUT
//           </span>
//           <div className="space-y-4">
//             <RuleProgress ruleNumber={1} percentage={100} />
//             <RuleProgress ruleNumber={2} percentage={50} />
//             <RuleProgress ruleNumber={3} percentage={100} />
//             <RuleProgress ruleNumber={4} percentage={50} />
//           </div>
//         </div>
//       </div>

//       {/* ==================== სექცია 3: Strategy Breakdown (სრულად გასწორებული ვიზუალით) ==================== */}
//       <div className="space-y-4 pt-4 border-t border-[#1f2023]/60">
//         <div className="flex items-center gap-2 text-xs font-bold text-[#6b7280] uppercase tracking-wider">
//           <span>🔮</span> Strategy Breakdown
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {/* სუფთა ბარათი, სადაც არანაირი ტექსტების აფსურდული დაჯახება აღარ მოხდება */}
//           <div className="relative w-full max-w-sm bg-[#09090b] border border-[#1f2023] rounded-xl p-5 flex flex-col justify-between">

//             <div className="relative w-full h-[220px] flex items-center justify-center">

//               {/* სუფთა მწვანე წრე მთლიანი 100%-ისთვის */}
//               <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 36 36">
//                 {/* უკანა ნაცრისფერი ზოლი */}
//                 <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#1f2023" strokeWidth="2.5" />
//                 {/* წინა საფირმო მწვანე აქცენტის წრე (100% BREAKOUT) */}
//                 <circle 
//                   cx="18" 
//                   cy="18" 
//                   r="15.915" 
//                   fill="transparent" 
//                   stroke="#0ecb81" 
//                   strokeWidth="2.5" 
//                   strokeDasharray="100 0" 
//                   strokeLinecap="round"
//                   className="drop-shadow-[0_0_4px_rgba(14,203,129,0.2)]"
//                 />
//               </svg>

//               {/* აბსოლუტურად ცენტრირებული, იზოლირებული ტექსტების ბლოკი */}
//               <div className="absolute flex flex-col items-center justify-center text-center select-none">
//                 <span className="text-3xl font-black tracking-tight text-[#f3f4f6]">2</span>
//                 <span className="text-[10px] font-bold text-[#4b5563] uppercase tracking-wider mt-0.5">
//                   Total Trades
//                 </span>
//               </div>
//             </div>

//             {/* ქვედა ლეგენდის ბლოკი */}
//             <div className="flex items-center justify-center gap-4 pt-3 border-t border-[#1f2023]/40 text-[11px] font-bold">
//               <div className="flex items-center gap-2 text-[#9ca3af]">
//                 <span className="w-2 h-2 rounded-full bg-[#0ecb81]" />
//                 <span>BREAKOUT (100%)</span>
//               </div>
//             </div>

//           </div>
//           <div className="hidden md:block"></div>
//         </div>
//       </div>

//     </div>
//   );
// }

import React from "react";
import DataBlock from "./DataBlock";
import SessionCard from "./SessionCard";
import RuleProgress from "./RuleProgress";

export default function StrategiesView({ strategyData = null, ruleData = [] }) {
  // 🚀 თუ მომხმარებელს არჩეული აქვს All Strategies, ვთხოვთ კონკრეტული სტრატეგიის მონიშვნას
  if (!strategyData) {
    return (
      <div className="w-full bg-[#09090b] border border-[#1f2023] rounded-xl p-8 text-center text-xs text-[#4b5563] font-black uppercase tracking-widest animate-in fade-in duration-150">
        Please select a specific strategy from the top filter to view rules and deep metrics.
      </div>
    );
  }

  const pnlNum = parseFloat(strategyData.totalPnL?.replace(/[^0-9.-]/g, '')) || 0;
  const isProfit = pnlNum >= 0;

  return (
    <div className="w-full space-y-6 text-left font-sans animate-in fade-in duration-200">

      {/* ==================== სექცია 1: Strategy Performance ==================== */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#6b7280] uppercase tracking-wider">
          <span>⚡</span> Strategy Performance
        </div>

        {/* ზედა ჰორიზონტალური დინამიური ზოლი */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#09090b] border border-[#1f2023] p-4 rounded-xl text-center md:text-left items-center">
          <DataBlock label="Strategy" value={strategyData.strategyName || "BREAKOUT"} />
          <DataBlock label="Win Rate" value={strategyData.winRate || "0.0%"} variant={parseFloat(strategyData.winRate) >= 50 ? "success" : "danger"} />
          <DataBlock label="Total P&L" value={strategyData.totalPnL || "$0.00"} variant={isProfit ? "success" : "danger"} />
          <DataBlock label="Avg RR" value={strategyData.avgRR || "0.00"} />
        </div>

        {/* სტრატეგიის დეტალური ვერტიკალური ქარდი */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <SessionCard
              sessionName={strategyData.strategyName || "Strategy"}
              sessionDesc="⚡ Trading Strategy Performance"
              tradesCount={strategyData.tradesCount || 0}
              openTrades={0}
              closedTrades={strategyData.tradesCount || 0}
              winRate={parseFloat(strategyData.winRate) || 0}
              avgRr={strategyData.avgRR || "0.00"}
              pnl={pnlNum}
              winsCount={Number(strategyData.wins) || 0}
              lossesCount={Number(strategyData.losses) || 0}
            />
          </div>
          <div className="hidden md:block md:col-span-2"></div>
        </div>
      </div>

      {/* ==================== სექცია 2: Rule Adherence ==================== */}
      <div className="space-y-4 pt-4 border-t border-[#1f2023]/60">
        <div className="flex items-center justify-between w-full border-b border-[#1f2023]/30 pb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#6b7280] uppercase tracking-wider">
            <span>🎯</span> Rule Adherence
          </div>
          <span className="text-[10px] text-[#4b5563] font-bold uppercase tracking-wider">{strategyData.tradesCount || 0} trades</span>
        </div>

        <div className="bg-[#0d0d0e] border border-[#1f2023] rounded-xl p-5 space-y-4">
          <span className="text-[11px] font-black text-[#9ca3af] uppercase tracking-wide block mb-1">
            {strategyData.strategyName}
          </span>
          <div className="space-y-4">
            {ruleData.length === 0 ? (
              <div className="text-xs text-[#4b5563] font-bold uppercase tracking-wider py-2">
                No rules defined or checked for this strategy yet.
              </div>
            ) : (
              ruleData.map((rule, idx) => (
                <div key={rule.ruleId || idx} className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold text-[#6b7280]">
                    <span>{rule.displayIndex}. {rule.text}</span>
                    <span className={rule.isPerfect ? "text-[#0ecb81]" : "text-[#9ca3af]"}>{rule.percentage}%</span>
                  </div>
                  <RuleProgress ruleNumber={rule.displayIndex} percentage={rule.percentage} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
