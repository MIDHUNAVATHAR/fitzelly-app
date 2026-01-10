import { api } from "../../../services/api";

export interface Trainer {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    specialization: string;
    monthlySalary: number;
    biography?: string;
    dateOfBirth?: string; // string when coming from API JSON
    isBlocked: boolean;
    isEmailVerified: boolean;
    createdAt: string;
}

export interface TrainerListResponse {
    trainers: Trainer[];
    total: number;
    page: number;
    limit: number;
}

export const TrainerService = {
    getTrainers: async (page: number = 1, limit: number = 10, search: string = ''): Promise<TrainerListResponse> => {
        const response = await api.get('/gym-trainer/trainers', { params: { page, limit, search } });
        return response.data.data;
    },

    createTrainer: async (data: Omit<Trainer, 'id' | 'createdAt'>): Promise<Trainer> => {
        const response = await api.post('/gym-trainer/trainers', data);
        return response.data.data;
    },

    updateTrainer: async (id: string, data: Partial<Omit<Trainer, 'id' | 'createdAt'>>): Promise<Trainer> => {
        const response = await api.put(`/gym-trainer/trainers/${id}`, data);
        return response.data.data;
    },

    deleteTrainer: async (id: string): Promise<void> => {
        await api.delete(`/gym-trainer/trainers/${id}`);
    },

    sendWelcomeEmail: async (id: string): Promise<void> => {
        await api.post(`/gym-trainer/trainers/${id}/welcome`);
    }
}
