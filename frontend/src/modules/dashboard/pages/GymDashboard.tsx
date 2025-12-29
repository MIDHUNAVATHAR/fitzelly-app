import DashboardLayout from '../layouts/DashboardLayout';
import StatCard from '../components/StatCard';
import { Users, User, UserPlus, DollarSign, Calendar } from 'lucide-react';

export default function GymDashboard() {
    return (
        <DashboardLayout>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500 mt-1">Welcome back! Here's your gym overview.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <StatCard
                    title="Total Members"
                    value="245"
                    change="+12%"
                    trend="up"
                    icon={Users}
                    color="bg-cyan-50 text-cyan-600"
                />
                <StatCard
                    title="Total Trainers"
                    value="8"
                    change="+0%"
                    trend="neutral"
                    icon={User}
                    color="bg-teal-50 text-teal-600"
                />
                <StatCard
                    title="New Joiners"
                    value="18"
                    change="+25%"
                    trend="up"
                    icon={UserPlus}
                    color="bg-blue-50 text-blue-600"
                />
                <StatCard
                    title="Revenue This Month"
                    value="₹1,45,000"
                    change="+8%"
                    trend="up"
                    icon={DollarSign}
                    color="bg-emerald-50 text-emerald-600"
                />
                <StatCard
                    title="Today's Check-Ins"
                    value="67"
                    change="+5%"
                    trend="up"
                    icon={Calendar}
                    color="bg-violet-50 text-violet-600"
                />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Recent Activities */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-6">Recent Activities</h2>
                    <div className="space-y-6">
                        {[
                            { title: 'New member joined', desc: 'Rahul Sharma', time: '2 minutes ago' },
                            { title: 'Payment received', desc: 'Priya Patel', time: '15 minutes ago' },
                            { title: 'Trainer checked in', desc: 'Vikram Singh', time: '30 minutes ago' },
                            { title: 'Membership renewed', desc: 'Anita Desai', time: '1 hour ago' },
                            { title: 'New enquiry', desc: 'Karan Mehta', time: '2 hours ago' },
                        ].map((item, index) => (
                            <div key={index} className="flex justify-between items-start group hover:bg-slate-50 p-2 rounded-lg transition-colors -mx-2">
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                                    <p className="text-sm text-slate-500 mt-0.5">{item.desc}</p>
                                </div>
                                <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-full group-hover:bg-white transition-colors">{item.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Expiries */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-6">Upcoming Membership Expiries</h2>
                    <div className="space-y-6">
                        {[
                            { name: 'Amit Kumar', plan: 'Monthly Premium', date: 'Dec 12, 2024' },
                            { name: 'Sneha Reddy', plan: 'Quarterly Cardio', date: 'Dec 15, 2024' },
                            { name: 'Rajesh Verma', plan: '20-Day Plan', date: 'Dec 18, 2024' },
                        ].map((item, index) => (
                            <div key={index} className="flex justify-between items-center group hover:bg-slate-50 p-3 rounded-xl border border-transparent hover:border-slate-100 transition-all">
                                <div>
                                    <p className="text-sm font-bold text-slate-800">{item.name}</p>
                                    <p className="text-xs text-slate-500 mt-1">{item.plan}</p>
                                </div>
                                <span className="text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
                                    {item.date}
                                </span>
                            </div>
                        ))}
                        {/* Empty State / Placeholder for more lines */}
                        <div className="h-24 flex items-center justify-center text-slate-400 text-sm italic">
                            No more upcoming expiries
                        </div>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
}
