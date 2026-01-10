import { api } from "../../../services/api";

export interface Exercise {
    name: string;
    sets: number;
    reps: number;
    rest: string;
}

export interface DayPlan {
    day: string;
    exercises: Exercise[];
    isRestDay: boolean;
}

export interface WorkoutPlan {
    id: string;
    trainerId: string;
    clientId: string;
    clientName?: string;
    weeklyPlan: DayPlan[];
    createdAt: string;
    updatedAt: string;
}

export interface AssignedClient {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    hasWorkoutPlan: boolean;
}

export interface AssignedClientsResponse {
    clients: AssignedClient[];
    total: number;
    page: number;
    limit: number;
}

export interface ClientDetails extends AssignedClient {
    createdAt?: string;
    emergencyContactNumber?: string;
    dateOfBirth?: string;
    // Add other fields as needed
}

export const TrainerClientsService = {
    getAssignedClients: async (page: number = 1, limit: number = 10, search: string = ''): Promise<AssignedClientsResponse> => {
        const response = await api.get('/trainer-clients/clients', { params: { page, limit, search } });
        return response.data.data;
    },

    getClientDetails: async (clientId: string): Promise<ClientDetails> => {
        const response = await api.get(`/trainer-clients/clients/${clientId}`);
        return response.data.data;
    },

    getWorkoutPlanByClientId: async (clientId: string): Promise<WorkoutPlan | null> => {
        const response = await api.get(`/trainer-plan/plans/client/${clientId}`);
        return response.data.data;
    },

    createWorkoutPlan: async (clientId: string, weeklyPlan: DayPlan[]): Promise<WorkoutPlan> => {
        const response = await api.post('/trainer-plan/plans', { clientId, weeklyPlan });
        return response.data.data;
    },

    updateWorkoutPlan: async (planId: string, weeklyPlan: DayPlan[]): Promise<WorkoutPlan> => {
        const response = await api.put(`/trainer-plan/plans/${planId}`, { weeklyPlan });
        return response.data.data;
    },

    deleteWorkoutPlan: async (planId: string): Promise<void> => {
        await api.delete(`/trainer-plan/plans/${planId}`);
    },
};
