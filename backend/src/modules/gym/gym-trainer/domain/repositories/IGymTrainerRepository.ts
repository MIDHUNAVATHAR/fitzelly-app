import { GymTrainer } from "../entities/GymTrainer.js";

export interface IGymTrainerRepository {
    create(trainer: GymTrainer): Promise<GymTrainer>;
    findById(id: string): Promise<GymTrainer | null>;
    findByGymId(gymId: string, options?: { search?: string, skip?: number, limit?: number }): Promise<{ trainers: GymTrainer[], total: number }>;
    findByEmail(email: string): Promise<GymTrainer | null>;
    update(trainer: GymTrainer): Promise<GymTrainer>;
}
