import { useState, useEffect } from "react";
import { Loader2, X, Mail, Phone, Briefcase, User } from "lucide-react";
import { ClientProfileService } from "../services/ClientProfileService";

interface TrainerDetailsModalProps {
    onClose: () => void;
}

export default function TrainerDetailsModal({ onClose }: TrainerDetailsModalProps) {
    const [trainer, setTrainer] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTrainer = async () => {
            try {
                const data = await ClientProfileService.getAssignedTrainer();
                setTrainer(data);
            } catch (error) {
                console.error("Failed to fetch trainer", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTrainer();
    }, []);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-md w-full relative overflow-hidden shadow-2xl animate-scale-in">
                {/* Header */}
                <div className="bg-slate-50 border-b border-slate-100 p-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">Assigned Trainer</h2>
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
                    ) : trainer ? (
                        <div className="space-y-6">
                            <div className="flex flex-col items-center">
                                <div className="w-20 h-20 bg-[#00ffd5]/10 rounded-full flex items-center justify-center text-[#00ffd5] mb-4">
                                    <User size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">{trainer.fullName}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">
                                        Verified Trainer
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-400 shadow-sm">
                                        <Briefcase size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium">Specialization</p>
                                        <p className="text-sm font-bold text-slate-900">{trainer.specialization || 'General Fitness'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-400 shadow-sm">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium">Email Address</p>
                                        <p className="text-sm font-bold text-slate-900">{trainer.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-400 shadow-sm">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium">Phone Number</p>
                                        <p className="text-sm font-bold text-slate-900">{trainer.phone}</p>
                                    </div>
                                </div>

                                {trainer.biography && (
                                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-blue-900">
                                        <p className="text-xs font-bold uppercase tracking-wider mb-2 opacity-70">About</p>
                                        <p className="text-sm leading-relaxed">{trainer.biography}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10 text-slate-500">
                            <User className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                            <p>No trainer assigned currently.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
