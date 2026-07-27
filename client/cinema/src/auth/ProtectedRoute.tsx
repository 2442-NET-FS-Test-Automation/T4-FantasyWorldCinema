import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./useAuth";

interface ProtectedRouteProps {
    allowedRoles?: string[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const { status, user } = useAuth();

    // 1. Wait until initial state resolves
    if (status === "authenticating") {
        return <div className="p-4 text-center">Loading...</div>; 
    }

    // 2. If anonymous, we send them to log in
    if (status === "anonymous" || !user) {
        return <Navigate to="/login" replace />;
    }

    // 3. If the route has role restrictions and the user does not, we expel them to home
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/home" replace />;
    }

    // 4. Everything in order, render the child components
    return <Outlet />;
}

export function AnonymousRoute() {
    const { status } = useAuth();

    // If you are already authenticated, you have nothing to do in /login or /register
    if (status === "authenticated") {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
}