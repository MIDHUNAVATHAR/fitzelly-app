import { IGymClientRepository } from "../../../../gym/gym-client/domain/repositories/IGymClientRepository.js";
import { IPasswordHasher } from "../../../../gym/authentication/domain/services/IPasswordHasher.js";
import { TokenService } from "../../../../gym/authentication/infrastructure/services/TokenService.js";
import { AuthResponseDTO, LoginRequestDTO } from "../dtos/ClientAuthDTO.js";
import { AppError } from "../../../../../core/errors/AppError.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";

export class ClientLoginUseCase {
    constructor(
        private gymClientRepository: IGymClientRepository,
        private passwordHasher: IPasswordHasher
    ) { }

    async execute(request: LoginRequestDTO): Promise<AuthResponseDTO> {
        const client = await this.gymClientRepository.findByEmail(request.email);

        if (!client) {
            throw new AppError("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }

        if (client.status === 'inactive') {
            throw new AppError("Account is inactive. Please activate your account.", HttpStatus.FORBIDDEN);
        }

        // Verify password
        if (!client.password) {
            throw new AppError("Password not set. Please activate your account.", HttpStatus.UNAUTHORIZED);
        }

        const isPasswordValid = await this.passwordHasher.compare(request.password, client.password);
        if (!isPasswordValid) {
            throw new AppError("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }

        // Generate Tokens
        const payload = {
            id: client.id,
            email: client.email,
            role: 'client',
            gymId: client.gymId
        };

        const accessToken = TokenService.generateAccessToken(payload);
        const refreshToken = TokenService.generateRefreshToken(payload);

        return {
            user: {
                id: client.id,
                email: client.email,
                fullName: client.fullName,
                role: 'client',
                gymId: client.gymId
            },
            tokens: {
                accessToken,
                refreshToken
            }
        };
    }
}
