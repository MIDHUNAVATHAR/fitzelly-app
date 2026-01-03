import { IGymProfileRepository } from "../../domain/repositories/IGymProfileRepository.js";
import { GymProfile } from "../../domain/entities/GymProfile.js";
import { GymModel } from "../../../authentication/infrastructure/database/mongoose/GymSchema.js"; // Reuse Schema/Model
import { GymProfilePersistenceMapper } from "../mappers/GymProfilePersistenceMapper.js";
import { AppError } from "../../../../../core/errors/AppError.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";

export class GymProfileRepositoryImpl implements IGymProfileRepository {
    async findById(id: string): Promise<GymProfile | null> {
        const gymDoc = await GymModel.findById(id);
        if (!gymDoc) return null;
        return GymProfilePersistenceMapper.toDomain(gymDoc);
    }

    async update(profile: GymProfile): Promise<GymProfile> {
        // We only update profile fields. Core Auth fields (email/password) are untouched unless profile logic changes.
        // Mongoose generic update.
        // Map domain fields to flat object manually or partial update?
        // Since GymProfile has same fields as schema (subset), we can update direct.
        // We must map it back to specific fields to avoid overwriting auth data if GymProfile object had it (it doesn't have password).

        const updatePayload: any = {
            ownerName: profile.ownerName,
            gymName: profile.gymName,
            phone: profile.phone,
            description: profile.description,
        };

        if (profile.address) {
            updatePayload.address = {
                street: profile.address.street,
                city: profile.address.city,
                state: profile.address.state,
                pincode: profile.address.pincode,
                mapLink: profile.address.mapLink,
            };
        }

        const updatedDoc = await GymModel.findByIdAndUpdate(
            profile.id,
            { $set: updatePayload },
            { new: true }
        );

        if (!updatedDoc) {
            throw new AppError("Gym not found during update", HttpStatus.NOT_FOUND);
        }

        return GymProfilePersistenceMapper.toDomain(updatedDoc);
    }
}
