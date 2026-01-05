import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface AuthGuardProps {
    children: ReactNode;
    allowedRoles?: ('gym' | 'client' | 'trainer' | 'super-admin')[];
}

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
    const { user, role, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="w-10 h-10 border-4 border-[#00ffd5] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        if (allowedRoles?.includes('super-admin')) {
            return <Navigate to="/fitzelly-hq/login" state={{ from: location }} replace />;
        }
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (allowedRoles && role && !allowedRoles.includes(role as any)) {
        // Role mismatch redirect
        if (role === 'gym') return <Navigate to="/gym/dashboard" replace />;
        if (role === 'client') return <Navigate to="/client/dashboard" replace />;
        if (role === 'trainer') return <Navigate to="/trainer/dashboard" replace />;
        if (role === 'super-admin') return <Navigate to="/fitzelly-hq" replace />;
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
