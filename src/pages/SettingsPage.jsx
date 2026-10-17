// // ==================== PIXEL-PERFECT SETTINGS PAGE - PART 1 ====================
// import React, { useState } from "react";
// import { 
//   User, 
//   Lock, 
//   Settings, 
//   Camera, 
//   Globe, 
//   ShieldAlert, 
//   Download,
//   Trash2,
//   Save
// } from "lucide-react"; // მხოლოდ უსუფთავესი ხაზოვანი ვექტორული აიქონები
// import InputField from "../components/InputField";
// import Button from "../components/Button";

// export default function SettingsPage() {
//   const [fullName, setFullName] = useState("Giorgi Lomaia");
//   const [email, setEmail] = useState("giorgilomaia9829@gmail.com");
//   const [currentPassword, setCurrentPassword] = useState("............");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const [defaultAccount, setDefaultAccount] = useState("lucid50k");
//   const [currency, setCurrency] = useState("USD");
//   const [timezone, setTimezone] = useState("EST");
//   const [weekStart, setWeekStart] = useState("Monday");

//   return (
//     <div className="min-h-screen bg-[#040405] text-[#f3f4f6] p-4 sm:p-8 font-sans text-left select-none animate-in fade-in duration-200 w-full">
//       <div className="max-w-7xl mx-auto space-y-6">
        
//         {/* ზედა მთავარი სათაური (ზუსტად ორიგინალი სქრინშოტის მასშტაბით) */}
//         <div className="flex items-center gap-3 border-b border-[#1f2023] pb-4">
//           <Settings className="w-5 h-5 text-[#0ecb81] filter drop-shadow-[0_0_3px_rgba(14,203,129,0.3)]" />
//           <div className="flex flex-col">
//             <h2 className="text-md font-black tracking-tight text-[#f3f4f6]">Settings</h2>
//             <p className="text-[11px] text-[#6b7280] font-semibold mt-0.5">Manage your account preferences and application settings.</p>
//           </div>
//         </div>

//         {/* ორპანელიანი მთავარი სისტემური Grid ლეიაუტი */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
          
//           {/* ==================== მარცხენა მხარე: პროფილის ინფო, პაროლი და პრივატულობა (2 სვეტი) ==================== */}
//           <div className="lg:col-span-2 space-y-6 w-full">
            
//             {/* 1. სექცია: Profile Information */}
//             <div className="bg-[#09090b] border border-[#1f2023] rounded-xl p-5 space-y-5">
//               <div className="flex items-center gap-2 border-b border-[#1f2023]/60 pb-3">
//                 <User className="w-4 h-4 text-[#6b7280]" />
//                 <div className="flex flex-col">
//                   <h3 className="text-xs font-black text-[#f3f4f6] tracking-tight uppercase">Profile Information</h3>
//                   <span className="text-[10px] font-semibold text-[#4b5563] mt-0.5">Update your personal information and account details</span>
//                 </div>
//               </div>

//               {/* ფოტოს სექცია (ზუსტად ორიგინალის მსგავსი კომპაქტური ზომებით) */}
//               <div className="flex items-center gap-4">
//                 <div className="w-14 h-14 rounded-full bg-[#141517] border border-[#1f2023] flex items-center justify-center text-xs font-black text-[#9ca3af] font-mono shadow-inner">
//                   GL
//                 </div>
//                 <div className="space-y-1">
//                   <button 
//                     type="button"
//                     className="flex items-center gap-1.5 px-3 py-2 bg-[#040405] border border-[#1f2023] hover:border-[#0ecb81]/30 hover:bg-[#0ecb81]/5 text-xs font-bold text-[#9ca3af] hover:text-[#0ecb81] rounded-xl transition-all cursor-pointer"
//                   >
//                     <Camera className="w-3.5 h-3.5" />
//                     <span>Change Photo</span>
//                   </button>
//                   <p className="text-[9px] text-[#4b5563] font-medium font-mono">JPG, PNG or WebP. Max 10MB.</p>
//                 </div>
//               </div>

//               {/* სახელი და იმეილი */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <InputField label="Full Name" type="text" value={fullName} onChange={setFullName} />
//                 <div className="opacity-40 pointer-events-none">
//                   <InputField label="Email Address" type="text" value={email} disabled={true} hint="Email cannot be changed after registration" />
//                 </div>
//               </div>

