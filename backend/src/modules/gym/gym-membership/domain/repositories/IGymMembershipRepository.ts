import { GymMembership } from "../entities/GymMembership.js";

export interface MembershipWithDetails {
    id: string;
    clientId: string;
    clientName: string;
    planId: string;
    planName: string;
    planType: 'category' | 'day';
    startDate: Date;
    expiredDate: Date | null;
    totalPurchasedDays: number | null;
    remainingDays: number | null;
    status: 'active' | 'expired' | 'cancelled';
    isDelete: boolean;
    // Helper property for UI logic (e.g. days left) can be computed in frontend or backend
}

export interface IGymMembershipRepository {
    create(membership: GymMembership): Promise<GymMembership>;
    findById(id: string): Promise<GymMembership | null>;
    update(membership: GymMembership): Promise<GymMembership>;

    findMemberships(gymId: string, options: {
        page: number;
        limit: number;
        search?: string;
        planType?: string; // 'all' | 'category' | 'day'
    }): Promise<{ items: MembershipWithDetails[], total: number }>;

    countActiveMemberships(clientId: string): Promise<number>;
}
