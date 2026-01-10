import { IGymProfileRepository } from "../../domain/repositories/IGymProfileRepository.js";
import { GymProfileMapper } from "../mappers/GymProfileMapper.js";
import { GymProfileDTO } from "../dtos/GymProfileDTO.js";
import { AppError } from "../../../../../core/errors/AppError.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";

export interface UpdateProfileRequest {
    ownerName?: string;
    gymName?: string;
    phone?: string;
    description?: string;
    logoUrl?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        pincode?: string;
        mapLink?: string;
    };
}

export class UpdateProfileUseCase {
    constructor(
        private gymProfileRepository: IGymProfileRepository
    ) { }

    async execute(userId: string, request: UpdateProfileRequest): Promise<GymProfileDTO> {
        // 1. Find Gym Profile
        const profile = await this.gymProfileRepository.findById(userId);
        if (!profile) {
            throw new AppError("Gym not found", HttpStatus.NOT_FOUND);
        }

        // 2. Update Details
        const updatedProfile = profile.updateDetails(request);

        // 3. Persist
        const persistedProfile = await this.gymProfileRepository.update(updatedProfile);

        // 4. Return DTO
        return GymProfileMapper.toDTO(persistedProfile);
    }
}
