// ==================== FULL COMPREHENSIVE APP.JSX ====================
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import DashboardPage from "./pages/DashboardPage";
import JournalPage from "./pages/JournalPage";
import CalendarPage from "./pages/CalendarPage";
import StatisticsPage from "./pages/StatisticsPage";
import TradeDetailPage from "./pages/TradeDetailPage";
import CreateAccountModal from "./components/CreateAccountModal";
import SettingsPage from "./pages/SettingsPage";
import ForgotPasswordPage from "./pages/ForgotPassword";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";

//Zustand სთორი
import { useAuthStore } from "./store/useAuthStore";
import { useAccountStore } from "./store/useAccountStore";
import { useStrategyStore } from "./store/useStrategyStore";


export default function App() {
  const navigate = useNavigate();
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  // ვიღებთ რეალურ სტეიტს და logout ფუნქციას Zustand-იდან
  const { user, token, logout } = useAuthStore();

  const fetchAccounts = useAccountStore((state) => state.fetchAccounts);
  const fetchStrategies = useStrategyStore((state) => state.fetchStrategies); 
  const activeAccount = useAccountStore((state) => state.activeAccount);

  useEffect(() => {
    if (token) {
      fetchAccounts();
      fetchStrategies();
    }
  }, [token, fetchAccounts, fetchStrategies]);

  // თუ მომხმარებელი არ არის შესული (არც ტოკენი გვაქვს ბრაუზერში)
  if (!token) {
    return (
      <Routes>
        {/* LoginPage-ს აღარ სჭირდება ძველი handleLoginSuccess პროპსი, რადგან ის თავად გამოიყენებს Zustand-ს */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        {/* ნებისმიერ სხვა მისამართზე გადასვლისას აბრუნებს ლოგინზე */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // ==================== თუ მომხმარებელი შესულია (მთავარი ეკოსისტემა) ====================
  return (
    <div className="flex min-h-screen bg-[#040405] w-full overflow-x-hidden text-[#f3f4f6]">

      {/* 1. რესპონსიული ფიქსირებული საიდბარი (მარცხნივ, მწვანე აქცენტით) */}
      <Sidebar
        isMobileOpen={isSidebarMobileOpen}
        onMobileClose={() => setIsSidebarMobileOpen(false)}
        onAddNewAccount={() => setIsAccountModalOpen(true)}
      />

      {/* 2. მარჯვენა ძირითადი ზონა (md:ml-64 კლასით, რომ გვერდები საიდბარს არ გადაეფაროს) */}
      <div className="flex-1 min-h-screen flex flex-col md:ml-64 w-full relative">

        {/* მობილურის თულბარი ჰამბურგერ-მენიუთი (ჩნდება მხოლოდ ტელეფონებზე) */}
        <header className="md:hidden w-full bg-[#09090b] border-b border-[#1f2023] px-4 py-3 flex items-center justify-between z-30 sticky top-0">
          <div className="flex items-center gap-2">
            <span className="text-md text-[#0ecb81] font-black">⚡</span>
            <span className="text-sm font-black text-white tracking-tight">Yonko</span>
          </div>
          <button
            onClick={() => setIsSidebarMobileOpen(true)}
            className="text-[#9ca3af] hover:text-[#0ecb81] bg-[#0d0d0e] border border-[#1f2023] p-2 rounded-xl text-xs font-black transition-all cursor-pointer"
          >
            ☰ Menu
          </button>
        </header>

        {/* 3. პრემიუმ ნავბარი დესკტოპისთვის (ჩნდება მხოლოდ დიდ ეკრანებზე) */}
        <div className="hidden md:block sticky top-0 z-30 w-full">
          {/* იყენებს Zustand-ის logout ფუნქციას */}
          <Navbar
            activeAccount={activeAccount ? activeAccount.accountName : "No Account"}
            currency={activeAccount ? activeAccount.currency : "USD"}

            onLogout={logout} />
        </div>

        {/* 4. გვერდების დინამიური ჩატვირთვის ძირითადი ზონა */}
        <main className="flex-1 w-full overflow-x-hidden p-5 sm:p-8">
          <Routes>
            {/* მთავარი დეფოლტ დეშბორდი */}
            <Route path="/" element={<DashboardPage />} />

            {/* სატრეიდო ჟურნალი */}
            <Route path="/journal" element={<JournalPage />} />

            {/* კალენდარი */}
            <Route path="/calendar" element={<CalendarPage />} />

            {/* სტატისტიკა და ანალიტიკა */}
            <Route path="/statistics" element={<StatisticsPage />} />

            {/* ტრეიდის დეტალური გვერდი */}
            <Route path="/trade/:id" element={<TradeDetailPage />} />

            {/* სეტინგების გვერდი */}
            <Route path="/settings" element={<SettingsPage />} />

            {/* თუ შესული მომხმარებელი ჩაწერს არასწორ ლინკს, გადაამისამართებს მთავარზე */}
            <Route path="*" element={<Navigate to="/" replace />} />

            {/* პლეისჰოლდერები დანარჩენი დამხმარე გვერდებისთვის */}
            {["reports", "achievements", "inner-space"].map((path) => (
              <Route
                key={path}
                path={`/${path}`}
                element={
                  <div className="p-8 text-left text-xs font-black text-[#4b5563] uppercase tracking-widest">
                    {path.replace("-", " ")} Section is coming soon...
                  </div>
                }
              />
            ))}
          </Routes>
        </main>
      </div>

      {/* --- ოპციონალური ტესტ მოდალი ექაუნთის დამატებისთვის --- */}
      <CreateAccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        onSave={(newAccount) => {
          console.log("New Account Created:", newAccount);
          alert(`Account "${newAccount.name}" created successfully in green ecosystem!`);
        }}
      />

    </div>
  );
}
