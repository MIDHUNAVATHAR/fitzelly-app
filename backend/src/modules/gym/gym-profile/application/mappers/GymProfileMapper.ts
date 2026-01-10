import { GymProfile } from "../../domain/entities/GymProfile.js";
import { GymProfileDTO } from "../dtos/GymProfileDTO.js";

export class GymProfileMapper {
    static toDTO(gym: GymProfile): GymProfileDTO {
        return {
            id: gym.id,
            email: gym.email,
            ...(gym.ownerName ? { ownerName: gym.ownerName } : {}),
            ...(gym.gymName ? { gymName: gym.gymName } : {}),
            ...(gym.phone ? { phone: gym.phone } : {}),
            ...(gym.description ? { description: gym.description } : {}),
            ...(gym.logoUrl ? { logoUrl: gym.logoUrl } : {}),
            ...(gym.address ? {
                address: {
                    ...(gym.address.street ? { street: gym.address.street } : {}),
                    ...(gym.address.city ? { city: gym.address.city } : {}),
                    ...(gym.address.state ? { state: gym.address.state } : {}),
                    ...(gym.address.pincode ? { pincode: gym.address.pincode } : {}),
                    ...(gym.address.mapLink ? { mapLink: gym.address.mapLink } : {}),
                }
            } : {}),
        };
    }
}
