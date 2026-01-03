export class GymTrainer {
    constructor(
        public readonly id: string,
        public readonly gymId: string,
        public readonly fullName: string,
        public readonly email: string,
        public readonly phone: string,
        public readonly specialization: string,
        public readonly monthlySalary: number,
        public readonly status: 'active' | 'blocked' | 'pending',
        public readonly isDelete: boolean,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) { }

    updateDetails(data: {
        fullName?: string;
        email?: string;
        phone?: string;
        specialization?: string;
        monthlySalary?: number;
        status?: 'active' | 'blocked' | 'pending';
    }): GymTrainer {
        return new GymTrainer(
            this.id,
            this.gymId,
            data.fullName ?? this.fullName,
            data.email ?? this.email,
            data.phone ?? this.phone,
            data.specialization ?? this.specialization,
            data.monthlySalary ?? this.monthlySalary,
            data.status ?? this.status,
            this.isDelete,
            this.createdAt,
            new Date(),
        );
    }

    markAsDeleted(): GymTrainer {
        return new GymTrainer(
            this.id,
            this.gymId,
            this.fullName,
            this.email,
            this.phone,
            this.specialization,
            this.monthlySalary,
            this.status,
            true, // isDelete
            this.createdAt,
            new Date(),
        );
    }
}
