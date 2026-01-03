import { api } from "../../../services/api";

export interface Plan {
    id?: string;
    planName: string;
    type: 'category' | 'day';
    monthlyFee: number;
    durationInDays?: number;
    description?: string;
    createdAt?: string;
}

export const PlanService = {
    getPlans: async (): Promise<Plan[]> => {
        const response = await api.get('/gym-plan/plans');
        return response.data.data;
    },

    createPlan: async (plan: Plan): Promise<Plan> => {
        const response = await api.post('/gym-plan/plans', plan);
        return response.data.data;
    },

    updatePlan: async (id: string, plan: Partial<Plan>): Promise<Plan> => {
        const { id: _, createdAt, ...validPayload } = plan as any; // Exclude id/createdAt from payload
        const response = await api.put(`/gym-plan/plans/${id}`, validPayload);
        return response.data.data;
    },

    deletePlan: async (id: string): Promise<void> => {
        await api.delete(`/gym-plan/plans/${id}`);
    }
}
