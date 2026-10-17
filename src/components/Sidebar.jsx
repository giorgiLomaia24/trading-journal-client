// ==================== PREMIUM SIDEBAR WITH LUCIDE ICONS ====================
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { NavLink, useNavigate } from "react-router-dom";
import { useAccountStore } from "../store/useAccountStore";
import { useAuthStore } from "../store/useAuthStore";
import ConfirmDelete from "./ConfirmDelete"; // ⚠️ ბილიკი მოარგე შენს სტრუქტურას
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  BarChart3,
  ChevronUp,
  ChevronDown,
  Target,
  Plus,
  Trophy,
  Settings,
  LogOut,
  MoreVertical,
  Pencil,
  Trash2,
  Check,
  X
} from "lucide-react";

const MAX_NAME_LENGTH = 40;
const ROW_MENU_WIDTH = 168;

export default function Sidebar({ isMobileOpen, onMobileClose, onAddNewAccount }) {
  const navigate = useNavigate();
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // ანგარიშის სამი წერტილის მენიუ (პორტალით, რომ სქროლ-კონტეინერმა არ გადაჭრას)
  const [rowMenu, setRowMenu] = useState(null); // { id, top, left }
  const rowMenuRef = useRef(null);

  // სახელის ინლაინ რედაქტირება
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editError, setEditError] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  // წაშლა
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState("");

  const { accounts, activeAccount, setActiveAccount, updateAccount, deleteAccount } = useAccountStore();

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const displayName = user?.name || "Trader";
  const initial = displayName.trim().charAt(0).toUpperCase() || "T";

  const menuItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Journal", path: "/journal", icon: BookOpen },
    { name: "Calendar", path: "/calendar", icon: Calendar },
    { name: "Statistics", path: "/statistics", icon: BarChart3 },
  ];

  // მომხმარებლის მენიუს გარეთ დაკლიკებისას დახურვა
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // სამი წერტილის მენიუს დახურვა: გარეთ დაკლიკება, Escape, resize
  useEffect(() => {
    if (!rowMenu) return;

    const onDown = (e) => {
      if (rowMenuRef.current?.contains(e.target)) return;
      if (e.target.closest?.("[data-row-menu-trigger]")) return; // ტრიგერი თავად ამუშავებს toggle-ს
      setRowMenu(null);
    };
    const onKey = (e) => { if (e.key === "Escape") setRowMenu(null); };
    const onResize = () => setRowMenu(null);

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [rowMenu]);

  const resetAccountUi = () => {
    setRowMenu(null);
    setEditingId(null);
    setEditError("");
    setActionError("");
  };

  const toggleAccountDropdown = () => {
    if (isAccountDropdownOpen) resetAccountUi();
    setIsAccountDropdownOpen(!isAccountDropdownOpen);
  };

  const selectAccount = (acc) => {
    setActiveAccount(acc);
    setIsAccountDropdownOpen(false);
    resetAccountUi();
  };

  // ---------- სამი წერტილი ----------
  const openRowMenu = (e, acc) => {
    e.stopPropagation();
    if (rowMenu?.id === acc._id) {
      setRowMenu(null);
      return;
    }

    const btnRect = e.currentTarget.getBoundingClientRect();
    const asideRect = e.currentTarget.closest("aside").getBoundingClientRect();
    const fitsRight = asideRect.right + 8 + ROW_MENU_WIDTH <= window.innerWidth - 8;

    setRowMenu({
      id: acc._id,
      // სასურველია მარჯვნივ, საიდბარის გარეთ. ვიწრო ეკრანზე ღილაკის ქვემოთ
      top: fitsRight ? btnRect.top : btnRect.bottom + 4,
      left: fitsRight ? asideRect.right + 8 : Math.max(8, btnRect.right - ROW_MENU_WIDTH)
    });
  };

  // ---------- გადარქმევა ----------
  const startRename = (acc) => {
    setRowMenu(null);
    setActionError("");
    setEditingId(acc._id);
    setEditName(acc.accountName || "");
    setEditError("");
  };

  const cancelRename = () => {
    setEditingId(null);
    setEditName("");
    setEditError("");
  };

  const saveRename = async (acc) => {
    if (savingEdit) return;

    const name = editName.trim();
    if (!name) {
      setEditError("Name is required");
      return;
    }
    if (name.length > MAX_NAME_LENGTH) {
      setEditError(`Max ${MAX_NAME_LENGTH} characters`);
      return;
    }
    if (name === acc.accountName) {
      cancelRename();
      return;
    }

    setSavingEdit(true);
    setEditError("");
    const result = await updateAccount(acc._id, { accountName: name });
    setSavingEdit(false);

    if (result?.success) cancelRename();
    else setEditError(result?.message || "Could not rename account");
  };

  // ---------- წაშლა ----------
  const startDelete = (acc) => {
    setRowMenu(null);
    setActionError("");
    setAccountToDelete(acc);
  };

  const handleConfirmDelete = async () => {
    if (!accountToDelete || deleting) return;

    setDeleting(true);
    const result = await deleteAccount(accountToDelete._id);
    setDeleting(false);
    setAccountToDelete(null);

    if (!result?.success) setActionError(result?.message || "Could not delete account");
  };

  const menuAccount = rowMenu ? accounts.find((a) => a._id === rowMenu.id) : null;

  return (
    <>
      {isMobileOpen && (
        <div onClick={onMobileClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-150" />
      )}

      <aside className={`w-64 h-screen bg-[#040405] border-r border-[#1f2023] flex flex-col justify-between p-4 fixed left-0 top-0 z-40 font-sans text-left select-none transition-transform duration-300 md:transition-none ${
        isMobileOpen ? "translate-x-0 shadow-2xl shadow-black/80" : "-translate-x-full md:translate-x-0"
      }`}>

        <div className="space-y-4 w-full">
          {/* ლოგოს ბლოკი */}
          <div className="flex items-center justify-between pl-1 pt-1">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => { navigate("/"); if (onMobileClose) onMobileClose(); }}>
              <span className="text-md text-[#0ecb81] font-black tracking-tight drop-shadow-[0_0_4px_rgba(14,203,129,0.3)]">⚡</span>
              <h1 className="text-md font-black tracking-tight text-[#f3f4f6]">Yonko</h1>
            </div>
            <button onClick={onMobileClose} className="md:hidden text-[#4b5563] hover:text-[#ef4444] transition-colors p-1">✕</button>
          </div>

          {/* ექაუნთის დროპდაუნი */}
          <div className="w-full relative">
            <button
              onClick={toggleAccountDropdown}
              className={`w-full bg-[#0d0d0e] border rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs transition-all cursor-pointer ${
                isAccountDropdownOpen ? "border-[#0ecb81]" : "border-[#1f2023] hover:border-[#2f3036]"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Target className="w-4 h-4 text-[#0ecb81] flex-shrink-0" />
                <div className="flex flex-col gap-0.5 min-w-0 text-left">
                  <span className="font-black text-[#f3f4f6] truncate">
                    {activeAccount ? activeAccount.accountName : "No Account"}
                  </span>
                  <span className="text-[10px] font-bold text-[#4b5563] font-mono">
                    {activeAccount ? `${activeAccount.currency} ${activeAccount.initialBalance.toLocaleString()}` : "$0"}
                  </span>
                </div>
              </div>
              {isAccountDropdownOpen ? <ChevronUp className="w-3.5 h-3.5 text-[#4b5563] flex-shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 text-[#4b5563] flex-shrink-0" />}
            </button>

            {isAccountDropdownOpen && (
              <div
                onScroll={() => setRowMenu(null)}
                className="absolute left-0 right-0 mt-1.5 bg-[#09090b] border border-[#1f2023] rounded-xl p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-100 max-h-[280px] overflow-y-auto overscroll-contain scrollbar-none"
              >
                <div className="text-[9px] font-black text-[#4b5563] uppercase tracking-wider px-2 py-1">
                  <span>Trading Accounts</span>
                </div>

                {actionError && (
                  <div className="mx-1 mt-1 px-2 py-1.5 rounded-lg bg-[#ef4444]/10 border border-[#ef4444]/20 text-[10px] font-medium text-[#ef4444]">
                    {actionError}
                  </div>
                )}

                {accounts.length === 0 ? (
                  <p className="text-[10px] text-[#4b5563] px-2 py-2 font-medium">No accounts found.</p>
                ) : (
                  accounts.map((acc) => {
                    const isActive = activeAccount?._id === acc._id;
                    const isEditing = editingId === acc._id;

                    return (
                      <div
                        key={acc._id}
                        onClick={() => { if (!isEditing) selectAccount(acc); }}
                        className={`w-full flex items-center justify-between p-2 rounded-lg border mt-1.5 transition-all ${
                          isEditing ? "cursor-default" : "cursor-pointer"
                        } ${
                          isActive
                            ? "bg-[#0ecb81]/10 border-[#0ecb81]/30"
                            : "bg-[#0d0d0e]/40 border-[#1f2023]/60 hover:border-[#2f3036]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 text-xs font-bold text-[#f3f4f6] min-w-0 flex-1">
                          <Target className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-[#0ecb81]" : "text-[#4b5563]"}`} />

                          <div className="flex flex-col min-w-0 flex-1">
                            {isEditing ? (
                              <div onClick={(e) => e.stopPropagation()} className="flex flex-col gap-1">
                                <div className="flex items-center gap-1">
                                  <input
                                    autoFocus
                                    type="text"
                                    value={editName}
                                    maxLength={MAX_NAME_LENGTH}
                                    disabled={savingEdit}
                                    onChange={(e) => { setEditName(e.target.value); if (editError) setEditError(""); }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") { e.preventDefault(); saveRename(acc); }
                                      if (e.key === "Escape") { e.stopPropagation(); cancelRename(); }
                                    }}
                                    className="w-full min-w-0 bg-[#040405] text-[#f3f4f6] text-xs font-bold border border-[#0ecb81]/50 rounded-md px-2 py-1 focus:outline-none focus:border-[#0ecb81] disabled:opacity-60"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => saveRename(acc)}
                                    disabled={savingEdit}
                                    aria-label="Save name"
                                    className="p-1 rounded-md text-[#0ecb81] hover:bg-[#0ecb81]/10 transition-colors cursor-pointer disabled:opacity-50"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={cancelRename}
                                    disabled={savingEdit}
                                    aria-label="Cancel rename"
                                    className="p-1 rounded-md text-[#6b7280] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors cursor-pointer disabled:opacity-50"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                {editError && (
                                  <span className="text-[9px] font-medium text-[#ef4444]">{editError}</span>
                                )}
                              </div>
                            ) : (
                              <>
                                <span className="truncate">{acc.accountName}</span>
                                <span className="text-[9px] text-[#4b5563] font-mono">
                                  {acc.currency} {acc.initialBalance.toLocaleString()}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {!isEditing && (
                          <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                            {isActive && (
                              <span className="text-[9px] bg-[#0ecb81]/10 text-[#0ecb81] border border-[#0ecb81]/20 px-1.5 py-0.5 rounded font-black uppercase">
                                Active
                              </span>
                            )}
                            <button
                              type="button"
                              data-row-menu-trigger
                              onClick={(e) => openRowMenu(e, acc)}
                              aria-label={`Options for ${acc.accountName}`}
                              aria-haspopup="menu"
                              aria-expanded={rowMenu?.id === acc._id}
                              className={`p-1 rounded-md transition-colors cursor-pointer ${
                                rowMenu?.id === acc._id
                                  ? "bg-[#1f2023] text-[#f3f4f6]"
                                  : "text-[#4b5563] hover:text-[#f3f4f6] hover:bg-[#1f2023]"
                              }`}
                            >
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}

                <button
                  onClick={() => { setIsAccountDropdownOpen(false); resetAccountUi(); if (onAddNewAccount) onAddNewAccount(); }}
                  className="w-full text-left flex items-center gap-2.5 p-2 rounded-lg text-xs font-black text-[#0ecb81] hover:bg-[#0ecb81]/5 transition-colors mt-1.5 border border-dashed border-[#0ecb81]/15 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#0ecb81]" />
                  <div className="flex flex-col"><span>Create New Account</span><span className="text-[9px] text-[#4b5563] font-medium">Add another account</span></div>
                </button>
              </div>
            )}
          </div>

          {/* ნავიგაცია */}
          <nav className="space-y-1 pt-1 flex flex-col w-full">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={onMobileClose}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 px-3 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer select-none border border-transparent ${
                      isActive
                        ? "bg-[#0ecb81] text-[#040405] font-black shadow-md shadow-[#0ecb81]/10"
                        : "text-[#6b7280] hover:text-[#f3f4f6] hover:bg-[#141517]/40"
                    }`
                  }
                >
                  <IconComponent className="w-4 h-4 flex-shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* მომხმარებლის პროფილის პანელი და პოპაპ მენიუ */}
        <div className="w-full relative" ref={userMenuRef}>

          {isUserMenuOpen && (
            <div className="absolute bottom-14 left-0 right-0 bg-[#09090b] border border-[#1f2023] rounded-xl p-4 shadow-2xl z-50 mb-2 space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-150">

              <div className="space-y-2 bg-[#0d0d0e] border border-[#1f2023]/60 p-3 rounded-lg">
                <div className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-[#0ecb81]" />
                    <span className="text-[#f3f4f6] tracking-tight">Traders Ranks </span>
                  </div>
                  <span className="text-[#0ecb81] font-black font-mono">18%</span>
                </div>
                <div className="flex justify-between items-center text-[9px] font-bold text-[#4b5563] font-mono">
                  <span>will be added soon</span>
                </div>
                <div className="w-full h-1.5 bg-[#141517] rounded-full overflow-hidden">
                  <div className="h-full bg-[#0ecb81] rounded-full drop-shadow-[0_0_3px_rgba(14,203,129,0.4)]" style={{ width: "18%" }} />
                </div>
              </div>

              <div className="space-y-1 text-xs font-bold">
                <button
                  onClick={() => { setIsUserMenuOpen(false); navigate("/settings"); }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[#9ca3af] hover:text-[#0ecb81] hover:bg-[#141517]/40 transition-all cursor-pointer text-left font-sans"
                >
                  <Settings className="w-4 h-4" /> Settings
                </button>

                <button
                  onClick={() => { setIsUserMenuOpen(false); logout(); }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[#ef4444] hover:bg-[#ef4444]/5 transition-all cursor-pointer text-left border-t border-[#1f2023]/40 mt-1 font-sans"
                >
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </div>
            </div>
          )}

          <div
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className={`w-full bg-[#0d0d0e]/60 border rounded-xl p-3 flex items-center justify-between text-left cursor-pointer transition-colors group ${
              isUserMenuOpen ? "border-[#0ecb81]" : "border-[#1f2023] hover:border-[#2f3036]"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {user?.avatar ? (
                <img src={user.avatar} alt={displayName} className="w-8 h-8 rounded-full object-cover border border-[#0ecb81]/20 shadow-sm" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#0ecb81]/10 border border-[#0ecb81]/20 flex items-center justify-center text-xs font-black text-[#0ecb81] font-mono shadow-sm">
                  {initial}
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-black text-[#f3f4f6] tracking-tight group-hover:text-[#0ecb81] transition-colors truncate max-w-[120px]">{displayName}</span>
                <span className="text-[10px] font-bold text-[#4b5563]">Pro Trial</span>
              </div>
            </div>
            {isUserMenuOpen ? <ChevronDown className="w-3.5 h-3.5 text-[#4b5563]" /> : <ChevronUp className="w-3.5 h-3.5 text-[#4b5563]" />}
          </div>
        </div>
      </aside>

      {/* სამი წერტილის მენიუ: პორტალი body-ში, რომ არც aside-ის transform-მა და არც სქროლ-კონტეინერმა არ შეზღუდოს */}
      {rowMenu && menuAccount &&
        createPortal(
          <div
            ref={rowMenuRef}
            role="menu"
            style={{ top: rowMenu.top, left: rowMenu.left, width: ROW_MENU_WIDTH }}
            className="fixed z-[60] bg-[#09090b] border border-[#1f2023] rounded-xl p-1.5 shadow-2xl shadow-black/60 animate-in fade-in zoom-in-95 duration-100 font-sans"
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => startRename(menuAccount)}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-bold text-[#9ca3af] hover:text-[#f3f4f6] hover:bg-[#141517] transition-colors cursor-pointer text-left"
            >
              <Pencil className="w-3.5 h-3.5" /> Rename
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => startDelete(menuAccount)}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-bold text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors cursor-pointer text-left mt-0.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>,
          document.body
        )}

      {/* წაშლის დადასტურება aside-ის გარეთაა: aside-ს transform აქვს და fixed მოდალი მის შიგნით viewport-ზე არ გაიშლებოდა */}
      <ConfirmDelete
        isOpen={!!accountToDelete}
        onClose={() => { if (!deleting) setAccountToDelete(null); }}
        onConfirm={handleConfirmDelete}
        message={
          accountToDelete
            ? `Delete "${accountToDelete.accountName}"? All trades linked to this account will be permanently deleted. This action can't be undone.`
            : ""
        }
      />
    </>
  );
}
