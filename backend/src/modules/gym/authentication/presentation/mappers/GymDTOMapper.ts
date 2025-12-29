import { Gym } from "../../domain/entities/Gym.js";
import { SignupGymResponseDTO } from "../../domain/dtos/SignupGymDTO.js";

export class GymDTOMapper {
    static toResponseDTO(gym: Gym, token: string): SignupGymResponseDTO {
        return {
            token,
            user: {
                id: gym.id,
                name: gym.name,
                email: gym.email
            }
        };
    }
}
