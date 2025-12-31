import { IGymRepository } from "../../domain/repositories/IGymRepository.js";
import { IOtpRepository } from "../../domain/repositories/IOtpRepository.js";
import { IPasswordHasher } from "../../domain/services/IPasswordHasher.js";
import { AppError } from "../../../../../core/errors/AppError.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";
import { ResetPasswordRequestDTO } from "../dtos/ForgotPasswordDTO.js";

/**
 * Use Case: Reset Password
 * Verifies OTP and updates user's password
 */
export class ResetPasswordUseCase {
    constructor(
        private gymRepository: IGymRepository,
        private otpRepository: IOtpRepository,
        private passwordHasher: IPasswordHasher
    ) { }

    async execute(request: ResetPasswordRequestDTO): Promise<void> {
        // 1. Verify OTP
        const isOtpValid = await this.otpRepository.verifyOtp(request.email, request.otp);
        if (!isOtpValid) {
            throw new AppError("Invalid or expired OTP", HttpStatus.BAD_REQUEST);
        }

        // 2. Find gym by email
        const gym = await this.gymRepository.findByEmail(request.email);
        if (!gym) {
            throw new AppError("User not found", HttpStatus.NOT_FOUND);
        }

        // 3. Hash new password using domain service
        const hashedPassword = await this.passwordHasher.hash(request.newPassword);

        // 4. Update password using domain method (maintains immutability)
        const updatedGym = gym.updatePassword(hashedPassword);

        await this.gymRepository.update(updatedGym);

        // 5. OTP will be auto-deleted by TTL index
        // No manual deletion needed
    }
}
