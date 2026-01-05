import { useState } from 'react';
import { api } from '../../../services/api';

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
            await api.post(`/${endpoint}/forgot-password/initiate`, { email });
            return true;
        } catch (err: any) {
            console.error("useForgotPassword Error:", err);
            setError(err.response?.data?.message || err.message || 'Network error occurred');
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
            await api.post(`/${endpoint}/forgot-password/complete`, { email, otp, password: newPassword, confirmPassword: newPassword });
            return true;
        } catch (err: any) {
            console.error("useForgotPassword Error:", err);
            setError(err.response?.data?.message || err.message || 'Network error occurred');
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
