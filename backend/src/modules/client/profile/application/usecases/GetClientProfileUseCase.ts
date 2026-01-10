import { IGymClientRepository } from "../../../../gym/gym-client/domain/repositories/IGymClientRepository.js";
import { ClientResponseDTO } from "../../../../gym/gym-client/application/dtos/GymClientDTO.js";
import { GymClientDTOMapper } from "../../../../gym/gym-client/application/mappers/GymClientDTOMapper.js";
import { AppError } from "../../../../../core/errors/AppError.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";

import { IGymRepository } from "../../../../gym/authentication/domain/repositories/IGymRepository.js";

export class GetClientProfileUseCase {
    constructor(
        private gymClientRepository: IGymClientRepository,
        private gymRepository: IGymRepository
    ) { }

    async execute(clientId: string): Promise<ClientResponseDTO> {
        const client = await this.gymClientRepository.findById(clientId);

        if (!client) {
            throw new AppError("Client not found", HttpStatus.NOT_FOUND);
        }

        const dto = GymClientDTOMapper.toResponseDTO(client);

        if (client.gymId) {
            const gym = await this.gymRepository.findById(client.gymId);
            if (gym) {
                if (gym.gymName) dto.gymName = gym.gymName;
                if (gym.logoUrl) dto.gymLogoUrl = gym.logoUrl;
            }
        }

        return dto;
    }
}
