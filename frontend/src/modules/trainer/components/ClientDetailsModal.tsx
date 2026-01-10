import { useState, useEffect } from "react";
import { Loader2, X, Mail, Phone, Calendar, HeartPulse, User } from "lucide-react";
import { TrainerClientsService, type ClientDetails } from "../services/TrainerClientsService";

interface ClientDetailsModalProps {
    clientId: string;
    onClose: () => void;
}

export default function ClientDetailsModal({ clientId, onClose }: ClientDetailsModalProps) {
    const [client, setClient] = useState<ClientDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        TrainerClientsService.getClientDetails(clientId)
            .then(data => setClient(data))
            .catch((err) => {
                console.error("Failed to fetch client details", err);
            })
            .finally(() => setIsLoading(false));
    }, [clientId]);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-md w-full relative overflow-hidden shadow-2xl animate-scale-in">
                {/* Header */}
                <div className="bg-slate-50 border-b border-slate-100 p-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">Client Details</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-10">
                            <Loader2 className="w-8 h-8 animate-spin text-[#00ffd5]" />
                        </div>
                    ) : client ? (
                        <div className="space-y-6">
                            <div className="flex flex-col items-center">
                                <div className="w-20 h-20 bg-[#00ffd5]/10 rounded-full flex items-center justify-center text-[#00ffd5] mb-4">
                                    <User size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">{client.fullName}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    {client.hasWorkoutPlan && (
                                        <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700">
                                            Active Plan
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-400 shadow-sm">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium">Email Address</p>
                                        <p className="text-sm font-bold text-slate-900">{client.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-400 shadow-sm">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium">Phone Number</p>
                                        <p className="text-sm font-bold text-slate-900">{client.phone}</p>
                                    </div>
                                </div>

                                {client.emergencyContactNumber && (
                                    <div className="flex items-center gap-4 p-3 rounded-xl bg-red-50 border border-red-100">
                                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-red-400 shadow-sm">
                                            <HeartPulse size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-red-500 font-medium">Emergency Contact</p>
                                            <p className="text-sm font-bold text-slate-900">{client.emergencyContactNumber}</p>
                                        </div>
                                    </div>
                                )}

                                {client.dateOfBirth && (
                                    <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-400 shadow-sm">
                                            <Calendar size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium">Date of Birth</p>
                                            <p className="text-sm font-bold text-slate-900">{new Date(client.dateOfBirth).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10 text-slate-500">
                            <User className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                            <p>Client details not found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
