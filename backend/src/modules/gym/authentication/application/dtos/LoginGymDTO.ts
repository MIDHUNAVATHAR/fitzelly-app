export interface LoginGymRequestDTO {
    email: string;
    password: string;
}

export interface LoginGymResponseDTO {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        ownerName?: string;
        gymName?: string;
        phone?: string;
        description?: string;
        logoUrl?: string;
        address?: {
            street?: string;
            city?: string;
            state?: string;
            pincode?: string;
            mapLink?: string;
        };
        email: string;
    }
}
