import { TokenService } from "../../infrastructure/services/TokenService.js";
import { IGymRepository } from "../../domain/repositories/IGymRepository.js";
import { Gym } from "../../domain/entities/Gym.js";
import { GoogleAuthService } from "../../infrastructure/services/GoogleAuthService.js";
import { GymDTOMapper } from "../mappers/GymDTOMapper.js";
import { SignupGymResponseDTO } from "../dtos/SignupGymDTO.js";
import crypto from 'crypto';
import { ROLES } from "../../../../../constants/roles.constants.js";

export class GoogleAuthGymUseCase {
    constructor(
        private gymRepository: IGymRepository,
        private googleAuthService: GoogleAuthService
    ) { }

    async execute(idToken: string): Promise<SignupGymResponseDTO> {
        // 1. Verify Google Token
        const googlePayload = await this.googleAuthService.verifyToken(idToken);
        const { email, name } = googlePayload;

        // 2. Check if user exists
        let gym = await this.gymRepository.findByEmail(email);

        if (!gym) {
            // 3. If not exists, create new Gym (Signup)
            // Use random placeholder for password hash
            const placeholderPasswordHash = crypto.randomBytes(32).toString('hex');

            const gymToCreate = new Gym(
                "",
                email,
                placeholderPasswordHash, // User must reset password if they want email/pass login later or we handle isGoogleAuth field in DB
                new Date(),
                new Date(),
                name // Google provided name -> ownerName
            );

            gym = await this.gymRepository.create(gymToCreate);
        }

        // 4. Generate Tokens (Login)
        const accessToken = TokenService.generateAccessToken({ id: gym.id, role: ROLES.GYM });
        const refreshToken = TokenService.generateRefreshToken({ id: gym.id, role: ROLES.GYM });

        return GymDTOMapper.toResponseDTO(gym, accessToken, refreshToken);
    }
}
