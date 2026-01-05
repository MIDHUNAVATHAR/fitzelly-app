import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { AuthService } from '../services/AuthService';

interface User {
    id: string;
    name: string;
    email: string;
    gymId?: string;
}

interface AuthContextType {
    user: User | null;
    role: 'gym' | 'client' | 'trainer' | 'super-admin' | null;
    isLoading: boolean;
    checkAuth: (shouldLoading?: boolean) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<'gym' | 'client' | 'trainer' | 'super-admin' | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = async (shouldLoading = true) => {
        if (shouldLoading) setIsLoading(true);

        // Check for tokens in URL (e.g. from Google Auth redirect)
        const searchParams = new URLSearchParams(window.location.search);
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');
        const urlRole = searchParams.get('role');

        if (accessToken) {
            localStorage.setItem('accessToken', accessToken);
            if (urlRole) localStorage.setItem('userRole', urlRole);
            if (refreshToken) {
                // If we want to store refresh token in local storage? 
                // Cookies are better, but if cross-domain failed, we might need it. 
                // For now, let's just stick to accessToken for immediate session.
                // The backend set cookies too, so if they work, great. If not, accessToken helps.
            }
            // Clear the query params from URL without refresh
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        // Check if we have a token to verify
        const storedToken = localStorage.getItem('accessToken');
        if (!storedToken) {
            setUser(null);
            setRole(null);
            if (shouldLoading) setIsLoading(false);
            return;
        }

        try {
            const storedRole = localStorage.getItem('userRole');

            // Helper to verify specific role
            const verifyRole = async (roleToCheck: 'gym' | 'client' | 'trainer' | 'super-admin') => {
                try {
                    const res = await AuthService.verifyToken(roleToCheck);
                    if (res && res.user) {
                        setUser(res.user);
                        setRole(roleToCheck as any);
                        localStorage.setItem('userRole', roleToCheck);
                        return true;
                    }
                } catch (e) { /* ignore 401 */ }
                return false;
            };

            // 1. Try stored role first
            if (storedRole && ['gym', 'client', 'trainer', 'super-admin'].includes(storedRole)) {
                if (await verifyRole(storedRole as any)) return;
            }

            // 2. Fallback sequence (Gym -> Client -> Trainer -> SuperAdmin), skipping what we already checked
            if (storedRole !== 'gym' && await verifyRole('gym')) return;
            if (storedRole !== 'client' && await verifyRole('client')) return;
            if (storedRole !== 'trainer' && await verifyRole('trainer')) return;
            if (storedRole !== 'super-admin' && await verifyRole('super-admin')) return;

            // If all fail
            setUser(null);
            setRole(null);
            localStorage.removeItem('userRole');


        } catch (error: any) {
            // 401 is expected if user is not logged in
            if (error?.response?.status !== 401) {
                console.error("Auth Check Failed", error);
            }
            setUser(null);
            setRole(null);
        } finally {
            if (shouldLoading) setIsLoading(false);
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
        const handleAuthChange = () => checkAuth();
        window.addEventListener('auth-change', handleAuthChange);
        return () => window.removeEventListener('auth-change', handleAuthChange);
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