//               {/* Save Name ღილაკი — ზუსტად ინფუთის მარჯვენა კიდეზე გასწორებული და კომპაქტური! */}
//               <div className="flex justify-end pt-1">
//                 <button
//                   type="button"
//                   onClick={() => alert("Name Saved Successfully!")}
//                   className="flex items-center gap-2 px-4 py-2.5 bg-[#0ecb81] text-[#040405] hover:bg-[#0bb572] text-xs font-black rounded-xl transition-all cursor-pointer shadow-md shadow-[#0ecb81]/5"
//                 >
//                   <Save className="w-4 h-4" />
//                   <span>Save Name</span>
//                 </button>
//               </div>
//             </div>

//             {/* 2. სექცია: Change Password */}
//             <div className="bg-[#09090b] border border-[#1f2023] rounded-xl p-5 space-y-5">
//               <div className="flex items-center gap-2 border-b border-[#1f2023]/60 pb-3">
//                 <Lock className="w-4 h-4 text-[#6b7280]" />
//                 <div className="flex flex-col">
//                   <h3 className="text-xs font-black text-[#f3f4f6] tracking-tight uppercase">Change Password</h3>
//                   <span className="text-[10px] font-semibold text-[#4b5563] mt-0.5">Ensure your account is using a long, random password to stay secure</span>
//                 </div>
//               </div>

//               <InputField label="Current Password" type="text" value={currentPassword} onChange={setCurrentPassword} />

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <InputField label="New Password" type="text" placeholder="Enter new password" value={newPassword} onChange={setNewPassword} />
//                 <InputField label="Confirm New Password" type="text" placeholder="Repeat new password" value={confirmPassword} onChange={setConfirmPassword} />
//               </div>

//               {/* Change Password ღილაკი — ზუსტად ინფუთის მარჯვენა კიდეზე გასწორებული */}
//               <div className="flex justify-end pt-1">
//                 <button
//                   type="button"
//                   onClick={() => alert("Password Changed Successfully!")}
//                   className="flex items-center gap-2 px-4 py-2.5 bg-[#0d0d0e] border border-[#1f2023] hover:border-[#2f3036] text-xs font-bold text-[#9ca3af] hover:text-[#f3f4f6] rounded-xl transition-all cursor-pointer"
//                 >
//                   <Lock className="w-4 h-4" />
//                   <span>Change Password</span>
//                 </button>
//               </div>
//             </div>

//             {/* 3. სექცია: Data & Privacy (სრულად აღდგენილი და გასწორებული!) */}
//             <div className="bg-[#09090b] border border-[#1f2023] rounded-xl p-5 space-y-5">
//               <div className="flex items-center gap-2 border-b border-[#1f2023]/60 pb-3">
//                 <ShieldAlert className="w-4 h-4 text-[#6b7280]" />
//                 <div className="flex flex-col">
//                   <h3 className="text-xs font-black text-[#f3f4f6] tracking-tight uppercase">Data & Privacy</h3>
//                   <span className="text-[10px] font-semibold text-[#4b5563] mt-0.5">Manage your personal data, data portability and account status</span>
//                 </div>
//               </div>

