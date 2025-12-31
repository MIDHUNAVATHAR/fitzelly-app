/**
 * Domain Interface for Email Service
 * Follows Clean Architecture - Domain Layer
 */

export interface IEmailService {
    /**
     * Send OTP verification email
     * @param to - Recipient email address
     * @param otp - OTP code to send
     */
    sendOtp(to: string, otp: string): Promise<void>;

    /**
     * Send password reset email
     * @param to - Recipient email address
     * @param resetLink - Password reset link
     */
    // sendPasswordReset?(to: string, resetLink: string): Promise<void>;

    /**
     * Send welcome email
     * @param to - Recipient email address
     * @param name - User's name
     */
    // sendWelcomeEmail?(to: string, name: string): Promise<void>;
}
