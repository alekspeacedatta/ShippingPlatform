import { useNavigate } from 'react-router-dom';
import ClientHeader from '../../components/client/ClientHeader';

const Dashboard = () => {
  const navigate = useNavigate();
  const go = (route: string) => navigate(route);

  return (
    <>
      <ClientHeader />

      <main className="min-h-screen bg-[radial-gradient(80%_60%_at_50%_0%,#eef2ff_0%,#ffffff_40%,#ffffff_100%)] dark:bg-[radial-gradient(80%_60%_at_50%_0%,#0b1220_0%,#0a0f1a_40%,#0a0f1a_100%)]">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div
              onClick={() => go('/client/create-request')}
              role="button"
              tabIndex={0}
              aria-label="Create Request"
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && go('/client/create-request')}
              className="  h-44 cursor-pointer overflow-hidden rounded-2xl border border-indigo-300 bg-white/90 backdrop-blur shadow-sm transition-all duration-300 hover:-translate-y-3  hover:shadow-md dark:border-white/10 dark:bg-slate-900/70 md:col-span-2 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400/40"
            >
              <div className="flex items-start gap-4 p-5">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl ring-1 ring-indigo-500/20 bg-gradient-to-br from-indigo-500/15">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6 text-indigo-600 dark:text-indigo-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path strokeLinecap="round" d="M12 8v8M8 12h8" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold tracking-tight">Create Request</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                    Start a new shipment: parcel details, route, type, and price estimate.
                  </p>
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-black/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:via-white/10" />
            </div>

            <div
              onClick={() => go('/client/requests')}
              role="button"
              tabIndex={0}
              aria-label="Requests"
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && go('/client/requests')}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-black/10 bg-white/90 backdrop-blur shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-slate-900/70 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400/40"
            >
              <div className="flex items-start gap-4 p-5">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl ring-1 ring-emerald-500/20 bg-gradient-to-br from-emerald-500/15">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6 text-emerald-600 dark:text-emerald-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 5h6" />
                    <path d="M9 3h6a2 2 0 0 1 2 2v1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h1V5a2 2 0 0 1 2-2z" />
                    <path d="M8 11h8M8 15h5" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold tracking-tight">Requests</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                    View statuses, timelines, and details of your parcel requests.
                  </p>
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-black/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:via-white/10" />
            </div>

            <div
              onClick={() => go('/client/track')}
              role="button"
              tabIndex={0}
              aria-label="Track"
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && go('/client/track')}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-black/10 bg-white/90 backdrop-blur shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-slate-900/70 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-400/40"
            >
              <div className="flex items-start gap-4 p-5">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl ring-1 ring-sky-500/25 bg-gradient-to-br from-sky-500/15">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6 text-sky-600 dark:text-sky-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2v2m0 16v2m8-10h2M2 12H4m12.95-6.95l1.414 1.414M5.636 18.364l1.414-1.414m0-10.95L5.636 6.464M18.364 18.364l-1.414-1.414" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold tracking-tight">Track</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                    Track shipments with your tracking ID and see live updates.
                  </p>
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-black/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:via-white/10" />
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
