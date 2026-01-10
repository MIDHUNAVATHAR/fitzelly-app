import { IGymTrainerRepository } from "../../../../gym/gym-trainer/domain/repositories/IGymTrainerRepository.js";
import { TrainerResponseDTO } from "../../../../gym/gym-trainer/application/dtos/GymTrainerDTO.js";
import { GymTrainerDTOMapper } from "../../../../gym/gym-trainer/application/mappers/GymTrainerDTOMapper.js";
import { AppError } from "../../../../../core/errors/AppError.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";

import { IGymRepository } from "../../../../gym/authentication/domain/repositories/IGymRepository.js";

export class GetTrainerProfileUseCase {
    constructor(
        private gymTrainerRepository: IGymTrainerRepository,
        private gymRepository: IGymRepository
    ) { }

    async execute(trainerId: string): Promise<TrainerResponseDTO> {
        const trainer = await this.gymTrainerRepository.findById(trainerId);

        if (!trainer) {
            throw new AppError("Trainer not found", HttpStatus.NOT_FOUND);
        }

        const dto = GymTrainerDTOMapper.toResponseDTO(trainer);

        if (trainer.gymId) {
            const gym = await this.gymRepository.findById(trainer.gymId);
            if (gym) {
                if (gym.gymName) dto.gymName = gym.gymName;
                if (gym.logoUrl) dto.gymLogoUrl = gym.logoUrl;
            }
        }

        return dto;
    }
}
