import { memo } from 'react';
import { Loader2, Edit2, Trash2, Eye, Mail, Ban, CheckCircle, AlertTriangle } from 'lucide-react';
import type { Client } from '../modules/gym/services/ClientService';

interface GymClientsTableProps {
    clients: Client[];
    isLoading: boolean;
    searchQuery: string;
    currentPage: number;
    totalPages: number;
    total: number;
    limit: number;
    sendingEmailId: string | null;
    trainersRecord: Record<string, string>;
    onView: (client: Client) => void;
    onEdit: (client: Client) => void;
    onDelete: (id: string) => void;
    onBlock: (client: Client) => void;
    onSendEmail: (id: string) => void;
    onPageChange: (page: number) => void;
}

const GymClientsTable = memo(({
    clients,
    isLoading,
    searchQuery,
    currentPage,
    totalPages,
    total,
    limit,
    sendingEmailId,
    trainersRecord,
    onView,
    onEdit,
    onDelete,
    onBlock,
    onSendEmail,
    onPageChange
}: GymClientsTableProps) => {
    console.log('GymClientsTable rendered');

    if (isLoading && clients.length === 0) {
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
            ) : clients.length === 0 ? (
                <div className="p-12 text-center">
                    <p className="text-slate-500">
                        {searchQuery ? "No clients found" : "No clients yet"}
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
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Trainer</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {clients.map((client) => (
                                    <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-slate-900">{client.fullName}</span>
                                                {client.isBlocked && (
                                                    <Ban size={16} className="text-red-500" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <span className="text-slate-600">{client.email}</span>
                                                {client.isEmailVerified ? (
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
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-600">{client.phone}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                                            {client.assignedTrainer && trainersRecord[client.assignedTrainer]
                                                ? trainersRecord[client.assignedTrainer]
                                                : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {client.status === 'active' ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <CheckCircle size={12} /> Active
                                                </span>
                                            ) : client.status === 'expired' ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                    <AlertTriangle size={12} /> Expired
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                                    <AlertTriangle size={12} /> Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => onView(client)}
                                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} className="text-slate-600" />
                                                </button>
                                                <button
                                                    onClick={() => onEdit(client)}
                                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={18} className="text-slate-600" />
                                                </button>
                                                <button
                                                    onClick={() => onSendEmail(client.id)}
                                                    disabled={sendingEmailId === client.id}
                                                    className="p-2 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Send Welcome Email"
                                                >
                                                    {sendingEmailId === client.id ? (
                                                        <Loader2 size={18} className="text-blue-500 animate-spin" />
                                                    ) : (
                                                        <Mail size={18} className="text-blue-500" />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => onBlock(client)}
                                                    className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
                                                    title={client.isBlocked ? "Unblock" : "Block"}
                                                >
                                                    <Ban size={18} className={client.isBlocked ? "text-green-500" : "text-orange-500"} />
                                                </button>
                                                <button
                                                    onClick={() => onDelete(client.id)}
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
                                Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, total)} of {total} clients
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
        prevProps.clients === nextProps.clients &&
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

GymClientsTable.displayName = 'GymClientsTable';

export default GymClientsTable;
