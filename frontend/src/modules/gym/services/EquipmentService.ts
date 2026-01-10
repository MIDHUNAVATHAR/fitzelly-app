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
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('windowTime', data.windowTime.toString());
            if (data.condition) formData.append('condition', data.condition);

            if (data.photoUrl && data.photoUrl.startsWith('data:')) {
                const blob = await (await fetch(data.photoUrl)).blob();
                formData.append('photo', blob, 'equipment.jpg');
            } else if (data.photoUrl) {
                formData.append('photoUrl', data.photoUrl);
            }

            const response = await api.post('/gym-equipment', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to create equipment');
        }
    },

    update: async (id: string, data: UpdateEquipmentDTO): Promise<GymEquipment> => {
        try {
            const formData = new FormData();
            if (data.name) formData.append('name', data.name);
            if (data.windowTime) formData.append('windowTime', data.windowTime.toString());
            if (data.condition) formData.append('condition', data.condition);

            if (data.photoUrl && data.photoUrl.startsWith('data:')) {
                const blob = await (await fetch(data.photoUrl)).blob();
                formData.append('photo', blob, 'equipment.jpg');
            } else if (data.photoUrl) {
                formData.append('photoUrl', data.photoUrl);
            }

            const response = await api.put(`/gym-equipment/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
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
