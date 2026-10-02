import { Outlet, useLocation, Navigate } from "react-router-dom";
import { UseAuth } from "../Hooks/UseAuth";





export function ProtectedRoutes() {
    const { IsAuthentificated, isLoading } = UseAuth();
    const location = useLocation();

    if (isLoading) {
        <div className="flex min-h-screen items-center justify-center">
            <p className="text-gray-600">Loading...</p>
        </div>
    }
    if (!IsAuthentificated) {
        return <Navigate to="/login" replace state={{ from: location }} />
    }
    return <Outlet />;
}

export default ProtectedRoutes;