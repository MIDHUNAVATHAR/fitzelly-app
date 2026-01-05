import { IGymListingRepository } from "../../domain/repositories/IGymListingRepository.js";
import { PaginatedGyms } from "../../domain/entities/GymSummary.js";

interface GetGymsRequest {
    page?: number;
    limit?: number;
    search?: string;
}

export class GetGymsUseCase {
    constructor(private gymListingRepository: IGymListingRepository) { }

    async execute(request: GetGymsRequest): Promise<PaginatedGyms> {
        const page = request.page || 1;
        const limit = request.limit || 10;
        const search = request.search || '';

        return this.gymListingRepository.findAll(page, limit, search);
    }
}
