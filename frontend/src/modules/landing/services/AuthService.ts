import { api } from "../../../services/api";
import { ROLES, type Role } from "../../../constants/roles";

export interface LoginResponse {
    message: string;
    user: any;
    accessToken?: string;
}

export interface LoginPayload {
    email: string;
    password: string;
    role?: Role; // Add role
}

export interface SignupPayload {
    email: string;
    password: string;
    otp: string;
    role?: Role; // Add role
}

export interface InitSignupPayload {
    email: string;
    role?: Role; // Add role
}

// Helper to get the correct auth endpoint based on role
// Helper to get the correct auth endpoint based on role
const getAuthEndpoint = (role: string = ROLES.GYM): string => {
    const endpoints: Record<string, string> = {
        [ROLES.GYM]: 'gym-auth',
        [ROLES.CLIENT]: 'client-auth',
        [ROLES.TRAINER]: 'trainer-auth',
        [ROLES.SUPER_ADMIN]: 'super-admin-auth'
    };
    return endpoints[role] || 'gym-auth';
};

export const AuthService = {
    initiateSignup: async (payload: InitSignupPayload): Promise<{ status: string; message: string }> => {
        try {
            const endpoint = getAuthEndpoint(payload.role || ROLES.GYM);
            const response = await api.post(`/${endpoint}/signup/initiate`, payload);
            return response.data;
        } catch (error: any) {
            console.error("AuthService Error:", error);
            throw new Error(error.response?.data?.message || 'Failed to send OTP');
        }
    },

    register: async (payload: SignupPayload): Promise<LoginResponse> => {
        try {
            const role = payload.role || ROLES.GYM;
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
            const role = payload.role || ROLES.GYM;
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
            // console.error("AuthService Error Details:", error); // Suppressed logs
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    },

    googleLogin: async (credential: string, role: string = ROLES.GYM): Promise<LoginResponse> => {
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

    verifyToken: async (role?: Role): Promise<any> => {
        try {
            // Prioritize passed role, fallback to localStorage (for persistence), default to gym
            const targetRole = role || (localStorage.getItem('userRole') as any) || ROLES.GYM;
            const endpoint = getAuthEndpoint(targetRole);

            const response = await api.get(`/${endpoint}/auth/me`);
            return response.data;
        } catch (error: any) {
            // console.error("Token verification error:", error); 
            // Silent fail is better for probing
            return null;
        }
    },

    updateProfile: async (payload: any): Promise<any> => {
        try {
            const role = localStorage.getItem('userRole') || ROLES.GYM;
            const endpoint = getAuthEndpoint(role);
            const response = await api.put(`/${endpoint}/profile`, payload, {
                headers: {
                    'Content-Type': undefined
                }
            });
            return response.data;
        } catch (error: any) {
            console.error("Profile update failed:", error);
            throw new Error(error.response?.data?.message || 'Profile update failed');
        }
    },

    logout: async (): Promise<void> => {
        try {
            const userRole = localStorage.getItem('userRole') as any;
            const endpoint = getAuthEndpoint(userRole || ROLES.GYM);

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
    },

    confirmPasswordReset: async (payload: { email: string; otp: string; password: string; role?: string }): Promise<any> => {
        try {
            const role = payload.role || ROLES.GYM;
            const endpoint = getAuthEndpoint(role);

            let path = '/forgot-password/reset'; // Default for gym
            if (role === ROLES.CLIENT || role === ROLES.TRAINER) {
                path = '/forgot-password/complete';
            }

            const response = await api.post(`/${endpoint}${path}`, payload);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Password reset failed');
        }
    }
};
