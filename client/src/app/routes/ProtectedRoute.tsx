import { Navigate, useLocation } from "react-router-dom";
import { type Role } from "../../types/Types";
import { useAuthStore } from "../../store/useAuthStore";

const ProtectedRoute = ( { allowed, children } : { allowed: Role[]; children: React.ReactNode  }) => {
    const user = useAuthStore(state => state.user);
    const location = useLocation();

    if(!user) return <Navigate to='/login' replace state={{ from: location}} />
    if(!allowed.includes(user.role)) return <Navigate to='/403' replace/>

    return <>{children}</>
}

export default ProtectedRoute