import { IGymTrainerRepository } from "../../domain/repositories/IGymTrainerRepository.js";
import { TrainerListResponseDTO } from "../dtos/GymTrainerDTO.js";
import { GymTrainerDTOMapper } from "../mappers/GymTrainerDTOMapper.js";

export class GetTrainersUseCase {
    constructor(private gymTrainerRepository: IGymTrainerRepository) { }

    async execute(gymId: string, page: number = 1, limit: number = 10, search?: string): Promise<TrainerListResponseDTO> {
        const skip = (page - 1) * limit;
        const { trainers, total } = await this.gymTrainerRepository.findByGymId(gymId, {
            skip,
            limit,
            ...(search ? { search } : {})
        });

        return {
            trainers: trainers.map(t => GymTrainerDTOMapper.toResponseDTO(t)),
            total,
            page,
            limit
        };
    }
}
