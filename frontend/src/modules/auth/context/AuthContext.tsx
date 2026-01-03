import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthService } from '../services/AuthService';

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    role: 'gym' | 'client' | 'trainer' | null;
    isLoading: boolean;
    checkAuth: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<'gym' | 'client' | 'trainer' | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = async () => {
        setIsLoading(true);
        try {
            // 1. Probe as Gym Owner
            // We pass 'gym' explicitly to verifyToken usage of api endpoint /gym-auth/auth/me
            const gymResponse = await AuthService.verifyToken('gym');

            if (gymResponse && gymResponse.user) {
                setUser(gymResponse.user);
                setRole('gym');
                // Sync localStorage for legacy checks or other UI logic if needed
                localStorage.setItem('userRole', 'gym');
                return;
            }

            // 2. Probe as Client (future)
            // const clientResponse = await AuthService.verifyToken('client');
            // if (clientResponse && clientResponse.user) { ... }

            // If all fail
            setUser(null);
            setRole(null);
            localStorage.removeItem('userRole'); // Clear valid role if session invalid

        } catch (error) {
            console.error("Auth Check Failed", error);
            setUser(null);
            setRole(null);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        await AuthService.logout();
        setUser(null);
        setRole(null);
        localStorage.removeItem('userRole');
        localStorage.removeItem('accessToken');
        window.location.href = '/';
    };

    useEffect(() => {
        checkAuth();
        // Listen for custom event if triggered elsewhere
        window.addEventListener('auth-change', checkAuth);
        return () => window.removeEventListener('auth-change', checkAuth);
    }, []);

    return (
        <AuthContext.Provider value={{ user, role, isLoading, checkAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
