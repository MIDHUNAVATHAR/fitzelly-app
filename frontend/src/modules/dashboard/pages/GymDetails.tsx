import { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { Pencil, Save, MapPin, Phone, Building, CheckCircle } from 'lucide-react';
import { useAuth } from '../../auth/context/AuthContext';
import { AuthService } from '../../auth/services/AuthService';

interface InputGroupProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: any) => void;
    isEditing: boolean;
    placeholder?: string;
    onKeyDown?: (e: React.KeyboardEvent) => void;
}

export default function GymDetails() {
    const { user, checkAuth } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const [formData, setFormData] = useState({
        gymName: '',
        ownerName: '',
        description: '',
        phone: '',
        email: '',
        address: {
            street: '',
            city: '',
            state: '',
            pincode: '',
            mapLink: ''
        }
    });

    useEffect(() => {
        if (user) {
            const u = user as any;
            setFormData({
                gymName: u.gymName || '',
                ownerName: u.ownerName || '',
                description: u.description || '',
                phone: u.phone || '',
                email: u.email || '',
                address: {
                    street: u.address?.street || '',
                    city: u.address?.city || '',
                    state: u.address?.state || '',
                    pincode: u.address?.pincode || '',
                    mapLink: u.address?.mapLink || ''
                }
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const { email, ...payload } = formData;
            await AuthService.updateProfile(payload);
            await checkAuth(false); // Refresh user data to show updated values without full page loader
            setIsEditing(false);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 4000);
        } catch (error) {
            console.error("Failed to save profile", error);
            // Optionally show error toast here
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && isEditing) {
            handleSave();
        }
    };

    return (
        <DashboardLayout>
            {/* Toast Notification */}
            {showToast && (
                <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-bounce-in">
                    <div className="w-6 h-6 bg-[#00ffd5] rounded-full flex items-center justify-center">
                        <CheckCircle size={14} className="text-slate-900" strokeWidth={3} />
                    </div>
                    <span className="font-semibold">Profile updated successfully</span>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Gym Details</h1>
                    <p className="text-slate-500 mt-1">Manage your gym information</p>
                </div>
                <button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    disabled={isLoading}
                    className={`
                        flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all shadow-md
                        ${isEditing
                            ? 'bg-[#00ffd5] hover:bg-[#00e6c0] text-slate-900 shadow-[0_4px_14px_0_rgba(0,255,213,0.39)]'
                            : 'bg-[#00ffd5] hover:bg-[#00e6c0] text-slate-900 shadow-[0_4px_14px_0_rgba(0,255,213,0.39)]'
                        }
                        ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
                    `}
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                    ) : isEditing ? (
                        <>
                            <Save size={18} />
                            Save Details
                        </>
                    ) : (
                        <>
                            <Pencil size={18} />
                            Edit Details
                        </>
                    )}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Basic Information */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                            <Building className="text-teal-600 w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">Basic Information</h2>
                    </div>

                    <div className="space-y-5 flex-1">
                        <InputGroup
                            label="Gym Name"
                            name="gymName"
                            value={formData.gymName}
                            onChange={handleChange}
                            isEditing={isEditing}
                            placeholder="e.g. FitZone Gym"
                            onKeyDown={handleKeyDown}
                        />
                        <InputGroup
                            label="Owner Name"
                            name="ownerName"
                            value={formData.ownerName}
                            onChange={handleChange}
                            isEditing={isEditing}
                            placeholder="e.g. Rajesh Kumar"
                            onKeyDown={handleKeyDown}
                        />
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-slate-700">Description</label>
                            {isEditing ? (
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Tell us about your gym..."
                                    rows={4}
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ffd5] focus:border-transparent text-slate-900 placeholder:text-slate-400 transition-all resize-none"
                                />
                            ) : (
                                <p className="text-slate-600 leading-relaxed py-2 min-h-[5rem] whitespace-pre-wrap">
                                    {formData.description || 'No description provided yet.'}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Phone className="text-blue-600 w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">Contact Information</h2>
                    </div>

                    <div className="space-y-5 flex-1">
                        <InputGroup
                            label="Phone Number"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            isEditing={isEditing}
                            placeholder="e.g. +91 98765 43210"
                            onKeyDown={handleKeyDown}
                        />
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-slate-700">Email Address</label>
                            <div className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed">
                                {formData.email}
                            </div>
                            <p className="text-xs text-slate-400">Email cannot be changed</p>
                        </div>
                    </div>
                </div>

                {/* Address & Location */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 lg:col-span-2">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                            <MapPin className="text-emerald-600 w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">Address & Location</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <InputGroup
                                label="Street Address"
                                name="address.street"
                                value={formData.address.street}
                                onChange={handleChange}
                                isEditing={isEditing}
                                placeholder="e.g. 123, Main Street, Sector 21"
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        <InputGroup
                            label="City"
                            name="address.city"
                            value={formData.address.city}
                            onChange={handleChange}
                            isEditing={isEditing}
                            placeholder="e.g. Mumbai"
                            onKeyDown={handleKeyDown}
                        />
                        <InputGroup
                            label="State"
                            name="address.state"
                            value={formData.address.state}
                            onChange={handleChange}
                            isEditing={isEditing}
                            placeholder="e.g. Maharashtra"
                            onKeyDown={handleKeyDown}
                        />
                        <InputGroup
                            label="Pincode"
                            name="address.pincode"
                            value={formData.address.pincode}
                            onChange={handleChange}
                            isEditing={isEditing}
                            placeholder="e.g. 400001"
                            onKeyDown={handleKeyDown}
                        />
                        <InputGroup
                            label="Google Maps Link"
                            name="address.mapLink"
                            value={formData.address.mapLink}
                            onChange={handleChange}
                            isEditing={isEditing}
                            placeholder="https://maps.google.com/..."
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

// Helper component for input fields
function InputGroup({
    label, name, value, onChange, isEditing, placeholder, onKeyDown
}: InputGroupProps) {
    return (
        <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">{label}</label>
            {isEditing ? (
                <input
                    type="text"
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    onKeyDown={onKeyDown}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ffd5] focus:border-transparent text-slate-900 placeholder:text-slate-400 transition-all"
                />
            ) : (
                <div className="w-full px-4 py-3 bg-transparent border border-transparent rounded-xl text-slate-800 -ml-4">
                    {value || <span className="text-slate-400 italic">Not provided</span>}
                </div>
            )}
        </div>
    );
}
