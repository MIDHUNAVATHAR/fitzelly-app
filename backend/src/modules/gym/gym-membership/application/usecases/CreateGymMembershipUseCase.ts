
import { IGymMembershipRepository } from "../../domain/repositories/IGymMembershipRepository.js";
import { GymMembership } from "../../domain/entities/GymMembership.js";
import { AppError } from "../../../../../core/errors/AppError.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";
import mongoose from "mongoose";

import { IGymClientRepository } from "../../../gym-client/domain/repositories/IGymClientRepository.js";

export interface CreateMembershipDTO {
    gymId: string;
    clientId: string;
    planId: string;
    startDate: Date;
    expiredDate: Date | null;
    totalPurchasedDays: number | null;
    remainingDays: number | null;
}

export class CreateGymMembershipUseCase {
    constructor(
        private gymMembershipRepository: IGymMembershipRepository,
        private gymClientRepository: IGymClientRepository
    ) { }

    async execute(data: CreateMembershipDTO): Promise<GymMembership> {
        // Here we ideally validate if client and plan exist in the gym
        // For brevity assuming controller validated IDs or DB will throw ref error

        const membership = new GymMembership(
            new mongoose.Types.ObjectId().toString(),
            data.gymId,
            data.clientId,
            data.planId,
            data.startDate,
            data.expiredDate,
            data.totalPurchasedDays,
            data.remainingDays,
            'active',
            false,
            new Date(),
            new Date()
        );

        const created = await this.gymMembershipRepository.create(membership);

        // Update Client Status to Active
        const client = await this.gymClientRepository.findById(data.clientId);
        if (client) {
            const updatedClient = client.updateStatus('active');
            await this.gymClientRepository.update(updatedClient);
        }

        return created;
    }
}
