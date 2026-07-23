import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./useAuth";

export function ProtectedRoute() {
    const { status } = useAuth();

    if (status === "anonymous") {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}