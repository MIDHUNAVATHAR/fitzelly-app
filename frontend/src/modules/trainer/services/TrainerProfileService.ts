import { api } from "../../../services/api";
import type { Trainer } from "../../gym/services/TrainerService";

export const TrainerProfileService = {
    getProfile: async (): Promise<Trainer> => {
        const response = await api.get('/trainer-profile/profile');
        return response.data.data;
    },

    updateProfile: async (data: Partial<Trainer>): Promise<Trainer> => {
        const response = await api.put('/trainer-profile/profile', data);
        return response.data.data;
    }
}
