import { OtpModel } from "../../infrastructure/database/mongoose/OtpSchema.js";
import { mailService } from "../../../../../core/services/MailService.js";
import { IGymRepository } from "../../domain/repositories/IGymRepository.js";
import { AppError } from "../../../../../core/errors/AppError.js";

interface InitiateSignupRequest {
    email: string;
}

export class InitiateSignupUseCase {
    constructor(private gymRepository: IGymRepository) { }

    async execute(request: InitiateSignupRequest): Promise<void> {
        //  Check if email already registered
        const existingGym = await this.gymRepository.findByEmail(request.email);
        if (existingGym) {
            throw new AppError("Email already in use", 400);
        }

        //  Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        //  Save OTP (Upsert: Update if exists, Insert if new)
        await OtpModel.findOneAndUpdate(
            { email: request.email },
            { otp, expiresAt },
            { upsert: true, new: true }
        );

        //  Send Email
        await mailService.sendOtp(request.email, otp);
    }
}
