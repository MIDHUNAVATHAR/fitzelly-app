export class GymClient {
    constructor(
        public readonly id: string,
        public readonly gymId: string,
        public readonly fullName: string,
        public readonly email: string,
        public readonly phone: string,
        public readonly status: 'active' | 'inactive' | 'expired',
        public readonly isEmailVerified: boolean,
        public readonly isBlocked: boolean,
        public readonly isDelete: boolean,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public readonly password?: string,
        public readonly assignedTrainer?: string | null,
        public readonly emergencyContactNumber?: string,
        public readonly dateOfBirth?: Date,
    ) { }

    setPassword(password: string): GymClient {
        return new GymClient(
            this.id,
            this.gymId,
            this.fullName,
            this.email,
            this.phone,
            this.status,
            this.isEmailVerified,
            this.isBlocked,
            this.isDelete,
            this.createdAt,
            new Date(),
            password,
            this.assignedTrainer,
            this.emergencyContactNumber,
            this.dateOfBirth
        );
    }

    updateDetails(data: {
        fullName?: string;
        email?: string;
        phone?: string;
        isBlocked?: boolean;
        assignedTrainer?: string | null;
        emergencyContactNumber?: string;
        dateOfBirth?: Date;
    }): GymClient {
        return new GymClient(
            this.id,
            this.gymId,
            data.fullName ?? this.fullName,
            data.email ?? this.email,
            data.phone ?? this.phone,
            this.status,
            this.isEmailVerified,
            data.isBlocked ?? this.isBlocked,
            this.isDelete,
            this.createdAt,
            new Date(),
            this.password,
            data.assignedTrainer !== undefined ? data.assignedTrainer : this.assignedTrainer,
            data.emergencyContactNumber ?? this.emergencyContactNumber,
            data.dateOfBirth ?? this.dateOfBirth
        );
    }

    markAsDeleted(): GymClient {
        return new GymClient(
            this.id,
            this.gymId,
            this.fullName,
            this.email,
            this.phone,
            this.status,
            this.isEmailVerified,
            this.isBlocked,
            true, // isDelete
            this.createdAt,
            new Date(),
            this.password,
            this.assignedTrainer,
            this.emergencyContactNumber,
            this.dateOfBirth
        );
    }
    updateStatus(newStatus: 'active' | 'inactive' | 'expired'): GymClient {
        return new GymClient(
            this.id,
            this.gymId,
            this.fullName,
            this.email,
            this.phone,
            newStatus,
            this.isEmailVerified,
            this.isBlocked,
            this.isDelete,
            this.createdAt,
            new Date(),
            this.password,
            this.assignedTrainer,
            this.emergencyContactNumber,
            this.dateOfBirth
        );
    }

    markAsVerified(): GymClient {
        return new GymClient(
            this.id,
            this.gymId,
            this.fullName,
            this.email,
            this.phone,
            this.status,
            true, // isEmailVerified
            this.isBlocked,
            this.isDelete,
            this.createdAt,
            new Date(),
            this.password,
            this.assignedTrainer,
            this.emergencyContactNumber,
            this.dateOfBirth
        );
    }

    // Helper to block
    block(): GymClient {
        return new GymClient(
            this.id,
            this.gymId,
            this.fullName,
            this.email,
            this.phone,
            this.status,
            this.isEmailVerified,
            true, // isBlocked
            this.isDelete,
            this.createdAt,
            new Date(),
            this.password,
            this.assignedTrainer,
            this.emergencyContactNumber,
            this.dateOfBirth
        );
    }
}
