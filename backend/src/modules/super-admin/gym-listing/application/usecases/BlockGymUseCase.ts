import { IGymListingRepository } from "../../domain/repositories/IGymListingRepository.js";

export class BlockGymUseCase {
    constructor(private gymListingRepository: IGymListingRepository) { }

    async execute(id: string, isBlocked: boolean): Promise<void> {
        await this.gymListingRepository.block(id, isBlocked);
    }
}
