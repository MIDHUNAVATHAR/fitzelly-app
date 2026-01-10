import { IGymTrainerRepository } from "../../../../gym/gym-trainer/domain/repositories/IGymTrainerRepository.js";
import { IPasswordHasher } from "../../../../gym/authentication/domain/services/IPasswordHasher.js";
import { TokenService } from "../../../../gym/authentication/infrastructure/services/TokenService.js";
import { AppError } from "../../../../../core/errors/AppError.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";
import { ROLES } from "../../../../../constants/roles.constants.js";
import { LoginRequestDTO, AuthResponseDTO } from "../dtos/TrainerAuthDTO.js";

export class TrainerLoginUseCase {
    constructor(
        private gymTrainerRepository: IGymTrainerRepository,
        private passwordHasher: IPasswordHasher
    ) { }

    async execute(request: LoginRequestDTO): Promise<AuthResponseDTO> {
        const trainer = await this.gymTrainerRepository.findByEmail(request.email);

        if (!trainer) {
            throw new AppError("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }

        // Verify password
        if (!trainer.password) {
            throw new AppError("Password not set. Please activate your account.", HttpStatus.UNAUTHORIZED);
        }

        const isPasswordValid = await this.passwordHasher.compare(request.password, trainer.password);
        if (!isPasswordValid) {
            throw new AppError("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }

        // Generate Tokens
        const payload = {
            id: trainer.id,
            email: trainer.email,
            role: ROLES.TRAINER,
            gymId: trainer.gymId
        };

        const accessToken = TokenService.generateAccessToken(payload);
        const refreshToken = TokenService.generateRefreshToken(payload);

        return {
            user: {
                id: trainer.id,
                email: trainer.email,
                fullName: trainer.fullName,
                role: ROLES.TRAINER,
                gymId: trainer.gymId
            },
            tokens: {
                accessToken,
                refreshToken
            }
        };
    }
}
