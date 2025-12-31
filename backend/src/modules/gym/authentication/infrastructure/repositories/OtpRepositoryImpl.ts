import { OtpModel } from "../database/mongoose/OtpSchema.js";
import { IOtpRepository } from "../../domain/repositories/IOtpRepository.js";

/**
 * OTP Repository Implementation
 * Infrastructure Layer - Implements domain interface
 */
export class OtpRepositoryImpl implements IOtpRepository {
    async upsertOtp(email: string, otp: string, expiresAt: Date): Promise<void> {
        await OtpModel.findOneAndUpdate(
            { email },
            { otp, expiresAt },
            { upsert: true, new: true }
        );
    }

    async findByEmail(email: string): Promise<{ email: string; otp: string; expiresAt: Date } | null> {
        const otpRecord = await OtpModel.findOne({ email });

        if (!otpRecord) {
            return null;
        }

        return {
            email: otpRecord.email,
            otp: otpRecord.otp,
            expiresAt: otpRecord.expiresAt
        };
    }

    async verifyOtp(email: string, otp: string): Promise<boolean> {
        const otpRecord = await this.findByEmail(email);

        if (!otpRecord) {
            return false;
        }

        return otpRecord.otp === otp;
    }
}