//               {/* ექსპორტის და წაშლის ღილაკების ვერტიკალური სოლიდური ბლოკი (ზუსტად სქრინშოტის იერით!) */}
//               <div className="space-y-3.5 max-w-xl">
//                 <button
//                   type="button"
//                   onClick={() => alert("Exporting Data...")}
//                   className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0d0d0e] border border-[#1f2023] hover:border-[#0ecb81]/30 text-xs font-bold text-[#9ca3af] hover:text-[#0ecb81] rounded-xl transition-all cursor-pointer"
//                 >
//                   <Download className="w-4 h-4" />
//                   <span>Export My Data</span>
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => {
//                     if(confirm("Are you absolutely sure you want to delete your account? This action cannot be undone.")) {
//                       alert("Account Deleted.");
//                     }
//                   }}
//                   className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#1c0d0d] border border-[#ef4444]/20 hover:border-[#ef4444]/50 text-xs font-bold text-[#ef4444] hover:bg-[#ef4444]/10 rounded-xl transition-all cursor-pointer shadow-sm shadow-[#ef4444]/2"
//                 >
//                   <Trash2 className="w-4 h-4" />
//                   <span>Delete Account</span>
//                 </button>
//               </div>
//             </div>

//           </div>

//           {/* ==================== მარჯვენა მხარე: სავაჭრო პრეფერენციები (1 სვეტი) ==================== */}
//           <div className="lg:col-span-1 space-y-6 w-full">
            
//             <div className="bg-[#09090b] border border-[#1f2023] rounded-xl p-5 space-y-4 w-full">
//               <div className="flex items-center gap-2 border-b border-[#1f2023]/60 pb-3">
//                 <Globe className="w-4 h-4 text-[#6b7280]" />
//                 <div className="flex flex-col">
//                   <h3 className="text-xs font-black text-[#f3f4f6] tracking-tight uppercase">Trading Preferences</h3>
//                   <span className="text-[10px] font-semibold text-[#4b5563]">Default settings for your trading dashboard</span>
//                 </div>
//               </div>

//               <InputField 
//                 label="Default Account" 
//                 type="select" 
//                 value={defaultAccount} 
//                 onChange={setDefaultAccount}
//                 options={[{ label: "📌    lucid50k", value: "lucid50k" }]} // თავსებადია ჩვენს InputField-თან
//               />

//               <InputField 
//                 label="Currency" 
//                 type="select" 
//                 value={currency} 
//                 onChange={setCurrency}
//                 options={[{ label: "USD ($)", value: "USD" }, { label: "EUR (€)", value: "EUR" }]}
//               />

//               <InputField 
//                 label="Timezone" 
//                 type="select" 
//                 value={timezone} 
//                 onChange={setTimezone}
//                 options={[
//                   { label: "Eastern Time (GMT-4)", value: "EST" }, 
//                   { label: "Tbilisi Time (GMT+4)", value: "GET" }
//                 ]}
//               />

//               <InputField 
//                 label="Week Starts On" 
//                 type="select" 
//                 value={weekStart} 
//                 onChange={setWeekStart}
//                 options={[{ label: "Monday", value: "Monday" }, { label: "Sunday", value: "Sunday" }]}
//               />

//               {/* დიდი მწვანე Save Preferences ღილაკი */}
//               <div className="pt-2">
//                 <button 
//                   type="button" 
//                   onClick={() => alert("Preferences Saved Successfully!")}
//                   className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0ecb81] text-[#040405] font-black hover:bg-[#0bb572] text-xs rounded-xl transition-all cursor-pointer shadow-md shadow-[#0ecb81]/5 active:scale-[0.99]" 
//                 >
//                   <Save className="w-4 h-4" /> 
//                   <span>Save Preferences</span>
//                 </button>
//               </div>
//             </div>

//           </div>

//         </div>

//       </div>
//     </div>
//   );
// }


// ==================== SETTINGS PAGE ====================
import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Lock,
  Settings,
  Camera,
  ShieldAlert,
  Download,
  Trash2,
  Save,
  Eye,
  EyeOff
} from "lucide-react";
import InputField from "../components/InputField";
import { useAuthStore } from "../store/useAuthStore";
import useScrollLock from "../hooks/useScrollLock";

const MAX_AVATAR_SIZE = 10 * 1024 * 1024; // 10MB
const NAME_MIN = 2;
const NAME_MAX = 40;
const PASSWORD_MIN = 6;

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("") || "?";

// წარმატების/შეცდომის მცირე შეტყობინება ღილაკების გვერდით
function Status({ status }) {
  if (!status?.text) return null;
  const ok = status.type === "success";
  return (
    <span className={`text-[11px] font-semibold ${ok ? "text-[#0ecb81]" : "text-[#ef4444]"}`}>
      {status.text}
    </span>
  );
}

