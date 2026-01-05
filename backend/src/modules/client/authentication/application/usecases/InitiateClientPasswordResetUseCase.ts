import { IGymClientRepository } from "../../../../gym/gym-client/domain/repositories/IGymClientRepository.js";
import { IOtpRepository } from "../../domain/repositories/IOtpRepository.js";
import { IEmailService } from "../../../../gym/authentication/domain/services/IEmailService.js";
import { AppError } from "../../../../../core/errors/AppError.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";

export interface InitiateForgotPasswordRequestDTO {
    email: string;
}

export class InitiateClientPasswordResetUseCase {
    constructor(
        private gymClientRepository: IGymClientRepository,
        private otpRepository: IOtpRepository,
        private emailService: IEmailService
    ) { }

    async execute(request: InitiateForgotPasswordRequestDTO): Promise<void> {
        const client = await this.gymClientRepository.findByEmail(request.email);

        if (!client) {
            // Security: Don't reveal if email exists, but logic implies we need client to send email.
            // Typically we return success even if email not found to prevent enumeration, 
            // OR we throw specific errors if UX demands it. 
            // Given the requirement "backend check this emails exists... then issue a otp",
            // I will throw error if not found or just silence it. 
            // The prompt says "backend check this emails exists in clients collection, then issue a otp".
            // If it DOES NOT exist, presumably we error or do nothing.
            // I'll throw 'User not found' for now to be explicit as per common flows in this app.
            throw new AppError("Client not found", HttpStatus.NOT_FOUND);
        }

        if (client.status === 'inactive') {
            // Optional: Allow them to activate via this flow? 
            // Requirement says "first time client open... click forgotpassword".
            // So yes, this is the activation flow too.
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Save OTP
        await this.otpRepository.saveOtp(client.email, otp, expiresAt);

        // Send OTP Email
        await this.emailService.sendOtp(client.email, otp);
    }
}
