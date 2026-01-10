import { IGymTrainerRepository } from "../../domain/repositories/IGymTrainerRepository.js";
import { TrainerResponseDTO } from "../dtos/GymTrainerDTO.js";
import { GymTrainerDTOMapper } from "../mappers/GymTrainerDTOMapper.js";
import { AppError } from "../../../../../core/errors/AppError.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";

export class GetTrainerByIdUseCase {
    constructor(private gymTrainerRepository: IGymTrainerRepository) { }

    async execute(id: string): Promise<TrainerResponseDTO> {
        const trainer = await this.gymTrainerRepository.findById(id);
        if (!trainer) {
            throw new AppError("Trainer not found", HttpStatus.NOT_FOUND);
        }
        return GymTrainerDTOMapper.toResponseDTO(trainer);
    }
}
