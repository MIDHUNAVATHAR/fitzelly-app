import { IOtpRepository } from "../../domain/repositories/IOtpRepository.js";
import { OtpModel } from "../models/OtpSchema.js";

export class OtpRepositoryImpl implements IOtpRepository {
    async saveOtp(email: string, otp: string, expiresAt: Date): Promise<void> {
        await OtpModel.findOneAndDelete({ email }); // Remove existing OTP
        await OtpModel.create({
            email,
            otp,
            expiresAt
        });
    }

    async findOtp(email: string, otp: string): Promise<boolean> {
        const record = await OtpModel.findOne({ email, otp });
        if (record && record.expiresAt > new Date()) {
            return true;
        }
        return false;
    }

    async deleteOtp(email: string): Promise<void> {
        await OtpModel.findOneAndDelete({ email });
    }
}
