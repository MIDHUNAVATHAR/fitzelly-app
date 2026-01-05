import { ISuperAdminRepository } from "../../../domain/repositories/ISuperAdminRepository.js";
import { IOtpRepository } from "../../../../client/authentication/domain/repositories/IOtpRepository.js";
import { IPasswordHasher } from "../../../../gym/authentication/domain/services/IPasswordHasher.js";
import { TokenService } from "../../../../gym/authentication/infrastructure/services/TokenService.js";
import { AppError } from "../../../../../core/errors/AppError.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";
import { CompletePasswordResetRequestDTO, AuthResponseDTO } from "../dtos/SuperAdminAuthDTO.js";

export class CompleteSuperAdminPasswordResetUseCase {
    constructor(
        private superAdminRepository: ISuperAdminRepository,
        private otpRepository: IOtpRepository,
        private passwordHasher: IPasswordHasher
    ) { }

    async execute(request: CompletePasswordResetRequestDTO): Promise<AuthResponseDTO> {
        // Verify OTP
        const isOtpValid = await this.otpRepository.findOtp(request.email, request.otp);
        if (!isOtpValid) {
            throw new AppError("Invalid or expired OTP", HttpStatus.BAD_REQUEST);
        }

        const admin = await this.superAdminRepository.findByEmail(request.email);
        if (!admin) {
            throw new AppError("Super Admin not found", HttpStatus.NOT_FOUND);
        }

        // Hash Password
        const hashedPassword = await this.passwordHasher.hash(request.password);

        // Update Admin Password
        const updatedAdmin = admin.setPassword(hashedPassword);

        await this.superAdminRepository.update(updatedAdmin);

        // Delete OTP
        await this.otpRepository.deleteOtp(request.email);

        // Generate Tokens
        const payload = {
            id: updatedAdmin.id,
            email: updatedAdmin.email,
            role: 'super-admin'
        };
        const accessToken = TokenService.generateAccessToken(payload);
        const refreshToken = TokenService.generateRefreshToken(payload);

        return {
            user: {
                id: updatedAdmin.id,
                email: updatedAdmin.email,
                fullName: updatedAdmin.fullName,
                role: 'super-admin'
            },
            tokens: {
                accessToken,
                refreshToken
            }
        };
    }
}
