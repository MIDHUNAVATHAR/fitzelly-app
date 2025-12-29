import { X, ArrowLeft, Timer } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import PasswordInput from './PasswordInput';

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToSignIn: () => void;
}

type Step = 'EMAIL' | 'OTP' | 'RESET_PASSWORD' | 'SUCCESS';

export default function ForgotPasswordModal({ isOpen, onClose, onSwitchToSignIn }: ForgotPasswordModalProps) {
    const [step, setStep] = useState<Step>('EMAIL');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Timer state
    const [timeLeft, setTimeLeft] = useState(90);
    const [canResend, setCanResend] = useState(false);

    // Prevent background scrolling
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
            // Reset state on close
            if (!isOpen) {
                setTimeout(() => {
                    setStep('EMAIL');
                    setEmail('');
                    setOtp('');
                    setNewPassword('');
                    setConfirmPassword('');
                }, 300);
            }
        };
    }, [isOpen]);

    // Timer logic
    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        if (step === 'OTP' && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setCanResend(true);
        }
        return () => clearInterval(timer);
    }, [step, timeLeft]);

    const handleSendOtp = () => {
        // API call to send OTP would go here
        setStep('OTP');
        setTimeLeft(30);
        setCanResend(false);
    };

    const handleVerifyOtp = () => {
        // API call to verify OTP would go here
        setStep('RESET_PASSWORD');
    };

    const handleResetPassword = () => {
        // API call to update password
        setStep('SUCCESS');
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center md:items-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative w-full h-full md:h-auto md:w-[480px] bg-white md:rounded-2xl shadow-2xl p-6 md:p-8 transform transition-all animate-in fade-in duration-300 overflow-y-auto">

                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            {step === 'EMAIL' && 'Forgot Password?'}
                            {step === 'OTP' && 'Verify Email'}
                            {step === 'RESET_PASSWORD' && 'Reset Password'}
                            {step === 'SUCCESS' && 'Password Reset'}
                        </h2>
                        <p className="text-slate-500 mt-1 text-sm">
                            {step === 'EMAIL' && "Enter your email to reset your password"}
                            {step === 'OTP' && `Enter the OTP sent to ${email}`}
                            {step === 'RESET_PASSWORD' && "Create a new strong password"}
                            {step === 'SUCCESS' && "Your password has been successfully updated"}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-100 p-1.5 rounded-full cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Step 1: Email Input */}
                {step === 'EMAIL' && (
                    <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleSendOtp(); }}>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-slate-900 placeholder:text-slate-400 transition-all"
                                required
                            />
                        </div>
                        <button
                            className="w-full bg-[#00ffd5] hover:bg-[#00e6c0] text-slate-900 font-bold py-3.5 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(0,255,213,0.39)] hover:shadow-[0_6px_20px_rgba(0,255,213,0.23)] transform hover:-translate-y-0.5 cursor-pointer"
                        >
                            Send OTP
                        </button>
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={onSwitchToSignIn}
                                className="text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-2 mx-auto"
                            >
                                <ArrowLeft size={16} /> Back to Login
                            </button>
                        </div>
                    </form>
                )}

                {/* Step 2: OTP Verification */}
                {step === 'OTP' && (
                    <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleVerifyOtp(); }}>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">One-Time Password</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter 6-digit OTP"
                                maxLength={6}
                                className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-slate-900 placeholder:text-slate-400 transition-all tracking-widest text-center text-lg font-bold"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-center gap-2 text-sm">
                            <Timer size={16} className="text-slate-400" />
                            {canResend ? (
                                <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    className="text-teal-500 font-semibold hover:text-teal-600 cursor-pointer"
                                >
                                    Resend OTP
                                </button>
                            ) : (
                                <span className="text-slate-500">
                                    Resend code in <span className="font-mono font-medium text-slate-700">{formatTime(timeLeft)}</span>
                                </span>
                            )}
                        </div>

                        <button
                            className="w-full bg-[#00ffd5] hover:bg-[#00e6c0] text-slate-900 font-bold py-3.5 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(0,255,213,0.39)] hover:shadow-[0_6px_20px_rgba(0,255,213,0.23)] transform hover:-translate-y-0.5 cursor-pointer"
                        >
                            Verify & Proceed
                        </button>
                    </form>
                )}

                {/* Step 3: Reset Password */}
                {step === 'RESET_PASSWORD' && (
                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleResetPassword(); }}>
                        <PasswordInput
                            label="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                        <PasswordInput
                            label="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                        <button
                            className="w-full bg-[#00ffd5] hover:bg-[#00e6c0] text-slate-900 font-bold py-3.5 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(0,255,213,0.39)] hover:shadow-[0_6px_20px_rgba(0,255,213,0.23)] transform hover:-translate-y-0.5 cursor-pointer mt-2"
                        >
                            Reset Password
                        </button>
                    </form>
                )}

                {/* Step 4: Success */}
                {step === 'SUCCESS' && (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">All Set!</h3>
                        <p className="text-slate-500 mb-8">Your password has been reset successfully. You can now login with your new password.</p>
                        <button
                            onClick={onSwitchToSignIn}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-colors cursor-pointer"
                        >
                            Back to Login
                        </button>
                    </div>
                )}

            </div>
        </div>,
        document.body
    );
}
