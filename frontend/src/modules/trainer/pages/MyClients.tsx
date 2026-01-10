import { useState, useMemo, useCallback, useEffect } from "react";
import TrainerDashboardLayout from "../layouts/TrainerDashboardLayout";
import { type AssignedClient, type DayPlan, type Exercise } from "../services/TrainerClientsService";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import { useDebounce } from "../../../hooks/useDebounce";
import {
    useAssignedClients,
    useWorkoutPlan,
    useCreateWorkoutPlan,
    useUpdateWorkoutPlan,
    useDeleteWorkoutPlan,
} from "../hooks/useTrainerClients";
import { SearchBar } from "../../../components/SearchBar";
import ClientListSection from "../../../components/ClientListSection";
import ClientDetailsModal from "../components/ClientDetailsModal";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function MyClients() {
    console.log('MyClients component rendered'); // Debug log

    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [searchInput, setSearchInput] = useState("");
    const debouncedSearch = useDebounce(searchInput, 500);

    // Fetch clients with React Query
    const { data, isLoading } = useAssignedClients(page, limit, debouncedSearch);

    // Memoize derived values
    const clients = useMemo(() => data?.clients || [], [data?.clients]);
    const total = useMemo(() => data?.total || 0, [data?.total]);
    const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);

    // Workout Plan Modal State
    const [showPlanModal, setShowPlanModal] = useState(false);
    const [selectedClient, setSelectedClient] = useState<AssignedClient | null>(null);

    // Fetch workout plan when modal opens
    const { data: currentPlan, isLoading: isLoadingPlan } = useWorkoutPlan(
        selectedClient?.id || '',
        showPlanModal && !!selectedClient?.hasWorkoutPlan
    );

    // Mutations
    const createPlanMutation = useCreateWorkoutPlan();
    const updatePlanMutation = useUpdateWorkoutPlan();
    const deletePlanMutation = useDeleteWorkoutPlan();

    // Workout Plan Form State
    const [weeklyPlan, setWeeklyPlan] = useState<DayPlan[]>(
        DAYS_OF_WEEK.map(day => ({
            day,
            exercises: [],
            isRestDay: day === "Sunday"
        }))
    );

    // Add Exercise Modal State
    const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
    const [selectedDay, setSelectedDay] = useState<string>("");
    const [newExercise, setNewExercise] = useState<Exercise>({
        name: "",
        sets: 3,
        reps: 10,
        rest: "60s"
    });

    // Client Details Modal State
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedDetailClientId, setSelectedDetailClientId] = useState<string | null>(null);

    // Update weekly plan when workout plan data is loaded
    useEffect(() => {
        if (currentPlan?.weeklyPlan) {
            setWeeklyPlan(currentPlan.weeklyPlan);
        }
    }, [currentPlan]);

    // Memoized callbacks - these will not change between re-renders
    const handleSearchChange = useCallback((value: string) => {
        console.log('Search changed:', value);
        setSearchInput(value);
        setPage(1);
    }, []);

    const handlePageChange = useCallback((newPage: number) => {
        console.log('Page changed:', newPage);
        setPage(newPage);
    }, []);

    const openPlanModal = useCallback((client: AssignedClient) => {
        console.log('Opening plan modal for:', client.fullName);
        setSelectedClient(client);
        setShowPlanModal(true);

        if (!client.hasWorkoutPlan) {
            setWeeklyPlan(DAYS_OF_WEEK.map(day => ({
                day,
                exercises: [],
                isRestDay: day === "Sunday"
            })));
        }
    }, []);

    const closePlanModal = useCallback(() => {
        setShowPlanModal(false);
        setSelectedClient(null);
        setWeeklyPlan(DAYS_OF_WEEK.map(day => ({
            day,
            exercises: [],
            isRestDay: day === "Sunday"
        })));
    }, []);

    const handleSavePlan = useCallback(async () => {
        if (!selectedClient) return;

        if (currentPlan) {
            await updatePlanMutation.mutateAsync({ planId: currentPlan.id, weeklyPlan });
        } else {
            await createPlanMutation.mutateAsync({ clientId: selectedClient.id, weeklyPlan });
        }
        closePlanModal();
    }, [selectedClient, currentPlan, weeklyPlan, updatePlanMutation, createPlanMutation, closePlanModal]);

    const handleDeletePlan = useCallback(async () => {
        if (!currentPlan || !window.confirm("Are you sure you want to delete this workout plan?")) return;

        await deletePlanMutation.mutateAsync(currentPlan.id);
        closePlanModal();
    }, [currentPlan, deletePlanMutation, closePlanModal]);

    const toggleRestDay = useCallback((day: string) => {
        setWeeklyPlan(prev => prev.map(d =>
            d.day === day ? { ...d, isRestDay: !d.isRestDay, exercises: !d.isRestDay ? [] : d.exercises } : d
        ));
    }, []);

    const handleViewClient = useCallback((clientId: string) => {
        setSelectedDetailClientId(clientId);
        setShowDetailsModal(true);
    }, []);

    const openAddExerciseModal = useCallback((day: string) => {
        setSelectedDay(day);
        setNewExercise({ name: "", sets: 3, reps: 10, rest: "60s" });
        setShowAddExerciseModal(true);
    }, []);

    const handleAddExercise = useCallback(() => {
        if (!newExercise.name.trim()) {
            return;
        }

        setWeeklyPlan(prev => prev.map(d =>
            d.day === selectedDay
                ? { ...d, exercises: [...d.exercises, newExercise] }
                : d
        ));
        setShowAddExerciseModal(false);
        setNewExercise({ name: "", sets: 3, reps: 10, rest: "60s" });
    }, [newExercise, selectedDay]);

    const handleRemoveExercise = useCallback((day: string, exerciseIndex: number) => {
        setWeeklyPlan(prev => prev.map(d =>
            d.day === day
                ? { ...d, exercises: d.exercises.filter((_, i) => i !== exerciseIndex) }
                : d
        ));
    }, []);

    const isSaving = createPlanMutation.isPending || updatePlanMutation.isPending;

    if (isLoading && clients.length === 0 && !searchInput) {
        return (
            <TrainerDashboardLayout>
                <div className="flex items-center justify-center h-[60vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-[#00ffd5]" />
                </div>
            </TrainerDashboardLayout>
        );
    }

    return (
        <TrainerDashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">My Clients</h1>
                        <p className="text-slate-500">Manage workout plans for your assigned clients</p>
                    </div>
                </div>

                {/* Search Bar - This component is memoized */}
                <SearchBar
                    value={searchInput}
                    onChange={handleSearchChange}
                    placeholder="Search clients by name..."
                />

                {/* Client List Section - This component will NOT re-render when search input changes */}
                <ClientListSection
                    clients={clients}
                    isLoading={isLoading}
                    searchQuery={debouncedSearch}
                    currentPage={page}
                    totalPages={totalPages}
                    total={total}
                    limit={limit}
                    onManagePlan={openPlanModal}
                    onViewClient={handleViewClient}
                    onPageChange={handlePageChange}
                />
            </div>

            {/* Workout Plan Modal */}
            {showPlanModal && selectedClient && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    {currentPlan ? "Edit" : "Create"} Workout Plan
                                </h2>
                                <p className="text-sm text-slate-500">{selectedClient.fullName}</p>
                            </div>
                            <button
                                onClick={closePlanModal}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {isLoadingPlan ? (
                            <div className="p-12 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 animate-spin text-[#00ffd5]" />
                            </div>
                        ) : (
                            <div className="p-6 space-y-6">
                                {/* Weekly Plan Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {weeklyPlan.map((dayPlan) => (
                                        <div
                                            key={dayPlan.day}
                                            className={`border-2 rounded-xl p-4 transition-all ${dayPlan.isRestDay
                                                ? "border-slate-200 bg-slate-50"
                                                : "border-[#00ffd5]/30 bg-white"
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="font-bold text-slate-900">{dayPlan.day}</h3>
                                                <button
                                                    onClick={() => !dayPlan.isRestDay && openAddExerciseModal(dayPlan.day)}
                                                    disabled={dayPlan.isRestDay}
                                                    className="p-1.5 hover:bg-[#00ffd5]/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <Plus size={16} className="text-[#00ffd5]" />
                                                </button>
                                            </div>

                                            <div className="mb-3">
                                                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={dayPlan.isRestDay}
                                                        onChange={() => toggleRestDay(dayPlan.day)}
                                                        className="rounded border-slate-300 text-[#00ffd5] focus:ring-[#00ffd5]"
                                                    />
                                                    Rest Day
                                                </label>
                                            </div>

                                            {dayPlan.isRestDay ? (
                                                <div className="text-center py-8 text-slate-400 text-sm">
                                                    Rest Day
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    {dayPlan.exercises.length === 0 ? (
                                                        <div className="text-center py-4 text-slate-400 text-sm">
                                                            No exercises
                                                        </div>
                                                    ) : (
                                                        dayPlan.exercises.map((exercise, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="bg-slate-50 rounded-lg p-3 group hover:bg-slate-100 transition-colors"
                                                            >
                                                                <div className="flex items-start justify-between gap-2">
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="font-medium text-sm text-slate-900 truncate">
                                                                            {exercise.name}
                                                                        </p>
                                                                        <p className="text-xs text-slate-500 mt-1">
                                                                            {exercise.sets}x{exercise.reps} • Rest: {exercise.rest}
                                                                        </p>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => handleRemoveExercise(dayPlan.day, idx)}
                                                                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all"
                                                                    >
                                                                        <Trash2 size={14} className="text-red-600" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                    {currentPlan && (
                                        <button
                                            onClick={handleDeletePlan}
                                            disabled={deletePlanMutation.isPending}
                                            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-all disabled:opacity-50"
                                        >
                                            {deletePlanMutation.isPending ? 'Deleting...' : 'Delete Plan'}
                                        </button>
                                    )}
                                    <div className="flex gap-3 ml-auto">
                                        <button
                                            onClick={closePlanModal}
                                            className="px-6 py-2.5 border border-slate-200 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSavePlan}
                                            disabled={isSaving}
                                            className="px-6 py-2.5 bg-[#00ffd5] text-slate-900 font-bold rounded-xl hover:bg-[#00ffd5]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {isSaving && <Loader2 size={16} className="animate-spin" />}
                                            {currentPlan ? "Update Plan" : "Create Plan"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showDetailsModal && selectedDetailClientId && (
                <ClientDetailsModal
                    clientId={selectedDetailClientId}
                    onClose={() => {
                        setShowDetailsModal(false);
                        setSelectedDetailClientId(null);
                    }}
                />
            )}

            {/* Add Exercise Modal */}
            {showAddExerciseModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-900">Add Exercise to {selectedDay}</h3>
                            <button
                                onClick={() => setShowAddExerciseModal(false)}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Exercise Name
                                </label>
                                <input
                                    type="text"
                                    value={newExercise.name}
                                    onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                                    placeholder="e.g., Bench Press"
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ffd5]/50 focus:border-[#00ffd5] transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Sets
                                    </label>
                                    <input
                                        type="number"
                                        value={newExercise.sets}
                                        onChange={(e) => setNewExercise({ ...newExercise, sets: parseInt(e.target.value) || 0 })}
                                        min="1"
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ffd5]/50 focus:border-[#00ffd5] transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Reps
                                    </label>
                                    <input
                                        type="number"
                                        value={newExercise.reps}
                                        onChange={(e) => setNewExercise({ ...newExercise, reps: parseInt(e.target.value) || 0 })}
                                        min="1"
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ffd5]/50 focus:border-[#00ffd5] transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Rest
                                    </label>
                                    <input
                                        type="text"
                                        value={newExercise.rest}
                                        onChange={(e) => setNewExercise({ ...newExercise, rest: e.target.value })}
                                        placeholder="60s"
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ffd5]/50 focus:border-[#00ffd5] transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleAddExercise}
                                className="w-full py-3 bg-[#00ffd5] text-slate-900 font-bold rounded-xl hover:bg-[#00ffd5]/90 transition-all flex items-center justify-center gap-2"
                            >
                                <Plus size={20} />
                                Add Exercise
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </TrainerDashboardLayout>
    );
}
