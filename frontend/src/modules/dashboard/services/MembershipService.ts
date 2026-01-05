import { api } from "../../../services/api";

export interface Membership {
    id: string;
    clientId: string;
    clientName: string;
    planId: string;
    planName: string;
    planType: 'category' | 'day';
    startDate: string;
    expiredDate: string | null;
    totalPurchasedDays: number | null;
    remainingDays: number | null;
    status: 'active' | 'expired' | 'cancelled';
}

interface MembershipsResponse {
    items: Membership[];
    total: number;
}

export const MembershipService = {
    getMemberships: async (page = 1, limit = 10, search = '', planType = 'all') => {
        const response = await api.get<any>(`/gym-membership/memberships`, {
            params: { page, limit, search, planType }
        });
        return response.data.data as MembershipsResponse;
    },

    createMembership: async (data: { clientId: string; planId: string; startDate: string; expiredDate: string | null; totalPurchasedDays: number | null; remainingDays: number | null }) => {
        const response = await api.post('/gym-membership/memberships', data);
        return response.data;
    },

    updateMembership: async (id: string, data: { planId?: string; startDate?: string; expiredDate?: string | null; totalPurchasedDays?: number | null; remainingDays?: number | null }) => {
        const response = await api.put(`/gym-membership/memberships/${id}`, data);
        return response.data;
    },

    deleteMembership: async (id: string) => {
        const response = await api.delete(`/gym-membership/memberships/${id}`);
        return response.data;
    }
};
