import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetUser } from '../../api/useAuth';
import { useAuthStore } from '../../store/useAuthStore';
import { useCompanyStore } from '../../store/useCompanyStore';
import { Button } from '../commons/Button';

const DashboardHeader = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const { data: admin, isLoading, isError, error } = useGetUser();
  const logout = useAuthStore((s) => s.logout);
  const companyLogout = useCompanyStore((s) => s.companyLogout);

  const go = (route: string) => {
    navigate(route);
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
    companyLogout();
    setOpen(false);
    navigate('/login', { replace: true });
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error {error.message}</p>;

  return (
    <header className="sticky top-0 z-10 backdrop-blur bg-white/70 dark:bg-dark-600/70 border-b border-black/5 dark:border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <div onClick={() => go('/company/dashboard')} className="cursor-pointer select-none">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
            {admin?.fullName}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Admin Dashboard</p>
        </div>

        <nav className="hidden md:flex items-center gap-3">
          <Button onClick={() => go('/company/requests')}>All Requests</Button>
          <Button onClick={() => go('/company/pricing')}>Pricing</Button>
          <Button onClick={() => go('/company/settings')}>Settings</Button>
          <Button onClick={handleLogout}>Logout</Button>
        </nav>

        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-lg p-2 ring-1 ring-black/10 dark:ring-white/10"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            className={`h-6 w-6 transition-transform ${open ? 'rotate-90' : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      <div
        className={`md:hidden transition-all duration-200 origin-top ${
          open ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="mx-auto max-w-6xl px-4 pb-4 grid gap-2">
          <Button className="w-full" onClick={() => go('/company/requests')}>
            All Requests
          </Button>
          <Button className="w-full" onClick={() => go('/company/pricing')}>
            Pricing
          </Button>
          <Button className="w-full" onClick={() => go('/company/settings')}>
            Settings
          </Button>
          <Button className="w-full" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
