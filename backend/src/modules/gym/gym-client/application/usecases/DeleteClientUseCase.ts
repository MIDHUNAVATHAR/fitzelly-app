import { IGymClientRepository } from "../../domain/repositories/IGymClientRepository.js";
import { AppError } from "../../../../../core/errors/AppError.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";

export class DeleteClientUseCase {
    constructor(private gymClientRepository: IGymClientRepository) { }

    async execute(clientId: string, gymId: string): Promise<void> {
        const client = await this.gymClientRepository.findById(clientId);

        if (!client) {
            throw new AppError("Client not found", HttpStatus.NOT_FOUND);
        }

        if (client.gymId !== gymId) {
            throw new AppError("Unauthorized access to client", HttpStatus.FORBIDDEN);
        }

        const deletedClient = client.markAsDeleted();
        await this.gymClientRepository.update(deletedClient);
    }
}
