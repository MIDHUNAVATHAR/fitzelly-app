import ClientDashboardLayout from "../layouts/ClientDashboardLayout";
import { useMyWorkoutPlan } from "../hooks/useMyWorkoutPlan";
import { Loader2, Dumbbell, Clock } from "lucide-react";
import { type DayPlan } from "../../trainer/services/TrainerClientsService";

export default function ClientWorkoutPlan() {
    const { data: plan, isLoading } = useMyWorkoutPlan();

    if (isLoading) {
        return (
            <ClientDashboardLayout>
                <div className="flex items-center justify-center h-[60vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-[#00ffd5]" />
                </div>
            </ClientDashboardLayout>
        );
    }

    if (!plan) {
        return (
            <ClientDashboardLayout>
                <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
                    <Dumbbell className="w-12 h-12 mb-4 text-slate-300" />
                    <p>No workout plan assigned yet.</p>
                </div>
            </ClientDashboardLayout>
        );
    }

    // Sort days starting from Monday
    const DAYS_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    // Sort weekly plan based on DAYS_ORDER
    const sortedPlan = [...plan.weeklyPlan].sort((a, b) => {
        return DAYS_ORDER.indexOf(a.day) - DAYS_ORDER.indexOf(b.day);
    });

    return (
        <ClientDashboardLayout>
            <div className="space-y-6">
                {/* Header / Banner */}
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6  flex items-center gap-4 shadow-sm">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-lg">
                        {plan.clientName ? plan.clientName[0].toUpperCase() : 'T'}
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            Assigned by Trainer {plan.clientName ? plan.clientName : 'Your Trainer'}
                        </h2>
                        <p className="text-sm text-slate-500">
                            Last updated: {new Date(plan.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {sortedPlan.map((dayPlan) => (
                        <DayCard key={dayPlan.day} dayPlan={dayPlan} />
                    ))}
                </div>
            </div>
        </ClientDashboardLayout>
    )
}

function DayCard({ dayPlan }: { dayPlan: DayPlan }) {
    if (dayPlan.isRestDay) {
        return (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 min-h-[200px] flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all">
                <h3 className="font-bold text-slate-900 mb-2">{dayPlan.day}</h3>
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 text-slate-400 mb-2">
                    <Clock size={24} />
                </span>
                <p className="text-slate-500 font-medium">Rest Day</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 min-h-[200px] shadow-sm hover:shadow-md transition-all">
            <h3 className="font-bold text-slate-900 mb-4 pb-3 border-b border-slate-50 flex items-center justify-between">
                {dayPlan.day}
                <span className="text-xs font-normal text-slate-400 bg-slate-50 px-2 py-1 rounded-full">
                    {dayPlan.exercises.length} Exercises
                </span>
            </h3>

            <div className="space-y-4">
                {dayPlan.exercises.length > 0 ? (
                    dayPlan.exercises.map((exercise, index) => (
                        <div key={index} className="group">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="font-bold text-slate-800 text-sm group-hover:text-[#00ffd5] transition-colors">{exercise.name}</p>
                                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                                        <span className="bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">{exercise.sets}x{exercise.reps}</span>
                                        <span className="text-slate-400">•</span>
                                        <span>Rest: {exercise.rest}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-6 text-slate-400 text-sm italic">
                        No specific exercises assigned.
                    </div>
                )}
            </div>
        </div>
    );
}
