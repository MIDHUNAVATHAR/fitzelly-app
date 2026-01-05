export interface IOtpRepository {
    saveOtp(email: string, otp: string, expiresAt: Date): Promise<void>;
    findOtp(email: string, otp: string): Promise<boolean>;
    deleteOtp(email: string): Promise<void>;
}
