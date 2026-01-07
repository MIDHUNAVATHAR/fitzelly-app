import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import { AuthService } from '../services/AuthService';

export default function VerifyOtpPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const email = searchParams.get('email');
    const role = searchParams.get('role');
    const otpFromUrl = searchParams.get('otp');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!email || !role || !otpFromUrl) {
            setError("Invalid verification link. Missing details.");
        }
    }, [email, role, otpFromUrl]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (!email || !role || !otpFromUrl) return;

        setLoading(true);
        setError(null);

        try {
            await AuthService.confirmPasswordReset({
                email,
                otp: otpFromUrl,
                password,
                role
            });

            setSuccess(true);
            setTimeout(() => {
                navigate('/landing?action=login');
            }, 3000);
        } catch (err: any) {
            setError(err.message || "Failed to set password.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="text-green-500 w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Password Reset Successful!</h2>
                    <p className="text-slate-500 mb-6">Your password has been set successfully. Use your new password to login. Redirecting...</p>
                    <button
                        onClick={() => navigate('/landing?action=login')}
                        className="w-full bg-[#00ffd5] text-slate-900 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    if (!email || !role || !otpFromUrl) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-red-500 font-medium">Invalid Invitation Link</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">Welcome!</h1>
                    <p className="text-slate-500 mt-2">Set up your password to access your dashboard.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ffd5] transition-all"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ffd5] transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#00ffd5] text-slate-900 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-[#00ffd5]/20 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 className="animate-spin" size={20} />}
                        {loading ? 'Setting Password...' : 'Set Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}
