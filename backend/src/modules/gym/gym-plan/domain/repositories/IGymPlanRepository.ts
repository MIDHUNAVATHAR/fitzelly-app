import { GymPlan } from "../entities/GymPlan.js";

export interface IGymPlanRepository {
    create(plan: GymPlan): Promise<GymPlan>;
    findById(id: string): Promise<GymPlan | null>;
    findByGymId(gymId: string): Promise<GymPlan[]>;
    update(plan: GymPlan): Promise<GymPlan>;
    // delete is soft delete handled by update, but we might want a specific method or just use update.
    // Clean Architecture prefers explicit methods if behavior differs.
    // But `update` covers `markAsDeleted` result persistence.
}
