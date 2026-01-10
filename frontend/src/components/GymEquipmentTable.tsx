import { memo } from 'react';
import { Loader2, Edit2, Trash2 } from 'lucide-react';
import type { GymEquipment } from '../modules/gym/services/EquipmentService';

interface GymEquipmentTableProps {
    equipment: GymEquipment[];
    isLoading: boolean;
    searchQuery: string;
    currentPage: number;
    totalPages: number;
    total: number;
    limit: number;
    onEdit: (equipment: GymEquipment) => void;
    onDelete: (id: string) => void;
    onPageChange: (page: number) => void;
}

const GymEquipmentTable = memo(({
    equipment,
    isLoading,
    searchQuery,
    currentPage,
    totalPages,
    total,
    limit,
    onEdit,
    onDelete,
    onPageChange
}: GymEquipmentTableProps) => {
    console.log('GymEquipmentTable rendered');

    if (isLoading && equipment.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-12 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-[#00ffd5]" />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {isLoading ? (
                <div className="p-12 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-[#00ffd5]" />
                </div>
            ) : equipment.length === 0 ? (
                <div className="p-12 text-center">
                    <p className="text-slate-500">
                        {searchQuery ? "No equipment found" : "No equipment added yet"}
                    </p>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Photo</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Window Time</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Condition</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {equipment.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {item.photoUrl ? (
                                                <img
                                                    src={item.photoUrl}
                                                    alt={item.name}
                                                    className="w-12 h-12 rounded-lg object-cover"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-xs">
                                                    No Image
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-medium text-slate-900">{item.name}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                                            {item.windowTime} minutes
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${item.condition === 'good' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {item.condition === 'good' ? 'Good' : 'Bad'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => onEdit(item)}
                                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                                >
                                                    <Edit2 size={18} className="text-slate-600" />
                                                </button>
                                                <button
                                                    onClick={() => onDelete(item.id)}
                                                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} className="text-red-500" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                            <p className="text-sm text-slate-600">
                                Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, total)} of {total} items
                            </p>
                            <div className="flex gap-2 items-center">
                                <button
                                    onClick={() => onPageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    Previous
                                </button>
                                <span className="px-4 py-2 text-sm font-medium text-slate-700">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => onPageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}, (prevProps, nextProps) => {
    return (
        prevProps.equipment === nextProps.equipment &&
        prevProps.isLoading === nextProps.isLoading &&
        prevProps.currentPage === nextProps.currentPage &&
        prevProps.totalPages === nextProps.totalPages &&
        prevProps.total === nextProps.total &&
        prevProps.onEdit === nextProps.onEdit &&
        prevProps.onDelete === nextProps.onDelete &&
        prevProps.onPageChange === nextProps.onPageChange
    );
});

GymEquipmentTable.displayName = 'GymEquipmentTable';

export default GymEquipmentTable;
