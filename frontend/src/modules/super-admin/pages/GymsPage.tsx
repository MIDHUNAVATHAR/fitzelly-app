import { useState, useEffect } from 'react';
import SuperAdminDashboardLayout from '../layouts/SuperAdminDashboardLayout';
import { GymListingService, type GymSummary } from '../services/GymListingService';
import { Search, ChevronLeft, ChevronRight, Building2, MapPin, Calendar, Eye, Ban, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function GymsPage() {
    const [gyms, setGyms] = useState<GymSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalGyms, setTotalGyms] = useState(0);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const navigate = useNavigate();

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1); // Reset to page 1 on new search
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        fetchGyms();
    }, [page, debouncedSearch]);

    const fetchGyms = async () => {
        setIsLoading(true);
        try {
            const data = await GymListingService.getGyms(page, limit, debouncedSearch);
            setGyms(data.gyms);
            setTotalPages(data.totalPages);
            setTotalGyms(data.total);
        } catch (error) {
            console.error("Failed to fetch gyms", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SuperAdminDashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Gyms</h1>
                        <p className="text-slate-500">Manage and view all registered gyms</p>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, email, or city..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ffd5]/50 focus:border-[#00ffd5] transition-all"
                        />
                    </div>
                    {/* Placeholder for filters */}
                    {/* <select className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ffd5]/50">
                        <option>Status: All</option>
                        <option>Active</option>
                        <option>Inactive</option>
                    </select> */}
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                                    <th className="px-6 py-4 font-semibold">Gym Name</th>
                                    <th className="px-6 py-4 font-semibold">Owner</th>
                                    <th className="px-6 py-4 font-semibold">Location</th>
                                    <th className="px-6 py-4 font-semibold">Contact</th>
                                    <th className="px-6 py-4 font-semibold">Joined Date</th>
                                    <th className="px-6 py-4 font-semibold text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {isLoading ? (
                                    Array(5).fill(0).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-32"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-24"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-20"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-32"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-24"></div></td>
                                            <td className="px-6 py-4"></td>
                                        </tr>
                                    ))
                                ) : gyms.length > 0 ? (
                                    gyms.map((gym) => (
                                        <tr key={gym.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600">
                                                        <Building2 size={20} />
                                                    </div>
                                                    <span className="font-medium text-slate-900">{gym.gymName}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">{gym.ownerName}</td>
                                            <td className="px-6 py-4 text-slate-600">
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin size={16} className="text-slate-400" />
                                                    {gym.city}, {gym.state}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-slate-900">{gym.email}</span>
                                                    <span className="text-xs text-slate-500">{gym.phone}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar size={16} className="text-slate-400" />
                                                    {new Date(gym.joinedAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => navigate(`/fitzelly-hq/gyms/${gym.id}`)}
                                                        className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            if (window.confirm(`Are you sure you want to ${gym.isBlocked ? 'unblock' : 'block'} this gym?`)) {
                                                                await GymListingService.blockGym(gym.id, !gym.isBlocked);
                                                                fetchGyms();
                                                            }
                                                        }}
                                                        className={`p-2 rounded-lg transition-colors ${gym.isBlocked ? 'text-red-500 hover:bg-red-50' : 'text-slate-400 hover:text-orange-500 hover:bg-orange-50'}`}
                                                        title={gym.isBlocked ? "Unblock Gym" : "Block Gym"}
                                                    >
                                                        <Ban size={18} />
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            if (window.confirm("Are you sure you want to DELETE this gym? This cannot be undone.")) {
                                                                await GymListingService.deleteGym(gym.id);
                                                                fetchGyms();
                                                            }
                                                        }}
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete Gym"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                            No gyms found matching your criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {!isLoading && totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                            <span className="text-sm text-slate-500">
                                Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to <span className="font-medium">{Math.min(page * limit, totalGyms)}</span> of <span className="font-medium">{totalGyms}</span> results
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <span className="text-sm font-medium text-slate-700 px-2">Page {page} of {totalPages}</span>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </SuperAdminDashboardLayout>
    );
}
