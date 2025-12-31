/**
 * DTOs for Forgot Password Flow
 */

export interface InitiateForgotPasswordRequestDTO {
    email: string;
}

export interface InitiateForgotPasswordResponseDTO {
    status: string;
    message: string;
}

export interface VerifyForgotPasswordOtpRequestDTO {
    email: string;
    otp: string;
}

export interface VerifyForgotPasswordOtpResponseDTO {
    status: string;
    message: string;
    resetToken: string; // Temporary token to authorize password reset
}

export interface ResetPasswordRequestDTO {
    email: string;
    otp: string;
    newPassword: string;
}

export interface ResetPasswordResponseDTO {
    status: string;
    message: string;
}
