import { IGymProfileRepository } from "../../domain/repositories/IGymProfileRepository.js";
import { GymProfileMapper } from "../mappers/GymProfileMapper.js";
import { GymProfileDTO } from "../dtos/GymProfileDTO.js";
import { AppError } from "../../../../../core/errors/AppError.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";

export class GetProfileUseCase {
    constructor(
        private gymProfileRepository: IGymProfileRepository
    ) { }

    async execute(userId: string): Promise<GymProfileDTO> {
        const gym = await this.gymProfileRepository.findById(userId);
        if (!gym) {
            throw new AppError("Gym not found", HttpStatus.NOT_FOUND);
        }

        return GymProfileMapper.toDTO(gym);
    }
}
