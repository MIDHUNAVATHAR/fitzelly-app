import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '../layouts/DashboardLayout';
import { Search, Plus, Edit2, Trash2, X, Upload, CheckCircle, Loader2 } from 'lucide-react';
import { EquipmentService, type GymEquipment, type CreateEquipmentDTO } from '../services/EquipmentService';
import Cropper, { type Area } from 'react-easy-crop';
import { getCroppedImg } from '../../../utils/canvasUtils';

export default function GymEquipmentPage() {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const limit = 10;
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Query
    const { data, isLoading: loading } = useQuery({
        queryKey: ['equipment', page, debouncedSearch],
        queryFn: () => EquipmentService.getAll(page, limit, debouncedSearch)
    });

    const equipments = data?.items || [];
    const total = data?.total || 0;
    const totalPages = Math.ceil(total / limit);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState<GymEquipment | null>(null);
    const [toast, setToast] = useState({ show: false, message: '' });

    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => {
                setToast({ show: false, message: '' });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [toast.show]);

    // Form Stats
    const [formData, setFormData] = useState<CreateEquipmentDTO>({
        name: '',
        windowTime: 60,
        condition: 'good',
        photoUrl: ''
    });

    // Image Crop State
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [isCropping, setIsCropping] = useState(false);

    // Mutations
    const createMutation = useMutation({
        mutationFn: EquipmentService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['equipment'] });
            setIsCreateModalOpen(false);
            resetForm();
            setToast({ show: true, message: 'Equipment added successfully' });
        },
        onError: () => console.error("Failed to create equipment")
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: CreateEquipmentDTO }) => EquipmentService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['equipment'] });
            setIsEditModalOpen(false);
            resetForm();
            setToast({ show: true, message: 'Equipment updated successfully' });
        },
        onError: () => console.error("Failed to update equipment")
    });

    const deleteMutation = useMutation({
        mutationFn: EquipmentService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['equipment'] });
            setIsDeleteModalOpen(false);
            setToast({ show: true, message: 'Equipment deleted successfully' });
        },
        onError: () => console.error("Failed to delete equipment")
    });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImageSrc(reader.result?.toString() || '');
                setIsCropping(true);
            });
            reader.readAsDataURL(file);
        }
    };

    const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const showCroppedImage = async () => {
        try {
            if (imageSrc && croppedAreaPixels) {
                const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
                if (croppedImage) {
                    setFormData(prev => ({ ...prev, photoUrl: croppedImage }));
                    setIsCropping(false);
                    setImageSrc(null);
                }
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate(formData);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEquipment) return;
        updateMutation.mutate({ id: selectedEquipment.id, data: formData });
    };

    const handleDelete = () => {
        if (!selectedEquipment) return;
        deleteMutation.mutate(selectedEquipment.id);
    };

    const openEditModal = (eq: GymEquipment) => {
        setSelectedEquipment(eq);
        setFormData({
            name: eq.name,
            windowTime: eq.windowTime,
            condition: eq.condition,
            photoUrl: eq.photoUrl || ''
        });
        setIsEditModalOpen(true);
    };

    const resetForm = () => {
        setFormData({ name: '', windowTime: 60, condition: 'good', photoUrl: '' });
        setImageSrc(null);
        setIsCropping(false);
        setSelectedEquipment(null);
    };

    // Explicit loading state for page transition
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
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                        Equipment Slots
                    </h1>
                    <p className="text-slate-500 mt-1">Manage gym equipment and client capacity per slot</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsCreateModalOpen(true); }}
                    className="bg-[#00ffd5] text-slate-900 px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#00ffd5]/20 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                    <Plus size={20} />
                    Add Equipment
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 sticky top-20 z-10">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search equipment..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ffd5] transition-all"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Equipment Name</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Slot Duration</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Condition</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">Loading equipment...</td>
                                </tr>
                            ) : equipments.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No equipment found. Add some!</td>
                                </tr>
                            ) : (
                                equipments.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                                                    {item.photoUrl ? (
                                                        <img src={item.photoUrl} alt={item.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Upload size={20} className="text-slate-400" />
                                                    )}
                                                </div>
                                                <div className="font-semibold text-slate-900">{item.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-slate-900">{item.windowTime}</span>
                                                <span className="text-slate-500">mins</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`text-xs px-2 py-0.5 rounded-full inline-block ${item.condition === 'good' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {item.condition === 'good' ? 'Good Condition' : 'Needs Repair'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => openEditModal(item)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all">
                                                    <Edit2 size={18} />
                                                </button>
                                                <button onClick={() => { setSelectedEquipment(item); setIsDeleteModalOpen(true); }} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
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
                        Showing {total === 0 ? 0 : ((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} equipment
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
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page >= totalPages || total === 0}
                            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Create/Edit Modal */}
            {(isCreateModalOpen || isEditModalOpen) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); }}></div>
                    <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-lg font-bold text-slate-900">
                                {isEditModalOpen ? 'Edit Equipment' : 'Add New Equipment'}
                            </h3>
                            <button onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); }} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={isEditModalOpen ? handleEditSubmit : handleCreateSubmit} className="p-6 space-y-6">
                            {/* Image Upload & Crop */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Equipment Photo</label>
                                {!isCropping ? (
                                    <div className="flex items-center gap-4">
                                        <div className="w-24 h-24 rounded-lg bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden relative group">
                                            {formData.photoUrl ? (
                                                <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <Upload size={24} className="text-slate-400" />
                                            )}
                                            <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        </div>
                                        <div className="text-sm text-slate-500">
                                            <p>Click to upload image.</p>
                                            <p className="text-xs">Supports JPG, PNG</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative h-64 w-full bg-slate-900 rounded-lg overflow-hidden">
                                        <Cropper
                                            image={imageSrc || ''}
                                            crop={crop}
                                            zoom={zoom}
                                            aspect={1}
                                            onCropChange={setCrop}
                                            onCropComplete={onCropComplete}
                                            onZoomChange={setZoom}
                                        />
                                        <button
                                            type="button"
                                            onClick={showCroppedImage}
                                            className="absolute bottom-4 right-4 bg-[#00ffd5] text-slate-900 px-4 py-2 rounded-lg font-semibold shadow-lg hover:bg-[#00e6c0]"
                                        >
                                            Apply Crop
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Equipment Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ffd5] transition-all"
                                    placeholder="e.g. Treadmill"
                                    autoFocus
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Slot Duration (Minutes)</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={formData.windowTime}
                                        onChange={(e) => setFormData({ ...formData, windowTime: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ffd5] transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Condition</label>
                                    <select
                                        value={formData.condition}
                                        onChange={(e) => setFormData({ ...formData, condition: e.target.value as 'good' | 'bad' })}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ffd5] transition-all"
                                    >
                                        <option value="good">Good</option>
                                        <option value="bad">Bad / Maintenance</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); }}
                                    className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createMutation.isPending || updateMutation.isPending}
                                    className="bg-[#00ffd5] text-slate-900 px-6 py-2.5 rounded-xl font-bold hover:shadow-lg hover:shadow-[#00ffd5]/20 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-wait flex items-center gap-2"
                                >
                                    {(createMutation.isPending || updateMutation.isPending) && <Loader2 size={18} className="animate-spin" />}
                                    {isEditModalOpen ? 'Save Changes' : 'Create Equipment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)}></div>
                    <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden p-6 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="text-red-600" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Equipment?</h3>
                        <p className="text-slate-500 mb-6">Are you sure you want to delete this equipment? This action cannot be undone.</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-6 py-2.5 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification - Added missing toast */}
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
