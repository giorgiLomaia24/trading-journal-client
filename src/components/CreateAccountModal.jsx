import React, { useState, useEffect } from "react";
import InputField from "./InputField";
import Button from "./Button";
import AccountTypeCard from "./AccountTypeCard";
import { useAccountStore } from "../store/useAccountStore"; // 👈 შემოგვაქვს ანგარიშების სთორი

export default function CreateAccountModal({ isOpen, onClose }) {
  // შემოგვაქვს ანგარიშის შექმნის ფუნქცია და ჩატვირთვის სტატუსი
  const { createAccount, loading } = useAccountStore();

  // 1. დინამიური სტეიტები ფორმის ველებისთვის
  const [accountType, setAccountType] = useState("Paper Trading");
  const [accountTypeIcon, setAccountTypeIcon] = useState("📋");
  const [accountName, setAccountName] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [balance, setBalance] = useState("10000");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  // Body Scroll Lock უკანა ფონის სქროლვის დასაბლოკად
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  const accountTypesList = [
    { title: "Live Account", desc: "Real money trading account", icon: "💰", id: "Live Account" },
    { title: "Demo Account", desc: "Practice trading with virtual money", icon: "🎯", id: "Demo Account" },
    { title: "Backtesting", desc: "Historical strategy testing", icon: "📈", id: "Backtesting" },
    { title: "Funded Account", desc: "Prop firm or funded trading account", icon: "🏆", id: "Funded Account" },
    { title: "Paper Trading", desc: "Simulated trading environment", icon: "📋", id: "Paper Trading" }
  ];

  const handleTypeSelect = (type) => {
    setAccountType(type.title);
    setAccountTypeIcon(type.icon);
  };

  // 🚀 ბექენდზე გაგზავნის ფუნქცია
  const handleCreate = async () => {
    if (!accountName.trim()) {
      setError("Account name is required");
      return;
    }

    setError("");

    // ვაკონვერტირებთ ტიპს ბექენდის enum-ის შესაბამისად
    let mappedType = "Demo";
    if (accountType === "Live Account") mappedType = "Live";
    if (accountType === "Funded Account") mappedType = "Funded";
    if (accountType === "Demo Account" || accountType === "Paper Trading") mappedType = "Demo";
    if (accountType === "Backtesting") mappedType = "Challenge"; // ან რაც გირჩევნია

    const accountData = {
      accountName: accountName,
      accountType: mappedType,
      initialBalance: parseFloat(balance) || 0,
      currency: currency,
      notes: description
    };

    const success = await createAccount(accountData);

    if (success) {
      // ფორმის გასუფთავება წარმატებული შენახვის შემდეგ
      setAccountName("");
      setBalance("10000");
      setDescription("");
      onClose(); // მოდალის დახურვა
    } else {
      setError("ვერ მოხერხდა ანგარიშის შექმნა. სცადეთ თავიდან.");
    }
  };

  return (
    <div 
      onClick={onClose} 
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto cursor-zoom-out animate-in fade-in duration-150"
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="w-full max-w-xl bg-[#09090b] border border-[#1f2023] rounded-xl p-5 sm:p-6 shadow-2xl relative my-auto cursor-default space-y-5 max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-150 scrollbar-thin scrollbar-thumb-[#1f2023] text-left"
      >
        {/* ჰედერი */}
        <div className="border-b border-[#1f2023]/60 pb-3.5 relative">
          <button onClick={onClose} className="absolute top-0 right-0 text-[#4b5563] hover:text-[#0ecb81] transition-colors cursor-pointer text-sm font-bold">✕</button>
          <h2 className="text-md font-black tracking-tight text-[#f3f4f6] flex items-center gap-2">
            <span className="text-[#0ecb81]">💳</span> Create New Account
          </h2>
          <p className="text-[11px] text-[#6b7280] font-semibold mt-0.5">Set up a new trading account to organize and track your trades across different platforms.</p>
        </div>

        {/* ერორ ბლოკი */}
        {error && (
          <div className="p-3 bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-lg text-xs text-[#ef4444] font-medium text-center">
            {error}
          </div>
        )}

        {/* სექცია: Account Type */}
        <div className="space-y-2">
          <span className="text-[10px] font-black text-[#6b7280] uppercase tracking-widest block">Account Type</span>
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#1f2023]">
            {accountTypesList.map((type) => (
              <AccountTypeCard
                key={type.id}
                title={type.title}
                description={type.desc}
                icon={type.icon}
                isSelected={accountType === type.title}
                onClick={() => handleTypeSelect(type)}
              />
            ))}
          </div>
        </div>

        {/* სახელი და ვალუტა */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <InputField 
              label="Account Name" 
              type="text" 
              placeholder="e.g., My Live Account" 
              value={accountName} 
              onChange={setAccountName} 
            />
          </div>
          <div className="sm:col-span-1">
            <InputField 
              label="Currency" 
              type="select" 
              value={currency} 
              onChange={setCurrency} 
              options={[
                { label: "USD", value: "USD" },
                { label: "EUR", value: "EUR" },
                { label: "GBP", value: "GBP" }
              ]} 
            />
          </div>
        </div>

        {/* საწყისი ბალანსი */}
        <InputField 
          label="$ Starting Balance" 
          type="number" 
          placeholder="10000" 
          value={balance} 
          onChange={setBalance} 
        />

        {/* აღწერა */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-black text-[#6b7280] uppercase tracking-widest block">
            📝 Description (Optional)
          </span>
          <textarea
            rows={2}
            placeholder="Add notes about this account, trading strategy, or purpose..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-[#0d0d0e] text-[#f3f4f6] text-xs border border-[#1f2023] rounded-xl p-3.5 placeholder-[#4b5563] focus:outline-none focus:border-[#0ecb81] transition-all resize-none leading-relaxed"
          />
        </div>

        {/* Account Preview ავტომატური ბლოკი */}
        <div className="space-y-2 pt-1">
          <span className="text-[10px] font-black text-[#4b5563] uppercase tracking-widest block">
            Account Preview:
          </span>
          <div className="w-full bg-[#0d0d0e] border border-[#1f2023] rounded-xl p-4 flex items-center justify-between text-xs select-none">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#141517] flex items-center justify-center text-sm">
                {accountTypeIcon}
              </div>
              <div className="flex flex-col">
                <span className="font-black text-[#f3f4f6] tracking-tight">
                  {accountName || "Account Name"}
                </span>
                <span className="text-[10px] font-bold text-[#4b5563] mt-0.5">
                  {accountType}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col items-end text-right">
              <span className="font-black text-[#f3f4f6] tracking-tight">
                {currency} {Number(balance || 0).toLocaleString()}
              </span>
              <span className="text-[10px] font-bold text-[#4b5563] mt-0.5">
                Starting Balance
              </span>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="pt-3 border-t border-[#1f2023]/60 flex items-center justify-between gap-3">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="!text-xs !py-2.5 flex-1 sm:flex-none sm:px-6"
          >
            Cancel
          </Button>
          
          <Button 
            variant="solid" 
            disabled={loading} // 👈 ითიშება ბექენდზე მოთხოვნის დროს
            className="!bg-[#0ecb81] !text-[#040405] font-black hover:!bg-[#0bb572] !text-xs !py-2.5 flex-1 sm:flex-none sm:px-6 shadow-lg shadow-[#0ecb81]/5 active:scale-[0.98]"
            onClick={handleCreate} // 👈 იძახებს ბექენდ კავშირს
          >
            {loading ? "Creating..." : "+ Create Account"}
          </Button>
        </div>

      </div>
    </div>
  );
}
