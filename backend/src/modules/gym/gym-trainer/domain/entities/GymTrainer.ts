export class GymTrainer {
    constructor(
        public readonly id: string,
        public readonly gymId: string,
        public readonly fullName: string,
        public readonly email: string,
        public readonly phone: string,
        public readonly specialization: string,
        public readonly monthlySalary: number,
        public readonly biography: string,
        public readonly dateOfBirth: Date | undefined,

        public readonly password: string | undefined,

        public readonly isEmailVerified: boolean,
        public readonly isBlocked: boolean,
        public readonly isDelete: boolean,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public readonly profilePicture?: string,
    ) { }

    updateDetails(data: {
        fullName?: string;
        email?: string;
        phone?: string;
        specialization?: string;
        monthlySalary?: number;
        biography?: string;
        dateOfBirth?: Date;
        isBlocked?: boolean;
        profilePicture?: string;
    }): GymTrainer {
        return new GymTrainer(
            this.id,
            this.gymId,
            data.fullName ?? this.fullName,
            data.email ?? this.email,
            data.phone ?? this.phone,
            data.specialization ?? this.specialization,
            data.monthlySalary ?? this.monthlySalary,
            data.biography ?? this.biography,
            data.dateOfBirth ?? this.dateOfBirth,

            this.password,

            this.isEmailVerified,
            data.isBlocked ?? this.isBlocked,
            this.isDelete,
            this.createdAt,
            new Date(),
            data.profilePicture ?? this.profilePicture
        );
    }

    // New Auth Methods
    setPassword(hashed: string): GymTrainer {
        return new GymTrainer(
            this.id, this.gymId, this.fullName, this.email, this.phone,
            this.specialization, this.monthlySalary, this.biography, this.dateOfBirth,
            hashed,
            this.isEmailVerified, this.isBlocked, this.isDelete, this.createdAt, new Date(),
            this.profilePicture
        );
    }

    markAsVerified(): GymTrainer {
        return new GymTrainer(
            this.id, this.gymId, this.fullName, this.email, this.phone,
            this.specialization, this.monthlySalary, this.biography, this.dateOfBirth,
            this.password,
            true, // isVerified
            this.isBlocked,
            this.isDelete, this.createdAt, new Date(),
            this.profilePicture
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
            this.biography,
            this.dateOfBirth,

            this.password,

            this.isEmailVerified,
            this.isBlocked,
            true, // isDelete
            this.createdAt,
            new Date(),
            this.profilePicture
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
            this.biography,
            this.dateOfBirth,
            this.password,
            this.isEmailVerified,
            true, // isBlocked
            this.isDelete,
            this.createdAt,
            new Date(),
            this.profilePicture
        );
    }
}
