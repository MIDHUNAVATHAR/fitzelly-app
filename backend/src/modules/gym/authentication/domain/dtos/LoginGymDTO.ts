export interface LoginGymRequestDTO {
    email: string;
    password: string;
}

export interface LoginGymResponseDTO {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
    }
}
