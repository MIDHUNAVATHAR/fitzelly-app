import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string;
    change: string;
    icon: LucideIcon;
    trend: 'up' | 'down' | 'neutral';
    color: string;
}

export default function StatCard({ title, value, change, icon: Icon, trend, color }: StatCardProps) {
    return (
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">{title}</h3>
                    <p className="text-2xl font-bold text-slate-900">{value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                    <Icon size={20} className="opacity-80" />
                </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium">
                <span className={`${trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-red-500' : 'text-slate-400'}`}>
                    {change}
                </span>
                <span className="text-slate-400">from last month</span>
            </div>
        </div>
    );
}
