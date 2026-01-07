import { IGymClientRepository } from "../../domain/repositories/IGymClientRepository.js";
import { IGymRepository } from "../../../authentication/domain/repositories/IGymRepository.js";
import { IOtpRepository } from "../../../../client/authentication/domain/repositories/IOtpRepository.js";
import { IEmailService } from "../../../authentication/domain/services/IEmailService.js";

export class SendClientWelcomeEmailUseCase {
    constructor(
        private gymClientRepository: IGymClientRepository,
        private gymRepository: IGymRepository,
        private otpRepository: IOtpRepository,
        private emailService: IEmailService
    ) { }

    async execute(clientId: string, gymId: string): Promise<void> {
        // 1. Get Client
        const client = await this.gymClientRepository.findById(clientId);
        if (!client) {
            throw new Error("Client not found");
        }
        if (client.gymId.toString() !== gymId) {
            throw new Error("Unauthorized to access this client");
        }

        // 2. Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        // 3. Save OTP
        await this.otpRepository.saveOtp(client.email, otp, expiresAt);

        // 4. Generate Link
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const link = `${frontendUrl}/auth/verify-otp?email=${encodeURIComponent(client.email)}&role=client&otp=${otp}`;

        // 5. Get Gym Details
        const gym = await this.gymRepository.findById(gymId);
        if (!gym) throw new Error("Gym not found");

        // 6. Send Email
        await this.emailService.sendClientInvitation(client.email, link, otp, gym.gymName || "Your Gym", 'Client');
    }
}
