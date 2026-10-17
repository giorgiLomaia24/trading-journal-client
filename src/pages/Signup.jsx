// ==================== REGISTER.JSX - PART 1 ====================
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import { useAuthStore } from '../store/useAuthStore';
import Button from '../components/Button';

export default function RegisterPage({ onRegisterSuccess }) {
    const navigate = useNavigate();

    const { registerUser, loading, error: backendError } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!username) {
            newErrors.username = "Username is required";
        }

        if (!email) {
            newErrors.email = "Email is required";
        } else if (!email.includes('@')) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});

        // ვაგზავნით მონაცემებს ბექენდზე. 
        // შენი UserSchema ელოდება 'name'-ს, ამიტომ username-ს ვატანთ როგორც name.
        // ასევე ვამატებთ normalizedEmail-ს, რომელსაც შენი სქემა ითხოვს (პატარა ასოებით)
        const success = await registerUser({
            name: username,
            email: email,
            normalizedEmail: email.toLowerCase(),
            password: password
        });

        // თუ რეგისტრაცია წარმატებით დასრულდა, გადაგვყავს ლოგინზე
        if (success) {
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-[#0b0e11] text-[#eaecef] flex select-none">
            <div className="w-full md:w-[42%] flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20 bg-[#0b0e11] z-10 shrink-0">
                <div className="mx-auto w-full max-w-[380px] bg-[#181a20] border border-[#2b2f36] rounded-2xl p-8 shadow-2xl">

                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-5 h-5 bg-[#0ecb81] rounded flex items-center justify-center text-[#0b0e11] font-black text-[10px]">Y</div>
                        <span className="text-base font-bold tracking-tight text-[#eaecef]">ONKO</span>
                    </div>

                    <h2 className="text-xl font-bold text-white tracking-tight">Create an account</h2>
                    <p className="text-xs text-[#848e9c] mt-1 mb-6 leading-relaxed">Start your data-driven trading journey today</p>

                    <form className="space-y-4" onSubmit={handleSubmit}>

                        {/* Username Input */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#848e9c]">Username</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#4b5563]">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                </span>
                                <input
                                    type="text"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className={`w-full bg-[#0d0d0e] text-[#f3f4f6] border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none transition-all ${errors.username ? "border-[#ef4444] focus:border-[#ef4444]" : "border-[#1f2023] focus:border-[#0ecb81]"}`}
                                />
                            </div>
                            {errors.username && <p className="text-xs text-[#ef4444] font-medium mt-0.5">{errors.username}</p>}
                        </div>

                        {/* Email Input */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#848e9c]">Email address</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#4b5563]">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
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
                        {/* Password Input */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#848e9c]">Password</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#4b5563]">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`w-full bg-[#0d0d0e] text-[#f3f4f6] border rounded-lg pl-10 pr-10 py-2.5 text-sm focus:outline-none transition-all ${errors.password ? "border-[#ef4444] focus:border-[#ef4444]" : "border-[#1f2023] focus:border-[#0ecb81]"}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#4b5563] hover:text-[#eaecef] focus:outline-none"
                                >
                                    {showPassword ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && <p className="text-xs text-[#ef4444] font-medium mt-0.5">{errors.password}</p>}
                        </div>

                        {/* Confirm Password Input */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#848e9c]">Confirm Password</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#4b5563]">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                </span>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Repeat your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`w-full bg-[#0d0d0e] text-[#f3f4f6] border rounded-lg pl-10 pr-10 py-2.5 text-sm focus:outline-none transition-all ${errors.confirmPassword ? "border-[#ef4444] focus:border-[#ef4444]" : "border-[#1f2023] focus:border-[#0ecb81]"}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#4b5563] hover:text-[#eaecef] focus:outline-none"
                                >
                                    {showConfirmPassword ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="text-xs text-[#ef4444] font-medium mt-0.5">{errors.confirmPassword}</p>}
                        </div>

                        <Button
                            type='submit'
                            disabled={loading}

                            variant="solid"
                            onClick={handleSubmit}
                            className="w-full mt-2"
                            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>}
                        >
                            Sign Up
                        </Button>
                    </form>

                    {/* ქვედა ლინკი მიუთითებს შენს მოთხოვნილ /login როუტზე */}
                    <div className="mt-5 text-center text-xs text-[#848e9c]">
                        Already have an account?{' '}
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
                    <div className="text-xl font-black text-[#0ecb81] mt-0.5 tracking-tight">+\$24,567</div>
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
