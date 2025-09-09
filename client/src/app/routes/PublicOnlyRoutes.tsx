import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export default function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const auth = useAuthStore((s) => s.authInfo);
  const location = useLocation();

  if (auth?.role === 'USER') {
    return <Navigate to="/client/dashboard" replace state={{ from: location }} />;
  }
  if (auth?.role === 'COMPANY_ADMIN') {
    return <Navigate to="/company/dashboard" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
