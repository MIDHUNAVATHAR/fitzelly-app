import { api } from "../../../services/api";

export interface GymSummary {
    id: string;
    gymName: string;
    ownerName: string;
    email: string;
    phone: string;
    city: string;
    state: string;
    joinedAt: string;
    isBlocked?: boolean;
}

export interface PaginatedGyms {
    gyms: GymSummary[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export const GymListingService = {
    getGyms: async (page: number = 1, limit: number = 10, search: string = ''): Promise<PaginatedGyms> => {
        try {
            const response = await api.get(`/super-admin/gyms?page=${page}&limit=${limit}&search=${search}`);
            return response.data.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch gyms');
        }
    },

    getGymDetails: async (id: string): Promise<GymSummary> => {
        try {
            const response = await api.get(`/super-admin/gyms/${id}`);
            return response.data.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch gym details');
        }
    },

    blockGym: async (id: string, isBlocked: boolean): Promise<void> => {
        try {
            await api.patch(`/super-admin/gyms/${id}/block`, { isBlocked });
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to update gym status');
        }
    },

    deleteGym: async (id: string): Promise<void> => {
        try {
            await api.delete(`/super-admin/gyms/${id}`);
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to delete gym');
        }
    }
};
