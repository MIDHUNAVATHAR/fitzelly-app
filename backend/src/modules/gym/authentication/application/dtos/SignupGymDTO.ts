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
        email: string;
    }
}
