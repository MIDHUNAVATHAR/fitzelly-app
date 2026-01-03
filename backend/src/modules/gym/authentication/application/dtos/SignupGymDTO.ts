export interface SignupGymRequestDTO {
    email: string;
    password: string;
}

export interface SignupGymResponseDTO {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        ownerName?: string;
        gymName?: string;
        phone?: string;
        description?: string;
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
