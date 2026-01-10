import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SuperAdminDashboardLayout from '../layouts/SuperAdminDashboardLayout';
import { GymListingService, type GymSummary } from '../services/GymListingService';
import { Loader2, ArrowLeft, Building2, MapPin, Calendar, Mail, Phone, Ban, Trash2, CheckCircle } from 'lucide-react';

export default function GymDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [gym, setGym] = useState<GymSummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isBlocking, setIsBlocking] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (id) fetchGymDetails();
    }, [id]);

    const fetchGymDetails = async () => {
        setIsLoading(true);
        try {
            if (!id) return;
            const data = await GymListingService.getGymDetails(id);
            setGym(data);
        } catch (error) {
            console.error("Failed to fetch gym details", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBlock = async () => {
        if (!gym || !window.confirm(`Are you sure you want to ${gym.isBlocked ? 'unblock' : 'block'} this gym?`)) return;

        setIsBlocking(true);
        try {
            await GymListingService.blockGym(gym.id, !gym.isBlocked);
            // Refresh details
            fetchGymDetails();
        } catch (error) {
            console.error("Failed to block/unblock gym", error);
        } finally {
            setIsBlocking(false);
        }
    };

    const handleDelete = async () => {
        if (!gym || !window.confirm("Are you sure you want to DELETE this gym? This action cannot be undone and will delete all associated data.")) return;

        setIsDeleting(true);
        try {
            await GymListingService.deleteGym(gym.id);
            navigate('/fitzelly-hq/gyms');
        } catch (error) {
            console.error("Failed to delete gym", error);
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <SuperAdminDashboardLayout>
                <div className="flex h-[80vh] items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#00ffd5]" />
                </div>
            </SuperAdminDashboardLayout>
        );
    }

    if (!gym) {
        return (
            <SuperAdminDashboardLayout>
                <div className="text-center py-12">
                    <h2 className="text-xl font-bold text-slate-700">Gym not found</h2>
                    <button onClick={() => navigate('/fitzelly-hq/gyms')} className="mt-4 text-[#00ffd5] hover:underline">Back to Gyms</button>
                </div>
            </SuperAdminDashboardLayout>
        );
    }

    return (
        <SuperAdminDashboardLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/fitzelly-hq/gyms')}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} className="text-slate-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{gym.gymName}</h1>
                        <p className="text-slate-500">Gym Details & Management</p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Details Card */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                            <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Overview</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <div className="text-xs font-semibold text-slate-500 uppercase">Owner Name</div>
                                    <div className="font-medium text-slate-900">{gym.ownerName}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-xs font-semibold text-slate-500 uppercase">Joined Date</div>
                                    <div className="flex items-center gap-2 font-medium text-slate-900">
                                        <Calendar size={16} className="text-slate-400" />
                                        {new Date(gym.joinedAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-xs font-semibold text-slate-500 uppercase">Contact Email</div>
                                    <div className="flex items-center gap-2 font-medium text-slate-900">
                                        <Mail size={16} className="text-slate-400" />
                                        {gym.email}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-xs font-semibold text-slate-500 uppercase">Phone Number</div>
                                    <div className="flex items-center gap-2 font-medium text-slate-900">
                                        <Phone size={16} className="text-slate-400" />
                                        {gym.phone}
                                    </div>
                                </div>
                                <div className="sm:col-span-2 space-y-1">
                                    <div className="text-xs font-semibold text-slate-500 uppercase">Location</div>
                                    <div className="flex items-center gap-2 font-medium text-slate-900">
                                        <MapPin size={16} className="text-slate-400" />
                                        {gym.city}, {gym.state}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions Card */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                            <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Status</h3>

                            <div className="flex items-center gap-3 mb-6">
                                <div className={`w-3 h-3 rounded-full ${gym.isBlocked ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                <span className={`font-medium ${gym.isBlocked ? 'text-red-600' : 'text-green-600'}`}>
                                    {gym.isBlocked ? 'Blocked' : 'Active'}
                                </span>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={handleBlock}
                                    disabled={isBlocking}
                                    className={`w-full py-2.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${gym.isBlocked
                                            ? 'bg-green-50 text-green-600 hover:bg-green-100'
                                            : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                                        }`}
                                >
                                    {isBlocking ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        <>
                                            {gym.isBlocked ? <CheckCircle size={18} /> : <Ban size={18} />}
                                            {gym.isBlocked ? 'Unblock Gym' : 'Block Gym'}
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="w-full py-2.5 px-4 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
                                >
                                    {isDeleting ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        <>
                                            <Trash2 size={18} />
                                            Delete Gym
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SuperAdminDashboardLayout>
    );
}
