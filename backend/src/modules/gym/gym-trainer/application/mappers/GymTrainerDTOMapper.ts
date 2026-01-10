import { GymTrainer } from "../../domain/entities/GymTrainer.js";
import { TrainerResponseDTO } from "../dtos/GymTrainerDTO.js";

export class GymTrainerDTOMapper {
    static toResponseDTO(trainer: GymTrainer): TrainerResponseDTO {
        return {
            id: trainer.id,
            fullName: trainer.fullName,
            email: trainer.email,
            phone: trainer.phone,
            specialization: trainer.specialization,
            monthlySalary: trainer.monthlySalary,
            isBlocked: trainer.isBlocked,

            isEmailVerified: trainer.isEmailVerified,
            createdAt: trainer.createdAt
        };
    }
}
