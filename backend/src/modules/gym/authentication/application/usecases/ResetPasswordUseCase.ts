import bcrypt from 'bcryptjs';
import { IGymRepository } from "../../domain/repositories/IGymRepository.js";
import { IOtpRepository } from "../../domain/repositories/IOtpRepository.js";
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
        private otpRepository: IOtpRepository
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

        // 3. Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(request.newPassword, salt);

        // 4. Update password using domain method (maintains immutability)
        const updatedGym = gym.updatePassword(hashedPassword);

        await this.gymRepository.update(updatedGym);

        // 5. OTP will be auto-deleted by TTL index
        // No manual deletion needed
    }
}
