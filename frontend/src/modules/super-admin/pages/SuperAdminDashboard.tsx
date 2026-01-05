import SuperAdminDashboardLayout from "../layouts/SuperAdminDashboardLayout";
import { useAuth } from "../../auth/context/AuthContext";
import { Building2, CheckCircle, XCircle, DollarSign, Users, AlertTriangle, TrendingUp } from 'lucide-react';

export default function SuperAdminDashboard() {
    const { user } = useAuth();

    return (
        <SuperAdminDashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                        <p className="text-slate-500">Welcome back, {user?.name || 'Super Admin'}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-sm font-medium text-slate-600">System Healthy</span>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total Gyms */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="text-slate-500 text-sm font-medium">Total Gyms</div>
                                <div className="text-2xl font-bold text-slate-900 mt-1">180</div>
                            </div>
                            <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
                                <Building2 size={20} />
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-teal-600 text-xs font-semibold">
                            <TrendingUp size={14} />
                            <span>+12% vs last month</span>
                        </div>
                    </div>

                    {/* Active Gyms */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="text-slate-500 text-sm font-medium">Active Gyms</div>
                                <div className="text-2xl font-bold text-slate-900 mt-1">156</div>
                            </div>
                            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                <CheckCircle size={20} />
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-green-600 text-xs font-semibold">
                            <TrendingUp size={14} />
                            <span>+8% vs last month</span>
                        </div>
                    </div>

                    {/* Expired Gyms */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="text-slate-500 text-sm font-medium">Expired Gyms</div>
                                <div className="text-2xl font-bold text-slate-900 mt-1">24</div>
                            </div>
                            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                                <XCircle size={20} />
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-amber-600 text-xs font-semibold">
                            <span>3% vs last month</span>
                        </div>
                    </div>

                    {/* Monthly Revenue */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="text-slate-500 text-sm font-medium">Monthly Revenue</div>
                                <div className="text-2xl font-bold text-slate-900 mt-1">₹7,20,000</div>
                            </div>
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                <DollarSign size={20} />
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                            <TrendingUp size={14} />
                            <span>+15% vs last month</span>
                        </div>
                    </div>
                </div>

                {/* Second Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* New Gyms */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                        <div>
                            <div className="text-slate-500 text-sm font-medium">New Gyms This Month</div>
                            <div className="text-2xl font-bold text-slate-900 mt-1 text-[#00ffd5]">32</div>
                        </div>
                        <div className="p-2 bg-slate-50 rounded-lg">
                            <TrendingUp size={20} className="text-[#00ffd5]" />
                        </div>
                    </div>
                    {/* Total Clients */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                        <div>
                            <div className="text-slate-500 text-sm font-medium">Total Clients</div>
                            <div className="text-2xl font-bold text-slate-900 mt-1">12,450</div>
                        </div>
                        <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                            <Users size={20} />
                        </div>
                    </div>
                    {/* Total Trainers */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                        <div>
                            <div className="text-slate-500 text-sm font-medium">Total Trainers</div>
                            <div className="text-2xl font-bold text-slate-900 mt-1">890</div>
                        </div>
                        <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                            <Users size={20} />
                        </div>
                    </div>
                    {/* Expiring Soon */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                        <div>
                            <div className="text-slate-500 text-sm font-medium">Expiring Soon</div>
                            <div className="text-2xl font-bold text-slate-900 mt-1 text-amber-500">18</div>
                        </div>
                        <div className="p-2 bg-amber-50 rounded-lg text-amber-500">
                            <AlertTriangle size={20} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-80 flex items-center justify-center text-slate-400">
                        Monthly Revenue Chart Placeholder
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-80 flex items-center justify-center text-slate-400">
                        Gym Growth Chart Placeholder
                    </div>
                </div>

            </div>
        </SuperAdminDashboardLayout>
    );
}
