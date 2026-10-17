// ==================== FORGOTPASSWORD.JSX - PART 1 ====================
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import InputField from '../components/InputField'; // შენი ხელუხლებელი კომპონენტი
import Button from '../components/Button';         // შენი ხელუხლებელი კომპონენტი

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!email.includes('@')) {
      newErrors.email = "Please enter a valid email address";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitted(true);
    // აქ შეგიძლია ჩასვა ბექენდის რეზესტის ფუნქცია
  };

  return (
    <div className="min-h-screen bg-[#0b0e11] text-[#eaecef] flex select-none">
      <div className="w-full md:w-[42%] flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20 bg-[#0b0e11] z-10 shrink-0">
        <div className="mx-auto w-full max-w-[380px] bg-[#181a20] border border-[#2b2f36] rounded-2xl p-8 shadow-2xl">
          
          <div className="flex items-center gap-2 mb-6">
            <div className="w-5 h-5 bg-[#0ecb81] rounded flex items-center justify-center text-[#0b0e11] font-black text-[10px]">Y</div>
            <span className="text-base font-bold tracking-tight text-[#eaecef]">ONKO</span>
          </div>

          <h2 className="text-xl font-bold text-white tracking-tight">Reset password</h2>
          <p className="text-xs text-[#848e9c] mt-1 mb-6 leading-relaxed">
            {isSubmitted 
              ? "Check your email for the verification link to reset your password" 
              : "Enter your email address and we'll send you a link to reset your password"}
          </p>

          {!isSubmitted ? (
            <form className="space-y-4" onSubmit={handleSubmit}>
              
              {/* Email Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#848e9c]">Email address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#4b5563]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  </span>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full bg-[#0d0d0e] text-[#f3f4f6] border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none transition-all ${errors.email ? "border-[#ef4444] focus:border-[#ef4444]" : "border-[#1f2023] focus:border-[#0ecb81]"}`}
                  />
                </div>
                {errors.email && <p className="text-xs text-[#ef4444] font-medium mt-0.5">{errors.email}</p>}
              </div>
              <Button
                variant="solid"
                onClick={handleSubmit}
                className="w-full mt-2"
                icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>}
              >
                Send Reset Link
              </Button>
            </form>
          ) : (
            <Button
              variant="outline"
              className="w-full mt-2"
              onClick={() => setIsSubmitted(false)}
            >
              Resend Email
            </Button>
          )}

          {/* უკან დაბრუნების ლინკი მიუთითებს /login როუტზე */}
          <div className="mt-5 text-center text-xs text-[#848e9c]">
            Remember your password?{' '}
            <Link to="/login" className="font-semibold text-[#0ecb81] hover:text-[#0b9b62] transition-colors">Sign in</Link>
          </div>

        </div>
      </div>

      {/* ================= მარჯვენა მხარე: პრემიუმ ბრენდინგ ბლოკი ================= */}
      <div className="hidden md:flex flex-1 flex-col justify-center items-center relative overflow-hidden bg-gradient-to-br from-[#0a0d14] via-[#0b0e11] to-[#0f141c] border-l border-[#1f2023] px-12">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#0ecb81]/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="absolute top-20 left-28 bg-[#181a20]/90 border border-[#2b2f36] rounded-xl p-4 shadow-2xl min-w-[140px]">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#848e9c] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0ecb81]" />Win Rate
          </div>
          <div className="text-2xl font-black text-[#0ecb81] mt-0.5 tracking-tight">87.3%</div>
          <div className="text-[10px] text-[#0ecb81] font-medium mt-0.5">+12.4% this month</div>
        </div>

        <div className="absolute top-32 right-28 bg-[#181a20]/90 border border-[#2b2f36] rounded-xl p-4 shadow-2xl min-w-[140px]">
          <div className="text-[10px] font-bold text-[#848e9c] uppercase tracking-wider">Total P&L</div>
          <div className="text-xl font-black text-[#0ecb81] mt-0.5 tracking-tight">+$24,567</div>
          <div className="text-[10px] text-[#848e9c] font-semibold mt-0.5 font-mono">• +18.2%</div>
        </div>

        <div className="max-w-xl text-center space-y-4 z-10">
          <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">Transform Your <br /><span className="text-[#0ecb81] drop-shadow-[0_0_20px_rgba(14,203,129,0.2)]">Trading Journey</span></h1>
          <p className="text-xs lg:text-sm text-[#848e9c] leading-relaxed max-w-sm mx-auto">Join thousands of traders using data-driven insights to achieve <span className="text-[#0ecb81] font-semibold">consistent profitability</span> and <span className="text-[#0ecb81] font-semibold">better psychology</span>.</p>
        </div>
      </div>
    </div>
  );
}
