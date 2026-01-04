import { IGymClientRepository } from "../../domain/repositories/IGymClientRepository.js";
import { CreateClientRequestDTO, ClientResponseDTO } from "../dtos/GymClientDTO.js";
import { GymClient } from "../../domain/entities/GymClient.js";
import { GymClientDTOMapper } from "../mappers/GymClientDTOMapper.js";

export class CreateClientUseCase {
    constructor(private gymClientRepository: IGymClientRepository) { }

    async execute(request: CreateClientRequestDTO): Promise<ClientResponseDTO> {
        const newClient = new GymClient(
            "", // ID handled by DB
            request.gymId,
            request.fullName,
            request.email,
            request.phone,
            'inactive', // Default status
            false, // isEmailVerified default
            false,
            new Date(),
            new Date(),
        );

        const createdClient = await this.gymClientRepository.create(newClient);
        return GymClientDTOMapper.toResponseDTO(createdClient);
    }
}
