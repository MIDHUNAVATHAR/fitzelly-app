import type { WorkoutPlan } from "../entities/WorkoutPlan.js";

export interface IWorkoutPlanRepository {
    create(workoutPlan: WorkoutPlan): Promise<WorkoutPlan>;
    findById(id: string): Promise<WorkoutPlan | null>;
    findByClientId(clientId: string): Promise<WorkoutPlan | null>;
    findByTrainerId(trainerId: string, page: number, limit: number): Promise<{ plans: WorkoutPlan[], total: number }>;
    update(workoutPlan: WorkoutPlan): Promise<WorkoutPlan>;
    delete(id: string): Promise<void>;
}
