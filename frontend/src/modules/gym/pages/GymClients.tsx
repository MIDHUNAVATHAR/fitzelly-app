import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '../layouts/DashboardLayout';
import { Plus, X, Filter, Check, ChevronDown } from 'lucide-react';
import { ClientService } from '../services/ClientService';
import type { Client } from '../services/ClientService';
import { TrainerService } from '../services/TrainerService';
import { SearchBar } from '../../../components/SearchBar';
import GymClientsTable from '../../../components/GymClientsTable';
import { useDebounce } from '../../../hooks/useDebounce';

export default function GymClients() {
    console.log('GymClients page rendered'); // Debug log

    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const limit = 10;
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Debounce search to reduce API calls
    const debouncedSearch = useDebounce(search, 500);

    // Query Clients
    const { data, isLoading: loading } = useQuery({
        queryKey: ['clients', page, debouncedSearch, statusFilter],
        queryFn: () => ClientService.getClients(page, limit, debouncedSearch, statusFilter)
    });

    // Query Trainers for Dropdown
    const { data: trainersData } = useQuery({
        queryKey: ['trainers-list'],
        queryFn: () => TrainerService.getTrainers(1, 100)
    });
    const trainers = trainersData?.trainers || [];

    // Memoize derived values
    const clients = useMemo(() => data?.clients || [], [data?.clients]);
    const total = useMemo(() => data?.total || 0, [data?.total]);
    const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);

    // Create trainer lookup map
    const trainersRecord = useMemo(() => {
        const record: Record<string, string> = {};
        if (trainers) {
            trainers.forEach(t => {
                record[t.id] = t.fullName;
            });
        }
        return record;
    }, [trainers]);

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

    // Block Modal State
    const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
    const [clientToBlock, setClientToBlock] = useState<Client | null>(null);

    // Sending Email State
    const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<Client>>({
        fullName: '',
        email: '',
        phone: '',
        assignedTrainer: '',
        emergencyContactNumber: '',
        dateOfBirth: ''
    });

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

    const blockMutation = useMutation({
        mutationFn: ({ id, isBlocked }: { id: string; isBlocked: boolean }) => ClientService.updateClient(id, { isBlocked }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients'] });
            showToastMessage(clientToBlock?.isBlocked ? "Client unblocked successfully" : "Client blocked successfully");
            setIsBlockModalOpen(false);
            setClientToBlock(null);
        },
        onError: () => {
            showToastMessage("Failed to update block status");
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
                phone: client.phone,
                assignedTrainer: client.assignedTrainer || '',
                emergencyContactNumber: client.emergencyContactNumber || '',
                dateOfBirth: client.dateOfBirth || ''
            });
        } else {
            setSelectedClient(null);
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                assignedTrainer: '',
                emergencyContactNumber: '',
                dateOfBirth: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedClient(null);
        setFormData({
            fullName: '',
            email: '',
            phone: '',
            assignedTrainer: '',
            emergencyContactNumber: '',
            dateOfBirth: ''
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (modalMode === 'create') {
            createMutation.mutate(formData as Omit<Client, 'id' | 'createdAt' | 'status' | 'isEmailVerified'>);
        } else if (modalMode === 'edit' && selectedClient) {
            updateMutation.mutate({ id: selectedClient.id, data: formData });
        }
    };

    // Memoized callbacks for table component
    const handleSearchChange = useCallback((value: string) => {
        console.log('Search changed:', value);
        setSearch(value);
        setPage(1);
    }, []);

    const handlePageChange = useCallback((newPage: number) => {
        console.log('Page changed:', newPage);
        setPage(newPage);
    }, []);

    const handleView = useCallback((client: Client) => {
        console.log('View client:', client.fullName);
        handleOpenModal('view', client);
    }, []);

    const handleEdit = useCallback((client: Client) => {
        console.log('Edit client:', client.fullName);
        handleOpenModal('edit', client);
    }, []);

    const handleDelete = useCallback((id: string) => {
        console.log('Delete client:', id);
        setClientToDelete(id);
        setIsDeleteModalOpen(true);
    }, []);

    const handleBlock = useCallback((client: Client) => {
        console.log('Block/Unblock client:', client.fullName);
        setClientToBlock(client);
        setIsBlockModalOpen(true);
    }, []);

    const handleSendEmail = useCallback((id: string) => {
        console.log('Send email to:', id);
        setSendingEmailId(id);
        sendWelcomeMutation.mutate(id);
    }, [sendWelcomeMutation]);

    const confirmDelete = () => {
        if (clientToDelete) {
            deleteMutation.mutate(clientToDelete);
        }
    };

    const confirmBlock = () => {
        if (clientToBlock) {
            blockMutation.mutate({ id: clientToBlock.id, isBlocked: !clientToBlock.isBlocked });
        }
    };

    // Explicit loading state
    if (loading && clients.length === 0 && !debouncedSearch && !statusFilter) {
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
                {/* Search Bar - Memoized Component */}
                <div className="max-w-md w-full">
                    <SearchBar
                        value={search}
                        onChange={handleSearchChange}
                        placeholder="Search by name..."
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

            {/* Clients Table - Memoized Component - Only re-renders when data changes! */}
            <GymClientsTable
                clients={clients}
                isLoading={loading}
                searchQuery={debouncedSearch}
                currentPage={page}
                totalPages={totalPages}
                total={total}
                limit={limit}
                sendingEmailId={sendingEmailId}
                trainersRecord={trainersRecord}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onBlock={handleBlock}
                onSendEmail={handleSendEmail}
                onPageChange={handlePageChange}
            />

            {/* Rest of the modals code continues... */}
            {/* I'll add the modals in a follow-up file to keep it manageable */}

            {/* Toast */}
            {toast.show && (
                <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-6 py-3 rounded-xl shadow-xl z-50 animate-in slide-in-from-bottom-5 duration-300">
                    {toast.message}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Client</h3>
                        <p className="text-slate-600 mb-6">Are you sure you want to delete this client? This action cannot be undone.</p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={deleteMutation.isPending}
                                className="px-4 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                            >
                                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Block Confirmation Modal */}
            {isBlockModalOpen && clientToBlock && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                            {clientToBlock.isBlocked ? 'Unblock' : 'Block'} Client
                        </h3>
                        <p className="text-slate-600 mb-6">
                            Are you sure you want to {clientToBlock.isBlocked ? 'unblock' : 'block'} {clientToBlock.fullName}?
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setIsBlockModalOpen(false)}
                                className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmBlock}
                                disabled={blockMutation.isPending}
                                className={`px-4 py-2 rounded-xl font-medium transition-colors disabled:opacity-50 ${clientToBlock.isBlocked
                                    ? 'bg-green-500 text-white hover:bg-green-600'
                                    : 'bg-orange-500 text-white hover:bg-orange-600'
                                    }`}
                            >
                                {blockMutation.isPending ? 'Processing...' : (clientToBlock.isBlocked ? 'Unblock' : 'Block')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Client Modal (Create/Edit/View) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl max-w-2xl w-full my-8">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <h2 className="text-2xl font-bold text-slate-900">
                                {modalMode === 'create' ? 'Add New Client' :
                                    modalMode === 'edit' ? 'Edit Client' : 'Client Details'}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                                    <input
                                        type="text"
                                        value={formData.fullName || ''}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        disabled={modalMode === 'view'}
                                        required
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ffd5] focus:border-transparent disabled:bg-slate-50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                                    <input
                                        type="email"
                                        value={formData.email || ''}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        disabled={modalMode === 'view' || modalMode === 'edit'}
                                        required
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ffd5] focus:border-transparent disabled:bg-slate-50"
                                    />
                                    {modalMode === 'edit' && (
                                        <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone *</label>
                                    <input
                                        type="tel"
                                        value={formData.phone || ''}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        disabled={modalMode === 'view'}
                                        required
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ffd5] focus:border-transparent disabled:bg-slate-50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Assign Trainer</label>
                                    <select
                                        value={formData.assignedTrainer || ''}
                                        onChange={(e) => setFormData({ ...formData, assignedTrainer: e.target.value })}
                                        disabled={modalMode === 'view'}
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ffd5] focus:border-transparent disabled:bg-slate-50"
                                    >
                                        <option value="">No Trainer</option>
                                        {trainers.map(trainer => (
                                            <option key={trainer.id} value={trainer.id}>
                                                {trainer.fullName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Additional Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Emergency Contact</label>
                                    <input
                                        type="tel"
                                        value={formData.emergencyContactNumber || ''}
                                        onChange={(e) => setFormData({ ...formData, emergencyContactNumber: e.target.value })}
                                        disabled={modalMode === 'view'}
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ffd5] focus:border-transparent disabled:bg-slate-50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth</label>
                                    <input
                                        type="date"
                                        value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ''}
                                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                        disabled={modalMode === 'view'}
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ffd5] focus:border-transparent disabled:bg-slate-50"
                                    />
                                </div>
                            </div>

                            {/* View Only Fields */}
                            {modalMode === 'view' && selectedClient && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                                        <div className="flex items-center gap-2">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                ${selectedClient.status === 'active' ? 'bg-green-100 text-green-800' :
                                                    selectedClient.status === 'expired' ? 'bg-orange-100 text-orange-800' :
                                                        'bg-slate-100 text-slate-800'}`}>
                                                {selectedClient.status.toUpperCase()}
                                            </span>
                                            {selectedClient.isBlocked && (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    Blocked
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Verification</label>
                                        <div>
                                            {selectedClient.isEmailVerified ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <Check size={12} /> Verified
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                                    Unverified
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Joined Date</label>
                                        <p className="text-slate-900">{new Date(selectedClient.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            )}

                            {modalMode !== 'view' && (
                                <div className="flex gap-3 justify-end pt-4">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="px-6 py-2.5 border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={createMutation.isPending || updateMutation.isPending}
                                        className="px-6 py-2.5 bg-[#00ffd5] text-slate-900 rounded-xl font-bold hover:bg-[#00e6c0] transition-colors disabled:opacity-50"
                                    >
                                        {createMutation.isPending || updateMutation.isPending
                                            ? 'Saving...'
                                            : modalMode === 'create' ? 'Add Client' : 'Save Changes'}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
