import {
    LayoutDashboard, User, Users, CreditCard, Calendar,
    Settings, LogOut, Bell, FileText, Briefcase,
    DollarSign, Activity, FileDigit, ShieldCheck,
    Menu, X
} from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/gym/dashboard' },
        { icon: FileText, label: 'Gym Details', path: '/gym/details' },
        { icon: FileDigit, label: 'Plans', path: '/gym/plans' },
        { icon: Users, label: 'Clients', path: '/gym/clients' },
        { icon: ShieldCheck, label: 'Active Memberships', path: '/gym/memberships' },
        { icon: User, label: 'Trainers', path: '/gym/trainers' },
        { icon: Briefcase, label: 'Trainer Subscription', path: '/gym/trainer-sub' },
        { icon: DollarSign, label: 'Trainer Salary', path: '/gym/salary' },
        { icon: Calendar, label: 'Attendance', path: '/gym/attendance' },
        { icon: User, label: 'Enquiries', path: '/gym/enquiries' },
        { icon: CreditCard, label: 'Client Payments', path: '/gym/payments' },
        { icon: DollarSign, label: 'Expenses', path: '/gym/expenses' },
        { icon: Activity, label: 'Revenue Analysis', path: '/gym/revenue' },
        { icon: Bell, label: 'Notifications', path: '/gym/notifications' },
        { icon: Settings, label: 'Settings', path: '/gym/settings' },
    ];

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
            <aside className={`
                fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                md:top-0 md:relative pt-16 md:pt-0
            `}>
                <div className="h-full flex flex-col overflow-y-auto custom-scrollbar">
                    {/* Logo (Desktop) */}
                    <div className="hidden md:flex items-center gap-3 p-6 border-b border-slate-100">
                        <div className="w-10 h-10 bg-[#00ffd5] rounded-xl flex items-center justify-center shadow-sm">
                            <Activity className="text-slate-900 w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="font-bold text-xl text-slate-900 leading-none">FITZELLY</h1>
                            <span className="text-xs text-slate-500 font-medium">Gym Dashboard</span>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <nav className="flex-1 px-4 py-6 space-y-1">
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

                    {/* Logout Section */}
                    <div className="p-4 border-t border-slate-100">
                        <button
                            onClick={() => {
                                localStorage.removeItem('token');
                                localStorage.removeItem('user');
                                window.location.href = '/';
                            }}
                            className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        >
                            <LogOut size={20} />
                            <span className="text-sm font-medium">Logout</span>
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
