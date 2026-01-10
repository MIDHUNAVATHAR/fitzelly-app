import type { IGymClientRepository } from "../../../../gym/gym-client/domain/repositories/IGymClientRepository.js";
import type { GymClient } from "../../../../gym/gym-client/domain/entities/GymClient.js";

export interface AssignedClientDTO {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    hasWorkoutPlan: boolean;
}

export interface AssignedClientsListResponseDTO {
    clients: AssignedClientDTO[];
    total: number;
    page: number;
    limit: number;
}

export class GetAssignedClientsUseCase {
    constructor(private clientRepository: IGymClientRepository) { }

    async execute(trainerId: string, page: number, limit: number, search: string = ''): Promise<AssignedClientsListResponseDTO> {
        const { clients, total } = await this.clientRepository.findByTrainerId(trainerId, page, limit, search);

        const clientDTOs: AssignedClientDTO[] = clients.map((client: GymClient) => ({
            id: client.id,
            fullName: client.fullName,
            email: client.email,
            phone: client.phone,
            hasWorkoutPlan: false, // Will be populated by controller
        }));

        return {
            clients: clientDTOs,
            total,
            page,
            limit,
        };
    }
}
