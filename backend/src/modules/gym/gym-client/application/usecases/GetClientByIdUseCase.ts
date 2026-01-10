import { IGymClientRepository } from "../../domain/repositories/IGymClientRepository.js";
import { ClientResponseDTO } from "../dtos/GymClientDTO.js";
import { GymClientDTOMapper } from "../mappers/GymClientDTOMapper.js";
import { AppError } from "../../../../../core/errors/AppError.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";

export class GetClientByIdUseCase {
    constructor(private gymClientRepository: IGymClientRepository) { }

    async execute(id: string): Promise<ClientResponseDTO> {
        const client = await this.gymClientRepository.findById(id);
        if (!client) {
            throw new AppError("Client not found", HttpStatus.NOT_FOUND);
        }
        return GymClientDTOMapper.toResponseDTO(client);
    }
}
