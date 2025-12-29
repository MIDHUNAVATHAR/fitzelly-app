export interface SignupGymRequestDTO {
    gymName: string;
    email: string;
    password: string;
}

export interface SignupGymResponseDTO {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        name: string;
        email: string;
    }
}
