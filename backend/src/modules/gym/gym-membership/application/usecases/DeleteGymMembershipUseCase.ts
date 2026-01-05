import { IGymMembershipRepository } from "../../domain/repositories/IGymMembershipRepository.js";
import { AppError } from "../../../../../core/errors/AppError.js";
import { HttpStatus } from "../../../../../constants/statusCodes.constants.js";

import { IGymClientRepository } from "../../../gym-client/domain/repositories/IGymClientRepository.js";

export class DeleteGymMembershipUseCase {
    constructor(
        private gymMembershipRepository: IGymMembershipRepository,
        private gymClientRepository: IGymClientRepository
    ) { }

    async execute(id: string, gymId: string): Promise<void> {
        const membership = await this.gymMembershipRepository.findById(id);
        if (!membership) {
            throw new AppError("Membership not found", HttpStatus.NOT_FOUND);
        }

        if (membership.gymId !== gymId) {
            throw new AppError("Unauthorized", HttpStatus.FORBIDDEN);
        }

        const deleted = membership.markAsDeleted();
        await this.gymMembershipRepository.update(deleted);

        // Side effect: Check if user has other active memberships
        const activeCount = await this.gymMembershipRepository.countActiveMemberships(membership.clientId);

        if (activeCount === 0) {
            const client = await this.gymClientRepository.findById(membership.clientId);
            if (client) {
                const updatedClient = client.updateStatus('expired');
                await this.gymClientRepository.update(updatedClient);
            }
        }
    }
}
