// ==================== TRADE DETAIL PAGE - PART 1 ====================
import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Tag from "../components/Tag";
import Button from "../components/Button";
import DataBlock from "../components/DataBlock";
import RuleChecker from "../components/RuleChecker";
import ImageGallery from "../components/ImageGallery";

// 🚀 შემოგვაქვს Zustand-ის რეალური სთორები ბექენდთან დასაკავშირებლად
import { useTradeStore } from "../store/useTradeStore";
import { useStrategyStore } from "../store/useStrategyStore";
import { useAccountStore } from "../store/useAccountStore";
import AddTradeModal from "../components/AddTradeModal";
import ConfirmDelete from "../components/ConfirmDelete";

export default function TradeDetailPage() {
  const { id } = useParams(); 
  const navigate = useNavigate();


  // 🚀 ვიღებთ მიმდინარე თრეიდს, მისი წამოღებისა და წაშლის ფუნქციებს Zustand-იდან
  const { currentTrade, getTradeById, deleteTrade, loading } = useTradeStore();
  const { strategies, fetchStrategies } = useStrategyStore();
  const { accounts, fetchAccounts } = useAccountStore();
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

const handleDelete = async () => { // 🚀 აქ დაემატა async
  try {
    const success = await deleteTrade(id);
    if (success) {
      setIsDeleteModalOpen(false); // ვხურავთ კონფირმ მოდალს
      navigate("/journal");   // 🚀 გადავდივართ პირდაპირ ჟურნალის გვერდზე
    }
  } catch (error) {
    console.error("Error deleting trade:", error);
    // აქ შეგიძლია დაამატო რაიმე ერორ თოასტი მომხმარებლისთვის
  }
};

  

  // 🚀 ფონურად ყოველთვის ვიძახებთ კონკრეტულ თრეიდს, ანგარიშებს და სტრატეგიებს ბაზიდან
  useEffect(() => {
    if (id) {
      getTradeById(id);
      fetchStrategies();
      fetchAccounts();
    }
  }, [id, getTradeById, fetchStrategies, fetchAccounts]);

  // 🚀 რეალური წაშლის ფუნქცია ბექენდ კავშირით
  const handleDeleteTrade = async () => {
    if (window.confirm("დარწმუნებული ხართ, რომ გსურთ ამ თრეიდის სამუდამოდ წაშლა ჟურნალიდან?")) {
      const success = await deleteTrade(id);
      if (success) {
        navigate("/journal"); // წაშლის მერე ბრუნდება ჟურნალში
      }
    }
  };

  // 🚀 თუ ბაზიდან მონაცემები ჯერ კიდევ იტვირთება, ვაჩვენებთ ლამაზ ლოდინის სტატუსს
  if (loading) {
    return (
      <div className="min-h-screen bg-[#040405] text-[#4b5563] font-black text-xs uppercase tracking-widest flex items-center justify-center animate-pulse">
        Loading trade details from database...
      </div>
    );
  }

  // 🚀 თუ ჩატვირთვა მორჩა, მაგრამ ბაზამ თრეიდი მაინც ვერ იპოვა
  if (!currentTrade) {
    return (
      <div className="min-h-screen bg-[#040405] text-[#ef4444] font-black text-xs uppercase tracking-widest flex flex-col gap-3 items-center justify-center">
        <span>⚠️ Trade not found or access denied</span>
        <Button variant="outline" onClick={() => navigate("/journal")}>Go Back to Journal</Button>
      </div>
    );
  }

  const trade = currentTrade;
  const isWin = trade.pnl >= 0;

  const pnlFormatted = isWin ? `+$${trade.pnl.toFixed(2)}` : `-$${Math.abs(trade.pnl).toFixed(2)}`;
  const pnlColor = isWin ? "text-[#0ecb81]" : "text-[#ef4444]";
  const pnlVariant = isWin ? "success" : "danger";

  // ბექენდის ISO თარიღების ფორმატირება ლამაზ საათებად და დღეებად
  const dateText = trade.entryDate 
    ? new Date(trade.entryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
    : "—";
  
  const entryTimeText = trade.entryDate
    ? new Date(trade.entryDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    : "—";

  const exitTimeText = trade.exitDate
    ? new Date(trade.exitDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    : "—";

  return (
    <div className="min-h-screen bg-[#040405] text-[#f3f4f6] p-4 sm:p-8 font-sans selection:bg-[#0ecb81]/30 text-left">
      <div className="max-w-7xl mx-auto space-y-5">
        
        {/* 1. ზედა თულბარი (Action Bar) */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate("/journal")}>
            ←
          </Button>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" icon="📥">Export</Button>
            <Button variant="outline" icon="📝" onClick={() => setIsLogModalOpen(true)}>Edit</Button>
            <Button variant="outline" danger={true} icon="🗑️" onClick={() => setIsDeleteModalOpen(true)} >Delete</Button>
          </div>
        </div>

        {/* 2. ტრეიდის ძირითადი ჰედერი */}
        <div className="flex items-center gap-3 bg-[#09090b] border border-[#1f2023] p-4 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-[#1f2023] flex items-center justify-center font-black text-xs text-[#0ecb81]">
            {trade.symbol}
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <h1 className="text-md font-black tracking-tight">{trade.symbol}</h1>
              <Tag variant={trade.type?.toUpperCase() === "BUY" ? "success" : "danger"}>{trade.type?.toUpperCase()}</Tag>
            </div>
            <span className="text-xs text-[#6b7280] font-semibold">
              {trade.quantity} contracts • {dateText}
            </span>
          </div>
        </div>

        {/* 3. დიდი ორპანელიანი ლეიაუტი */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          
          {/* მარცხენა პანელი */}
          <div className="lg:col-span-2 space-y-5">
            
            {/* დიდი P&L ქარდი */}
            <div className="bg-[#09090b] border border-[#1f2023] rounded-xl p-5">
              <span className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider">Total P&L</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className={`text-xl font-bold ${pnlColor}`}>{isWin ? "↗" : "↘"}</span>
                <h2 className={`text-2xl font-black tracking-tight ${pnlColor}`}>
                  {pnlFormatted}
                </h2>
              </div>
            </div>
            {/* Trade Metadata ბლოკი */}
            <div className="bg-[#09090b] border border-[#1f2023] rounded-xl p-5 space-y-6">
              <div className="flex items-center gap-2 text-xs font-bold text-[#6b7280] uppercase tracking-wider">
                <span>📊</span> Trade Metadata
              </div>

              {/* ხაზი 1: Quantity და Session */}
              <div className="grid grid-cols-2 gap-4 border-b border-[#1f2023]/60 pb-5">
                <DataBlock label="Quantity" value={trade.quantity} icon="📉" />
                <DataBlock label="Session" value={trade.session} icon="🕒" />
              </div>

              {/* ხაზი 2: Entry Date და Exit Date */}
              <div className="grid grid-cols-2 gap-4 border-b border-[#1f2023]/60 pb-5">
                <DataBlock label="Entry Date" value={`${dateText}, ${entryTimeText}`} icon="📅" />
                <DataBlock label="Exit Date" value={`${dateText}, ${exitTimeText}`} icon="📅" />
              </div>

              {/* ხაზი 3: Risk, RR და Realized P&L */}
              <div className="grid grid-cols-3 gap-4">
                <DataBlock label="Risk" value={`$${trade.risk ? trade.risk.toFixed(2) : "0.00"}`} icon="⚠️" />
                <DataBlock label="Risk/Reward Ratio" value={`${trade.riskRewardRatio || 0}:1`} icon="🎯" />
                <DataBlock label="Realized P&L" value={pnlFormatted} icon="💰" variant={pnlVariant} />
              </div>
            </div>

            {/* Strategy Notes ბლოკი */}
            <div className="bg-[#09090b] border border-[#1f2023] rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#6b7280] uppercase tracking-wider">
                <span>📝</span> Strategy Notes
              </div>
              <div className="w-full bg-[#0d0d0e] border border-[#1f2023] rounded-lg px-4 py-3 text-sm text-[#9ca3af] font-medium leading-relaxed">
                {trade.notes || "No description provided for this trade."}
              </div>
            </div>

            {/* Reusable ჩარტების გალერეა Cloudinary ლინკებით */}
            <ImageGallery images={trade.images && trade.images.length > 0 ? trade.images : []} />

          </div>

          {/* მარჯვენა პანელი */}
          <div className="space-y-5">
            
            {/* 1. Trade Info და წესების ბლოკი */}
            <div className="bg-[#09090b] border border-[#1f2023] rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-[#f3f4f6]">Trade Info</h3>
              
              <div className="space-y-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-[#4b5563] uppercase tracking-wide">Strategy</span>
                  <span className="text-xs font-bold text-[#0ecb81]">{trade.strategy}</span>
                </div>
                
                {/* წესების შემმოწმებელი დინამიური კომპონენტი */}
                {(() => {
                  const currentStratObj = strategies.find(s => s.strategyName === trade.strategy || s._id === trade.strategy);
                  
                  const formattedRules = currentStratObj?.rules?.map(r => ({
                    id: r.ruleId,
                    text: r.text,
                    followed: trade.checkedRules?.includes(r.ruleId)
                  })) || [];

                  return <RuleChecker rules={formattedRules} />;
                })()}
              </div>

              {/* ანგარიში და თრეიდის ტიპი */}
              <div className="pt-4 border-t border-[#1f2023]/60 space-y-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-[#4b5563] uppercase tracking-wide">Account</span>
                  <span className="text-xs font-bold text-[#f3f4f6]">
                    {(() => {
                      const foundAcc = accounts.find(a => a._id === trade.account);
                      return foundAcc ? foundAcc.accountName : "My Trading Account";
                    })()}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-[#4b5563] uppercase tracking-wide">Trade Type</span>
                  <div>
                    <Tag variant={trade.type?.toUpperCase() === "BUY" ? "success" : "danger"}>
                      {trade.type?.toUpperCase()}
                    </Tag>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Result ბლოკი */}
            <div className="bg-[#09090b] border border-[#1f2023] rounded-xl p-5 space-y-3">
              <h3 className="text-xs font-bold text-[#6b7280] uppercase tracking-wider">Result</h3>
              <div>
                <Tag variant={isWin ? "success" : "danger"}>
                  {trade.result && trade.result.length > 0 ? trade.result : (isWin ? "Win" : "Loss")}
                </Tag>
              </div>
            </div>

            {/* 3. Emotions ბლოკი */}
            <div className="bg-[#09090b] border border-[#1f2023] rounded-xl p-5 space-y-3">
              <h3 className="text-xs font-bold text-[#6b7280] uppercase tracking-wider">Emotions</h3>
              <div className="flex flex-wrap gap-1.5">
                {trade.emotions && trade.emotions.length > 0 ? (
                  trade.emotions.map((emotion, index) => (
                    <Tag key={index} variant="info">{emotion}</Tag>
                  ))
                ) : (
                  <span className="text-xs text-[#4b5563] font-medium pl-0.5">No emotions recorded.</span>
                )}
              </div>
            </div>

          </div>

        </div>

        <AddTradeModal
          tradeToEdit={currentTrade}
                isOpen={isLogModalOpen}
                onClose={() => setIsLogModalOpen(false)}
                onSave={(newTrade) => {
                  console.log("Saving new trade:", newTrade);
                 
                }}
              />
  <ConfirmDelete 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={handleDelete}
        message="Are you sure you want to delete this action? This won't be reversed."
      />
      </div>
    </div>
  );
}

