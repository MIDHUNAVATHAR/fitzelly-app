import {
    LayoutDashboard, User, Users, CreditCard, Calendar,
    Settings, LogOut, Bell, FileText,
    IndianRupee, Activity, FileDigit, ShieldCheck,
    Menu, X, Dumbbell, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../landing/context/AuthContext';

export default function Sidebar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/gym/dashboard' },
        { icon: FileText, label: 'Gym Details', path: '/gym/details' },
        { icon: FileDigit, label: 'Plans', path: '/gym/plans' },
        { icon: Users, label: 'Clients', path: '/gym/clients' },
        { icon: ShieldCheck, label: 'Active Memberships', path: '/gym/memberships' },
        { icon: User, label: 'Trainers', path: '/gym/trainers' },
        { icon: Dumbbell, label: 'Equipment Slot', path: '/gym/equipment' },

        { icon: IndianRupee, label: 'Trainer Salary', path: '/gym/salary' },
        { icon: Calendar, label: 'Attendance', path: '/gym/attendance' },
        { icon: User, label: 'Enquiries', path: '/gym/enquiries' },
        { icon: CreditCard, label: 'Client Payments', path: '/gym/payments' },
        { icon: IndianRupee, label: 'Expenses', path: '/gym/expenses' },
        { icon: Activity, label: 'Revenue Analysis', path: '/gym/revenue' },
        { icon: Bell, label: 'Notifications', path: '/gym/notifications' },
        { icon: Settings, label: 'Settings', path: '/gym/settings' },
    ];

    const handleLogout = async () => {
        try {
            await logout(); // Use context logout
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
            // Still navigate even if logout fails
            navigate('/');
        }
    };

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <>
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 fixed top-0 left-0 right-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#00ffd5] rounded-lg flex items-center justify-center">
                        <Activity className="text-slate-900 w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg text-slate-900">FITZELLY</span>
                </div>
                <button onClick={toggleMobileMenu} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Container */}
            <aside
                className={`
                    fixed top-0 left-0 z-40 h-screen bg-white border-r border-slate-200 transition-all duration-300 ease-in-out
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                    md:top-0 md:relative pt-16 md:pt-0
                    ${isCollapsed ? 'w-20' : 'w-64'}
                `}
            >
                <div className="h-full flex flex-col relative">
                    {/* Toggle Button */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden md:flex absolute -right-3 top-20 bg-white border border-slate-200 text-slate-500 hover:text-slate-900 rounded-full p-1 cursor-pointer hover:bg-slate-50 shadow-sm z-50"
                    >
                        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                    </button>

                    {/* Logo (Desktop) - Fixed at top */}
                    <div
                        className={`hidden md:flex items-center gap-3 p-6 border-b border-slate-100 flex-shrink-0 cursor-pointer hover:bg-slate-50 transition-colors ${isCollapsed ? 'justify-center px-2' : ''}`}
                        onClick={() => navigate('/landing')}
                    >
                        <div className="w-10 h-10 bg-[#00ffd5] rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                            <Activity className="text-slate-900 w-6 h-6" />
                        </div>
                        <div className={`overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100 block'}`}>
                            <h1 className="font-bold text-xl text-slate-900 leading-none">FITZELLY</h1>
                            <span className="text-xs text-slate-500 font-medium">Gym Dashboard</span>
                        </div>
                    </div>

                    {/* Menu Items - Scrollable */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar overflow-x-hidden">
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
                                    ${isCollapsed ? 'justify-center px-2' : ''}
                                `}
                                onClick={() => setIsMobileMenuOpen(false)}
                                title={isCollapsed ? item.label : ''}
                            >
                                {({ isActive }) => (
                                    <>
                                        <item.icon size={20} className={`flex-shrink-0 ${isActive ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`} />
                                        <span className={`text-sm whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100 block'}`}>{item.label}</span>
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Logout Section - Fixed at bottom */}
                    <div className="p-4 border-t border-slate-100 flex-shrink-0">
                        <button
                            onClick={handleLogout}
                            className={`flex items-center gap-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-50 rounded-xl transition-colors ${isCollapsed ? 'justify-center px-2' : ''}`}
                            title={isCollapsed ? "Logout" : ""}
                        >
                            <LogOut size={20} className="flex-shrink-0" />
                            <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100 block'}`}>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Backdrop for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-30 md:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </>
    );
}
