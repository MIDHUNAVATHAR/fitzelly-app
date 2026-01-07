import ClientDashboardLayout from "../layouts/ClientDashboardLayout";

export default function ClientDashboard() {
    // We can fetch client-specific stats here

    return (
        <ClientDashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Welcome back, John!</h1>
                        <p className="text-slate-500">Here's your fitness overview for today</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Active Premium Plan</h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-3xl font-bold text-[#00ffd5]">18 Days Remaining</span>
                            <p className="text-sm text-slate-500 mt-1">Expires on Dec 29, 2025</p>
                        </div>
                        <button className="px-4 py-2 border border-[#00ffd5] text-slate-900 rounded-lg font-medium hover:bg-[#00ffd5]/10">
                            Renew Membership
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <div className="text-2xl font-bold text-slate-900">24</div>
                        <div className="text-xs text-slate-500">Days Active</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <div className="text-2xl font-bold text-slate-900">156</div>
                        <div className="text-xs text-slate-500">Workouts Done</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <div className="text-2xl font-bold text-slate-900">48h</div>
                        <div className="text-xs text-slate-500">Total Hours</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <div className="text-2xl font-bold text-slate-900">22.4</div>
                        <div className="text-xs text-slate-500">Current BMI</div>
                    </div>
                </div>
            </div>
        </ClientDashboardLayout>
    );
}
