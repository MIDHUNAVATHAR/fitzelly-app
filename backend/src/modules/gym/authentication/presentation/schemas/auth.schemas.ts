import { z } from 'zod';

export const initiateSignupSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email format'),
    }),
});

export const completeSignupSchema = z.object({
    body: z.object({
        gymName: z.string().min(1, 'Gym name is required'),
        email: z.string().email('Invalid email format'),
        password: z.string().min(6, 'Password must be at least 6 characters long'),
        otp: z.string().length(6, 'OTP must be 6 digits'),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email format'),
        password: z.string().min(1, 'Password is required'),
    }),
});

export const initiateForgotPasswordSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email format'),
    }),
});

export const resetPasswordSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email format'),
        otp: z.string().length(6, 'OTP must be 6 digits'),
        newPassword: z.string().min(6, 'Password must be at least 6 characters long'),
    }),
});
