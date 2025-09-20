import { useMemo, useState } from 'react';
import { useGetRequests } from '../../api/useParcel';
import { Badge } from '../commons/Badge';
import { ArrowUpDown } from 'lucide-react';
import { useCompanyStore } from '../../store/useCompanyStore';
import type { ParcelRequest, RequestStatus } from '../../types/Types';
import { REQUEST_STATUS, statusColors } from '../../types/Types';
import { useNavigate } from 'react-router-dom';

const RequestsTable = () => {
  type ParcelWithId = ParcelRequest & { _id: string };

  const navigate = useNavigate();
  const companyId = useCompanyStore((s) => s.companyInfo?.companyId);

  const { data = [], isLoading, isError, error } = useGetRequests(companyId);
  const [filteredState, setFilteredState] = useState<RequestStatus | 'ALL'>('ALL');
  const [reversed, setReversed] = useState(false);

  const requests = data as ParcelWithId[];
  const filtered = useMemo(() => {
    const base = filteredState === 'ALL' ? requests : requests.filter((r) => r.status === filteredState);
    return reversed ? [...base].reverse() : base;
  }, [requests, filteredState, reversed]);
  const isFilterActive = filteredState !== 'ALL';

  if (!companyId) return <div className="p-4">No company selected.</div>;
  if (isLoading) return <div className="p-4">Loading requests…</div>;
  if (isError) return <div className="p-4 text-red-600">Failed to load requests. {error?.message}</div>;

  return (
    <>
      <div
            className=" w-full flex flex-col gap-3 md:flex-row md:items-center md:justify-between "
          >
            <div className="flex items-center gap-2">
              <p
                className="cursor-pointer hover:font-semibold hover:underline underline-offset-4"
                onClick={() => navigate(-1)}
              >
                Dashboard
              </p>
              <span>→</span>
              <p
                className="cursor-pointer font-semibold text-indigo-500 underline underline-offset-4 transition-all duration-200"
                onClick={() => navigate(1)}
              >
                All Request
              </p>
            </div>

            <div
              className="w-full flex flex-col gap-2 sm:flex-row sm:items-center sm:flex-wrap md:w-auto "
            >
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">Filter by status</p>
                <span className="hidden sm:inline">-</span>
              </div>

              <div className="relative inline-flex w-full sm:w-64">
                <select
                  value={filteredState}
                  onChange={(e) => setFilteredState(e.target.value as RequestStatus | 'ALL')}
                  aria-label="Filter by status"
                  className={`
          appearance-none w-full rounded-xl px-3 py-2 pr-9
          font-semibold shadow-sm backdrop-blur transition-all duration-200
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
          hover:shadow-md
          ${
            isFilterActive
              ? 'border border-indigo-600 bg-indigo-50 text-indigo-700'
              : 'border border-gray-200/80 bg-white/80 text-gray-700'
          }
        `}
                >
                  <option value="ALL">ALL</option>
                  {REQUEST_STATUS.map((s) => (
                    <option key={s} value={s}>
                      {s.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>

                <svg
                  className={`
          pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4
          transition-colors duration-200
          ${isFilterActive ? 'text-indigo-600' : 'text-gray-400'}
        `}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.06l3.71-3.83a.75.75 0 1 1 1.08 1.04l-4.24 4.38a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06z" />
                </svg>
              </div>

              <button
                onClick={() => setReversed((p) => !p)}
                aria-pressed={reversed}
                aria-label={reversed ? 'Sort oldest to newest' : 'Sort newest to oldest'}
                title={reversed ? 'Oldest → Newest' : 'Newest → Oldest'}
                className={`
        inline-flex items-center justify-center gap-2
        rounded-xl px-3 py-2 shadow-sm backdrop-blur
        transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
        active:scale-[0.97]
        w-full sm:w-auto
        ${
          reversed
            ? 'border border-indigo-600 bg-indigo-50 hover:bg-indigo-100'
            : 'border border-gray-200/80 bg-white/80 hover:bg-white hover:shadow-md'
        }
      `}
              >
                <ArrowUpDown
                  size={18}
                  className={`
          transition-colors duration-200
          ${reversed ? 'text-indigo-600' : 'text-gray-500'}
        `}
                />
                <span className="flex items-baseline gap-1">
                  <span className="text-sm font-medium">Sort</span>
                  <span
                    className={`text-xs whitespace-nowrap transition-colors duration-200 ${
                      reversed ? 'text-indigo-700' : 'text-gray-500'
                    }`}
                  >
                    {reversed ? 'oldest → newest' : 'newest → oldest'}
                  </span>
                </span>
              </button>
            </div>
          </div>

      <div className="py-1.7 h-[62vh] md:h-[73vh] overflow-y-auto">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.length === 0 ? (
            <div className="col-span-full rounded-lg border bg-white p-6 text-gray-500">No requests found.</div>
          ) : (
            filtered.map((req) => (
              <div
                key={req._id}
                onClick={() => navigate(`/company/requests/${req._id}`)}
                className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border bg-white p-4 transform transition-transform duration-200 hover:-translate-y-2 hover:shadow-lg"
              >
                <section className="min-w-0 flex flex-col gap-1">
                  <p className="truncate text-sm font-semibold md:text-base lg:text-lg">
                    {req.route.origin.country} → {req.route.destination.country}
                  </p>
                  <section className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <p className="text-xs text-gray-600 md:text-sm">
                      <span className="font-semibold">Type:</span> {req.shippingType}
                    </p>
                    <p className="text-xs text-gray-600 md:text-sm">
                      <span className="font-semibold">Price estimate:</span> {req.priceEstimate}$
                    </p>
                  </section>
                  <p className="text-xs text-gray-600 md:text-sm">
                    <span className="font-semibold">Tracking ID:</span> {req._id}
                  </p>
                </section>
                <Badge className={statusColors[req.status]}>
                  <span className="text-xs md:text-sm lg:text-base">{req.status.replace(/_/g, ' ')}</span>
                </Badge>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default RequestsTable;