// InputField-ს password ტიპი არ აქვს, ამიტომ პაროლის ველი ცალკეა (თვალის ღილაკით)
function PasswordField({ label, value, onChange, placeholder, autoComplete, disabled }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="flex flex-col gap-1.5 w-full text-left font-sans">
      {label && <label className="text-xs font-semibold text-[#9ca3af] tracking-wide">{label}</label>}
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#0d0d0e] text-[#f3f4f6] border border-[#1f2023] rounded-lg pl-4 pr-10 py-3 text-sm placeholder-[#4b5563] focus:outline-none focus:border-[#0ecb81] focus:ring-1 focus:ring-[#0ecb81] transition-all disabled:opacity-60"
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          tabIndex={-1}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#4b5563] hover:text-[#f3f4f6] transition-colors cursor-pointer"
        >
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const updateProfileName = useAuthStore((s) => s.updateProfileName);
  const changePassword = useAuthStore((s) => s.changePassword);
  const uploadAvatar = useAuthStore((s) => s.uploadAvatar);
  const exportMyData = useAuthStore((s) => s.exportMyData);
  const deleteMyAccount = useAuthStore((s) => s.deleteMyAccount);

  // პროფილი
  const [fullName, setFullName] = useState(user?.name || "");
  const [savingName, setSavingName] = useState(false);
  const [nameStatus, setNameStatus] = useState(null);

  // ავატარი
  const fileInputRef = useRef(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarStatus, setAvatarStatus] = useState(null);

  // პაროლი
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState(null);

  // ექსპორტი
  const [exporting, setExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState(null);

  // ანგარიშის წაშლა
  const [showDelete, setShowDelete] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useScrollLock(showDelete);

  // თუ სახელი სხვაგან განახლდა, ველიც განახლდეს
  useEffect(() => {
    setFullName(user?.name || "");
  }, [user?.name]);

  // Escape ხურავს წაშლის მოდალს
  useEffect(() => {
    if (!showDelete) return;
    const onKey = (e) => { if (e.key === "Escape" && !deleting) closeDelete(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDelete, deleting]);

  // ---------- სახელი ----------
  const handleSaveName = async () => {
    if (savingName) return;

    const name = fullName.trim().replace(/\s+/g, " ");
    if (name.length < NAME_MIN) {
      setNameStatus({ type: "error", text: `Name must be at least ${NAME_MIN} characters` });
      return;
    }
    if (name.length > NAME_MAX) {
      setNameStatus({ type: "error", text: `Name must be at most ${NAME_MAX} characters` });
      return;
    }
    if (name === user?.name) {
      setNameStatus({ type: "error", text: "No changes to save" });
      return;
    }

    setSavingName(true);
    setNameStatus(null);
    const result = await updateProfileName(name);
    setSavingName(false);

    setNameStatus(
      result.success
        ? { type: "success", text: "Name updated" }
        : { type: "error", text: result.message }
    );
  };

  // ---------- ავატარი ----------
  const handleAvatarPicked = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // იგივე ფაილის ხელახლა არჩევა რომ შესაძლებელი იყოს
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setAvatarStatus({ type: "error", text: "Please choose an image file" });
      return;
    }
    if (file.size > MAX_AVATAR_SIZE) {
      setAvatarStatus({ type: "error", text: "Image must be 10MB or smaller" });
      return;
    }

    setUploadingAvatar(true);
    setAvatarStatus(null);
    const result = await uploadAvatar(file);
    setUploadingAvatar(false);

    setAvatarStatus(
      result.success
        ? { type: "success", text: "Photo updated" }
        : { type: "error", text: result.message }
    );
  };

  // ---------- პაროლი ----------
  const handleChangePassword = async () => {
    if (savingPassword) return;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordStatus({ type: "error", text: "Please fill in all fields" });
      return;
    }
    if (newPassword.length < PASSWORD_MIN) {
      setPasswordStatus({ type: "error", text: `New password must be at least ${PASSWORD_MIN} characters` });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: "error", text: "New passwords do not match" });
      return;
    }
    if (newPassword === currentPassword) {
      setPasswordStatus({ type: "error", text: "New password must be different from the current one" });
      return;
    }

    setSavingPassword(true);
    setPasswordStatus(null);
    const result = await changePassword(currentPassword, newPassword);
    setSavingPassword(false);

    if (result.success) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordStatus({ type: "success", text: "Password changed" });
    } else {
      setPasswordStatus({ type: "error", text: result.message });
    }
  };

  // ---------- ექსპორტი ----------
  const handleExport = async () => {
    if (exporting) return;
    setExporting(true);
    setExportStatus(null);
    const result = await exportMyData();
    setExporting(false);
    setExportStatus(
      result.success
        ? { type: "success", text: "Export downloaded" }
        : { type: "error", text: result.message }
    );
  };

  // ---------- ანგარიშის წაშლა ----------
  const closeDelete = () => {
    setShowDelete(false);
    setDeletePassword("");
    setDeleteError("");
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (deleting) return;

    if (!deletePassword) {
      setDeleteError("Enter your password to confirm");
      return;
    }

    setDeleting(true);
    setDeleteError("");
    const result = await deleteMyAccount(deletePassword);
    // წარმატებისას სთორი თავად გამოიყვანს მომხმარებელს /login-ზე
    if (!result.success) {
      setDeleting(false);
      setDeleteError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#040405] text-[#f3f4f6] p-4 sm:p-8 font-sans text-left select-none animate-in fade-in duration-200 w-full">
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="flex items-center gap-3 border-b border-[#1f2023] pb-4">
          <Settings className="w-5 h-5 text-[#0ecb81] filter drop-shadow-[0_0_3px_rgba(14,203,129,0.3)]" />
          <div className="flex flex-col">
            <h2 className="text-md font-black tracking-tight text-[#f3f4f6]">Settings</h2>
            <p className="text-[11px] text-[#6b7280] font-semibold mt-0.5">Manage your account preferences and application settings.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
          <div className="lg:col-span-2 space-y-6 w-full">

            {/* 1. Profile Information */}
            <div className="bg-[#09090b] border border-[#1f2023] rounded-xl p-5 space-y-5">
              <div className="flex items-center gap-2 border-b border-[#1f2023]/60 pb-3">
                <User className="w-4 h-4 text-[#6b7280]" />
                <div className="flex flex-col">
                  <h3 className="text-xs font-black text-[#f3f4f6] tracking-tight uppercase">Profile Information</h3>
                  <span className="text-[10px] font-semibold text-[#4b5563] mt-0.5">Update your personal information and account details</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="w-14 h-14 rounded-full object-cover border border-[#1f2023] shadow-inner"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[#141517] border border-[#1f2023] flex items-center justify-center text-xs font-black text-[#9ca3af] font-mono shadow-inner">
                    {getInitials(user?.name)}
                  </div>
                )}
                <div className="space-y-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleAvatarPicked}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={uploadingAvatar}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-2 bg-[#040405] border border-[#1f2023] hover:border-[#0ecb81]/30 hover:bg-[#0ecb81]/5 text-xs font-bold text-[#9ca3af] hover:text-[#0ecb81] rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{uploadingAvatar ? "Uploading..." : "Change Photo"}</span>
                  </button>
                  <p className="text-[9px] text-[#4b5563] font-medium font-mono">JPG, PNG or WebP. Max 10MB.</p>
                  <Status status={avatarStatus} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Full Name" type="text" value={fullName} onChange={(v) => { setFullName(v); if (nameStatus) setNameStatus(null); }} />
                <div className="opacity-40 pointer-events-none">
                  <InputField label="Email Address" type="text" value={user?.email || ""} disabled={true} hint="Email cannot be changed after registration" />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-1">
                <Status status={nameStatus} />
                <button
                  type="button"
                  onClick={handleSaveName}
                  disabled={savingName}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#0ecb81] text-[#040405] hover:bg-[#0bb572] text-xs font-black rounded-xl transition-all cursor-pointer shadow-md shadow-[#0ecb81]/5 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingName ? "Saving..." : "Save Name"}</span>
                </button>
              </div>
            </div>

            {/* 2. Change Password */}
            <div className="bg-[#09090b] border border-[#1f2023] rounded-xl p-5 space-y-5">
              <div className="flex items-center gap-2 border-b border-[#1f2023]/60 pb-3">
                <Lock className="w-4 h-4 text-[#6b7280]" />
                <div className="flex flex-col">
                  <h3 className="text-xs font-black text-[#f3f4f6] tracking-tight uppercase">Change Password</h3>
                  <span className="text-[10px] font-semibold text-[#4b5563] mt-0.5">Ensure your account is using a long, random password to stay secure</span>
                </div>
              </div>

              <PasswordField
                label="Current Password"
                value={currentPassword}
                onChange={(v) => { setCurrentPassword(v); if (passwordStatus) setPasswordStatus(null); }}
                placeholder="Enter current password"
                autoComplete="current-password"
                disabled={savingPassword}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PasswordField
                  label="New Password"
                  value={newPassword}
                  onChange={(v) => { setNewPassword(v); if (passwordStatus) setPasswordStatus(null); }}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  disabled={savingPassword}
                />
                <PasswordField
                  label="Confirm New Password"
                  value={confirmPassword}
                  onChange={(v) => { setConfirmPassword(v); if (passwordStatus) setPasswordStatus(null); }}
                  placeholder="Repeat new password"
                  autoComplete="new-password"
                  disabled={savingPassword}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-1">
                <Status status={passwordStatus} />
                <button
                  type="button"
                  onClick={handleChangePassword}
                  disabled={savingPassword}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#0d0d0e] border border-[#1f2023] hover:border-[#2f3036] text-xs font-bold text-[#9ca3af] hover:text-[#f3f4f6] rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Lock className="w-4 h-4" />
                  <span>{savingPassword ? "Changing..." : "Change Password"}</span>
                </button>
              </div>
            </div>

            {/* 3. Data & Privacy */}
            <div className="bg-[#09090b] border border-[#1f2023] rounded-xl p-5 space-y-5">
              <div className="flex items-center gap-2 border-b border-[#1f2023]/60 pb-3">
                <ShieldAlert className="w-4 h-4 text-[#6b7280]" />
                <div className="flex flex-col">
                  <h3 className="text-xs font-black text-[#f3f4f6] tracking-tight uppercase">Data & Privacy</h3>
                  <span className="text-[10px] font-semibold text-[#4b5563] mt-0.5">Manage your personal data, data portability and account status</span>
                </div>
              </div>

              <div className="space-y-3.5 max-w-xl">
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={handleExport}
                    disabled={exporting}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0d0d0e] border border-[#1f2023] hover:border-[#0ecb81]/30 text-xs font-bold text-[#9ca3af] hover:text-[#0ecb81] rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <Download className="w-4 h-4" />
                    <span>{exporting ? "Preparing export..." : "Export My Data"}</span>
                  </button>
                  <p className="text-[10px] text-[#4b5563] font-medium">
                    Downloads a JSON file with your profile, accounts, strategies, sessions and all trades.
                  </p>
                  <Status status={exportStatus} />
                </div>

                <button
                  type="button"
                  onClick={() => setShowDelete(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#1c0d0d] border border-[#ef4444]/20 hover:border-[#ef4444]/50 text-xs font-bold text-[#ef4444] hover:bg-[#ef4444]/10 rounded-xl transition-all cursor-pointer shadow-sm shadow-[#ef4444]/2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Account</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ანგარიშის წაშლის დადასტურება (პაროლით) */}
      {showDelete && (
        <div
          onClick={() => { if (!deleting) closeDelete(); }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto overscroll-contain cursor-zoom-out animate-in fade-in duration-150"
        >
          <form
            onSubmit={handleDeleteAccount}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#09090b] border border-[#ef4444]/30 rounded-xl p-6 shadow-2xl my-auto cursor-default space-y-4 animate-in zoom-in-95 duration-150 text-left"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#ef4444]/10 border border-[#ef4444]/20 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 text-[#ef4444]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-[#f3f4f6]">Delete your account?</h3>
                <p className="text-xs text-[#9ca3af] leading-relaxed">
                  This permanently deletes your profile and <span className="text-[#ef4444] font-bold">all</span> your
                  trading accounts, trades, strategies and sessions. This action can't be undone.
                </p>
              </div>
            </div>

            {deleteError && (
              <div className="p-2.5 bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-lg text-xs text-[#ef4444] font-medium text-center">
                {deleteError}
              </div>
            )}

            <PasswordField
              label="Enter your password to confirm"
              value={deletePassword}
              onChange={(v) => { setDeletePassword(v); if (deleteError) setDeleteError(""); }}
              placeholder="Your password"
              autoComplete="current-password"
              disabled={deleting}
            />

            <p className="text-[10px] text-[#4b5563] font-medium">
              Tip: use "Export My Data" first if you want to keep a copy.
            </p>

            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={closeDelete}
                disabled={deleting}
                className="px-4 py-2.5 border border-[#1f2023] hover:border-[#2f3036] text-xs font-bold text-[#9ca3af] hover:text-[#f3f4f6] rounded-xl transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={deleting || !deletePassword}
                className="px-4 py-2.5 bg-[#ef4444] hover:bg-[#dc2626] text-xs font-black text-white rounded-xl transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
              >
                {deleting ? "Deleting..." : "Yes, delete everything"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
