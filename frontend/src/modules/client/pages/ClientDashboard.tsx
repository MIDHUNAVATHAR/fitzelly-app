import ClientDashboardLayout from "../layouts/ClientDashboardLayout";
import { Check, Activity } from "lucide-react";

export default function ClientDashboard() {
    // Helper data for Today's Workout
    const workoutExercises = [
        { name: "Bench Press", sets: "4x12", completed: false },
        { name: "Incline Dumbbell Press", sets: "3x10", completed: true },
        { name: "Cable Flyes", sets: "3x15", completed: false },
        { name: "Tricep Pushdowns", sets: "4x12", completed: false },
        { name: "Overhead Tricep Extension", sets: "3x10", completed: false },
    ];

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

                {/* Banner */}
                <div className="bg-[#00ffd5] p-6 md:p-8 rounded-3xl shadow-lg shadow-[#00ffd5]/20 text-slate-900 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-700" />

                    <div className="relative z-10">
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-3 py-1 bg-slate-900/10 backdrop-blur-sm text-slate-900 text-xs font-semibold rounded-full border border-slate-900/10">Active</span>
                            <span className="px-3 py-1 bg-white/30 backdrop-blur-sm text-slate-900 text-xs font-medium rounded-full">Premium Plan</span>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold mb-2">18 Days Remaining</h2>
                                <p className="text-slate-900/70 font-medium">Expires on Dec 29, 2025</p>
                            </div>

                            <button className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-sm whitespace-nowrap">
                                Renew Membership
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:border-[#00ffd5]/50 transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-[#00ffd5]/10 transition-colors">
                                <span className="text-xl">📅</span>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-slate-900">24</div>
                                <div className="text-xs text-slate-500 font-medium">Days Active</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:border-[#00ffd5]/50 transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-[#00ffd5]/10 transition-colors">
                                <span className="text-xl">💪</span>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-slate-900">156</div>
                                <div className="text-xs text-slate-500 font-medium">Workouts Done</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:border-[#00ffd5]/50 transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-[#00ffd5]/10 transition-colors">
                                <span className="text-xl">⏱️</span>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-slate-900">48h</div>
                                <div className="text-xs text-slate-500 font-medium">Total Hours</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:border-[#00ffd5]/50 transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-[#00ffd5]/10 transition-colors">
                                <span className="text-xl">📈</span>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-slate-900">22.4</div>
                                <div className="text-xs text-slate-500 font-medium">Current BMI</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Workout & BMI */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Today's Workout (Span 2) */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-slate-900">Today's Workout</h2>
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg border border-slate-200">Chest & Triceps</span>
                        </div>

                        <div className="space-y-3">
                            {workoutExercises.map((exercise, index) => (
                                <div key={index} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-xl transition-all cursor-pointer group border border-transparent hover:border-slate-100">
                                    <div className={`
                                        w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors
                                        ${exercise.completed ? 'bg-[#00ffd5] border-[#00ffd5]' : 'border-slate-300 group-hover:border-[#00ffd5]'}
                                    `}>
                                        {exercise.completed && <Check size={14} className="text-slate-900 stroke-[3]" />}
                                    </div>
                                    <div>
                                        <h3 className={`font-semibold transition-colors ${exercise.completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{exercise.name}</h3>
                                        <p className="text-xs text-slate-500 font-medium mt-0.5">{exercise.sets}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8">
                            <button className="w-full bg-[#00ffd5] text-slate-900 font-bold py-4 rounded-xl hover:bg-[#00ffd5]/90 transition-all hover:shadow-[0_4px_20px_rgba(0,255,213,0.3)] hover:-translate-y-0.5 active:translate-y-0">
                                Start Workout
                            </button>
                        </div>
                    </div>

                    {/* Right Column: BMI Snapshot (Span 1) */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 mb-6">BMI Snapshot</h2>
                                <div className="mb-2">
                                    <span className="text-5xl font-bold text-[#00ffd5] tracking-tight">22.4</span>
                                </div>
                                <div className="mb-8">
                                    <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg">Normal Weight</span>
                                </div>

                                <div className="text-xs text-slate-400 font-medium mb-6">
                                    Last updated: 2 days ago <br /> Next check: Dec 15
                                </div>
                            </div>

                            {/* Simple Visual for Graph */}
                            <div className="h-40 bg-slate-50/50 rounded-xl flex items-end justify-between p-4 px-6 border border-slate-100/50">
                                <div className="w-2 h-10 bg-slate-200 rounded-t-full opacity-50"></div>
                                <div className="w-2 h-14 bg-slate-200 rounded-t-full opacity-50"></div>
                                <div className="w-2 h-12 bg-slate-200 rounded-t-full opacity-50"></div>
                                <div className="w-2 h-16 bg-slate-200 rounded-t-full opacity-50"></div>
                                <div className="w-2 h-14 bg-slate-200 rounded-t-full opacity-50"></div>
                                <div className="w-2 h-24 bg-[#00ffd5] rounded-t-full shadow-[0_0_15px_rgba(0,255,213,0.4)] relative group cursor-pointer transition-all hover:h-28">
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        You are here
                                    </div>
                                    <Activity size={12} className="absolute bottom-2 left-1/2 -translate-x-1/2 text-slate-900/50" />
                                </div>
                                <div className="w-2 h-18 bg-slate-200 rounded-t-full opacity-50"></div>
                            </div>

                            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                                <span className="text-sm font-semibold text-slate-700">View History</span>
                                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                                    ↗
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ClientDashboardLayout>
    );
}
