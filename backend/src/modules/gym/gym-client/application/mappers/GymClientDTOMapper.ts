import { GymClient } from "../../domain/entities/GymClient.js";
import { ClientResponseDTO } from "../dtos/GymClientDTO.js";

export class GymClientDTOMapper {
    static toResponseDTO(client: GymClient): ClientResponseDTO {
        return {
            id: client.id,
            fullName: client.fullName,
            email: client.email,
            phone: client.phone,
            status: client.status,
            isBlocked: client.isBlocked,
            isEmailVerified: client.isEmailVerified,
            createdAt: client.createdAt,
            assignedTrainer: client.assignedTrainer,
            emergencyContactNumber: client.emergencyContactNumber,
            dateOfBirth: client.dateOfBirth,
            profilePicture: client.profilePicture
        };
    }
}
