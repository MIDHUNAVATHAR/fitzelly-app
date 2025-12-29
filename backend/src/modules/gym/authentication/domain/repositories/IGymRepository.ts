import { Gym } from "../entities/Gym.js";

export interface IGymRepository {
    create(gym: Gym): Promise<Gym>;
    findByEmail(email: string): Promise<Gym | null>;
    findById(id: string): Promise<Gym | null>;
}
