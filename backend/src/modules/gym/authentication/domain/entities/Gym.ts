export class Gym {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly email: string,
        public readonly passwordHash: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) { }

    /**
     * Creates a new Gym instance with updated password
     * Maintains immutability by returning a new instance
     */
    updatePassword(newPasswordHash: string): Gym {
        return new Gym(
            this.id,
            this.name,
            this.email,
            newPasswordHash,
            this.createdAt,
            new Date() // Update timestamp
        );
    }
}
