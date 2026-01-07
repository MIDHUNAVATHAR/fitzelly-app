import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SignInModal from '../components/SignInModal';
import SignUpModal from '../components/SignUpModal';
import ForgotPasswordModal from '../components/ForgotPasswordModal';
import { useAuth } from '../../landing/context/AuthContext';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
    const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);

    const { user, role, isLoading } = useAuth();
    const navigate = useNavigate();

    const getDashboardInfo = () => {
        // Explicitly check for super-admin role
        if (role === 'super-admin') {
            return {
                path: '/fitzelly-hq',
                label: 'Super Admin Dashboard'
            };
        }

        const currentRole = role || 'gym';
        return {
            path: `/${currentRole}/dashboard`,
            label: `${currentRole.charAt(0).toUpperCase() + currentRole.slice(1)} Dashboard`
        };
    };

    const dashboard = getDashboardInfo();
    const isLoggedIn = !!user;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-900/90 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-6'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="w-8 h-8 bg-[#00ffd5] rounded-lg flex items-center justify-center text-slate-900 font-bold text-xl">F</div>
                        <span className={`text-xl font-bold tracking-tight transition-colors ${isScrolled ? 'text-white' : 'text-slate-900'}`}>FITZELLY</span>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className={`font-medium transition-colors ${isScrolled ? 'text-slate-300 hover:text-white' : 'text-slate-900 hover:text-slate-900'}`}
                        >
                            Home
                        </button>
                        <button
                            onClick={() => scrollToSection('features')}
                            className={`font-medium transition-colors ${isScrolled ? 'text-slate-300 hover:text-white' : 'text-slate-900 hover:text-slate-900'}`}
                        >
                            Features
                        </button>
                        <button
                            onClick={() => scrollToSection('pricing')}
                            className={`font-medium transition-colors ${isScrolled ? 'text-slate-300 hover:text-white' : 'text-slate-900 hover:text-slate-900'}`}
                        >
                            Pricing
                        </button>
                    </nav>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        {isLoading ? (
                            <div className="w-6 h-6 border-2 border-[#00ffd5] border-t-transparent rounded-full animate-spin"></div>
                        ) : isLoggedIn ? (
                            <button
                                onClick={() => navigate(dashboard.path)}
                                className="bg-[#00ffd5] text-slate-900 px-5 py-2.5 rounded-lg font-bold hover:bg-[#00e6c0] transition-colors cursor-pointer"
                            >
                                {dashboard.label}
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsSignInModalOpen(true)}
                                className="bg-[#00ffd5] text-slate-900 px-5 py-2.5 rounded-lg font-bold hover:bg-[#00e6c0] transition-colors cursor-pointer"
                            >
                                Sign In
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className={`md:hidden ${isScrolled ? 'text-white' : 'text-slate-900'}`}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-slate-900 absolute top-full left-0 right-0 border-t border-slate-800 p-4">
                    <div className="flex flex-col space-y-4">
                        <button
                            onClick={() => {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                setIsMobileMenuOpen(false);
                            }}
                            className="text-left text-slate-300 hover:text-white font-medium"
                        >
                            Home
                        </button>
                        <button
                            onClick={() => scrollToSection('features')}
                            className="text-left text-slate-300 hover:text-white font-medium"
                        >
                            Features
                        </button>
                        <button
                            onClick={() => scrollToSection('pricing')}
                            className="text-left text-slate-300 hover:text-white font-medium"
                        >
                            Pricing
                        </button>
                        <div className="h-px bg-slate-800 my-2"></div>
                        {isLoggedIn ? (
                            <button
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    navigate(dashboard.path);
                                }}
                                className="w-full bg-[#00ffd5] text-slate-900 px-5 py-2.5 rounded-lg font-bold hover:bg-[#00e6c0] transition-colors text-center cursor-pointer"
                            >
                                {dashboard.label}
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    setIsSignInModalOpen(true);
                                }}
                                className="w-full bg-[#00ffd5] text-slate-900 px-5 py-2.5 rounded-lg font-bold hover:bg-[#00e6c0] transition-colors text-center cursor-pointer"
                            >
                                Sign In
                            </button>
                        )}
                    </div>
                </div>
            )}
            {/* Sign In Modal */}
            <SignInModal
                isOpen={isSignInModalOpen}
                onClose={() => setIsSignInModalOpen(false)}
                onSwitchToSignUp={() => {
                    setIsSignInModalOpen(false);
                    setIsSignUpModalOpen(true);
                }}
                onForgotPassword={() => {
                    setIsSignInModalOpen(false);
                    setIsForgotPasswordModalOpen(true);
                }}
            />

            {/* Sign Up Modal */}
            <SignUpModal
                isOpen={isSignUpModalOpen}
                onClose={() => setIsSignUpModalOpen(false)}
                onSwitchToSignIn={() => {
                    setIsSignUpModalOpen(false);
                    setIsSignInModalOpen(true);
                }}
            />

            {/* Forgot Password Modal */}
            <ForgotPasswordModal
                isOpen={isForgotPasswordModalOpen}
                onClose={() => setIsForgotPasswordModalOpen(false)}
                onSwitchToSignIn={() => {
                    setIsForgotPasswordModalOpen(false);
                    setIsSignInModalOpen(true);
                }}
            />
        </header>
    );
}
