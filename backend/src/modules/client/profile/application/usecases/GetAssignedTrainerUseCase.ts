import type { IGymClientRepository } from "../../../../gym/gym-client/domain/repositories/IGymClientRepository.js";
import type { IGymTrainerRepository } from "../../../../gym/gym-trainer/domain/repositories/IGymTrainerRepository.js";
import { AppError } from "../../../../../core/errors/AppError.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";

// We can define a DTO locally or shared
export interface AssignedTrainerDTO {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    specialization: string;
    biography?: string;
    photoUrl?: string; // If exists
}

export class GetAssignedTrainerUseCase {
    constructor(
        private clientRepository: IGymClientRepository,
        private trainerRepository: IGymTrainerRepository
    ) { }

    async execute(clientId: string): Promise<AssignedTrainerDTO | null> {
        const client = await this.clientRepository.findById(clientId);
        if (!client) {
            throw new AppError("Client not found", HttpStatus.NOT_FOUND);
        }

        if (!client.assignedTrainer) {
            return null;
        }

        const trainer = await this.trainerRepository.findById(client.assignedTrainer);
        if (!trainer) {
            return null; // Trainer might have been deleted
        }

        // Map to DTO, excluding sensitive info like salary, password, etc.
        return {
            id: trainer.id,
            fullName: trainer.fullName,
            email: trainer.email,
            phone: trainer.phone,
            specialization: trainer.specialization,
            biography: trainer.biography,
        };
    }
}
