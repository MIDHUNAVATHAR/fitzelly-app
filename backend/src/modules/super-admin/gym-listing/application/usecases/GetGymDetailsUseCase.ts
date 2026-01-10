import { IGymListingRepository } from "../../domain/repositories/IGymListingRepository.js";
import { GymSummary } from "../../domain/entities/GymSummary.js";

export class GetGymDetailsUseCase {
    constructor(private gymListingRepository: IGymListingRepository) { }

    async execute(id: string): Promise<GymSummary | null> {
        return await this.gymListingRepository.findById(id);
    }
}
