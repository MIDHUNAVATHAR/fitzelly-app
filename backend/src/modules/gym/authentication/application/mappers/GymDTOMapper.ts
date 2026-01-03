import { Gym } from "../../domain/entities/Gym.js";
import { SignupGymResponseDTO } from "../dtos/SignupGymDTO.js";

export class GymDTOMapper {
    static toResponseDTO(gym: Gym, accessToken: string, refreshToken: string): SignupGymResponseDTO {
        return {
            accessToken,
            refreshToken,
            user: {
                id: gym.id,
                ...(gym.ownerName ? { ownerName: gym.ownerName } : {}),
                ...(gym.gymName ? { gymName: gym.gymName } : {}),
                ...(gym.phone ? { phone: gym.phone } : {}),
                ...(gym.description ? { description: gym.description } : {}),
                ...(gym.address ? {
                    address: {
                        ...(gym.address.street ? { street: gym.address.street } : {}),
                        ...(gym.address.city ? { city: gym.address.city } : {}),
                        ...(gym.address.state ? { state: gym.address.state } : {}),
                        ...(gym.address.pincode ? { pincode: gym.address.pincode } : {}),
                        ...(gym.address.mapLink ? { mapLink: gym.address.mapLink } : {}),
                    }
                } : {}),
                email: gym.email
            }
        };
    }
}

//mappers helps to filter out passwordhash,createdat,updatedat etc from the gym doc and give to frontend