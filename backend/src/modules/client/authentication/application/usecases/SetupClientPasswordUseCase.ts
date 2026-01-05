import { IGymClientRepository } from "../../../../gym/gym-client/domain/repositories/IGymClientRepository.js";
import { IOtpRepository } from "../../domain/repositories/IOtpRepository.js";
import { IPasswordHasher } from "../../../../gym/authentication/domain/services/IPasswordHasher.js";
import { TokenService } from "../../../../gym/authentication/infrastructure/services/TokenService.js";
import { SetupPasswordRequestDTO, AuthResponseDTO } from "../dtos/ClientAuthDTO.js";
import { AppError } from "../../../../../core/errors/AppError.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";

export class SetupClientPasswordUseCase {
    constructor(
        private gymClientRepository: IGymClientRepository,
        private otpRepository: IOtpRepository,
        private passwordHasher: IPasswordHasher,
        // private tokenService: ITokenService
    ) { }

    async execute(request: SetupPasswordRequestDTO): Promise<AuthResponseDTO> {
        if (request.password !== request.confirmPassword) {
            throw new AppError("Passwords do not match", HttpStatus.BAD_REQUEST);
        }

        const isOtpValid = await this.otpRepository.findOtp(request.email, request.otp);
        if (!isOtpValid) {
            throw new AppError("Invalid or expired OTP", HttpStatus.UNAUTHORIZED);
        }

        const client = await this.gymClientRepository.findByEmail(request.email);
        if (!client) {
            throw new AppError("Client not found", HttpStatus.NOT_FOUND);
        }

        const hashedPassword = await this.passwordHasher.hash(request.password);

        const updatedClient = client.setPassword(hashedPassword);
        const verifiedClient = updatedClient.markAsVerified().updateStatus('active');

        await this.gymClientRepository.update(verifiedClient);
        await this.otpRepository.deleteOtp(request.email);

        // Generate Tokens
        const payload = {
            id: verifiedClient.id,
            email: verifiedClient.email,
            role: 'client',
            gymId: verifiedClient.gymId
        };

        const accessToken = TokenService.generateAccessToken(payload);
        const refreshToken = TokenService.generateRefreshToken(payload);

        return {
            user: {
                id: verifiedClient.id,
                email: verifiedClient.email,
                fullName: verifiedClient.fullName,
                role: 'client',
                gymId: verifiedClient.gymId
            },
            tokens: {
                accessToken,
                refreshToken
            }
        };
    }
}
