import bcrypt from 'bcryptjs';
import { TokenService } from "../../infrastructure/services/TokenService.js";
import { IGymRepository } from "../../domain/repositories/IGymRepository.js";
import { AppError } from "../../../../../core/errors/AppError.js";
import { LoginGymRequestDTO, LoginGymResponseDTO } from "../dtos/LoginGymDTO.js";
import { GymDTOMapper } from "../mappers/GymDTOMapper.js";


export class LoginGymUseCase {
    constructor(private gymRepository: IGymRepository) { }

    async execute(request: LoginGymRequestDTO): Promise<LoginGymResponseDTO> {
        // 1. Check if gym exists
        const gym = await this.gymRepository.findByEmail(request.email);
        if (!gym) {
            throw new AppError("Invalid credentials", 401);
        }

        // 2. Validate Password
        const isPasswordValid = await bcrypt.compare(request.password, gym.passwordHash);
        if (!isPasswordValid) {
            throw new AppError("Invalid credentials", 401);
        }

        // 3. Generate Token
        // Use TokenService
        const accessToken = TokenService.generateAccessToken({ id: gym.id, role: 'gym_owner' });
        const refreshToken = TokenService.generateRefreshToken({ id: gym.id, role: 'gym_owner' });


        // 4. Return Response
        return GymDTOMapper.toResponseDTO(gym, accessToken, refreshToken);
    }
}
