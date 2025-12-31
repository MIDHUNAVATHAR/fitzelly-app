import { api } from "../../../services/api";

export interface LoginResponse {
    message: string;
    user: any;
    accessToken?: string;
}

export interface LoginPayload {
    email: string;
    password: string;
    role?: 'gym' | 'client' | 'trainer'; // Add role
}

export interface SignupPayload {
    gymName: string;
    email: string;
    password: string;
    otp: string;
    role?: 'gym' | 'client' | 'trainer'; // Add role
}

export interface InitSignupPayload {
    email: string;
    role?: 'gym' | 'client' | 'trainer'; // Add role
}

// Helper to get the correct auth endpoint based on role
const getAuthEndpoint = (role: 'gym' | 'client' | 'trainer' = 'gym'): string => {
    const endpoints = {
        gym: 'gym-auth',
        client: 'client-auth',
        trainer: 'trainer-auth'
    };
    return endpoints[role];
};

export const AuthService = {
    initiateSignup: async (payload: InitSignupPayload): Promise<{ status: string; message: string }> => {
        try {
            const endpoint = getAuthEndpoint(payload.role || 'gym');
            const response = await api.post(`/${endpoint}/signup/initiate`, payload);
            return response.data;
        } catch (error: any) {
            console.error("AuthService Error:", error);
            throw new Error(error.response?.data?.message || 'Failed to send OTP');
        }
    },

    register: async (payload: SignupPayload): Promise<LoginResponse> => {
        try {
            const endpoint = getAuthEndpoint(payload.role || 'gym');
            const response = await api.post(`/${endpoint}/signup/complete`, payload);
            const data = response.data;

            if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
            }

            return data;
        } catch (error: any) {
            console.error("AuthService Error:", error);
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    },

    login: async (payload: LoginPayload): Promise<LoginResponse> => {
        try {
            const role = payload.role || 'gym';
            const endpoint = getAuthEndpoint(role);
            console.log(`AuthService: Logging in as ${role} at ${endpoint}`);

            const response = await api.post(`/${endpoint}/login`, payload);
            const data = response.data;

            if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('userRole', role);
            }

            return data;
        } catch (error: any) {
            console.error("AuthService Error:", error);
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    },

    verifyToken: async (): Promise<any> => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) return null;

            // Note: Interceptor adds the Authorization header
            const response = await api.get('/gym-auth/auth/me');
            return response.data;
        } catch (error: any) {
            console.error("Token verification error:", error);
            if (error.response?.status === 401) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('userRole');
            }
            return null;
        }
    },

    logout: async (): Promise<void> => {
        try {
            const userRole = localStorage.getItem('userRole') as any;
            const endpoint = getAuthEndpoint(userRole || 'gym');

            await api.post(`/${endpoint}/logout`);

            localStorage.removeItem('accessToken');
            localStorage.removeItem('userRole');
            window.dispatchEvent(new Event('auth-change'));
        } catch (error: any) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userRole');
            window.dispatchEvent(new Event('auth-change'));
            throw new Error(error.response?.data?.message || 'Logout failed');
        }
    }
};
