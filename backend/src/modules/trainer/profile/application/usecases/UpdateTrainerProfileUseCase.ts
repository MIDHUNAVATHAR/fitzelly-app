import { IGymTrainerRepository } from "../../../../gym/gym-trainer/domain/repositories/IGymTrainerRepository.js";
import { TrainerResponseDTO } from "../../../../gym/gym-trainer/application/dtos/GymTrainerDTO.js";
import { GymTrainerDTOMapper } from "../../../../gym/gym-trainer/application/mappers/GymTrainerDTOMapper.js";
import { AppError } from "../../../../../core/errors/AppError.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";

export interface UpdateTrainerProfileRequestDTO {
    trainerId: string;
    fullName?: string;
    phone?: string;
    specialization?: string;
    biography?: string;
    dateOfBirth?: Date;
}

export class UpdateTrainerProfileUseCase {
    constructor(private gymTrainerRepository: IGymTrainerRepository) { }

    async execute(request: UpdateTrainerProfileRequestDTO): Promise<TrainerResponseDTO> {
        const trainer = await this.gymTrainerRepository.findById(request.trainerId);

        if (!trainer) {
            throw new AppError("Trainer not found", HttpStatus.NOT_FOUND);
        }

        const updatedTrainerEntity = trainer.updateDetails({
            ...(request.fullName ? { fullName: request.fullName } : {}),
            ...(request.phone ? { phone: request.phone } : {}),
            ...(request.specialization ? { specialization: request.specialization } : {}),
            ...(request.biography ? { biography: request.biography } : {}),
            ...(request.dateOfBirth ? { dateOfBirth: new Date(request.dateOfBirth) } : {})
        });

        const result = await this.gymTrainerRepository.update(updatedTrainerEntity);
        return GymTrainerDTOMapper.toResponseDTO(result);
    }
}
