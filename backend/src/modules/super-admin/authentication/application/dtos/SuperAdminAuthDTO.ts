export interface InitiatePasswordResetRequestDTO {
    email: string;
}

export interface CompletePasswordResetRequestDTO {
    email: string;
    otp: string;
    password: string;
    confirmPassword?: string;
}

export interface LoginRequestDTO {
    email: string;
    password: string;
}

export interface SuperAdminUserDTO {
    id: string;
    email: string;
    fullName: string;
    role: 'super-admin';
}

export interface AuthResponseDTO {
    user: SuperAdminUserDTO;
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
}
