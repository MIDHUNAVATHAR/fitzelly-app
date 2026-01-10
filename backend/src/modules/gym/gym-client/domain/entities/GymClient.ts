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
            password
        );
    }

    updateDetails(data: {
        fullName?: string;
        email?: string;
        phone?: string;
        isBlocked?: boolean;
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
            this.password
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
            this.password
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
            this.password
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
            this.password
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
            this.password
        );
    }
}
