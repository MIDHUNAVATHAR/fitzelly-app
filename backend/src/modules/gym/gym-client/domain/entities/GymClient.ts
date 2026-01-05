export class GymClient {
    constructor(
        public readonly id: string,
        public readonly gymId: string,
        public readonly fullName: string,
        public readonly email: string,
        public readonly phone: string,
        public readonly status: 'active' | 'inactive' | 'expired',
        public readonly isEmailVerified: boolean,
        public readonly isDelete: boolean,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) { }

    updateDetails(data: {
        fullName?: string;
        email?: string;
        phone?: string;
    }): GymClient {
        return new GymClient(
            this.id,
            this.gymId,
            data.fullName ?? this.fullName,
            data.email ?? this.email,
            data.phone ?? this.phone,
            this.status,
            this.isEmailVerified,
            this.isDelete,
            this.createdAt,
            new Date(),
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
            true, // isDelete
            this.createdAt,
            new Date(),
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
            this.isDelete,
            this.createdAt,
            new Date(),
        );
    }
}
