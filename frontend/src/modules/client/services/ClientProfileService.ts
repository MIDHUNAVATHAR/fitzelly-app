import { api } from "../../../services/api";
import type { Client } from "../../gym/services/ClientService";

export const ClientProfileService = {
    getProfile: async (): Promise<Client> => {
        const response = await api.get('/client-profile/profile');
        return response.data.data;
    },

    updateProfile: async (data: Partial<Client>): Promise<Client> => {
        const response = await api.put('/client-profile/profile', data);
        return response.data.data;
    }
}
