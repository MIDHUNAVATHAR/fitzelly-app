import { memo } from 'react';
import { Loader2, Edit, Plus, Eye } from 'lucide-react';
import type { AssignedClient } from '../modules/trainer/services/TrainerClientsService';

interface ClientListSectionProps {
    clients: AssignedClient[];
    isLoading: boolean;
    searchQuery: string;
    currentPage: number;
    totalPages: number;
    total: number;
    limit: number;
    onManagePlan: (client: AssignedClient) => void;
    onViewClient: (clientId: string) => void;
    onPageChange: (page: number) => void;
}

const ClientListSection = memo(({
    clients,
    isLoading,
    searchQuery,
    currentPage,
    totalPages,
    total,
    limit,
    onManagePlan,
    onViewClient,
    onPageChange
}: ClientListSectionProps) => {
    console.log('ClientListSection rendered'); // Debug log

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
            {/* Table */}
            {isLoading ? (
                <div className="p-12 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-[#00ffd5]" />
                </div>
            ) : clients.length === 0 ? (
                <div className="p-12 text-center">
                    <p className="text-slate-500">
                        {searchQuery ? "No clients found matching your search" : "No clients assigned yet"}
                    </p>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                        Client Name
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                        Phone
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                        Workout Plan
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {clients.map((client) => (
                                    <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-slate-900">{client.fullName}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                                            {client.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                                            {client.phone}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {client.hasWorkoutPlan ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                                                    None
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => onViewClient(client.id)}
                                                    className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye size={20} />
                                                </button>
                                                <button
                                                    onClick={() => onManagePlan(client)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00ffd5] text-slate-900 font-medium text-sm rounded-lg hover:bg-[#00ffd5]/90 transition-all"
                                                >
                                                    {client.hasWorkoutPlan ? (
                                                        <>
                                                            <Edit size={16} />
                                                            Manage Plan
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Plus size={16} />
                                                            Create Plan
                                                        </>
                                                    )}
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
    // Custom comparison function - only re-render if these specific props change
    return (
        prevProps.clients === nextProps.clients &&
        prevProps.isLoading === nextProps.isLoading &&
        prevProps.currentPage === nextProps.currentPage &&
        prevProps.totalPages === nextProps.totalPages &&
        prevProps.total === nextProps.total &&
        prevProps.onManagePlan === nextProps.onManagePlan &&
        prevProps.onViewClient === nextProps.onViewClient &&
        prevProps.onPageChange === nextProps.onPageChange
        // Note: searchQuery is intentionally excluded from comparison
        // It's only used for the empty state message, not for rendering logic
    );
});

ClientListSection.displayName = 'ClientListSection';

export default ClientListSection;
