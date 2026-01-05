import { ISuperAdminRepository } from "../../../domain/repositories/ISuperAdminRepository.js";
import { IPasswordHasher } from "../../../../gym/authentication/domain/services/IPasswordHasher.js";
import { TokenService } from "../../../../gym/authentication/infrastructure/services/TokenService.js";
import { AppError } from "../../../../../core/errors/AppError.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";
import { LoginRequestDTO, AuthResponseDTO } from "../dtos/SuperAdminAuthDTO.js";

export class SuperAdminLoginUseCase {
    constructor(
        private superAdminRepository: ISuperAdminRepository,
        private passwordHasher: IPasswordHasher
    ) { }

    async execute(request: LoginRequestDTO): Promise<AuthResponseDTO> {
        const admin = await this.superAdminRepository.findByEmail(request.email);

        if (!admin) {
            throw new AppError("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }

        // Verify password
        if (!admin.password) {
            throw new AppError("Password not set. Please reset your password.", HttpStatus.UNAUTHORIZED);
        }

        const isPasswordValid = await this.passwordHasher.compare(request.password, admin.password);
        if (!isPasswordValid) {
            throw new AppError("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }

        // Generate Tokens
        const payload = {
            id: admin.id,
            email: admin.email,
            role: 'super-admin'
        };

        const accessToken = TokenService.generateAccessToken(payload);
        const refreshToken = TokenService.generateRefreshToken(payload);

        return {
            user: {
                id: admin.id,
                email: admin.email,
                fullName: admin.fullName,
                role: 'super-admin'
            },
            tokens: {
                accessToken,
                refreshToken
            }
        };
    }
}
