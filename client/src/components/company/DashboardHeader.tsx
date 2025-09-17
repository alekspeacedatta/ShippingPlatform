import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useGetUser } from '../../api/useAuth';
import { useAuthStore } from '../../store/useAuthStore';
import { useCompanyStore } from '../../store/useCompanyStore';

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

  const items = [
    { to: '/company/requests', label: 'All Requests' },
    { to: '/company/pricing', label: 'Pricing' },
    { to: '/company/settings', label: 'Settings' },
  ];

  const linkBase =
    'group inline-flex flex-col items-center justify-center px-4 py-2 text-sm font-medium rounded-md no-underline';
  const activeLink = 'text-indigo-600 bg-black/5 dark:bg-white/5';
  const inactiveLink = 'text-gray-700 hover:text-indigo-600 hover:bg-black/5 dark:text-gray-200 dark:hover:bg-white/5';

  return (
    <header className="sticky top-0 z-10 backdrop-blur bg-white dark:bg-dark-600/70 border-b border-black/5 dark:border-white/10">      
      <div className="relative mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <div onClick={() => go('/company/dashboard')} className="cursor-pointer select-none">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">{admin?.fullName}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Admin Dashboard</p>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              className={({ isActive }) => [linkBase, isActive ? activeLink : inactiveLink].join(' ')}
              onClick={() => setOpen(false)}
            >
              {({ isActive }) => (
                <>
                  <span>{it.label}</span>
                  <span
                    aria-hidden
                    className={[
                      'mt-1 h-0.5 w-6 rounded-full transition',
                      isActive
                        ? 'bg-indigo-500'
                        : 'bg-transparent group-hover:bg-gray-300 dark:group-hover:bg-white/30',
                    ].join(' ')}
                  />
                </>
              )}
            </NavLink>
          ))}

          <button
            onClick={handleLogout}
            className="ml-2 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition"
          >
            Logout
          </button>
        </nav>

        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-lg p-2 ring-1 ring-black/10 dark:ring-white/10"
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="company-mobile-menu"
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
        <div
          id="company-mobile-menu"
          className={['md:hidden absolute left-0 right-0 top-full z-20', open ? 'block' : 'hidden'].join(' ')}
        >
          <div className="mx-auto max-w-6xl px-4 pb-4 pt-3 bg-white/95 dark:bg-dark-600/95 backdrop-blur border-b border-black/5 dark:border-white/10 rounded-b-xl shadow-sm grid gap-1">
            {items.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  [
                    'block w-full rounded-lg px-3 py-2 text-sm transition',
                    isActive
                      ? 'text-indigo-600 bg-black/5 dark:bg-white/5'
                      : 'text-gray-800 hover:bg-black/5 dark:text-gray-200 dark:hover:bg-white/5',
                  ].join(' ')
                }
              >
                {it.label}
              </NavLink>
            ))}

            <button
              onClick={handleLogout}
              className="mt-1 w-full rounded-lg px-3 py-2 text-sm text-left text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
