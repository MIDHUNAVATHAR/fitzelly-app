import { IGymTrainerRepository } from "../../../../gym/gym-trainer/domain/repositories/IGymTrainerRepository.js";
import { IOtpRepository } from "../../../../client/authentication/domain/repositories/IOtpRepository.js"; // Reusing interface
import { IEmailService } from "../../../../gym/authentication/domain/services/IEmailService.js";
import { AppError } from "../../../../../core/errors/AppError.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";
import { InitiatePasswordResetRequestDTO } from "../dtos/TrainerAuthDTO.js";

export class InitiateTrainerPasswordResetUseCase {
    constructor(
        private gymTrainerRepository: IGymTrainerRepository,
        private otpRepository: IOtpRepository,
        private emailService: IEmailService
    ) { }

    async execute(request: InitiatePasswordResetRequestDTO): Promise<void> {
        const trainer = await this.gymTrainerRepository.findByEmail(request.email);

        if (!trainer) {
            throw new AppError("Trainer not found", HttpStatus.NOT_FOUND);
        }

        if (trainer.isDelete) {
            throw new AppError("Account is deleted", HttpStatus.FORBIDDEN);
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Save OTP
        await this.otpRepository.saveOtp(request.email, otp, expiresAt);

        // Send Email
        await this.emailService.sendOtp(trainer.email, otp);
    }
}
