import { TokenService } from "../../../../gym/authentication/infrastructure/services/TokenService.js";
import { GoogleAuthService } from "../../../../gym/authentication/infrastructure/services/GoogleAuthService.js";
import { IGymClientRepository } from "../../../../gym/gym-client/domain/repositories/IGymClientRepository.js";

export class GoogleAuthClientUseCase {
    constructor(
        private clientRepository: IGymClientRepository,
        private googleAuthService: GoogleAuthService
    ) { }

    async execute(code: string): Promise<any> {
        // 1. Verify Google Token
        const googlePayload = await this.googleAuthService.verifyToken(code);
        const { email } = googlePayload;

        // 2. Check if user exists
        let client = await this.clientRepository.findByEmail(email);

        if (!client) {
            throw new Error("Client account not found. Please ask your gym to add you.");
        }

        // 2.1 Mark as verified if not already
        if (!client.isEmailVerified) {
            client = client.markAsVerified();
            await this.clientRepository.update(client);
        }

        // 3. Generate Tokens (Login)
        const accessToken = TokenService.generateAccessToken({ id: client.id, role: 'client' });
        const refreshToken = TokenService.generateRefreshToken({ id: client.id, role: 'client' });

        return {
            user: {
                id: client.id,
                email: client.email,
                fullName: client.fullName,
                role: 'client',
                gymId: client.gymId
            },
            accessToken,
            refreshToken
        };
    }
}
