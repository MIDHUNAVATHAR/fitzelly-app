import { IGymRepository } from "../../domain/repositories/IGymRepository.js";
import { IOtpRepository } from "../../domain/repositories/IOtpRepository.js";
import { IEmailService } from "../../domain/services/IEmailService.js";
import { AppError } from "../../../../../core/errors/AppError.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";

interface InitiateSignupRequest {
    email: string;
}

export class InitiateSignupUseCase {
    constructor(
        private gymRepository: IGymRepository,
        private otpRepository: IOtpRepository,
        private emailService: IEmailService
    ) { }

    async execute(request: InitiateSignupRequest): Promise<void> {
        //  Check if email already registered
        const existingGym = await this.gymRepository.findByEmail(request.email);
        if (existingGym) {
            throw new AppError("Email already in use", HttpStatus.BAD_REQUEST);
        }

        //  Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        //  Save OTP (Upsert: Update if exists, Insert if new)
        // TTL index will automatically delete expired OTPs
        await this.otpRepository.upsertOtp(request.email, otp, expiresAt);

        //  Send Email
        await this.emailService.sendOtp(request.email, otp);
    }
}
