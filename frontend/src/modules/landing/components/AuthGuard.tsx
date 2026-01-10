import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROLES, type Role } from "../../../constants/roles";

interface AuthGuardProps {
    children: ReactNode;
    allowedRoles?: Role[];
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
        if (allowedRoles?.includes(ROLES.SUPER_ADMIN)) {
            return <Navigate to="/fitzelly-hq/login" state={{ from: location }} replace />;
        }
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (allowedRoles && role && !allowedRoles.includes(role)) {
        // Role mismatch redirect
        if (role === ROLES.GYM) return <Navigate to="/gym/dashboard" replace />;
        if (role === ROLES.CLIENT) return <Navigate to="/client/dashboard" replace />;
        if (role === ROLES.TRAINER) return <Navigate to="/trainer/dashboard" replace />;
        if (role === ROLES.SUPER_ADMIN) return <Navigate to="/fitzelly-hq" replace />;
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
