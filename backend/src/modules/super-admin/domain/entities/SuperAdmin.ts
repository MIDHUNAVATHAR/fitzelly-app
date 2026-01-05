export class SuperAdmin {
    constructor(
        public readonly id: string,
        public readonly email: string,
        public readonly password: string | undefined, // Undefined if not set (though unlikely for admin)
        public readonly fullName: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) { }

    setPassword(hashed: string): SuperAdmin {
        return new SuperAdmin(
            this.id,
            this.email,
            hashed,
            this.fullName,
            this.createdAt,
            new Date()
        );
    }
}
