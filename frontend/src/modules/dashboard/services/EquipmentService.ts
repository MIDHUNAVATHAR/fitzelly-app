import { api } from "../../../services/api";

export interface GymEquipment {
    id: string;
    gymId: string;
    name: string;
    photoUrl: string;
    windowTime: number; // minutes
    condition: 'good' | 'bad';
    isDeleted: boolean;
}

export interface CreateEquipmentDTO {
    name: string;
    photoUrl?: string;
    windowTime: number;
    condition?: 'good' | 'bad';
}

export interface UpdateEquipmentDTO {
    name?: string;
    photoUrl?: string;
    windowTime?: number;
    condition?: 'good' | 'bad';
}

export const EquipmentService = {
    getAll: async (page = 1, limit = 10, search = ''): Promise<{ items: GymEquipment[], total: number }> => {
        try {
            const response = await api.get('/gym-equipment', {
                params: { page, limit, search }
            });
            return response.data.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch equipment');
        }
    },

    create: async (data: CreateEquipmentDTO): Promise<GymEquipment> => {
        try {
            const response = await api.post('/gym-equipment', data);
            return response.data.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to create equipment');
        }
    },

    update: async (id: string, data: UpdateEquipmentDTO): Promise<GymEquipment> => {
        try {
            const response = await api.put(`/gym-equipment/${id}`, data);
            return response.data.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to update equipment');
        }
    },

    delete: async (id: string): Promise<void> => {
        try {
            await api.delete(`/gym-equipment/${id}`);
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to delete equipment');
        }
    }
};
