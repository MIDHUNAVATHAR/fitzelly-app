import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

export default function RedirectIfAuthenticated({ children }: { children: ReactNode }) {
    const { user, role, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="w-10 h-10 border-4 border-[#00ffd5] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (user) {
        if (role === 'gym') {
            return <Navigate to="/gym/dashboard" replace />;
        }
        // Add other roles here
    }

    return <>{children}</>;
}
