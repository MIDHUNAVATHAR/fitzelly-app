import { api } from "../../../services/api";
import type { Client } from "../../gym/services/ClientService";

export interface AssignedTrainerDTO {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    specialization: string;
    biography?: string;
}

export const ClientProfileService = {
    getProfile: async (): Promise<Client> => {
        const response = await api.get('/client-profile/profile');
        return response.data.data;
    },

    updateProfile: async (data: Partial<Client> | FormData): Promise<Client> => {
        const response = await api.put('/client-profile/profile', data);
        return response.data.data;
    },

    getAssignedTrainer: async (): Promise<AssignedTrainerDTO> => {
        const response = await api.get('/client-profile/trainer');
        return response.data.data;
    }
}
