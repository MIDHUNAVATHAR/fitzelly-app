import { LayoutDashboard, Calendar, CreditCard, User, Activity, LogOut, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../landing/context/AuthContext';

export default function TrainerSidebar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [gymName] = useState('FITZELLY');
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
    }, [user]);

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/trainer/dashboard' },
        { icon: Calendar, label: 'Attendance', path: '/trainer/attendance' },
        { icon: CreditCard, label: 'Payments', path: '/trainer/payments' },
        { icon: User, label: 'Profile', path: '/trainer/profile' },
    ];

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            navigate('/');
        }
    };

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <>
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 fixed top-0 left-0 right-0 z-50">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-slate-900">{gymName}</span>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">Trainer Dashboard</span>
                </div>
                <button onClick={toggleMobileMenu} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Container */}
            <aside className={`
                fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                md:top-0 md:relative pt-16 md:pt-0
            `}>
                <div className="h-full flex flex-col">
                    {/* Logo (Desktop) - Fixed at top */}
                    <div
                        className="hidden md:flex flex-col gap-1 p-6 border-b border-slate-100 flex-shrink-0 cursor-pointer hover:bg-slate-50 transition-colors"
                        onClick={() => navigate('/landing')}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#00ffd5] rounded-xl flex items-center justify-center shadow-sm">
                                <Activity className="text-slate-900 w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="font-bold text-xl text-slate-900 leading-none">{gymName}</h1>
                            </div>
                        </div>
                        <div className="text-xs text-slate-500 mt-1 pl-1">Trainer Dashboard</div>
                    </div>

                    {/* Menu Items */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => `
                                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                                    ${isActive
                                        ? 'bg-[#00ffd5] text-slate-900 font-semibold shadow-[0_2px_12px_rgba(0,255,213,0.3)]'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                    }
                                `}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {({ isActive }) => (
                                    <>
                                        <item.icon size={20} className={isActive ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'} />
                                        <span className="text-sm">{item.label}</span>
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Logout */}
                    <div className="p-4 border-t border-slate-100 flex-shrink-0">
                        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                            <LogOut size={20} />
                            <span className="text-sm font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-slate-900/50 z-30 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            )}
        </>
    );
}
