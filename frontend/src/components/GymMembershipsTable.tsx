import { memo } from 'react';
import { Loader2, Edit2, Trash2, Eye } from 'lucide-react';
import type { Membership } from '../modules/gym/services/MembershipService';

interface GymMembershipsTableProps {
    memberships: Membership[];
    isLoading: boolean;
    searchQuery: string;
    currentPage: number;
    totalPages: number;
    total: number;
    limit: number;
    onView: (membership: Membership) => void;
    onEdit: (membership: Membership) => void;
    onDelete: (id: string) => void;
    onPageChange: (page: number) => void;
}

const GymMembershipsTable = memo(({
    memberships,
    isLoading,
    searchQuery,
    currentPage,
    totalPages,
    total,
    limit,
    onView,
    onEdit,
    onDelete,
    onPageChange
}: GymMembershipsTableProps) => {
    console.log('GymMembershipsTable rendered');

    if (isLoading && memberships.length === 0) {
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
            ) : memberships.length === 0 ? (
                <div className="p-12 text-center">
                    <p className="text-slate-500">
                        {searchQuery ? "No memberships found" : "No active memberships"}
                    </p>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Client</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Plan</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Start Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Expiry Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Days</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {memberships.map((membership) => (
                                    <tr key={membership.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-medium text-slate-900">{membership.clientName}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-600">{membership.planName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${membership.planType === 'category' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                                                {membership.planType === 'category' ? 'Category' : 'Day-based'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                                            {new Date(membership.startDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                                            {membership.expiredDate ? new Date(membership.expiredDate).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                                            {membership.remainingDays !== null ? `${membership.remainingDays}/${membership.totalPurchasedDays}` : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {membership.status === 'active' ? (
                                                <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Active
                                                </span>
                                            ) : membership.status === 'expired' ? (
                                                <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    Expired
                                                </span>
                                            ) : (
                                                <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    Cancelled
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => onView(membership)}
                                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                                >
                                                    <Eye size={18} className="text-slate-600" />
                                                </button>
                                                <button
                                                    onClick={() => onEdit(membership)}
                                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                                >
                                                    <Edit2 size={18} className="text-slate-600" />
                                                </button>
                                                <button
                                                    onClick={() => onDelete(membership.id)}
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
                                Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, total)} of {total} memberships
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
        prevProps.memberships === nextProps.memberships &&
        prevProps.isLoading === nextProps.isLoading &&
        prevProps.currentPage === nextProps.currentPage &&
        prevProps.totalPages === nextProps.totalPages &&
        prevProps.total === nextProps.total &&
        prevProps.onView === nextProps.onView &&
        prevProps.onEdit === nextProps.onEdit &&
        prevProps.onDelete === nextProps.onDelete &&
        prevProps.onPageChange === nextProps.onPageChange
    );
});

GymMembershipsTable.displayName = 'GymMembershipsTable';

export default GymMembershipsTable;
