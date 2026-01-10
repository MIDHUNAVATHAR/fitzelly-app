import { IGymTrainerRepository } from "../../../../gym/gym-trainer/domain/repositories/IGymTrainerRepository.js";
import { TrainerResponseDTO } from "../../../../gym/gym-trainer/application/dtos/GymTrainerDTO.js";
import { GymTrainerDTOMapper } from "../../../../gym/gym-trainer/application/mappers/GymTrainerDTOMapper.js";
import { AppError } from "../../../../../core/errors/AppError.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";

export class GetTrainerProfileUseCase {
    constructor(private gymTrainerRepository: IGymTrainerRepository) { }

    async execute(trainerId: string): Promise<TrainerResponseDTO> {
        const trainer = await this.gymTrainerRepository.findById(trainerId);

        if (!trainer) {
            throw new AppError("Trainer not found", HttpStatus.NOT_FOUND);
        }

        return GymTrainerDTOMapper.toResponseDTO(trainer);
    }
}
