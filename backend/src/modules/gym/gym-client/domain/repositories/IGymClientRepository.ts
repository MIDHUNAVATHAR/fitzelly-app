import { GymClient } from "../entities/GymClient.js";

export interface IGymClientRepository {
    create(client: GymClient): Promise<GymClient>;
    findById(id: string): Promise<GymClient | null>;
    findByGymId(gymId: string, options?: { search?: string, skip?: number, limit?: number, status?: string }): Promise<{ clients: GymClient[], total: number }>;
    findByEmail(email: string): Promise<GymClient | null>;
    update(client: GymClient): Promise<GymClient>;
}
