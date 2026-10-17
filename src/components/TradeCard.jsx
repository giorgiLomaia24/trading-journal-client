// // ==================== TRADECARD COMPONENT - PART 1 ====================
// import { useNavigate } from "react-router-dom"; 
// import React from "react";
// import Tag from "./Tag";
// import Button from "./Button";

// export default function TradeCard({ trade, viewMode = "grid" }) {
//   const navigate = useNavigate();
//   // მონაცემების დესტრუქტურიზაცია უსაფრთხოებისთვის
//   const chartUrl = trade.images && trade.images.length > 0 ? trade.images[0] : null;
//   const {
//     symbol = "MNQ",
//     type = "SELL",
//     strategy = "BREAKOUT",
//     contracts = 3,
//     rr = "1:1",
//     session = "NY AM",
//     date = "Oct 13, 2026",
//     pnl = -210.00,
//     notes = "I should not have done that",
//   } = trade;


//   const isWin = pnl >= 0;
  
//   // P&L ფორმატირება და ფერები
//   const pnlFormatted = isWin ? `+$${pnl.toFixed(2)}` : `-$${Math.abs(pnl).toFixed(2)}`;
//   const pnlColor = isWin ? "text-[#0ecb81]" : "text-[#ef4444]";
//   const pnlBg = isWin ? "bg-[#0ecb81]/5" : "bg-[#ef4444]/5";
//   const pnlBorder = isWin ? "border-[#0ecb81]/10" : "border-[#ef4444]/10";

//   // --- ქეისი 1: LIST VIEW (სქრინშოტი 1-ის მიხედვით) ---
//   if (viewMode === "list") {
//     return (
//       <div
//         onClick={() => navigate(`/trade/${trade._id || trade.id}`)} 
//         className="w-full bg-[#09090b] border border-[#1f2023] hover:border-[#2f3036] rounded-xl p-4 flex flex-col gap-3 transition-all text-left">
        
//         {/* ზედა ხაზი: თეგები, მეტამონაცემები და თარიღი */}
//         <div className="flex items-center justify-between w-full">
//           <div className="flex flex-wrap items-center gap-2">
//             {/* სიმბოლო (იასამნისფერის ნაცვლად ვიყენებთ ნეიტრალურ მუქ ინფოს) */}
//             <Tag variant="info">{symbol}</Tag>
//             <Tag variant={type.toUpperCase() === "BUY" ? "success" : "danger"}>{type}</Tag>
//             <Tag variant="neutral">{strategy}</Tag>
            
//             {/* პატარა გამყოფი წერტილი და მეტამონაცემები */}
//             <span className="text-[#4b5563] text-xs px-1">•</span>
//             <span className="text-xs text-[#9ca3af] font-medium">{contracts} contracts</span>
//             <span className="text-[#4b5563] text-xs">•</span>
//             <span className="text-xs text-[#eab308] font-semibold">🎯 {rr}</span>
//             <span className="text-[#4b5563] text-xs">•</span>
//             <span className="text-xs text-[#9ca3af] font-medium">🕒 {session}</span>
//           </div>
          
//           {/* მარჯვენა მხარეს თარიღი */}
//           <span className="text-xs text-[#4b5563] font-medium">{date}</span>
//         </div>

//         {/* შუა ხაზი: ნოტების ველი (გრძელი და დახვეწილი ბლოკი) */}
//         {notes && (
//           <div className="w-full bg-[#0d0d0e] border border-[#1f2023] rounded-lg px-4 py-3 text-sm text-[#9ca3af] font-medium">
//             {notes}
//           </div>
//         )}

//         {/* ქვედა ხაზი: P&L და ექშენ ღილაკები */}
//         <div className="flex items-center justify-between mt-1">
//           <div className="flex items-center gap-1.5">
//             <span className={`text-xs ${pnlColor} font-bold`}>{isWin ? "↗" : "↘"}</span>
//             <span className={`text-base font-black tracking-tight ${pnlColor}`}>
//               {pnlFormatted}
//             </span>
//           </div>

