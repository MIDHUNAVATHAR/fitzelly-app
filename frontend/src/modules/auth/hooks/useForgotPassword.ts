import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;
const API_VERSION = import.meta.env.VITE_API_VERSION;
const BASE_URL = `${API_URL}/api/${API_VERSION}`;

type UserRole = 'gym' | 'client' | 'trainer';

// Helper to get the correct auth endpoint based on role
const getAuthEndpoint = (role: UserRole = 'gym'): string => {
    const endpoints = {
        gym: 'gym-auth',
        client: 'client-auth',
        trainer: 'trainer-auth'
    };
    return endpoints[role];
};

export const useForgotPassword = (role: UserRole = 'gym') => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const initiateForgotPassword = async (email: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const endpoint = getAuthEndpoint(role);
            const response = await fetch(`${BASE_URL}/${endpoint}/forgot-password/initiate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to send OTP');
            }

            return true;
        } catch (err: any) {
            setError(err.message || 'Network error occurred');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const resetPassword = async (
        email: string,
        otp: string,
        newPassword: string
    ): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const endpoint = getAuthEndpoint(role);
            const response = await fetch(`${BASE_URL}/${endpoint}/forgot-password/reset`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, newPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to reset password');
            }

            return true;
        } catch (err: any) {
            setError(err.message || 'Network error occurred');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        error,
        initiateForgotPassword,
        resetPassword,
    };
};
