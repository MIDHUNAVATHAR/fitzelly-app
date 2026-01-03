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
                email: gym.email
            }
        };
    }
}

//mappers helps to filter out passwordhash,createdat,updatedat etc from the gym doc and give to frontend