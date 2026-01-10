
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '../layouts/DashboardLayout';
import { X, Filter, Check, Plus, Calendar, Loader2, ChevronDown, CheckCircle, AlertTriangle, Search } from 'lucide-react';
import { MembershipService } from '../services/MembershipService';
import type { Membership } from '../services/MembershipService';
import { ClientService } from '../services/ClientService';
import { PlanService } from '../services/PlanService';
import type { Plan } from '../services/PlanService';
import { format, differenceInDays, addDays } from 'date-fns';
import { SearchBar } from '../../../components/SearchBar';
import GymMembershipsTable from '../../../components/GymMembershipsTable';
import { useDebounce } from '../../../hooks/useDebounce';

export default function GymMemberships() {

    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const limit = 10;
    const [search, setSearch] = useState('');
    // Use the hook...
    const debouncedSearch = useDebounce(search, 500);

    // Filter State
    const [planTypeFilter, setPlanTypeFilter] = useState('all');

    // Main Query
    const { data, isLoading: loading } = useQuery({
        queryKey: ['memberships', page, debouncedSearch, planTypeFilter],
        queryFn: () => MembershipService.getMemberships(page, limit, debouncedSearch, planTypeFilter)
    });

    const memberships = useMemo(() => data?.items || [], [data?.items]);
    const total = useMemo(() => data?.total || 0, [data?.total]);
    const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);

    // Create Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Dropdown Queries
    const { data: plans = [] } = useQuery({
        queryKey: ['plans'],
        queryFn: PlanService.getPlans,
        staleTime: 5 * 60 * 1000 // Cache for 5 mins
    });

    const { data: clientsData } = useQuery({
        queryKey: ['clients', 'dropdown'],
        queryFn: () => ClientService.getClients(1, 1000),
        enabled: isCreateModalOpen, // Only fetch when creating
        staleTime: 5 * 60 * 1000
    });
    const clients = clientsData?.clients || [];

    const [clientSearch, setClientSearch] = useState('');
    const [createFormData, setCreateFormData] = useState<{
        clientId: string;
        planId: string;
        startDate: string;
        expiredDate: string;
    }>({
        clientId: '',
        planId: '',
        startDate: format(new Date(), 'yyyy-MM-dd'),
        expiredDate: format(addDays(new Date(), 30), 'yyyy-MM-dd')
    });
    const [selectedPlanDetails, setSelectedPlanDetails] = useState<Plan | null>(null);

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState<{
        id: string;
        planId: string;
        startDate: string;
        expiredDate: string;
        remainingDays: number | null;
        totalPurchasedDays: number | null; // Keep track if needed, though mostly editing remaining days? User said "remaining days will reduce". Edit should probably allow editing remainingDays.
    }>({
        id: '',
        planId: '',
        startDate: '',
        expiredDate: '',
        remainingDays: null,
        totalPurchasedDays: null
    });
    const [editSelectedPlan, setEditSelectedPlan] = useState<Plan | null>(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null);

    // Toast State
    const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: '', show: false });

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [membershipToDelete, setMembershipToDelete] = useState<string | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsFilterOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredClients = useMemo(() => {
        if (clientSearch.trim() === '') {
            return clients.slice(0, 50);
        } else {
            const lowerInfo = clientSearch.toLowerCase();
            return clients.filter(c =>
                c.fullName.toLowerCase().includes(lowerInfo) ||
                c.phone.includes(lowerInfo)
            ).slice(0, 20);
        }
    }, [clientSearch, clients]);

    // Mutations
    const createMutation = useMutation({
        mutationFn: MembershipService.createMembership,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['memberships'] });
            showToastMessage("Membership created successfully");
            setIsCreateModalOpen(false);
        },
        onError: () => showToastMessage("Failed to create membership")
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: any }) => MembershipService.updateMembership(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['memberships'] });
            showToastMessage("Membership updated successfully");
            setIsEditModalOpen(false);
        },
        onError: () => showToastMessage("Failed to update membership")
    });

    const deleteMutation = useMutation({
        mutationFn: MembershipService.deleteMembership,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['memberships'] });
            showToastMessage("Membership deleted successfully");
            setIsDeleteModalOpen(false);
            setMembershipToDelete(null);
        }
    });

    const handleOpenCreateModal = () => {
        setIsCreateModalOpen(true);
        // Reset form
        setCreateFormData({
            clientId: '',
            planId: '',
            startDate: format(new Date(), 'yyyy-MM-dd'),
            expiredDate: format(addDays(new Date(), 30), 'yyyy-MM-dd')
        });
        setClientSearch('');
        setSelectedPlanDetails(null);
    };

    const handlePlanSelect = (planId: string, isEdit = false) => {
        const plan = plans.find(p => p.id === planId);
        if (plan) {
            if (isEdit) {
                setEditSelectedPlan(plan);
                let newExpiredDate = editFormData.expiredDate;
                let newRemainingDays = editFormData.remainingDays;

                if (plan.type === 'category') {
                    // Default 30 days logic if switching to monthly
                    newExpiredDate = format(addDays(new Date(editFormData.startDate), 30), 'yyyy-MM-dd');
                    newRemainingDays = null;
                } else {
                    newExpiredDate = '';
                    newRemainingDays = plan.durationInDays || 0;
                }

                setEditFormData(prev => ({
                    ...prev,
                    planId,
                    expiredDate: newExpiredDate,
                    remainingDays: newRemainingDays,
                    totalPurchasedDays: plan.type === 'day' ? (plan.durationInDays || 0) : null
                }));

            } else {
                setSelectedPlanDetails(plan);
                let newExpiredDate = createFormData.expiredDate;
                if (plan.type === 'category') {
                    newExpiredDate = format(addDays(new Date(createFormData.startDate), 30), 'yyyy-MM-dd');
                } else {
                    newExpiredDate = '';
                }
                setCreateFormData(prev => ({
                    ...prev,
                    planId,
                    expiredDate: newExpiredDate
                }));
            }
        }
    };

    const handleStartDateChange = (date: string, isEdit = false) => {
        if (isEdit) {
            setEditFormData(prev => {
                let newExpiredDate = prev.expiredDate;
                if (editSelectedPlan?.type === 'category') {
                    newExpiredDate = format(addDays(new Date(date), 30), 'yyyy-MM-dd');
                }
                return {
                    ...prev,
                    startDate: date,
                    expiredDate: newExpiredDate
                };
            });
        } else {
            setCreateFormData(prev => {
                let newExpiredDate = prev.expiredDate;
                if (selectedPlanDetails?.type === 'category') {
                    newExpiredDate = format(addDays(new Date(date), 30), 'yyyy-MM-dd');
                }
                return {
                    ...prev,
                    startDate: date,
                    expiredDate: newExpiredDate
                };
            });
        }
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!createFormData.clientId || !createFormData.planId) {
            showToastMessage("Please select a client and a plan");
            return;
        }

        const payload = {
            clientId: createFormData.clientId,
            planId: createFormData.planId,
            startDate: createFormData.startDate,
            expiredDate: (selectedPlanDetails?.type === 'day' || !createFormData.expiredDate) ? null : createFormData.expiredDate,
            totalPurchasedDays: selectedPlanDetails?.type === 'day' ? (selectedPlanDetails.durationInDays || 0) : null,
            remainingDays: selectedPlanDetails?.type === 'day' ? (selectedPlanDetails.durationInDays || 0) : null
        };

        createMutation.mutate(payload);
    };

    const handleOpenEditModal = useCallback((membership: Membership) => {
        const currentPlan = plans.find(p => p.id === membership.planId);
        setEditSelectedPlan(currentPlan || null);

        setSelectedMembership(membership);
        setEditFormData({
            id: membership.id,
            planId: membership.planId,
            startDate: format(new Date(membership.startDate), 'yyyy-MM-dd'),
            expiredDate: membership.expiredDate ? format(new Date(membership.expiredDate), 'yyyy-MM-dd') : '',
            remainingDays: membership.remainingDays,
            totalPurchasedDays: membership.totalPurchasedDays
        });
        setIsEditModalOpen(true);
    }, [plans]);

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            planId: editFormData.planId,
            startDate: editFormData.startDate,
            expiredDate: (editSelectedPlan?.type === 'day' || !editFormData.expiredDate) ? null : editFormData.expiredDate,
            remainingDays: editSelectedPlan?.type === 'day' ? Number(editFormData.remainingDays) : null,
            totalPurchasedDays: editSelectedPlan?.type === 'day' ? Number(editFormData.totalPurchasedDays) : null
        };

        updateMutation.mutate({ id: editFormData.id, payload });
    };

    const showToastMessage = (message: string) => {
        setToast({ message, show: true });
        setTimeout(() => setToast({ message: '', show: false }), 3000);
    };

    const handleOpenModal = useCallback((membership: Membership) => {
        setSelectedMembership(membership);
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedMembership(null);
    };

    const handleDeleteClick = useCallback((id: string) => {
        setMembershipToDelete(id);
        setIsDeleteModalOpen(true);
    }, []);

    const confirmDelete = () => {
        if (membershipToDelete) {
            deleteMutation.mutate(membershipToDelete);
        }
    };

    const getDaysLeft = (endDate: string) => {
        if (!endDate) return '∞'; // Infinite or Day based handling
        const days = differenceInDays(new Date(endDate), new Date());
        if (days < 0) return '-';
        return `${days} days`;
    };

    const getFilterLabel = () => {
        switch (planTypeFilter) {
            case 'category': return 'Category-Based';
            case 'day': return 'Day-Based';
            default: return 'All Plans';
        }
    };

    const handleSearchChange = useCallback((val: string) => {
        setSearch(val);
        setPage(1);
    }, []);

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage);
    }, []);

    // Explicit loading state
    if (loading && memberships.length === 0 && !debouncedSearch && planTypeFilter === 'all') {
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
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Active Memberships</h1>
                    <p className="text-slate-500 mt-1">View and manage active member subscriptions</p>
                </div>
                <button
                    onClick={handleOpenCreateModal}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#00ffd5] hover:bg-[#00e6c0] text-slate-900 rounded-xl font-bold transition-all shadow-[0_4px_14px_0_rgba(0,255,213,0.39)]"
                >
                    <Plus size={20} />
                    Add Membership
                </button>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4 mb-6">

                {/* Custom Dropdown Filter */}
                <div className="relative" ref={filterRef}>
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors min-w-[160px] justify-between"
                    >
                        <div className="flex items-center gap-2">
                            <Filter size={18} className="text-slate-400" />
                            <span>{getFilterLabel()}</span>
                        </div>
                        <ChevronDown size={16} className={`text-slate-400 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isFilterOpen && (
                        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-20 animate-in fade-in zoom-in duration-200">
                            {[
                                { value: 'all', label: 'All Plans' },
                                { value: 'category', label: 'Category-Based' },
                                { value: 'day', label: 'Day-Based' }
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        setPlanTypeFilter(option.value);
                                        setPage(1);
                                        setIsFilterOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2.5 text-sm font-medium flex items-center justify-between transition-colors
                                        ${planTypeFilter === option.value
                                            ? 'bg-orange-50 text-orange-600'
                                            : 'text-slate-600 hover:bg-slate-50'
                                        }
                                    `}
                                >
                                    {option.label}
                                    {planTypeFilter === option.value && <Check size={16} />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="max-w-md w-full">
                    <SearchBar
                        value={search}
                        onChange={handleSearchChange}
                        placeholder="Search by client name..."
                    />
                </div>
            </div>

            {/* Table */}
            <GymMembershipsTable
                memberships={memberships}
                isLoading={loading}
                searchQuery={debouncedSearch}
                currentPage={page}
                totalPages={totalPages}
                total={total}
                limit={limit}
                onView={handleOpenModal}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteClick}
                onPageChange={handlePageChange}
            />

            {/* View Modal */}
            {isModalOpen && selectedMembership && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleCloseModal} />
                    <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900">Membership Details</h2>
                            <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 transition-colors hover:border-[#00ffd5]/30">
                                <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Client Name</div>
                                <div className="text-slate-900 font-bold text-lg">{selectedMembership.clientName}</div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Plan</div>
                                    <div className="text-slate-900 font-medium">{selectedMembership.planName}</div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Type</div>
                                    <div className="text-slate-900 font-medium capitalize">
                                        {selectedMembership.planType === 'category' ? 'Monthly Plan' : 'Day-Based Plan'}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Start Date</div>
                                    <div className="text-slate-900 font-medium font-mono">
                                        {format(new Date(selectedMembership.startDate), 'PPP')}
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Expiry Date</div>
                                    <div className="text-slate-900 font-medium font-mono">
                                        {selectedMembership.expiredDate ? format(new Date(selectedMembership.expiredDate), 'PPP') : '-'}
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                                <div>
                                    <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Status</div>
                                    <div className={`font-bold uppercase tracking-wide text-xs px-2 py-1 rounded inline-block ${selectedMembership.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {selectedMembership.status}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Days Left</div>
                                    <div className="text-slate-900 font-bold text-xl">
                                        {selectedMembership.planType === 'day' ? selectedMembership.remainingDays : (selectedMembership.expiredDate ? getDaysLeft(selectedMembership.expiredDate) : '-')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {/* Create Membership Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsCreateModalOpen(false)} />
                    <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900">Add Membership</h2>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateSubmit} className="space-y-4">
                            {/* Client Selection */}
                            <div className="relative">
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Select Client</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search by name or phone..."
                                        value={clientSearch}
                                        onChange={(e) => setClientSearch(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ffd5] focus:border-transparent transition-all"
                                        autoFocus
                                    />
                                </div>

                                {/* Client List */}
                                <div className="mt-2 max-h-40 overflow-y-auto border border-slate-200 rounded-xl bg-slate-50">
                                    {filteredClients.length === 0 ? (
                                        <div className="p-3 text-center text-slate-500 text-sm">No clients found</div>
                                    ) : (
                                        filteredClients.map(client => (
                                            <div
                                                key={client.id}
                                                onClick={() => {
                                                    setCreateFormData(prev => ({ ...prev, clientId: client.id }));
                                                    setClientSearch(client.fullName);
                                                }}
                                                className={`p-3 text-sm cursor-pointer flex justify-between items-center hover:bg-slate-100 transition-colors ${createFormData.clientId === client.id ? 'bg-[#00ffd5]/10 border-l-4 border-[#00ffd5]' : ''
                                                    }`}
                                            >
                                                <div>
                                                    <div className="font-medium text-slate-900">{client.fullName}</div>
                                                    <div className="text-slate-500 text-xs">{client.phone}</div>
                                                </div>
                                                {createFormData.clientId === client.id && <CheckCircle size={16} className="text-[#00aa8d]" />}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Plan Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Select Plan</label>
                                <select
                                    required
                                    value={createFormData.planId}
                                    onChange={(e) => handlePlanSelect(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ffd5] focus:border-transparent transition-all cursor-pointer appearance-none"
                                >
                                    <option value="">-- Choose a Plan --</option>
                                    <optgroup label="Monthly Plans">
                                        {plans.filter(p => p.type === 'category').map(plan => (
                                            <option key={plan.id} value={plan.id!}>{plan.planName} - ₹{plan.monthlyFee}</option>
                                        ))}
                                    </optgroup>
                                    <optgroup label="Day-Based Plans">
                                        {plans.filter(p => p.type === 'day').map(plan => (
                                            <option key={plan.id} value={plan.id!}>{plan.planName} ({plan.durationInDays} days) - ₹{plan.monthlyFee}</option>
                                        ))}
                                    </optgroup>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Start Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                        <input
                                            type="date"
                                            required
                                            value={createFormData.startDate}
                                            onChange={(e) => handleStartDateChange(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ffd5] focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>

                                {selectedPlanDetails?.type !== 'day' && (
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Expiry Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                            <input
                                                type="date"
                                                required={selectedPlanDetails?.type === 'category'}
                                                value={createFormData.expiredDate}
                                                onChange={(e) => setCreateFormData(prev => ({ ...prev, expiredDate: e.target.value }))}
                                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ffd5] focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {selectedPlanDetails?.type === 'day' && (
                                <div className="p-3 bg-blue-50 text-blue-700 text-sm rounded-lg flex items-start gap-2">
                                    <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                                    <span>Day-based plans do not have a fixed expiry date. The validity is based on usage/sessions.</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={createMutation.isPending}
                                className="w-full bg-[#00ffd5] hover:bg-[#00e6c0] disabled:opacity-50 disabled:cursor-wait text-slate-900 font-bold py-3 rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-2"
                            >
                                {createMutation.isPending && <Loader2 size={18} className="animate-spin" />}
                                Create Membership
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Membership Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
                    <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900">Edit Membership</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            {/* Client Name Display (Non-editable) */}
                            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                                <span className="text-xs font-semibold text-slate-500 uppercase">Client</span>
                                <div className="font-bold text-slate-900">{selectedMembership?.clientName}</div>
                            </div>

                            {/* Plan Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Change Plan</label>
                                <select
                                    required
                                    key={`plan-select-${plans.length}-${editFormData.planId}`} // Force re-render when plans load or ID changes to ensure value is picked up
                                    value={editFormData.planId || ''}
                                    onChange={(e) => handlePlanSelect(e.target.value, true)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            e.currentTarget.form?.requestSubmit();
                                        }
                                    }}
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ffd5] focus:border-transparent transition-all cursor-pointer appearance-none"
                                    autoFocus
                                >
                                    <option value="">-- Choose a Plan --</option>
                                    <optgroup label="Monthly Plans">
                                        {plans.filter(p => p.type === 'category').map(plan => (
                                            <option key={plan.id} value={plan.id!}>{plan.planName} - ₹{plan.monthlyFee}</option>
                                        ))}
                                    </optgroup>
                                    <optgroup label="Day-Based Plans">
                                        {plans.filter(p => p.type === 'day').map(plan => (
                                            <option key={plan.id} value={plan.id!}>{plan.planName} ({plan.durationInDays} days) - ₹{plan.monthlyFee}</option>
                                        ))}
                                    </optgroup>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Start Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                        <input
                                            type="date"
                                            required
                                            value={editFormData.startDate}
                                            onChange={(e) => handleStartDateChange(e.target.value, true)}
                                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ffd5] focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>

                                {editSelectedPlan?.type === 'category' ? (
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Expiry Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                            <input
                                                type="date"
                                                required
                                                value={editFormData.expiredDate}
                                                onChange={(e) => setEditFormData(prev => ({ ...prev, expiredDate: e.target.value }))}
                                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ffd5] focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Days Left</label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            value={editFormData.remainingDays || ''}
                                            onChange={(e) => setEditFormData(prev => ({ ...prev, remainingDays: Number(e.target.value) }))}
                                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ffd5] focus:border-transparent transition-all"
                                        />
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={updateMutation.isPending}
                                className="w-full bg-[#00ffd5] hover:bg-[#00e6c0] disabled:opacity-50 disabled:cursor-wait text-slate-900 font-bold py-3 rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-2"
                            >
                                {updateMutation.isPending && <Loader2 size={18} className="animate-spin" />}
                                Update Membership
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
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Membership?</h3>
                            <p className="text-slate-500 mb-6">
                                Are you sure you want to delete this membership? This action cannot be undone.
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
