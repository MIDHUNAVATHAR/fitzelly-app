import { memo } from 'react';
import { Loader2, Edit, Plus } from 'lucide-react';
import type { AssignedClient } from '../modules/trainer/services/TrainerClientsService';

interface ClientsTableProps {
    clients: AssignedClient[];
    isLoading: boolean;
    searchInput: string;
    onManagePlan: (client: AssignedClient) => void;
}

export const ClientsTable = memo(({ clients, isLoading, searchInput, onManagePlan }: ClientsTableProps) => {
    if (isLoading) {
        return (
            <div className="p-12 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-[#00ffd5]" />
            </div>
        );
    }

    if (clients.length === 0) {
        return (
            <div className="p-12 text-center">
                <p className="text-slate-500">
                    {searchInput ? "No clients found matching your search" : "No clients assigned yet"}
                </p>
            </div>
        );
    }

    return (
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
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
});

ClientsTable.displayName = 'ClientsTable';
