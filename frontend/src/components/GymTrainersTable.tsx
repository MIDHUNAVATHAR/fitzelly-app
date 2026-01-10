import { memo } from 'react';
import { Loader2, Edit2, Trash2, Eye, Mail, Ban, CheckCircle, AlertTriangle } from 'lucide-react';
import type { Trainer } from '../modules/gym/services/TrainerService';

interface GymTrainersTableProps {
    trainers: Trainer[];
    isLoading: boolean;
    searchQuery: string;
    currentPage: number;
    totalPages: number;
    total: number;
    limit: number;
    sendingEmailId: string | null;
    onView: (trainer: Trainer) => void;
    onEdit: (trainer: Trainer) => void;
    onDelete: (id: string) => void;
    onBlock: (trainer: Trainer) => void;
    onSendEmail: (id: string) => void;
    onPageChange: (page: number) => void;
}

const GymTrainersTable = memo(({
    trainers,
    isLoading,
    searchQuery,
    currentPage,
    totalPages,
    total,
    limit,
    sendingEmailId,
    onView,
    onEdit,
    onDelete,
    onBlock,
    onSendEmail,
    onPageChange
}: GymTrainersTableProps) => {
    console.log('GymTrainersTable rendered');

    if (isLoading && trainers.length === 0) {
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
            ) : trainers.length === 0 ? (
                <div className="p-12 text-center">
                    <p className="text-slate-500">
                        {searchQuery ? "No trainers found" : "No trainers yet"}
                    </p>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Phone</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Specialization</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Salary</th>

                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {trainers.map((trainer) => (
                                    <tr key={trainer.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-slate-900">{trainer.fullName}</span>
                                                {trainer.isBlocked && (
                                                    <Ban size={16} className="text-red-500" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <span className="text-slate-600">{trainer.email}</span>
                                                {trainer.isEmailVerified ? (
                                                    <div className="group relative">
                                                        <CheckCircle size={16} className="text-green-500 cursor-help" />
                                                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                            Verified
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="group relative">
                                                        <AlertTriangle size={16} className="text-amber-500 cursor-help" />
                                                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                            Unverified
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-600">{trainer.phone}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-600">{trainer.specialization || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-600">₹{trainer.monthlySalary || 0}</td>

                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => onView(trainer)}
                                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} className="text-slate-600" />
                                                </button>
                                                <button
                                                    onClick={() => onEdit(trainer)}
                                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={18} className="text-slate-600" />
                                                </button>
                                                <button
                                                    onClick={() => onSendEmail(trainer.id)}
                                                    disabled={sendingEmailId === trainer.id}
                                                    className="p-2 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Send Welcome Email"
                                                >
                                                    {sendingEmailId === trainer.id ? (
                                                        <Loader2 size={18} className="text-blue-500 animate-spin" />
                                                    ) : (
                                                        <Mail size={18} className="text-blue-500" />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => onBlock(trainer)}
                                                    className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
                                                    title={trainer.isBlocked ? "Unblock" : "Block"}
                                                >
                                                    <Ban size={18} className={trainer.isBlocked ? "text-green-500" : "text-orange-500"} />
                                                </button>
                                                <button
                                                    onClick={() => onDelete(trainer.id)}
                                                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
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
                                Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, total)} of {total} trainers
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
    // Custom comparison - only re-render if these specific props change
    return (
        prevProps.trainers === nextProps.trainers &&
        prevProps.isLoading === nextProps.isLoading &&
        prevProps.currentPage === nextProps.currentPage &&
        prevProps.totalPages === nextProps.totalPages &&
        prevProps.total === nextProps.total &&
        prevProps.sendingEmailId === nextProps.sendingEmailId &&
        prevProps.onView === nextProps.onView &&
        prevProps.onEdit === nextProps.onEdit &&
        prevProps.onDelete === nextProps.onDelete &&
        prevProps.onBlock === nextProps.onBlock &&
        prevProps.onSendEmail === nextProps.onSendEmail &&
        prevProps.onPageChange === nextProps.onPageChange
    );
});

GymTrainersTable.displayName = 'GymTrainersTable';

export default GymTrainersTable;
