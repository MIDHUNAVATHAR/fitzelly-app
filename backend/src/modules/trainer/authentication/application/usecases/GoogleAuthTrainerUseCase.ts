import { TokenService } from "../../../../gym/authentication/infrastructure/services/TokenService.js";
import { GoogleAuthService } from "../../../../gym/authentication/infrastructure/services/GoogleAuthService.js";
import { IGymTrainerRepository } from "../../../../gym/gym-trainer/domain/repositories/IGymTrainerRepository.js";
import { ROLES } from "../../../../../constants/roles.constants.js";

export class GoogleAuthTrainerUseCase {
    constructor(
        private trainerRepository: IGymTrainerRepository,
        private googleAuthService: GoogleAuthService
    ) { }

    async execute(code: string): Promise<any> {
        // 1. Verify Google Token
        const googlePayload = await this.googleAuthService.verifyToken(code);
        const { email } = googlePayload;

        // 2. Check if user exists
        let trainer = await this.trainerRepository.findByEmail(email);

        if (!trainer) {
            throw new Error("Trainer account not found. Please contact your gym.");
        }

        // 2.1 Mark as verified if not already
        if (!trainer.isEmailVerified) {
            trainer = trainer.markAsVerified();
            await this.trainerRepository.update(trainer);
        }

        // 3. Generate Tokens (Login)
        const accessToken = TokenService.generateAccessToken({ id: trainer.id, role: ROLES.TRAINER });
        const refreshToken = TokenService.generateRefreshToken({ id: trainer.id, role: ROLES.TRAINER });

        return {
            user: {
                id: trainer.id,
                email: trainer.email,
                fullName: trainer.fullName,
                role: ROLES.TRAINER,
                gymId: trainer.gymId
            },
            accessToken,
            refreshToken
        };
    }
}
