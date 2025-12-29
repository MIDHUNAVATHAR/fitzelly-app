export interface LoginResponse {
    message: string;
    user: any;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface SignupPayload {
    gymName: string;
    email: string;
    password: string;
    otp: string; // Add otp
}

export interface InitSignupPayload {
    email: string;
}

const API_URL = import.meta.env.VITE_API_URL;
const API_VERSION = import.meta.env.VITE_API_VERSION;
const BASE_URL = `${API_URL}/api/${API_VERSION}`;

export const AuthService = {
    initiateSignup: async (payload: InitSignupPayload): Promise<{ status: string; message: string }> => {
        try {
            const response = await fetch(`${BASE_URL}/gym-auth/signup/initiate`, {
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
            const response = await fetch(`${BASE_URL}/gym-auth/signup/complete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }

            return await response.json();
        } catch (error: any) {
            throw new Error(error.message || 'Network error occurred');
        }
    },

    login: async (payload: LoginPayload): Promise<LoginResponse> => {
        try {
            const response = await fetch(`${BASE_URL}/gym-auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }


            return await response.json();
        } catch (error: any) {
            throw new Error(error.message || 'Network error occurred');
        }
    },

    verifyToken: async (): Promise<any> => {
        try {
            console.log("Checking token...");
            const response = await fetch(`${BASE_URL}/gym-auth/auth/me`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });

            console.log("Token check status:", response.status);

            if (!response.ok) {
                console.log("Token invalid or expired");
                return null;
            }
            const data = await response.json();
            console.log("User verified:", data);
            return data;
        } catch (error) {
            console.error("Token verification error:", error);
            return null;
        }
    }
};
