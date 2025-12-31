/**
 * Domain Interface for OTP Repository
 * Follows Clean Architecture - Domain Layer
 */

export interface IOtpRepository {
    /**
     * Create or update OTP for an email
     * @param email - User's email address
     * @param otp - Generated OTP code
     * @param expiresAt - Expiration timestamp
     */
    upsertOtp(email: string, otp: string, expiresAt: Date): Promise<void>;

    /**
     * Find OTP record by email
     * @param email - User's email address
     * @returns OTP record or null if not found/expired
     */
    findByEmail(email: string): Promise<{ email: string; otp: string; expiresAt: Date } | null>;

    /**
     * Verify if OTP is valid
     * @param email - User's email address
     * @param otp - OTP to verify
     * @returns true if valid, false otherwise
     */
    verifyOtp(email: string, otp: string): Promise<boolean>;
}
