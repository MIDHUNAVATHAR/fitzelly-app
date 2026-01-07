import { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { Plus, Edit2, Trash2, X, Search, CheckCircle, AlertTriangle, Eye, Mail, Loader2 } from 'lucide-react';
import { TrainerService } from '../services/TrainerService';
import type { Trainer } from '../services/TrainerService';

export default function GymTrainers() {
    const [trainers, setTrainers] = useState<Trainer[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
    const [editingTrainer, setEditingTrainer] = useState<string | null>(null); // Keep for existing logic compatibility if needed, but better to replace with selectedTrainer
    const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);

    // Toast State
    const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: '', show: false });

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [trainerToDelete, setTrainerToDelete] = useState<string | null>(null);

    // Sending Email State
    const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<Trainer>>({
        fullName: '',
        email: '',
        phone: '',
        specialization: '',
        monthlySalary: 0,

    });

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        fetchTrainers();
    }, [page, debouncedSearch]);

    const fetchTrainers = async () => {
        try {
            setLoading(true);
            const data = await TrainerService.getTrainers(page, limit, debouncedSearch);
            setTrainers(data.trainers);
            setTotal(data.total);
        } catch (error) {
            console.error("Failed to fetch trainers", error);
        } finally {
            setLoading(false);
        }
    };

    const showToastMessage = (message: string) => {
        setToast({ message, show: true });
        setTimeout(() => setToast({ message: '', show: false }), 3000);
    };

    const handleOpenModal = (mode: 'create' | 'edit' | 'view', trainer?: Trainer) => {
        setModalMode(mode);
        if (trainer) {
            setEditingTrainer(trainer.id); // For compatibility with submit logic
            setSelectedTrainer(trainer);
            setFormData({
                fullName: trainer.fullName,
                email: trainer.email,
                phone: trainer.phone,
                specialization: trainer.specialization,
                monthlySalary: trainer.monthlySalary,

            });
        } else {
            setEditingTrainer(null);
            setSelectedTrainer(null);
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                specialization: '',
                monthlySalary: 0,

            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTrainer(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingTrainer) {
                await TrainerService.updateTrainer(editingTrainer, formData);
                showToastMessage("Trainer updated successfully");
            } else {
                await TrainerService.createTrainer(formData as any);
                showToastMessage("Trainer added successfully");
            }
            fetchTrainers();
            handleCloseModal();
        } catch (error: any) {
            console.error("Failed to save trainer", error);
            // Extract error message if available from axios error or Error object
            const msg = error.response?.data?.message || error.message || "Failed to save trainer";
            showToastMessage(msg);
        }
    };

    const handleDeleteClick = (id: string) => {
        setTrainerToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (trainerToDelete) {
            try {
                await TrainerService.deleteTrainer(trainerToDelete);
                fetchTrainers();
                showToastMessage("Trainer deleted successfully");
            } catch (error) {
                console.error("Failed to delete trainer", error);
            } finally {
                setIsDeleteModalOpen(false);
                setTrainerToDelete(null);
            }
        }
    };

    const handleSendWelcome = async (id: string, email: string) => {
        try {
            setSendingEmailId(id);
            await TrainerService.sendWelcomeEmail(id);
            showToastMessage(`Welcome email sent to ${email}`);
        } catch (error) {
            console.error("Failed to send welcome email", error);
            showToastMessage("Failed to send welcome email");
        } finally {
            setSendingEmailId(null);
        }
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Trainers</h1>
                    <p className="text-slate-500 mt-1">Manage gym trainers and their details</p>
                </div>
                <button
                    onClick={() => handleOpenModal('create')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#00ffd5] hover:bg-[#00e6c0] text-slate-900 rounded-xl font-bold transition-all shadow-[0_4px_14px_0_rgba(0,255,213,0.39)]"
                >
                    <Plus size={20} />
                    Add Trainer
                </button>
            </div>

            {/* Search */}
            <div className="mb-6">
                <div className="relative max-w-md w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by trainer name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ffd5] focus:border-transparent transition-all"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Full Name</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Email</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Phone</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Specialization</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Salary</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading...</td>
                                </tr>
                            ) : trainers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No trainers found.</td>
                                </tr>
                            ) : (
                                trainers.map(trainer => (
                                    <tr key={trainer.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">{trainer.fullName}</td>
                                        <td className="px-6 py-4 text-slate-600">
                                            <div className="flex items-center gap-2">
                                                {trainer.email}
                                                {trainer.isEmailVerified && (
                                                    <div title="Email Verified" className="text-[#00ffd5]">
                                                        <CheckCircle size={14} />
                                                    </div>
                                                )}
                                                {!trainer.isEmailVerified && (
                                                    <div title="Email Unverified" className="w-2 h-2 rounded-full bg-red-500"></div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{trainer.phone}</td>
                                        <td className="px-6 py-4 text-slate-600">{trainer.specialization || '-'}</td>
                                        <td className="px-6 py-4 text-slate-900 font-semibold">₹{trainer.monthlySalary.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleSendWelcome(trainer.id, trainer.email)}
                                                    disabled={sendingEmailId === trainer.id}
                                                    className="p-2 text-slate-400 hover:text-[#00ffd5] hover:bg-slate-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-wait"
                                                    title="Send Welcome Email"
                                                >
                                                    {sendingEmailId === trainer.id ? (
                                                        <Loader2 size={18} className="animate-spin text-[#00ffd5]" />
                                                    ) : (
                                                        <Mail size={18} />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleOpenModal('view', trainer)}
                                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleOpenModal('edit', trainer)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(trainer.id)}
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

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                    <span className="text-sm text-slate-500">
                        Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} trainers
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={page * limit >= total}
                            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleCloseModal} />
                    <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900">
                                {modalMode === 'create' ? 'Add New Trainer' : modalMode === 'edit' ? 'Edit Trainer' : 'Trainer Details'}
                            </h2>
                            <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>

                        {modalMode === 'view' && selectedTrainer ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Full Name</div>
                                    <div className="text-slate-900 font-medium">{selectedTrainer.fullName}</div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Email</div>
                                    <div className="text-slate-900 font-medium flex items-center gap-2">
                                        {selectedTrainer.email}
                                        {selectedTrainer.isEmailVerified ? (
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Verified</span>
                                        ) : (
                                            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">Unverified</span>
                                        )}
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Phone</div>
                                    <div className="text-slate-900 font-medium">{selectedTrainer.phone}</div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Specialization</div>
                                    <div className="text-slate-900 font-medium">{selectedTrainer.specialization || '-'}</div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Salary</div>
                                    <div className="text-slate-900 font-medium">₹{selectedTrainer.monthlySalary.toLocaleString()}</div>
                                </div>

                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Joined Date</div>
                                    <div className="text-slate-900 font-medium">
                                        {new Date(selectedTrainer.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.fullName}
                                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                        placeholder="Enter full name"
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ffd5] focus:border-transparent transition-all"
                                        autoFocus
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email *</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="Email address"
                                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ffd5] focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone *</label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="Phone number"
                                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ffd5] focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Specialization</label>
                                    <input
                                        type="text"
                                        value={formData.specialization}
                                        onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                                        placeholder="e.g. Weight Training, Cardio"
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ffd5] focus:border-transparent transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Monthly Salary (₹) *</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.monthlySalary || ''}
                                        onChange={e => setFormData({ ...formData, monthlySalary: e.target.value === '' ? 0 : Number(e.target.value) })}
                                        placeholder="0"
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ffd5] focus:border-transparent transition-all"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-[#00ffd5] hover:bg-[#00e6c0] text-slate-900 font-bold py-3 rounded-xl transition-all shadow-md mt-2"
                                >
                                    {editingTrainer ? 'Update Trainer' : 'Add Trainer'}
                                </button>
                            </form>
                        )}
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
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Trainer?</h3>
                            <p className="text-slate-500 mb-6">
                                Are you sure you want to delete this trainer? This action cannot be undone.
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
