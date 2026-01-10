export class GymTrainer {
    constructor(
        public readonly id: string,
        public readonly gymId: string,
        public readonly fullName: string,
        public readonly email: string,
        public readonly phone: string,
        public readonly specialization: string,
        public readonly monthlySalary: number,

        public readonly password: string | undefined,

        public readonly isEmailVerified: boolean,
        public readonly isBlocked: boolean,
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
        isBlocked?: boolean;
    }): GymTrainer {
        return new GymTrainer(
            this.id,
            this.gymId,
            data.fullName ?? this.fullName,
            data.email ?? this.email,
            data.phone ?? this.phone,
            data.specialization ?? this.specialization,
            data.monthlySalary ?? this.monthlySalary,

            this.password,

            this.isEmailVerified,
            data.isBlocked ?? this.isBlocked,
            this.isDelete,
            this.createdAt,
            new Date(),
        );
    }

    // New Auth Methods
    setPassword(hashed: string): GymTrainer {
        return new GymTrainer(
            this.id, this.gymId, this.fullName, this.email, this.phone,
            this.specialization, this.monthlySalary,
            hashed,
            this.isEmailVerified, this.isBlocked, this.isDelete, this.createdAt, new Date()
        );
    }

    markAsVerified(): GymTrainer {
        return new GymTrainer(
            this.id, this.gymId, this.fullName, this.email, this.phone,
            this.specialization, this.monthlySalary,
            this.password,
            true, // isVerified
            this.isBlocked,
            this.isDelete, this.createdAt, new Date()
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

            this.password,

            this.isEmailVerified,
            this.isBlocked,
            true, // isDelete
            this.createdAt,
            new Date(),
        );
    }

    block(): GymTrainer {
        return new GymTrainer(
            this.id,
            this.gymId,
            this.fullName,
            this.email,
            this.phone,
            this.specialization,
            this.monthlySalary,
            this.password,
            this.isEmailVerified,
            true, // isBlocked
            this.isDelete,
            this.createdAt,
            new Date(),
        );
    }
}
