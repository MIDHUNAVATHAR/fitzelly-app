import { api } from "../../../services/api";
import { type WorkoutPlan } from "../../trainer/services/TrainerClientsService"; // Reuse type

export const ClientWorkoutService = {
    getMyPlan: async (): Promise<WorkoutPlan | null> => {
        const response = await api.get('/client-plan/my-plan');
        return response.data.data;
    }
};
