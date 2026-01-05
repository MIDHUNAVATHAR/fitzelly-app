import { PaginatedGyms } from "../entities/GymSummary.js";

export interface IGymListingRepository {
    findAll(page: number, limit: number, search?: string): Promise<PaginatedGyms>;
}
