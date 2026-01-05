import { IGymClientRepository } from "../../../../gym/gym-client/domain/repositories/IGymClientRepository.js";
import { IOtpRepository } from "../../domain/repositories/IOtpRepository.js";
import { IPasswordHasher } from "../../../../gym/authentication/domain/services/IPasswordHasher.js";
import { TokenService } from "../../../../gym/authentication/infrastructure/services/TokenService.js";
import { AuthResponseDTO } from "../dtos/ClientAuthDTO.js";
import { AppError } from "../../../../../core/errors/AppError.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";

export interface CompletePasswordResetRequestDTO {
    email: string;
    otp: string;
    password: string;
    confirmPassword: string;
}

export class CompleteClientPasswordResetUseCase {
    constructor(
        private gymClientRepository: IGymClientRepository,
        private otpRepository: IOtpRepository,
        private passwordHasher: IPasswordHasher
    ) { }

    async execute(request: CompletePasswordResetRequestDTO): Promise<AuthResponseDTO> {
        // Verify OTP
        const isOtpValid = await this.otpRepository.findOtp(request.email, request.otp);
        if (!isOtpValid) {
            throw new AppError("Invalid or expired OTP", HttpStatus.UNAUTHORIZED);
        }

        // Find Client
        const client = await this.gymClientRepository.findByEmail(request.email);
        if (!client) {
            throw new AppError("Client not found", HttpStatus.NOT_FOUND);
        }

        // Hash Password
        const hashedPassword = await this.passwordHasher.hash(request.password);

        // Update Client: Set Password, Mark Verified, Active
        // Note: Using markAsVerified() and updateStatus from Entity.
        // Assuming client entity is immutable and returns new instance.
        const updatedClient = client
            .setPassword(hashedPassword)
            .markAsVerified()
            .updateStatus('active');

        await this.gymClientRepository.update(updatedClient);

        // Delete OTP
        await this.otpRepository.deleteOtp(request.email);

        // Generate Tokens
        const payload = {
            id: updatedClient.id,
            email: updatedClient.email,
            role: 'client',
            gymId: updatedClient.gymId
        };
        const accessToken = TokenService.generateAccessToken(payload);
        const refreshToken = TokenService.generateRefreshToken(payload);

        return {
            user: {
                id: updatedClient.id,
                email: updatedClient.email,
                fullName: updatedClient.fullName,
                role: 'client',
                gymId: updatedClient.gymId
            },
            tokens: {
                accessToken,
                refreshToken
            }
        };
    }
}
