export interface InitiatePasswordResetRequestDTO {
    email: string;
}

export interface CompletePasswordResetRequestDTO {
    email: string;
    otp: string;
    password: string;
    confirmPassword?: string; // Optional for backend check as discussed
}

export interface LoginRequestDTO {
    email: string;
    password: string;
}

export interface TrainerUserDTO {
    id: string;
    email: string;
    fullName: string;
    role: 'trainer';
    gymId: string;
}

export interface AuthResponseDTO {
    user: TrainerUserDTO;
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
}
