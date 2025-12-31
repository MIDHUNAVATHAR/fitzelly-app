import { Gym } from "../../domain/entities/Gym.js";
import { SignupGymResponseDTO } from "../dtos/SignupGymDTO.js";

export class GymDTOMapper {
    static toResponseDTO(gym: Gym, accessToken: string, refreshToken: string): SignupGymResponseDTO {
        return {
            accessToken,
            refreshToken,
            user: {
                id: gym.id,
                name: gym.name,
                email: gym.email
            }
        };
    }
}
