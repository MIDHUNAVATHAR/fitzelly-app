import { ISuperAdminRepository } from "../../../domain/repositories/ISuperAdminRepository.js";
import { IOtpRepository } from "../../../../client/authentication/domain/repositories/IOtpRepository.js";
import { IEmailService } from "../../../../gym/authentication/domain/services/IEmailService.js";
import { AppError } from "../../../../../core/errors/AppError.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";
import { InitiatePasswordResetRequestDTO } from "../dtos/SuperAdminAuthDTO.js";

export class InitiateSuperAdminPasswordResetUseCase {
    constructor(
        private superAdminRepository: ISuperAdminRepository,
        private otpRepository: IOtpRepository,
        private emailService: IEmailService
    ) { }

    async execute(request: InitiatePasswordResetRequestDTO): Promise<void> {
        const admin = await this.superAdminRepository.findByEmail(request.email);

        if (!admin) {
            // Security: Don't reveal if admin exists, but here we can throw generic error or specific if development.
            // For Super Admin logic, usually being specific is okay as there are few admins.
            throw new AppError("Super Admin not found", HttpStatus.NOT_FOUND);
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP
        // 10 minutes expiry
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await this.otpRepository.saveOtp(request.email, otp, expiresAt);

        // Send Email
        await this.emailService.sendOtp(request.email, otp);
    }
}
