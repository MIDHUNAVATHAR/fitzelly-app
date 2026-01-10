import { PaginatedGyms, GymSummary } from "../entities/GymSummary.js";

export interface IGymListingRepository {
    findAll(page: number, limit: number, search?: string): Promise<PaginatedGyms>;
    findById(id: string): Promise<GymSummary | null>;
    block(id: string, isBlocked: boolean): Promise<void>;
    delete(id: string): Promise<void>;
}
