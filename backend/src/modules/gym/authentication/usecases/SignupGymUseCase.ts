import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IGymRepository } from "../domain/repositories/IGymRepository.js";
import { Gym } from "../domain/entities/Gym.js";
import { AppError } from "../../../../core/errors/AppError.js";
import { SignupGymRequestDTO, SignupGymResponseDTO } from "../domain/dtos/SignupGymDTO.js";
import { GymDTOMapper } from "../presentation/mappers/GymDTOMapper.js";
import { OtpModel } from "../infrastructure/persistence/mongoose/OtpSchema.js"; // Direct access for now, cleaner to use Repo

export interface CompleteSignupRequest extends SignupGymRequestDTO {
    otp: string;
}

export class SignupGymUseCase {
    constructor(private gymRepository: IGymRepository) { }

    async execute(request: CompleteSignupRequest): Promise<SignupGymResponseDTO> {
        // 1. Verify OTP
        const otpRecord = await OtpModel.findOne({ email: request.email });
        if (!otpRecord) {
            throw new AppError("OTP expired or not found. Please request again.", 400);
        }

        if (otpRecord.otp !== request.otp) {
            throw new AppError("Invalid OTP", 400);
        }

        // 2. Check if email exists (Double check for safety)
        const existingGym = await this.gymRepository.findByEmail(request.email);
        if (existingGym) {
            throw new AppError("Email already in use", 400);
        }

        // 3. Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(request.password, salt);

        // 4. Create Entity 
        const gymToCreate = new Gym(
            "",
            request.gymName,
            request.email,
            hashedPassword,
            new Date(),
            new Date()
        );

        const createdGym = await this.gymRepository.create(gymToCreate);

        // 5. Delete OTP used
        await OtpModel.deleteOne({ email: request.email });

        // 6. Generate Token
        const secret = process.env.JWT_SECRET || "default_secret_key_change_me";
        const token = jwt.sign({ id: createdGym.id, role: 'gym_owner' }, secret, { expiresIn: '1d' });

        return GymDTOMapper.toResponseDTO(createdGym, token);
    }
}
