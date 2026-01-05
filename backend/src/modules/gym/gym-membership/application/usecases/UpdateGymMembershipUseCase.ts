
import { IGymMembershipRepository } from "../../domain/repositories/IGymMembershipRepository.js";
import { GymMembership } from "../../domain/entities/GymMembership.js";
import { AppError } from "../../../../../core/errors/AppError.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";

export interface UpdateMembershipDTO {
    planId?: string;
    startDate?: Date;
    expiredDate?: Date | null;
    totalPurchasedDays?: number | null;
    remainingDays?: number | null;
}

export class UpdateGymMembershipUseCase {
    constructor(private gymMembershipRepository: IGymMembershipRepository) { }

    async execute(id: string, data: UpdateMembershipDTO): Promise<GymMembership> {
        const existing = await this.gymMembershipRepository.findById(id);
        if (!existing) {
            throw new AppError("Membership not found", HttpStatus.NOT_FOUND);
        }

        // Create a new instance with updated properties (Entity is immutable-ish approach)
        // Since we don't have setters, we create a new object.
        // We only update the allowed fields.

        const updated = new GymMembership(
            existing.id,
            existing.gymId,
            existing.clientId,
            data.planId || existing.planId,
            data.startDate || existing.startDate,
            data.expiredDate !== undefined ? data.expiredDate : existing.expiredDate,
            data.totalPurchasedDays !== undefined ? data.totalPurchasedDays : existing.totalPurchasedDays,
            data.remainingDays !== undefined ? data.remainingDays : existing.remainingDays,
            existing.status,
            existing.isDelete,
            existing.createdAt,
            new Date() // updatedAt
        );

        return this.gymMembershipRepository.update(updated);
    }
}
