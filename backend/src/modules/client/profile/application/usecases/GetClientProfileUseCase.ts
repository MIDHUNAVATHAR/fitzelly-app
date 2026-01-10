import { IGymClientRepository } from "../../../../gym/gym-client/domain/repositories/IGymClientRepository.js";
import { ClientResponseDTO } from "../../../../gym/gym-client/application/dtos/GymClientDTO.js";
import { GymClientDTOMapper } from "../../../../gym/gym-client/application/mappers/GymClientDTOMapper.js";
import { AppError } from "../../../../../core/errors/AppError.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";

export class GetClientProfileUseCase {
    constructor(private gymClientRepository: IGymClientRepository) { }

    async execute(clientId: string): Promise<ClientResponseDTO> {
        const client = await this.gymClientRepository.findById(clientId);

        if (!client) {
            throw new AppError("Client not found", HttpStatus.NOT_FOUND);
        }

        return GymClientDTOMapper.toResponseDTO(client);
    }
}
