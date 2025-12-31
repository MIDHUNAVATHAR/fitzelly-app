import { TokenService } from "../../infrastructure/services/TokenService.js";
import { IGymRepository } from "../../domain/repositories/IGymRepository.js";
import { IOtpRepository } from "../../domain/repositories/IOtpRepository.js";
import { IPasswordHasher } from "../../domain/services/IPasswordHasher.js";
import { Gym } from "../../domain/entities/Gym.js";
import { AppError } from "../../../../../core/errors/AppError.js";
import { SignupGymRequestDTO, SignupGymResponseDTO } from "../dtos/SignupGymDTO.js";
import { GymDTOMapper } from "../mappers/GymDTOMapper.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";

export interface CompleteSignupRequest extends SignupGymRequestDTO {
    otp: string;
}

export class SignupGymUseCase {
    constructor(
        private gymRepository: IGymRepository,
        private otpRepository: IOtpRepository,
        private passwordHasher: IPasswordHasher
    ) { }

    async execute(request: CompleteSignupRequest): Promise<SignupGymResponseDTO> {
        // 1. Verify OTP
        const isOtpValid = await this.otpRepository.verifyOtp(request.email, request.otp);
        if (!isOtpValid) {
            throw new AppError("Invalid or expired OTP. Please request again.", HttpStatus.BAD_REQUEST);
        }

        // 2. Check if email exists (Double check for safety)
        const existingGym = await this.gymRepository.findByEmail(request.email);
        if (existingGym) {
            throw new AppError("Email already in use", HttpStatus.BAD_REQUEST);
        }

        // 3. Hash Password using domain service
        const hashedPassword = await this.passwordHasher.hash(request.password);

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

        // 5. OTP is automatically deleted by TTL index when it expires
        // No manual deletion needed

        // 6. Generate Token
        const accessToken = TokenService.generateAccessToken({ id: createdGym.id, role: 'gym_owner' });
        const refreshToken = TokenService.generateRefreshToken({ id: createdGym.id, role: 'gym_owner' });


        return GymDTOMapper.toResponseDTO(createdGym, accessToken, refreshToken);
    }
}
