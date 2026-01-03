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
// Helper to get the correct auth endpoint based on role
const getAuthEndpoint = (role: string = 'gym'): string => {
    const endpoints: Record<string, string> = {
        gym: 'gym-auth',
        client: 'client-auth',
        trainer: 'trainer-auth'
    };
    return endpoints[role] || 'gym-auth';
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
            const role = payload.role || 'gym';
            const endpoint = getAuthEndpoint(role);
            const response = await api.post(`/${endpoint}/signup/complete`, payload);
            const data = response.data;

            if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('userRole', role);
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
            console.log("role : ", role)
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
            console.error("AuthService Error Details:", {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
                url: error.config?.url,
                baseURL: error.config?.baseURL
            });
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    },

    googleLogin: async (credential: string, role: string = 'gym'): Promise<LoginResponse> => {
        try {
            const endpoint = getAuthEndpoint(role);
            const response = await api.post(`/${endpoint}/google-login`, { token: credential });
            const data = response.data;

            if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('userRole', role);
            }

            return data;
        } catch (error: any) {
            console.error("AuthService Google Login Error Details:", {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
            });
            throw new Error(error.response?.data?.message || 'Google Login failed');
        }
    },

    verifyToken: async (role?: 'gym' | 'client' | 'trainer'): Promise<any> => {
        try {
            // Prioritize passed role, fallback to localStorage (for persistence), default to gym
            const targetRole = role || (localStorage.getItem('userRole') as any) || 'gym';
            const endpoint = getAuthEndpoint(targetRole);

            const response = await api.get(`/${endpoint}/auth/me`);
            return response.data;
        } catch (error: any) {
            // console.error("Token verification error:", error); 
            // Silent fail is better for probing
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
