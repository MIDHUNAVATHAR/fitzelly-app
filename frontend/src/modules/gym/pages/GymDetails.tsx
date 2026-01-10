import { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { Pencil, Save, MapPin, Phone, Building, Loader2 } from 'lucide-react';
import { useGymProfile, useUpdateGymProfile } from '../hooks/useGymProfile';
import ImageCropper from '../../../components/ImageCropper';

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
    const { data: user, isLoading } = useGymProfile();
    const updateProfileMutation = useUpdateGymProfile();
    const [isEditing, setIsEditing] = useState(false);
    const [logoFile, setLogoFile] = useState<Blob | null>(null);
    const [previewLogo, setPreviewLogo] = useState<string | null>(null);

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
            if (u.logoUrl) setPreviewLogo(u.logoUrl);
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

    const handleSave = () => {
        const payload = new FormData();
        payload.append('gymName', formData.gymName);
        payload.append('ownerName', formData.ownerName);
        payload.append('description', formData.description);
        payload.append('phone', formData.phone);
        payload.append('address', JSON.stringify(formData.address));

        if (logoFile) {
            payload.append('profileImage', logoFile, 'logo.png');
            console.log("Frontend: Appending profileImage to FormData", logoFile);
        } else {
            console.log("Frontend: No logoFile to append");
        }

        // Debugging: Log FormData entries
        for (const pair of payload.entries()) {
            console.log(pair[0], pair[1]);
        }

        updateProfileMutation.mutate(payload, {
            onSuccess: () => {
                setIsEditing(false);
                setLogoFile(null);
            }
        });
    };

    const handleLogoCrop = (file: Blob) => {
        setLogoFile(file);
        setPreviewLogo(URL.createObjectURL(file));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && isEditing) {
            handleSave();
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex h-[80vh] items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#00ffd5]" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>


            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Gym Details</h1>
                    <p className="text-slate-500 mt-1">Manage your gym information</p>
                </div>
                <button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    disabled={updateProfileMutation.isPending}
                    className={`
                        flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all shadow-md
                        ${isEditing
                            ? 'bg-[#00ffd5] hover:bg-[#00e6c0] text-slate-900 shadow-[0_4px_14px_0_rgba(0,255,213,0.39)]'
                            : 'bg-[#00ffd5] hover:bg-[#00e6c0] text-slate-900 shadow-[0_4px_14px_0_rgba(0,255,213,0.39)]'
                        }
                        ${updateProfileMutation.isPending ? 'opacity-70 cursor-not-allowed' : ''}
                    `}
                >
                    {updateProfileMutation.isPending ? (
                        <Loader2 size={20} className="animate-spin text-slate-900" />
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
                        {isEditing ? (
                            <div className="w-full">
                                <ImageCropper
                                    image={previewLogo || undefined}
                                    onCropComplete={handleLogoCrop}
                                    label="Update Gym Logo"
                                    circularCrop={true}
                                />
                            </div>
                        ) : (
                            <div className="w-16 h-16 rounded-full overflow-hidden border border-slate-200 flex items-center justify-center bg-teal-50">
                                {previewLogo ? (
                                    <img src={previewLogo} alt="Gym Logo" className="w-full h-full object-cover" />
                                ) : (
                                    <Building className="text-teal-600 w-8 h-8" />
                                )}
                            </div>
                        )}
                        {!isEditing && <h2 className="text-lg font-bold text-slate-900">Basic Information</h2>}
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
