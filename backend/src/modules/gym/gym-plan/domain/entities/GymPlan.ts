export class GymPlan {
    constructor(
        public readonly id: string,
        public readonly gymId: string,
        public readonly planName: string,
        public readonly type: 'category' | 'day',
        public readonly monthlyFee: number,
        public readonly isDelete: boolean,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public readonly durationInDays?: number,
        public readonly description?: string,
    ) { }

    updateDetails(data: {
        planName?: string;
        monthlyFee?: number;
        durationInDays?: number;
        description?: string;
    }): GymPlan {
        return new GymPlan(
            this.id,
            this.gymId,
            data.planName ?? this.planName,
            this.type, // Type usually doesn't change after creation, or maybe it can? Let's assume immutable type for now.
            data.monthlyFee ?? this.monthlyFee,
            this.isDelete,
            this.createdAt,
            new Date(),
            data.durationInDays ?? this.durationInDays,
            data.description ?? this.description
        );
    }

    markAsDeleted(): GymPlan {
        return new GymPlan(
            this.id,
            this.gymId,
            this.planName,
            this.type,
            this.monthlyFee,
            true, // isDelete
            this.createdAt,
            new Date(),
            this.durationInDays,
            this.description
        );
    }
}
