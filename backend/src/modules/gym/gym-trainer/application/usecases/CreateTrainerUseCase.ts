import { IGymTrainerRepository } from "../../domain/repositories/IGymTrainerRepository.js";
import { CreateTrainerRequestDTO, TrainerResponseDTO } from "../dtos/GymTrainerDTO.js";
import { GymTrainer } from "../../domain/entities/GymTrainer.js";
import { GymTrainerDTOMapper } from "../mappers/GymTrainerDTOMapper.js";

export class CreateTrainerUseCase {
    constructor(private gymTrainerRepository: IGymTrainerRepository) { }

    async execute(request: CreateTrainerRequestDTO): Promise<TrainerResponseDTO> {
        const newTrainer = new GymTrainer(
            "", // ID handled by DB
            request.gymId,
            request.fullName,
            request.email,
            request.phone,
            request.specialization || '',
            request.monthlySalary || 0,
            '', // biography
            undefined, // dateOfBirth
            undefined, // password (initially undefined)

            false, // isEmailVerified
            false, // isBlocked
            false, // isDelete
            new Date(),
            new Date(),
        );

        const createdTrainer = await this.gymTrainerRepository.create(newTrainer);
        return GymTrainerDTOMapper.toResponseDTO(createdTrainer);
    }
}
