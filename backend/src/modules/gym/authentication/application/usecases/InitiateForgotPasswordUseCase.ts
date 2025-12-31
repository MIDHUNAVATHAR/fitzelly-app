import { IGymRepository } from "../../domain/repositories/IGymRepository.js";
import { IOtpRepository } from "../../domain/repositories/IOtpRepository.js";
import { IEmailService } from "../../domain/services/IEmailService.js";
import { AppError } from "../../../../../core/errors/AppError.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";
import { InitiateForgotPasswordRequestDTO } from "../dtos/ForgotPasswordDTO.js";

/**
 * Use Case: Initiate Forgot Password
 * Sends OTP to user's email for password reset
 */
export class InitiateForgotPasswordUseCase {
    constructor(
        private gymRepository: IGymRepository,
        private otpRepository: IOtpRepository,
        private emailService: IEmailService
    ) { }

    async execute(request: InitiateForgotPasswordRequestDTO): Promise<void> {
        // 1. Check if gym exists with this email
        const gym = await this.gymRepository.findByEmail(request.email);
        if (!gym) {
            // For security, don't reveal if email exists or not
            // But still throw error to prevent password reset
            throw new AppError("If this email exists, an OTP has been sent", HttpStatus.OK);
        }

        // 2. Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes for password reset

        // 3. Save OTP (TTL index will auto-delete)
        await this.otpRepository.upsertOtp(request.email, otp, expiresAt);

        // 4. Send OTP via email
        await this.emailService.sendOtp(request.email, otp);
    }
}
