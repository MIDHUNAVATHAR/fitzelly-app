import { IGymMembershipRepository, MembershipWithDetails } from "../../domain/repositories/IGymMembershipRepository.js";

export class GetGymMembershipsUseCase {
    constructor(private gymMembershipRepository: IGymMembershipRepository) { }

    async execute(gymId: string, page: number, limit: number, search?: string, planType?: string): Promise<{ items: MembershipWithDetails[], total: number }> {
        return this.gymMembershipRepository.findMemberships(gymId, { page, limit, search, planType });
    }
}
