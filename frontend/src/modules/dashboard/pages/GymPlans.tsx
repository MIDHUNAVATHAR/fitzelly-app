import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '../layouts/DashboardLayout';
import { Tag, Calendar, Plus, Edit2, Trash2, X, CheckCircle, AlertTriangle } from 'lucide-react';
import { PlanService } from '../services/PlanService';
import type { Plan } from '../services/PlanService';

export default function GymPlans() {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<'category' | 'day'>('category');

    // Query for Plans
    const { data: plans = [], isLoading: loading } = useQuery({
        queryKey: ['plans'],
        queryFn: PlanService.getPlans
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

    // Toast State
    const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: '', show: false });

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [planToDelete, setPlanToDelete] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<Plan>>({
        planName: '',
        monthlyFee: 0,
        description: '',
        durationInDays: 0
    });

    // Mutations
    const createMutation = useMutation({
        mutationFn: PlanService.createPlan,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['plans'] });
            showToastMessage("Plan added successfully");
            handleCloseModal();
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Plan }) => PlanService.updatePlan(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['plans'] });
            showToastMessage("Plan updated successfully");
            handleCloseModal();
        }
    });

    const deleteMutation = useMutation({
        mutationFn: PlanService.deletePlan,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['plans'] });
            showToastMessage("Plan deleted successfully");
            setIsDeleteModalOpen(false);
            setPlanToDelete(null);
        }
    });

    const showToastMessage = (message: string) => {
        setToast({ message, show: true });
        setTimeout(() => setToast({ message: '', show: false }), 3000);
    };

    const handleOpenModal = (plan?: Plan) => {
        if (plan) {
            setEditingPlan(plan);
            setFormData({
                planName: plan.planName,
                monthlyFee: plan.monthlyFee,
                description: plan.description || '',
                durationInDays: plan.durationInDays || 0
            });
        } else {
            setEditingPlan(null);
            setFormData({
                planName: '',
                monthlyFee: 0,
                description: '',
                durationInDays: 0
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingPlan(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload: Plan = {
            ...formData as Plan,
            type: activeTab,
            monthlyFee: Number(formData.monthlyFee),
            durationInDays: activeTab === 'day' ? Number(formData.durationInDays) : undefined
        };

        if (editingPlan && editingPlan.id) {
            updateMutation.mutate({ id: editingPlan.id, payload });
        } else {
            createMutation.mutate(payload);
        }
    };

    const handleDeleteClick = (id: string) => {
        setPlanToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (planToDelete) {
            deleteMutation.mutate(planToDelete);
        }
    };



    const filteredPlans = plans.filter(p => p.type === activeTab);

    return (
        <DashboardLayout>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Plans</h1>
                    <p className="text-slate-500 mt-1">Create and manage membership plans</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#00ffd5] hover:bg-[#00e6c0] text-slate-900 rounded-xl font-bold transition-all shadow-[0_4px_14px_0_rgba(0,255,213,0.39)]"
                >
                    <Plus size={20} />
                    Add {activeTab === 'category' ? 'Category' : 'Day-Based'} Plan
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 bg-slate-100 p-1.5 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab('category')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'category'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-900'
                        }`}
                >
                    <Tag size={18} />
                    Category-Based Plans
                </button>
                <button
                    onClick={() => setActiveTab('day')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'day'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-900'
                        }`}
                >
                    <Calendar size={18} />
                    Day-Based Plans
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Plan Name</th>
                                {activeTab === 'day' && (
                                    <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Days</th>
                                )}
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Amount</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Description</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading...</td>
                                </tr>
                            ) : filteredPlans.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No {activeTab} plans found.</td>
                                </tr>
                            ) : (
                                filteredPlans.map(plan => (
                                    <tr key={plan.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">{plan.planName}</td>
                                        {activeTab === 'day' && (
                                            <td className="px-6 py-4 text-slate-600">{plan.durationInDays}</td>
                                        )}
                                        <td className="px-6 py-4 text-slate-900 font-semibold">₹{plan.monthlyFee.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-slate-500 max-w-xs truncate">{plan.description || '-'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(plan)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(plan.id!)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleCloseModal} />
                    <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900">
                                {editingPlan ? 'Edit' : 'Add'} {activeTab === 'category' ? 'Category' : 'Day-Based'} Plan
                            </h2>
                            <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Plan Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.planName}
                                    onChange={e => setFormData({ ...formData, planName: e.target.value })}
                                    placeholder={activeTab === 'category' ? "e.g. Cardio Premium" : "e.g. 15-Day Flex"}
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ffd5] focus:border-transparent transition-all"
                                    autoFocus
                                />
                            </div>

                            {activeTab === 'day' && (
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Number of Days</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={formData.durationInDays || ''}
                                        onChange={e => setFormData({ ...formData, durationInDays: Number(e.target.value) })}
                                        placeholder="e.g. 15"
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ffd5] focus:border-transparent transition-all"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Amount (₹)</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={formData.monthlyFee || ''}
                                    onChange={e => setFormData({ ...formData, monthlyFee: Number(e.target.value) })}
                                    placeholder="e.g. 2000"
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ffd5] focus:border-transparent transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                                <textarea
                                    rows={3}
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Brief description of the plan..."
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ffd5] focus:border-transparent transition-all resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#00ffd5] hover:bg-[#00e6c0] text-slate-900 font-bold py-3 rounded-xl transition-all shadow-md mt-2"
                            >
                                {editingPlan ? 'Update Plan' : 'Add Plan'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} />
                    <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                <AlertTriangle className="text-red-500" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Plan?</h3>
                            <p className="text-slate-500 mb-6">
                                Are you sure you want to delete this plan? This action cannot be undone.
                            </p>
                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-red-500/30"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast.show && (
                <div className="fixed bottom-8 right-8 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className="bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
                        <CheckCircle className="text-[#00ffd5]" size={20} />
                        <span className="font-medium text-sm">{toast.message}</span>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
