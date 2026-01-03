import { IGymTrainerRepository } from "../../domain/repositories/IGymTrainerRepository.js";
import { AppError } from "../../../../../core/errors/AppError.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";

export class DeleteTrainerUseCase {
    constructor(private gymTrainerRepository: IGymTrainerRepository) { }

    async execute(trainerId: string, gymId: string): Promise<void> {
        const trainer = await this.gymTrainerRepository.findById(trainerId);

        if (!trainer) {
            throw new AppError("Trainer not found", HttpStatus.NOT_FOUND);
        }

        if (trainer.gymId !== gymId) {
            throw new AppError("Unauthorized access to trainer", HttpStatus.FORBIDDEN);
        }

        const deletedTrainer = trainer.markAsDeleted();
        await this.gymTrainerRepository.update(deletedTrainer);
    }
}
