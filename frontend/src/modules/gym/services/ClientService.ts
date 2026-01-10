import { api } from "../../../services/api";

export interface Client {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    status: 'active' | 'inactive' | 'expired';
    isEmailVerified: boolean;
    isBlocked: boolean;
    createdAt: string;
    assignedTrainer?: string | null;
    emergencyContactNumber?: string;
    dateOfBirth?: string; // date string from API
}

export interface ClientListResponse {
    clients: Client[];
    total: number;
    page: number;
    limit: number;
}

export const ClientService = {
    getClients: async (page: number = 1, limit: number = 10, search: string = '', status: string = ''): Promise<ClientListResponse> => {
        const response = await api.get('/gym-client/clients', { params: { page, limit, search, status } });
        return response.data.data;
    },

    createClient: async (data: Omit<Client, 'id' | 'createdAt' | 'status' | 'isEmailVerified'>): Promise<Client> => {
        const response = await api.post('/gym-client/clients', data);
        return response.data.data;
    },

    updateClient: async (id: string, data: Partial<Omit<Client, 'id' | 'createdAt' | 'status' | 'isEmailVerified'>>): Promise<Client> => {
        const response = await api.put(`/gym-client/clients/${id}`, data);
        return response.data.data;
    },

    deleteClient: async (id: string): Promise<void> => {
        await api.delete(`/gym-client/clients/${id}`);
    },

    sendWelcomeEmail: async (id: string): Promise<void> => {
        await api.post(`/gym-client/clients/${id}/welcome`);
    }
}
