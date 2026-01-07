import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '../layouts/DashboardLayout';
import { Plus, Edit2, Trash2, X, Search, CheckCircle, AlertTriangle, Eye, Filter, Check, ChevronDown, Mail, Loader2 } from 'lucide-react';
import { ClientService } from '../services/ClientService';
import type { Client } from '../services/ClientService';

export default function GymClients() {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const limit = 10;
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Query
    const { data, isLoading: loading } = useQuery({
        queryKey: ['clients', page, debouncedSearch, statusFilter],
        queryFn: () => ClientService.getClients(page, limit, debouncedSearch, statusFilter)
    });

    const clients = data?.clients || [];
    const total = data?.total || 0;
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsFilterOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    // Toast State
    const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: '', show: false });

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [clientToDelete, setClientToDelete] = useState<string | null>(null);

    // Sending Email State
    const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<Client>>({
        fullName: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1); // Reset page on search
            setDebouncedSearch(search)
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Mutations
    const createMutation = useMutation({
        mutationFn: ClientService.createClient,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients'] });
            showToastMessage("Client added successfully");
            handleCloseModal();
        },
        onError: () => {
            showToastMessage("Failed to add client");
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Client> }) => ClientService.updateClient(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients'] });
            showToastMessage("Client updated successfully");
            handleCloseModal();
        },
        onError: () => {
            showToastMessage("Failed to update client");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: ClientService.deleteClient,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients'] });
            showToastMessage("Client deleted successfully");
            setIsDeleteModalOpen(false);
            setClientToDelete(null);
        }
    });

    const sendWelcomeMutation = useMutation({
        mutationFn: ClientService.sendWelcomeEmail,
        onSuccess: () => {
            showToastMessage("Welcome email sent");
        },
        onError: () => {
            showToastMessage("Failed to send welcome email");
        },
        onSettled: () => {
            setSendingEmailId(null);
        }
    });

    const showToastMessage = (message: string) => {
        setToast({ message, show: true });
        setTimeout(() => setToast({ message: '', show: false }), 3000);
    };

    const handleOpenModal = (mode: 'create' | 'edit' | 'view', client?: Client) => {
        setModalMode(mode);
        if (client) {
            setSelectedClient(client);
            setFormData({
                fullName: client.fullName,
                email: client.email,
                phone: client.phone
            });
        } else {
            setSelectedClient(null);
            setFormData({
                fullName: '',
                email: '',
                phone: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedClient(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (modalMode === 'edit' && selectedClient) {
            updateMutation.mutate({ id: selectedClient.id, data: formData });
        } else if (modalMode === 'create') {
            createMutation.mutate(formData as any);
        }
    };

    const handleDeleteClick = (id: string) => {
        setClientToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (clientToDelete) {
            deleteMutation.mutate(clientToDelete);
        }
    };

    const handleSendWelcome = (id: string) => {
        setSendingEmailId(id);
        sendWelcomeMutation.mutate(id);
    };

    // Explicit loading state
    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex h-[80vh] items-center justify-center">
                    <div className="w-8 h-8 border-4 border-[#00ffd5] border-t-transparent rounded-full animate-spin"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Clients</h1>
                    <p className="text-slate-500 mt-1">Manage all gym members</p>
                </div>
                <button
                    onClick={() => handleOpenModal('create')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#00ffd5] hover:bg-[#00e6c0] text-slate-900 rounded-xl font-bold transition-all shadow-[0_4px_14px_0_rgba(0,255,213,0.39)]"
                >
                    <Plus size={20} />
                    Add Client
                </button>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4 mb-6">
                <div className="relative max-w-md w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ffd5] focus:border-transparent transition-all"
                    />
                </div>
                {/* Custom Dropdown Filter */}
                <div className="relative" ref={filterRef}>
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors min-w-[160px] justify-between"
                    >
                        <div className="flex items-center gap-2">
                            <Filter size={18} className="text-slate-400" />
                            <span>
                                {statusFilter === '' ? 'All Status' :
                                    statusFilter === 'active' ? 'Active' :
                                        statusFilter === 'inactive' ? 'Inactive' : 'Expired'}
                            </span>
                        </div>
                        <ChevronDown size={16} className={`text-slate-400 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isFilterOpen && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-20 animate-in fade-in zoom-in duration-200">
                            {[
                                { value: '', label: 'All Status' },
                                { value: 'active', label: 'Active' },
                                { value: 'inactive', label: 'Inactive' },
                                { value: 'expired', label: 'Expired' }
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        setStatusFilter(option.value);
                                        setPage(1);
                                        setIsFilterOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2.5 text-sm font-medium flex items-center justify-between transition-colors
                                        ${statusFilter === option.value
                                            ? 'bg-orange-50 text-orange-600'
                                            : 'text-slate-600 hover:bg-slate-50'
                                        }
                                    `}
                                >
                                    {option.label}
                                    {statusFilter === option.value && <Check size={16} />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Name</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Phone</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Email</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Status</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading...</td>
                                </tr>
                            ) : clients.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No clients found.</td>
                                </tr>
                            ) : (
                                clients.map(client => (
                                    <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">{client.fullName}</td>
                                        <td className="px-6 py-4 text-slate-600">{client.phone}</td>
                                        <td className="px-6 py-4 text-slate-600">
                                            <div className="flex items-center gap-2">
                                                {client.email}
                                                {client.isEmailVerified && (
                                                    <div title="Email Verified" className="text-[#00ffd5]">
                                                        <CheckCircle size={14} />
                                                    </div>
                                                )}
                                                {!client.isEmailVerified && (
                                                    <div title="Email Unverified" className="w-2 h-2 rounded-full bg-red-500"></div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${client.status === 'active'
                                                ? 'bg-[#00ffd5]/20 text-teal-800'
                                                : client.status === 'expired'
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                {client.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleSendWelcome(client.id)}
                                                    disabled={sendingEmailId === client.id}
                                                    className="p-2 text-slate-400 hover:text-[#00ffd5] hover:bg-slate-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-wait"
                                                    title="Send Welcome Email"
                                                >
                                                    {sendingEmailId === client.id ? (
                                                        <Loader2 size={18} className="animate-spin text-[#00ffd5]" />
                                                    ) : (
                                                        <Mail size={18} />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleOpenModal('view', client)}
                                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleOpenModal('edit', client)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-all"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(client.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-slate-50 rounded-lg transition-all"
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
                        Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} clients
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
                                {modalMode === 'create' ? 'Add New Client' : modalMode === 'edit' ? 'Edit Client' : 'Client Details'}
                            </h2>
                            <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>

                        {modalMode === 'view' && selectedClient ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Full Name</div>
                                    <div className="text-slate-900 font-medium">{selectedClient.fullName}</div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Email</div>
                                    <div className="text-slate-900 font-medium flex items-center gap-2">
                                        {selectedClient.email}
                                        {selectedClient.isEmailVerified ? (
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Verified</span>
                                        ) : (
                                            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">Unverified</span>
                                        )}
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Phone</div>
                                    <div className="text-slate-900 font-medium">{selectedClient.phone}</div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Status</div>
                                    <div className="text-slate-900 font-medium capitalize">{selectedClient.status}</div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Joined Date</div>
                                    <div className="text-slate-900 font-medium">
                                        {new Date(selectedClient.createdAt).toLocaleDateString()}
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

                                <button
                                    type="submit"
                                    className="w-full bg-[#00ffd5] hover:bg-[#00e6c0] text-slate-900 font-bold py-3 rounded-xl transition-all shadow-md mt-2"
                                >
                                    {modalMode === 'create' ? 'Add Client' : 'Update Client'}
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
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Client?</h3>
                            <p className="text-slate-500 mb-6">
                                Are you sure you want to delete this client? This action cannot be undone.
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
