export class GymMembership {
    constructor(
        public readonly id: string,
        public readonly gymId: string,
        public readonly clientId: string,
        public readonly planId: string,
        public readonly startDate: Date,
        public readonly expiredDate: Date | null,
        public readonly totalPurchasedDays: number | null,
        public readonly remainingDays: number | null,
        public readonly status: 'active' | 'expired' | 'cancelled',
        public readonly isDelete: boolean,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) { }

    markAsDeleted(): GymMembership {
        return new GymMembership(
            this.id,
            this.gymId,
            this.clientId,
            this.planId,
            this.startDate,
            this.expiredDate,
            this.totalPurchasedDays,
            this.remainingDays,
            this.status,
            true,
            this.createdAt,
            new Date()
        );
    }
}
