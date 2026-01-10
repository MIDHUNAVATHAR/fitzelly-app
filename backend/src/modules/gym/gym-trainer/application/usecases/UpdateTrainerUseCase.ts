import { IGymTrainerRepository } from "../../domain/repositories/IGymTrainerRepository.js";
import { UpdateTrainerRequestDTO, TrainerResponseDTO } from "../dtos/GymTrainerDTO.js";
import { GymTrainerDTOMapper } from "../mappers/GymTrainerDTOMapper.js";
import { AppError } from "../../../../../core/errors/AppError.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";

export class UpdateTrainerUseCase {
    constructor(private gymTrainerRepository: IGymTrainerRepository) { }

    async execute(request: UpdateTrainerRequestDTO): Promise<TrainerResponseDTO> {
        const trainer = await this.gymTrainerRepository.findById(request.trainerId);

        if (!trainer) {
            throw new AppError("Trainer not found", HttpStatus.NOT_FOUND);
        }

        if (trainer.gymId !== request.gymId) {
            throw new AppError("Unauthorized access to trainer", HttpStatus.FORBIDDEN);
        }

        const updatedTrainerEntity = trainer.updateDetails({
            ...(request.fullName ? { fullName: request.fullName } : {}),
            ...(request.email ? { email: request.email } : {}),
            ...(request.phone ? { phone: request.phone } : {}),
            ...(request.specialization ? { specialization: request.specialization } : {}),
            ...(request.monthlySalary !== undefined ? { monthlySalary: request.monthlySalary } : {}),
            ...(request.isBlocked !== undefined ? { isBlocked: request.isBlocked } : {})

        });

        const result = await this.gymTrainerRepository.update(updatedTrainerEntity);
        return GymTrainerDTOMapper.toResponseDTO(result);
    }
}
