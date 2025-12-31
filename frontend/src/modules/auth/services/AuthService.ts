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

const API_URL = import.meta.env.VITE_API_URL;
const API_VERSION = import.meta.env.VITE_API_VERSION;
const BASE_URL = `${API_URL}/api/${API_VERSION}`;

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
            const response = await fetch(`${BASE_URL}/${endpoint}/signup/initiate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("AuthService Error Response:", errorData);
                throw new Error(errorData.message || 'Failed to send OTP');
            }

            return await response.json();
        } catch (error: any) {
            console.error("AuthService Network/Logic Error:", error);
            throw new Error(error.message || 'Network error occurred');
        }
    },

    register: async (payload: SignupPayload): Promise<LoginResponse> => {
        try {
            const endpoint = getAuthEndpoint(payload.role || 'gym');
            const response = await fetch(`${BASE_URL}/${endpoint}/signup/complete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }

            const data = await response.json();

            // Store access token in localStorage
            if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
            }

            return data;
        } catch (error: any) {
            throw new Error(error.message || 'Network error occurred');
        }
    },

    login: async (payload: LoginPayload): Promise<LoginResponse> => {
        try {
            const role = payload.role || 'gym';
            const endpoint = getAuthEndpoint(role);
            console.log(`AuthService: Logging in as ${role} at ${endpoint}`);

            const response = await fetch(`${BASE_URL}/${endpoint}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }

            const data = await response.json();

            // Store access token in localStorage
            if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
                // Store role for future reference
                localStorage.setItem('userRole', payload.role || 'gym');
            }

            return data;
        } catch (error: any) {
            throw new Error(error.message || 'Network error occurred');
        }
    },

    verifyToken: async (): Promise<any> => {
        try {
            console.log("Checking token...");
            const accessToken = localStorage.getItem('accessToken');

            if (!accessToken) {
                console.log("No access token found in localStorage");
                return null;
            }

            const response = await fetch(`${BASE_URL}/gym-auth/auth/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                credentials: 'include'
            });
            console.log("Token check status:", response.status);

            if (!response.ok) {
                console.log("Token invalid or expired");
                localStorage.removeItem('accessToken');
                localStorage.removeItem('userRole');
                return null;
            }
            const data = await response.json();
            console.log("User verified:", data);
            return data;
        } catch (error) {
            console.error("Token verification error:", error);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userRole');
            return null;
        }
    },

    logout: async (): Promise<void> => {
        try {
            const response = await fetch(`${BASE_URL}/gym-auth/logout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Logout failed');
            }

            // Remove access token from localStorage
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userRole');

            // Dispatch auth-change event to update UI
            window.dispatchEvent(new Event('auth-change'));
        } catch (error: any) {
            throw new Error(error.message || 'Logout failed');
        }
    }
};
