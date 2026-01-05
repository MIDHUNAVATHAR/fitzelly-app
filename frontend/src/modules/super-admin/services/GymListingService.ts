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
    }
};
