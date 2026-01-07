import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Building2,
    CreditCard,
    DollarSign,
    Dumbbell,
    BarChart3,
    Users,
    Settings,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { useAuth } from '../../landing/context/AuthContext';

export default function SuperAdminSidebar() {
    const { logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const linkClass = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive
            ? 'bg-[#00ffd5] text-slate-900 shadow-[0_4px_14px_0_rgba(0,255,213,0.39)]'
            : 'text-slate-400 hover:text-white hover:bg-slate-800'
        }`;

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={toggleMobileMenu}
                className="lg:hidden fixed top-4 right-4 z-[60] p-2 bg-slate-900 text-white rounded-lg shadow-lg"
            >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar Overlay for Mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 z-50 h-screen w-72 bg-slate-900 text-white
                flex flex-col transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#00ffd5] to-teal-400 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,255,213,0.3)]">
                            <span className="text-slate-900 font-bold text-xl">F</span>
                        </div>
                        <div>
                            <h1 className="font-bold text-xl tracking-tight">FITZELLY</h1>
                            <p className="text-xs text-slate-400 font-medium">Super Admin</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
                    <div className="space-y-1">
                        <NavLink to="/fitzelly-hq" end className={linkClass} onClick={() => setIsMobileMenuOpen(false)}>
                            <LayoutDashboard size={20} />
                            <span>Dashboard</span>
                        </NavLink>
                        <NavLink to="/fitzelly-hq/gyms" className={linkClass} onClick={() => setIsMobileMenuOpen(false)}>
                            <Building2 size={20} />
                            <span>Gyms</span>
                        </NavLink>
                        <NavLink to="/fitzelly-hq/subscriptions" className={linkClass} onClick={() => setIsMobileMenuOpen(false)}>
                            <CreditCard size={20} />
                            <span>Subscriptions</span>
                        </NavLink>
                        <NavLink to="/fitzelly-hq/revenue" className={linkClass} onClick={() => setIsMobileMenuOpen(false)}>
                            <DollarSign size={20} />
                            <span>Revenue</span>
                        </NavLink>
                        <NavLink to="/fitzelly-hq/exercise-library" className={linkClass} onClick={() => setIsMobileMenuOpen(false)}>
                            <Dumbbell size={20} />
                            <span>Exercise Library</span>
                        </NavLink>
                        <NavLink to="/fitzelly-hq/analytics" className={linkClass} onClick={() => setIsMobileMenuOpen(false)}>
                            <BarChart3 size={20} />
                            <span>Platform Analytics</span>
                        </NavLink>
                        <NavLink to="/fitzelly-hq/admin-users" className={linkClass} onClick={() => setIsMobileMenuOpen(false)}>
                            <Users size={20} />
                            <span>Admin Users</span>
                        </NavLink>
                        <NavLink to="/fitzelly-hq/settings" className={linkClass} onClick={() => setIsMobileMenuOpen(false)}>
                            <Settings size={20} />
                            <span>Global Settings</span>
                        </NavLink>
                    </div>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-all font-medium group"
                    >
                        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Logout</span>
                    </button>
                    <div className="mt-4 text-center">
                        <p className="text-xs text-slate-600">v1.0.0 Super Admin</p>
                    </div>
                </div>
            </aside>
        </>
    );
}
