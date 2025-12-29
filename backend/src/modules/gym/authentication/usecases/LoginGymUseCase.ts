import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IGymRepository } from "../domain/repositories/IGymRepository.js";
import { AppError } from "../../../../core/errors/AppError.js";
import { LoginGymRequestDTO, LoginGymResponseDTO } from "../domain/dtos/LoginGymDTO.js";
import { GymDTOMapper } from "../presentation/mappers/GymDTOMapper.js";

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
        // In a real app, use a proper ConfigService
        const secret = process.env.JWT_SECRET || "default_secret_key_change_me";
        const token = jwt.sign({ id: gym.id, role: 'gym_owner' }, secret, { expiresIn: '1d' });

        // 4. Return Response
        return GymDTOMapper.toResponseDTO(gym, token);
    }
}
