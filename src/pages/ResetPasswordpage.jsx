// ==================== RESET PASSWORD PAGE ====================
import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import AuthBrandPanel from "../components/AuthBrandPanel";
import { useAuthStore } from "../store/useAuthStore";

const EyeOpen = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
);
const EyeOff = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
);
const LockIcon = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
);

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const resetPassword = useAuthStore((s) => s.resetPassword);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    const newErrors = {};
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setServerError("");
    setSaving(true);
    const result = await resetPassword(token, password);
    setSaving(false);

    if (result.success) {
      setDone(true);
      setTimeout(() => navigate("/login"), 2500);
    } else {
      setServerError(result.message);
    }
  };

  const inputClass = (hasError) =>
    `w-full bg-[#0d0d0e] text-[#f3f4f6] border rounded-lg pl-10 pr-10 py-2.5 text-sm focus:outline-none transition-all ${hasError ? "border-[#ef4444] focus:border-[#ef4444]" : "border-[#1f2023] focus:border-[#0ecb81]"}`;

  return (
    <div className="min-h-screen bg-[#0b0e11] text-[#eaecef] flex select-none">
      <div className="w-full md:w-[42%] flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20 bg-[#0b0e11] z-10 shrink-0">
        <div className="mx-auto w-full max-w-[380px] bg-[#181a20] border border-[#2b2f36] rounded-2xl p-8 shadow-2xl">

          <div className="flex items-center gap-2 mb-6">
            <div className="w-5 h-5 bg-[#0ecb81] rounded flex items-center justify-center text-[#0b0e11] font-black text-[10px]">Y</div>
            <span className="text-base font-bold tracking-tight text-[#eaecef]">ONKO</span>
          </div>

          {done ? (
            <div className="space-y-4 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-[#0ecb81]/10 border border-[#0ecb81]/20 flex items-center justify-center text-[#0ecb81] text-xl font-black">✓</div>
              <h2 className="text-xl font-bold text-white tracking-tight">Password updated</h2>
              <p className="text-xs text-[#848e9c] leading-relaxed">
                Your password has been changed. Redirecting you to sign in...
              </p>
              <Link to="/login" className="inline-block text-xs font-semibold text-[#0ecb81] hover:text-[#0b9b62] transition-colors">
                Go to Sign in now
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-white tracking-tight">Choose a new password</h2>
              <p className="text-xs text-[#848e9c] mt-1 mb-6 leading-relaxed">
                Enter a new password for your account. Use at least 6 characters.
              </p>

              {serverError && (
                <div className="mb-4 p-3 bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-lg text-xs text-[#ef4444] font-medium text-center space-y-1">
                  <p>{serverError}</p>
                  <Link to="/forgot-password" className="inline-block font-bold underline hover:text-white transition-colors">
                    Request a new link
                  </Link>
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#848e9c]">New password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#4b5563]">{LockIcon}</span>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      className={inputClass(errors.password)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#4b5563] hover:text-[#eaecef] focus:outline-none"
                    >
                      {showPassword ? EyeOff : EyeOpen}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-[#ef4444] font-medium mt-0.5">{errors.password}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#848e9c]">Confirm new password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#4b5563]">{LockIcon}</span>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Repeat new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      className={inputClass(errors.confirmPassword)}
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-[#ef4444] font-medium mt-0.5">{errors.confirmPassword}</p>}
                </div>

                <Button type="submit" variant="solid" disabled={saving} className="w-full mt-2">
                  {saving ? "Saving..." : "Reset Password"}
                </Button>
              </form>
            </>
          )}

          {!done && (
            <div className="mt-5 text-center text-xs text-[#848e9c]">
              Back to{" "}
              <Link to="/login" className="font-semibold text-[#0ecb81] hover:text-[#0b9b62] transition-colors">Sign in</Link>
            </div>
          )}
        </div>
      </div>

      <AuthBrandPanel />
    </div>
  );
}