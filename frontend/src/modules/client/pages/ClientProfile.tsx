import { useState, useEffect } from "react";
import ClientDashboardLayout from "../layouts/ClientDashboardLayout";
import { ClientProfileService } from "../services/ClientProfileService";
import type { Client } from "../../gym/services/ClientService";
import { Loader2, Save, User, Mail, Phone, Calendar, HeartPulse, Pencil, X } from "lucide-react";
import toast from "react-hot-toast";

export default function ClientProfile() {
    const [profile, setProfile] = useState<Client | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        emergencyContactNumber: "",
        dateOfBirth: "", // YYYY-MM-DD for input
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await ClientProfileService.getProfile();
            setProfile(data);

            // Format Date for Input
            let dob = "";
            if (data.dateOfBirth) {
                // If it comes as ISO string
                dob = new Date(data.dateOfBirth).toISOString().split('T')[0];
            }

            setFormData({
                fullName: data.fullName,
                phone: data.phone,
                emergencyContactNumber: data.emergencyContactNumber || "",
                dateOfBirth: dob,
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to load profile");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCancel = () => {
        setIsEditing(false);
        if (profile) {
            let dob = "";
            if (profile.dateOfBirth) {
                dob = new Date(profile.dateOfBirth).toISOString().split('T')[0];
            }
            setFormData({
                fullName: profile.fullName,
                phone: profile.phone,
                emergencyContactNumber: profile.emergencyContactNumber || "",
                dateOfBirth: dob,
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await ClientProfileService.updateProfile({
                ...formData,
                // Pass date only if present, or null? Service expects Partial<Client>.
                // Backend expects Date object or string. DTO says Date. 
                // JSON payload will send string "YYYY-MM-DD". Mongoose casts it.
            });
            toast.success("Profile updated successfully");
            await fetchProfile(); // Refresh
            setIsEditing(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <ClientDashboardLayout>
                <div className="flex items-center justify-center h-[60vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-[#00ffd5]" />
                </div>
            </ClientDashboardLayout>
        );
    }

    return (
        <ClientDashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
                        <p className="text-slate-500">Manage your personal and emergency information.</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* READ ONLY FIELDS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                    <Mail size={16} /> Email Address
                                </label>
                                <input
                                    type="email"
                                    value={profile?.email || ""}
                                    disabled
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                                />
                                <p className="text-xs text-slate-400">Email cannot be changed.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                    <User size={16} /> Trainer
                                </label>
                                <input
                                    type="text"
                                    value={profile?.assignedTrainer ? "Assigned" : "None Assigned"}
                                    // ideally we fetch trainer name, but for now just showing status or ID is complex without extra fetch.
                                    disabled
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                                />
                                <p className="text-xs text-slate-400">Assigned by Gym.</p>
                            </div>
                        </div>

                        <div className="h-px bg-slate-100" />

                        {/* EDITABLE FIELDS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                    <User size={16} /> Full Name
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00ffd5]/50 focus:border-[#00ffd5] transition-all disabled:bg-slate-50 disabled:text-slate-500"
                                    required
                                    disabled={!isEditing}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                    <Phone size={16} /> Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00ffd5]/50 focus:border-[#00ffd5] transition-all disabled:bg-slate-50 disabled:text-slate-500"
                                    required
                                    disabled={!isEditing}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                    <HeartPulse size={16} /> Emergency Contact
                                </label>
                                <input
                                    type="tel"
                                    name="emergencyContactNumber"
                                    value={formData.emergencyContactNumber}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00ffd5]/50 focus:border-[#00ffd5] transition-all disabled:bg-slate-50 disabled:text-slate-500"
                                    placeholder="Emergency Phone Number"
                                    disabled={!isEditing}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                    <Calendar size={16} /> Date of Birth
                                </label>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00ffd5]/50 focus:border-[#00ffd5] transition-all disabled:bg-slate-50 disabled:text-slate-500"
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            {!isEditing ? (
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-6 py-3 bg-[#00ffd5] text-slate-900 font-bold rounded-xl hover:bg-[#00ffd5]/90 transition-all hover:shadow-[0_4px_20px_rgba(0,255,213,0.3)]"
                                >
                                    <Pencil size={20} />
                                    Edit Profile
                                </button>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        disabled={isSaving}
                                        className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
                                    >
                                        <X size={20} />
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="flex items-center gap-2 px-6 py-3 bg-[#00ffd5] text-slate-900 font-bold rounded-xl hover:bg-[#00ffd5]/90 transition-all hover:shadow-[0_4px_20px_rgba(0,255,213,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                                        Save Changes
                                    </button>
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </ClientDashboardLayout>
    );
}
