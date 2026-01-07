import DashboardLayout from '../layouts/DashboardLayout';
import { Users, User, UserPlus, DollarSign, Calendar, TrendingUp, Clock, AlertCircle } from 'lucide-react';

export default function GymDashboard() {
    return (
        <DashboardLayout>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500 mt-1">Welcome back! Here's your gym overview.</p>
            </div>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                <PremiumStatCard
                    title="Total Members"
                    value="245"
                    change="+12%"
                    trend="up"
                    icon={Users}
                    gradient="from-cyan-500 to-blue-500"
                    iconColor="text-white"
                />
                <PremiumStatCard
                    title="Active Trainers"
                    value="8"
                    change="Stable"
                    trend="neutral"
                    icon={User}
                    gradient="from-violet-500 to-purple-500"
                    iconColor="text-white"
                />
                <PremiumStatCard
                    title="New Joiners"
                    value="18"
                    change="+25%"
                    trend="up"
                    icon={UserPlus}
                    gradient="from-emerald-400 to-emerald-600"
                    iconColor="text-white"
                />
                <PremiumStatCard
                    title="Revenue"
                    value="₹1.45L"
                    change="+8%"
                    trend="up"
                    icon={DollarSign}
                    gradient="from-amber-400 to-orange-500"
                    iconColor="text-white"
                />
                <PremiumStatCard
                    title="Check-Ins"
                    value="67"
                    change="+5%"
                    trend="up"
                    icon={Calendar}
                    gradient="from-pink-500 to-rose-500"
                    iconColor="text-white"
                />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Recent Activities */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-6 md:p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Clock size={20} className="text-slate-400" />
                            Recent Activities
                        </h2>
                        <button className="text-sm font-semibold text-[#00ffd5] hover:text-[#00e6c0] transition-colors">View All</button>
                    </div>
                    <div className="space-y-6">
                        {[
                            { title: 'New member joined', desc: 'Rahul Sharma', time: '2 mins ago', type: 'join' },
                            { title: 'Payment received', desc: 'Priya Patel - ₹3,000', time: '15 mins ago', type: 'pay' },
                            { title: 'Trainer checked in', desc: 'Vikram Singh', time: '30 mins ago', type: 'checkin' },
                            { title: 'Membership renewed', desc: 'Anita Desai', time: '1 hour ago', type: 'renew' },
                            { title: 'New enquiry', desc: 'Karan Mehta', time: '2 hours ago', type: 'enquiry' },
                        ].map((item, index) => (
                            <div key={index} className="flex justify-between items-start group hover:bg-slate-50 p-4 rounded-xl transition-all border border-transparent hover:border-slate-100 cursor-default">
                                <div className="flex items-start gap-4">
                                    <div className={`
                                        w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm
                                        ${item.type === 'join' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' :
                                            item.type === 'pay' ? 'bg-gradient-to-br from-amber-400 to-orange-500' :
                                                item.type === 'checkin' ? 'bg-gradient-to-br from-blue-400 to-blue-600' :
                                                    'bg-gradient-to-br from-slate-400 to-slate-600'}
                                     `}>
                                        {item.title.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800 group-hover:text-slate-900">{item.title}</p>
                                        <p className="text-sm text-slate-500 mt-0.5">{item.desc}</p>
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100 group-hover:bg-white transition-colors">{item.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Expiries */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-6 md:p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <AlertCircle size={20} className="text-slate-400" />
                            Expiring Soon
                        </h2>
                        <button className="text-sm font-semibold text-[#00ffd5] hover:text-[#00e6c0] transition-colors">View All</button>
                    </div>
                    <div className="space-y-4">
                        {[
                            { name: 'Amit Kumar', plan: 'Monthly Premium', date: 'Dec 12', days: 2 },
                            { name: 'Sneha Reddy', plan: 'Quarterly Cardio', date: 'Dec 15', days: 5 },
                            { name: 'Rajesh Verma', plan: '20-Day Plan', date: 'Dec 18', days: 8 },
                            { name: 'Pooja Singh', plan: 'Yearly Gold', date: 'Dec 20', days: 10 },
                        ].map((item, index) => (
                            <div key={index} className="flex justify-between items-center group hover:bg-slate-50 p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-all shadow-sm hover:shadow-md bg-slate-50/50">
                                <div>
                                    <p className="text-sm font-bold text-slate-800">{item.name}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{item.plan}</p>
                                </div>
                                <div className="text-right">
                                    <span className="block text-xs font-bold text-slate-700 bg-red-100 text-red-600 px-2 py-1 rounded-lg">
                                        {item.days} days left
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 text-sm font-semibold hover:border-[#00ffd5] hover:text-slate-800 transition-all">
                        Send Reminders to All
                    </button>
                </div>

            </div>
        </DashboardLayout>
    );
}

function PremiumStatCard({ title, value, change, trend, icon: Icon, gradient, iconColor }: any) {
    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_25px_rgba(0,0,0,0.06)] transition-all group relative overflow-hidden">
            {/* Background decorative blob */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}></div>

            <div className="flex items-start justify-between mb-4 relative z-10">
                <div>
                    <p className="text-slate-500 text-sm font-medium">{title}</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg shadow-${gradient.split(' ')[1]}/30`}>
                    <Icon size={20} className={iconColor} />
                </div>
            </div>

            <div className="flex items-center gap-1.5 relative z-10">
                <div className={`
                    flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full
                    ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}
                `}>
                    {trend === 'up' && <TrendingUp size={12} />}
                    {change}
                </div>
                <span className="text-xs text-slate-400 font-medium">vs last month</span>
            </div>
        </div>
    );
}
