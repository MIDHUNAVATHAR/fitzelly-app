import TrainerDashboardLayout from "../layouts/TrainerDashboardLayout";
import { useAuth } from "../../auth/context/AuthContext";

export default function TrainerDashboard() {
    const { user } = useAuth();

    return (
        <TrainerDashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user?.name || 'Trainer'}!</h1>
                        <p className="text-slate-500">Track your daily attendance and payments.</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <div className="text-2xl font-bold text-slate-900">95%</div>
                        <div className="text-xs text-slate-500">Attendance Rate</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <div className="text-2xl font-bold text-slate-900">₹45,000</div>
                        <div className="text-xs text-slate-500">This Month's Salary</div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
                    <p className="text-slate-500">Select an option from the sidebar to manage your activities.</p>
                </div>
            </div>
        </TrainerDashboardLayout>
    );
}
