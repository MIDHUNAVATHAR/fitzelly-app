import { GymProfile } from "../entities/GymProfile.js";

export interface IGymProfileRepository {
    findById(id: string): Promise<GymProfile | null>;
    update(profile: GymProfile): Promise<GymProfile>;
}