//           {/* ჩვენი გამზადებული სამი ექშენ ღილაკი გვერდიგვერდ */}
//           <div className="flex items-center gap-1">
//             <Button
//               variant="icon-only"
//               onClick={() => navigator.clipboard.writeText(window.location.href)}
//               icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 10.742l4.57 2.286M14.192 12.316a3 3 0 115.422-2.316 3 3 0 01-5.422 2.316zm-7.076 2.632a3 3 0 11-5.422-2.316 3 3 0 01-5.422 2.316zM14.2 5.25a3 3 0 115.421 2.316 3 3 0 01-5.42-2.316z" /></svg>}
//             />
//             <Button
//               variant="icon-only"
//               onClick={() => console.log("Edit trade", trade)}
//               icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}
//             />
//             <Button
//               variant="icon-only"
//               danger={true}
//               onClick={() => console.log("Delete trade", trade)}
//               icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>}
//             />
//           </div>
//         </div>

//       </div>
//     );
//   }
// // ==================== TRADECARD COMPONENT - PART 2 ====================

//   // --- ქეისი 2: GRID / CARD VIEW (სქრინშოტი 2-ის მიხედვით) ---
//   return (
//     <div
//      onClick={() => navigate(`/trade/${trade._id || trade.id}`)} 
//       className="bg-[#09090b] border border-[#1f2023] hover:border-[#2f3036] rounded-xl overflow-hidden flex flex-col justify-between transition-all text-left group">
      
//       {/* 1. ჩარტის სქრინშოტის სექცია (ბარათის ზედა ნაწილი) */}
//       <div className="relative w-full aspect-[16/10] bg-[#0d0d0e] border-b border-[#1f2023] overflow-hidden">
//         {chartUrl ? (
//           <img 
//             src={chartUrl}
//             alt={`${symbol} Chart`} 
//             className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
//           />
//         ) : (
//           /* პლეისჰოლდერი, თუ ჩარტი არ არის ატვირთული */
//           <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-[#4b5563]">
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//             </svg>
//             <span className="text-[11px] font-medium tracking-wide">No Chart Uploaded</span>
//           </div>
//         )}
//       </div>

//       {/* 2. ბარათის შიგთავსი (ინფორმაცია) */}
//       <div className="p-4 flex flex-col gap-3.5 flex-1 justify-between">
        
//         {/* თეგების პირველი ხაზი */}
//         <div className="flex flex-wrap items-center gap-1.5">
//           <Tag variant="info">{symbol}</Tag>
//           <Tag variant={type.toUpperCase() === "BUY" ? "success" : "danger"}>{type}</Tag>
//         </div>

//         {/* მეტამონაცემები და თარიღი */}
//         <div className="flex flex-col gap-1">
//           <span className="text-xs text-[#4b5563] font-semibold uppercase tracking-wider">{date}</span>
//           <div className="flex items-center gap-1.5 mt-0.5">
//             <Tag variant="neutral">{strategy}</Tag>
//           </div>
//         </div>

//         {/* ხაზი 3: P&L და მეტა-ინფო */}
//         <div className="pt-2 border-t border-[#1f2023]/60 flex flex-col gap-2">
//           <div className="flex items-baseline gap-1.5">
//             <span className={`text-xs ${pnlColor} font-bold`}>{isWin ? "↗" : "↘"}</span>
//             <span className={`text-base font-black tracking-tight ${pnlColor}`}>
//               {pnlFormatted}
//             </span>
//           </div>
          
//           <div className="flex items-center text-[11px] text-[#6b7280] font-medium gap-1.5">
//             <span>{contracts} contracts</span>
//             <span className="text-[#1f2023]">•</span>
//             <span className="text-[#eab308]">🎯 {rr}</span>
//             <span className="text-[#1f2023]">•</span>
//             <span>🕒 {session}</span>
//           </div>
//         </div>

