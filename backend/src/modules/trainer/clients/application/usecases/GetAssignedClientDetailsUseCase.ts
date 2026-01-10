import type { IGymClientRepository } from "../../../../gym/gym-client/domain/repositories/IGymClientRepository.js";
import { AppError } from "../../../../../core/errors/AppError.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";

export class GetAssignedClientDetailsUseCase {
    constructor(private clientRepo: IGymClientRepository) { }

    async execute(trainerId: string, clientId: string) {
        const client = await this.clientRepo.findById(clientId);

        if (!client) {
            throw new AppError("Client not found", HttpStatus.NOT_FOUND);
        }

        if (client.assignedTrainer !== trainerId) {
            throw new AppError("Client is not assigned to you", HttpStatus.FORBIDDEN);
        }

        return client;
    }
}
