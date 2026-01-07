import { IGymTrainerRepository } from "../../domain/repositories/IGymTrainerRepository.js";
import { IGymRepository } from "../../../authentication/domain/repositories/IGymRepository.js";
import { IOtpRepository } from "../../../../client/authentication/domain/repositories/IOtpRepository.js";
import { IEmailService } from "../../../authentication/domain/services/IEmailService.js";

export class SendTrainerWelcomeEmailUseCase {
    constructor(
        private gymTrainerRepository: IGymTrainerRepository,
        private gymRepository: IGymRepository,
        private otpRepository: IOtpRepository,
        private emailService: IEmailService
    ) { }

    async execute(trainerId: string, gymId: string): Promise<void> {
        // 1. Get Trainer
        const trainer = await this.gymTrainerRepository.findById(trainerId);
        if (!trainer) {
            throw new Error("Trainer not found");
        }
        if (trainer.gymId.toString() !== gymId) {
            throw new Error("Unauthorized to access this trainer");
        }

        // 2. Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        // 3. Save OTP
        await this.otpRepository.saveOtp(trainer.email, otp, expiresAt);

        // 4. Generate Link
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const link = `${frontendUrl}/auth/verify-otp?email=${encodeURIComponent(trainer.email)}&role=trainer&otp=${otp}`;

        // 5. Get Gym Details
        const gym = await this.gymRepository.findById(gymId);
        if (!gym) throw new Error("Gym not found");

        // 6. Send Email
        await this.emailService.sendClientInvitation(trainer.email, link, otp, gym.gymName || "Your Gym", 'Trainer');
    }
}
