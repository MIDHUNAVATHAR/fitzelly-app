import { IGymTrainerRepository } from "../../../../gym/gym-trainer/domain/repositories/IGymTrainerRepository.js";
import { IOtpRepository } from "../../../../client/authentication/domain/repositories/IOtpRepository.js";
import { IPasswordHasher } from "../../../../gym/authentication/domain/services/IPasswordHasher.js";
import { TokenService } from "../../../../gym/authentication/infrastructure/services/TokenService.js";
import { AppError } from "../../../../../core/errors/AppError.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";
import { CompletePasswordResetRequestDTO, AuthResponseDTO } from "../dtos/TrainerAuthDTO.js";

export class CompleteTrainerPasswordResetUseCase {
    constructor(
        private gymTrainerRepository: IGymTrainerRepository,
        private otpRepository: IOtpRepository,
        private passwordHasher: IPasswordHasher
    ) { }

    async execute(request: CompletePasswordResetRequestDTO): Promise<AuthResponseDTO> {
        // Verify OTP
        const isOtpValid = await this.otpRepository.findOtp(request.email, request.otp);
        if (!isOtpValid) {
            throw new AppError("Invalid or expired OTP", HttpStatus.BAD_REQUEST);
        }

        const trainer = await this.gymTrainerRepository.findByEmail(request.email);
        if (!trainer) {
            throw new AppError("Trainer not found", HttpStatus.NOT_FOUND);
        }

        // Hash Password
        const hashedPassword = await this.passwordHasher.hash(request.password);

        // Update Client (Set Password, Verify Email, Active Status)
        // Using the new methods we added to GymTrainer entity
        const updatedTrainer = trainer
            .setPassword(hashedPassword)
            .markAsVerified();

        await this.gymTrainerRepository.update(updatedTrainer);

        // Delete OTP
        await this.otpRepository.deleteOtp(request.email);

        // Generate Tokens
        const payload = {
            id: updatedTrainer.id,
            email: updatedTrainer.email,
            role: 'trainer',
            gymId: updatedTrainer.gymId
        };
        const accessToken = TokenService.generateAccessToken(payload);
        const refreshToken = TokenService.generateRefreshToken(payload);

        return {
            user: {
                id: updatedTrainer.id,
                email: updatedTrainer.email,
                fullName: updatedTrainer.fullName,
                role: 'trainer',
                gymId: updatedTrainer.gymId
            },
            tokens: {
                accessToken,
                refreshToken
            }
        };
    }
}
