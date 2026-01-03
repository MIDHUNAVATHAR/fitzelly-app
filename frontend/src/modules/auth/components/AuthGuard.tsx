import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface AuthGuardProps {
    children: ReactNode;
    allowedRoles?: ('gym' | 'client' | 'trainer')[];
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
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (allowedRoles && role && !allowedRoles.includes(role)) {
        // Role mismatch redirect
        if (role === 'gym') return <Navigate to="/gym/dashboard" replace />;
        // if (role === 'client') return <Navigate to="/client/dashboard" replace />;
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
