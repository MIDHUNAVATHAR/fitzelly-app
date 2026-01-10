import { IGymClientRepository } from "../../domain/repositories/IGymClientRepository.js";
import { UpdateClientRequestDTO, ClientResponseDTO } from "../dtos/GymClientDTO.js";
import { GymClientDTOMapper } from "../mappers/GymClientDTOMapper.js";
import { AppError } from "../../../../../core/errors/AppError.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";

export class UpdateClientUseCase {
    constructor(private gymClientRepository: IGymClientRepository) { }

    async execute(request: UpdateClientRequestDTO): Promise<ClientResponseDTO> {
        const client = await this.gymClientRepository.findById(request.clientId);

        if (!client) {
            throw new AppError("Client not found", HttpStatus.NOT_FOUND);
        }

        if (client.gymId !== request.gymId) {
            throw new AppError("Unauthorized access to client", HttpStatus.FORBIDDEN);
        }

        const updatedClientEntity = client.updateDetails({
            ...(request.fullName ? { fullName: request.fullName } : {}),
            ...(request.email ? { email: request.email } : {}),
            ...(request.phone ? { phone: request.phone } : {}),
            ...(request.isBlocked !== undefined ? { isBlocked: request.isBlocked } : {})
        });

        const result = await this.gymClientRepository.update(updatedClientEntity);
        return GymClientDTOMapper.toResponseDTO(result);
    }
}
