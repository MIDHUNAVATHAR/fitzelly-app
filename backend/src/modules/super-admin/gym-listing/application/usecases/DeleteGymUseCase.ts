import { IGymListingRepository } from "../../domain/repositories/IGymListingRepository.js";

export class DeleteGymUseCase {
    constructor(private gymListingRepository: IGymListingRepository) { }

    async execute(id: string): Promise<void> {
        await this.gymListingRepository.delete(id);
    }
}
