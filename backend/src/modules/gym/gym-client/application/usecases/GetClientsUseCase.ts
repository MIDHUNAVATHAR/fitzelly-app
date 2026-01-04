import { IGymClientRepository } from "../../domain/repositories/IGymClientRepository.js";
import { ClientListResponseDTO } from "../dtos/GymClientDTO.js";
import { GymClientDTOMapper } from "../mappers/GymClientDTOMapper.js";

export class GetClientsUseCase {
    constructor(private gymClientRepository: IGymClientRepository) { }

    async execute(gymId: string, page: number = 1, limit: number = 10, search?: string, status?: string): Promise<ClientListResponseDTO> {
        const skip = (page - 1) * limit;
        const { clients, total } = await this.gymClientRepository.findByGymId(gymId, {
            skip,
            limit,
            ...(search ? { search } : {}),
            ...(status ? { status } : {})
        });

        return {
            clients: clients.map(c => GymClientDTOMapper.toResponseDTO(c)),
            total,
            page,
            limit
        };
    }
}
