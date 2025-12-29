export interface SignupGymRequestDTO {
    gymName: string;
    email: string;
    password: string;
}

export interface SignupGymResponseDTO {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
    }
}