//         {/* ხაზი 4: ექშენები ჰოვერზე (Share, Edit, Delete) */}
//         <div className="pt-2 flex items-center justify-end border-t border-[#1f2023]/40">
//           <div className="flex items-center gap-0.5">
//             <Button
//               variant="icon-only"
//               onClick={() => navigator.clipboard.writeText(window.location.href)}
//               icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 10.742l4.57 2.286M14.192 12.316a3 3 0 115.422-2.316 3 3 0 01-5.422 2.316zm-7.076 2.632a3 3 0 11-5.422-2.316 3 3 0 01-5.422 2.316zM14.2 5.25a3 3 0 115.421 2.316 3 3 0 01-5.42-2.316z" /></svg>}
//             />
//             <Button
//               variant="icon-only"
//               onClick={() => console.log("Edit trade", trade)}
//               icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}
//             />
//             <Button
//               variant="icon-only"
//               danger={true}
//               onClick={() => console.log("Delete trade", trade)}
//               icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>}
//             />
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }


// ==================== TRADECARD COMPONENT ====================
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Tag from "./Tag";
import Button from "./Button";
import AddTradeModal from "./AddTradeModal";
import ConfirmDelete from "./ConfirmDelete"; // ⚠️ ბილიკი მოარგე შენს სტრუქტურას
import { useTradeStore } from "../store/useTradeStore";

const ShareIcon = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 10.742l4.57 2.286M14.192 12.316a3 3 0 115.422-2.316 3 3 0 01-5.422 2.316zm-7.076 2.632a3 3 0 11-5.422-2.316 3 3 0 01-5.422 2.316zM14.2 5.25a3 3 0 115.421 2.316 3 3 0 01-5.42-2.316z" /></svg>
);
const CheckIcon = (
  <svg className="w-4 h-4 text-[#0ecb81]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
);
const EditIcon = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
);
const DeleteIcon = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
);

