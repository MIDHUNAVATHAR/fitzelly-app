import { IGymClientRepository } from "../../../../gym/gym-client/domain/repositories/IGymClientRepository.js";
import { ClientResponseDTO } from "../../../../gym/gym-client/application/dtos/GymClientDTO.js";
import { GymClientDTOMapper } from "../../../../gym/gym-client/application/mappers/GymClientDTOMapper.js";
import { AppError } from "../../../../../core/errors/AppError.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";

export interface UpdateClientProfileRequestDTO {
    clientId: string;
    fullName?: string;
    phone?: string;
    emergencyContactNumber?: string;
    dateOfBirth?: Date;
    profilePicture?: string;
}

export class UpdateClientProfileUseCase {
    constructor(private gymClientRepository: IGymClientRepository) { }

    async execute(request: UpdateClientProfileRequestDTO): Promise<ClientResponseDTO> {
        const client = await this.gymClientRepository.findById(request.clientId);

        if (!client) {
            throw new AppError("Client not found", HttpStatus.NOT_FOUND);
        }

        const updatedClientEntity = client.updateDetails({
            ...(request.fullName ? { fullName: request.fullName } : {}),
            ...(request.phone ? { phone: request.phone } : {}),
            ...(request.emergencyContactNumber ? { emergencyContactNumber: request.emergencyContactNumber } : {}),
            ...(request.dateOfBirth ? { dateOfBirth: new Date(request.dateOfBirth) } : {}),
            ...(request.profilePicture ? { profilePicture: request.profilePicture } : {})
        });

        const result = await this.gymClientRepository.update(updatedClientEntity);
        return GymClientDTOMapper.toResponseDTO(result);
    }
}
