export class GymSummary {
    constructor(
        public readonly id: string,
        public readonly gymName: string,
        public readonly ownerName: string,
        public readonly email: string,
        public readonly phone: string,
        public readonly city: string,
        public readonly state: string,
        public readonly joinedAt: Date,
        public readonly isBlocked: boolean = false
    ) { }
}

export interface PaginatedGyms {
    gyms: GymSummary[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