// onChanged: არასავალდებულო. იძახება ტრეიდის შეცვლის/წაშლის შემდეგ (მაგ. Dashboard-ის განახლებისთვის)
export default function TradeCard({ trade, viewMode = "grid", onChanged }) {
  const navigate = useNavigate();
  const deleteTrade = useTradeStore((s) => s.deleteTrade);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  // სქრინშოტის წინასწარ მომზადებული ფაილი Share-ისთვის: null = ჯერ არ უცდია, false = ვერ მოხერხდა, File = მზადაა
  const shareFileRef = useRef(null);

  const tradeId = trade._id || trade.id;
  const chartUrl = trade.images && trade.images.length > 0 ? trade.images[0] : null;

  // ბაზის ველების სახელები (quantity, riskRewardRatio) და ბარათის ველები (contracts, rr) ერთმანეთს ეწყობა
  const symbol = trade.symbol || "—";
  const type = String(trade.type || "").toUpperCase();
  const strategy = trade.strategy || "—";
  const contracts = trade.contracts ?? trade.quantity ?? 0;
  const rawRr = trade.rr ?? trade.riskRewardRatio;
  const rr =
    typeof rawRr === "string" && rawRr
      ? rawRr
      : Number(rawRr)
        ? `${Number(rawRr).toFixed(2)}:1`
        : "—";
  const session = trade.session || "—";
  const date =
    trade.date ||
    (trade.entryDate
      ? new Date(trade.entryDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "—");
  const pnl = Number(trade.pnl) || 0;
  const notes = trade.notes || "";

  const isWin = pnl >= 0;
  const pnlFormatted = isWin ? `+$${pnl.toFixed(2)}` : `-$${Math.abs(pnl).toFixed(2)}`;
  const pnlColor = isWin ? "text-[#0ecb81]" : "text-[#ef4444]";

  const goToDetails = () => navigate(`/trade/${tradeId}`);

  // ---------- გაზიარება ----------
  // ტექსტური შეჯამება, რომელიც სურათთან/ლინკთან ერთად იგზავნება
  const shareText = [
    `${symbol}${type ? ` ${type}` : ""} • ${pnlFormatted}`,
    [`${contracts} contracts`, rr !== "—" ? `RR ${rr}` : null, session !== "—" ? session : null]
      .filter(Boolean)
      .join(" • "),
    strategy !== "—" ? `Strategy: ${strategy}` : null,
    date !== "—" ? date : null
  ]
    .filter(Boolean)
    .join("\n");

  const flashCopied = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // სქრინშოტის ფაილის მომზადება წინასწარ (ღილაკზე ხელის მიტანისას), რომ დაკლიკებისას share() მაშინვე გაეშვას.
  // ბრაუზერები (განსაკუთრებით Safari) ხანგრძლივი await-ის შემდეგ share-ს ხშირად ბლოკავენ
  const warmUpShareFile = async () => {
    if (!chartUrl || shareFileRef.current !== null) return;
    shareFileRef.current = false;
    try {
      const res = await fetch(chartUrl);
      const blob = await res.blob();
      const ext = (blob.type.split("/")[1] || "png").replace("jpeg", "jpg");
      shareFileRef.current = new File([blob], `${symbol}-trade.${ext}`, { type: blob.type || "image/png" });
    } catch {
      shareFileRef.current = false; // CORS ან ქსელის შეცდომა: ქვემოთ ლინკით გავაზიარებთ
    }
  };

  const handleShare = async () => {
    const file = shareFileRef.current || null;
    const textWithLink = chartUrl ? `${shareText}\n${chartUrl}` : shareText;

    // 1) სისტემური გაზიარების მენიუ (ტელეფონი, Safari, Windows/macOS Chrome და Edge)
    if (navigator.share) {
      try {
        if (file && navigator.canShare?.({ files: [file] })) {
          await navigator.share({ title: `${symbol} trade`, text: shareText, files: [file] });
        } else {
          await navigator.share({ title: `${symbol} trade`, text: textWithLink });
        }
        return;
      } catch (err) {
        if (err?.name === "AbortError") return; // მომხმარებელმა თავად დახურა მენიუ
        // სხვა შეცდომის შემთხვევაში ქვემოთ clipboard-ს ვცდით
      }
    }

    // 2) სარეზერვო ვარიანტი: შეჯამება + სქრინშოტის ლინკი იკოპირება
    try {
      await navigator.clipboard.writeText(textWithLink);
      flashCopied();
    } catch {
      // clipboard მიუწვდომელია (მაგ. http კავშირი)
    }
  };

  const handleConfirmDelete = async () => {
    if (deleting) return;
    setDeleting(true);
    const ok = await deleteTrade(tradeId);
    setDeleting(false);
    setIsDeleteOpen(false);
    if (ok) {
      if (onChanged) onChanged();
    } else {
      alert("ვერ მოხერხდა ტრეიდის წაშლა. სცადეთ თავიდან.");
    }
  };

  // wrapper-ის stopPropagation ხელს უშლის ღილაკზე დაკლიკებას ბარათის onClick-მდე (დეტალების გვერდზე გადასვლამდე) მიაღწიოს
  const renderActions = (gapClass) => (
    <div onClick={(e) => e.stopPropagation()} className={`flex items-center ${gapClass}`}>
      <span
        title={copied ? "Copied!" : "Share trade"}
        className="inline-flex"
        onPointerEnter={warmUpShareFile}
        onFocus={warmUpShareFile}
      >
        <Button variant="icon-only" onClick={handleShare} icon={copied ? CheckIcon : ShareIcon} />
      </span>
      <span title="Edit trade" className="inline-flex">
        <Button variant="icon-only" onClick={() => setIsEditOpen(true)} icon={EditIcon} />
      </span>
      <span title="Delete trade" className="inline-flex">
        <Button variant="icon-only" danger={true} onClick={() => setIsDeleteOpen(true)} icon={DeleteIcon} />
      </span>
    </div>
  );

  // მოდალები ბარათის გარეთაა (sibling), ამიტომ მათზე დაკლიკება ბარათის onClick-ს არ გააქტიურებს.
  // Edit მოდალი მხოლოდ გახსნისას ირთვება, რომ სიაში თითო ბარათზე ზედმეტი მოდალი არ იყოს
  const modals = (
    <>
      {isEditOpen && (
        <AddTradeModal
          isOpen
          tradeToEdit={trade}
          onClose={() => setIsEditOpen(false)}
          onSave={() => { if (onChanged) onChanged(); }}
        />
      )}
      <ConfirmDelete
        isOpen={isDeleteOpen}
        onClose={() => { if (!deleting) setIsDeleteOpen(false); }}
        onConfirm={handleConfirmDelete}
        message={`Delete this ${symbol} trade (${pnlFormatted})? This action can't be undone.`}
      />
    </>
  );

  // --- ქეისი 1: LIST VIEW ---
  if (viewMode === "list") {
    return (
      <>
        <div
          onClick={goToDetails}
          className="w-full bg-[#09090b] border border-[#1f2023] hover:border-[#2f3036] rounded-xl p-4 flex flex-col gap-3 transition-all text-left cursor-pointer"
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-wrap items-center gap-2">
              <Tag variant="info">{symbol}</Tag>
              {type && <Tag variant={type === "BUY" ? "success" : "danger"}>{type}</Tag>}
              <Tag variant="neutral">{strategy}</Tag>

              <span className="text-[#4b5563] text-xs px-1">•</span>
              <span className="text-xs text-[#9ca3af] font-medium">{contracts} contracts</span>
              <span className="text-[#4b5563] text-xs">•</span>
              <span className="text-xs text-[#eab308] font-semibold">🎯 {rr}</span>
              <span className="text-[#4b5563] text-xs">•</span>
              <span className="text-xs text-[#9ca3af] font-medium">🕒 {session}</span>
            </div>

            <span className="text-xs text-[#4b5563] font-medium">{date}</span>
          </div>

          {notes && (
            <div className="w-full bg-[#0d0d0e] border border-[#1f2023] rounded-lg px-4 py-3 text-sm text-[#9ca3af] font-medium">
              {notes}
            </div>
          )}

          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-1.5">
              <span className={`text-xs ${pnlColor} font-bold`}>{isWin ? "↗" : "↘"}</span>
              <span className={`text-base font-black tracking-tight ${pnlColor}`}>{pnlFormatted}</span>
            </div>

            {renderActions("gap-1")}
          </div>
        </div>
        {modals}
      </>
    );
  }

  // --- ქეისი 2: GRID / CARD VIEW ---
  return (
    <>
      <div
        onClick={goToDetails}
        className="bg-[#09090b] border border-[#1f2023] hover:border-[#2f3036] rounded-xl overflow-hidden flex flex-col justify-between transition-all text-left group cursor-pointer"
      >
        <div className="relative w-full aspect-[16/10] bg-[#0d0d0e] border-b border-[#1f2023] overflow-hidden">
          {chartUrl ? (
            <img
              src={chartUrl}
              alt={`${symbol} Chart`}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-[#4b5563]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-[11px] font-medium tracking-wide">No Chart Uploaded</span>
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col gap-3.5 flex-1 justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            <Tag variant="info">{symbol}</Tag>
            {type && <Tag variant={type === "BUY" ? "success" : "danger"}>{type}</Tag>}
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-[#4b5563] font-semibold uppercase tracking-wider">{date}</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Tag variant="neutral">{strategy}</Tag>
            </div>
          </div>

          <div className="pt-2 border-t border-[#1f2023]/60 flex flex-col gap-2">
            <div className="flex items-baseline gap-1.5">
              <span className={`text-xs ${pnlColor} font-bold`}>{isWin ? "↗" : "↘"}</span>
              <span className={`text-base font-black tracking-tight ${pnlColor}`}>{pnlFormatted}</span>
            </div>

            <div className="flex items-center text-[11px] text-[#6b7280] font-medium gap-1.5">
              <span>{contracts} contracts</span>
              <span className="text-[#1f2023]">•</span>
              <span className="text-[#eab308]">🎯 {rr}</span>
              <span className="text-[#1f2023]">•</span>
              <span>🕒 {session}</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end border-t border-[#1f2023]/40">
            {renderActions("gap-0.5")}
          </div>
        </div>
      </div>
      {modals}
    </>
  );
}
