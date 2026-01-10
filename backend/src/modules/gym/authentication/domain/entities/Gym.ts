export class Gym {
    constructor(
        public readonly id: string,
        public readonly email: string,
        public readonly passwordHash: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public readonly ownerName?: string,
        public readonly gymName?: string,
        public readonly phone?: string,
        public readonly description?: string,
        public readonly address?: {
            street?: string;
            city?: string;
            state?: string;
            pincode?: string;
            mapLink?: string;
        },
        public readonly logoUrl?: string,
        public readonly isBlocked: boolean = false
    ) { }

    updatePassword(newPasswordHash: string): Gym {
        return new Gym(
            this.id,
            this.email,
            newPasswordHash,
            this.createdAt,
            new Date(),
            this.ownerName,
            this.gymName,
            this.phone,
            this.description,
            this.address,
            this.logoUrl,
            this.isBlocked
        );
    }


}
