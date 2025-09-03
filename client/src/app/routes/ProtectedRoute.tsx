import { Navigate, useLocation } from "react-router-dom";
import { type Role } from "../../types/Types";
import { useAuthStore } from "../../store/useAuthStore";

const ProtectedRoute = ( { allowed, children } : { allowed: Role[]; children: React.ReactNode  }) => {
    const authInfo = useAuthStore(state => state.authInfo);
    const location = useLocation();

    if(!authInfo) return <Navigate to='/login' replace state={{ from: location}} />
    if(!allowed.includes(authInfo.role)) return <Navigate to='/403' replace/>

    return <>{children}</>
}

export default ProtectedRoute