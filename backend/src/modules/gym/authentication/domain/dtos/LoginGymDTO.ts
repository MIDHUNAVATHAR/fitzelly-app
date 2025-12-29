export interface LoginGymRequestDTO {
    email: string;
    password: string;
}

export interface LoginGymResponseDTO {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        name: string;
        email: string;
    }
}
