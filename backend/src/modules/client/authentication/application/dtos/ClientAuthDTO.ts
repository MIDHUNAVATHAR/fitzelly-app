export interface SetupPasswordRequestDTO {
    email: string;
    otp: string;
    password: string;
    confirmPassword: string;
}

export interface AuthResponseDTO {
    user: {
        id: string;
        email: string;
        fullName: string;
        role: string;
        gymId: string;
    };
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
}
export interface LoginRequestDTO {
    email: string;
    password: string;
}
