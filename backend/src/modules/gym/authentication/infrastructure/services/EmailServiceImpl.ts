import { IEmailService } from "../../domain/services/IEmailService.js";
import { mailService } from "../../../../../core/services/MailService.js";

/**
 * Email Service Implementation
 * Infrastructure Layer - Adapter for MailService
 */
export class EmailServiceImpl implements IEmailService {
    async sendOtp(to: string, otp: string): Promise<void> {
        await mailService.sendOtp(to, otp);
    }

    // async sendPasswordReset(to: string, resetLink: string): Promise<void> {
    //     // TODO: Implement password reset email
    //     throw new Error("Not implemented yet");
    // }

    // async sendWelcomeEmail(to: string, name: string): Promise<void> {
    //     // TODO: Implement welcome email
    //     throw new Error("Not implemented yet");
    // }

    async sendClientInvitation(to: string, link: string, otp: string): Promise<void> {
        await mailService.sendClientInvitation(to, link, otp);
    }
}
