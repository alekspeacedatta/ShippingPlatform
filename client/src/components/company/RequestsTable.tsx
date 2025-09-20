import { useMemo, useState } from 'react';
import { useGetRequests } from '../../api/useParcel';
import { Badge } from '../commons/Badge';
import { ArrowUpDown } from 'lucide-react';
import { useCompanyStore } from '../../store/useCompanyStore';
import type { ParcelRequest, RequestStatus } from '../../types/Types';
import { REQUEST_STATUS, statusColors } from '../../types/Types';
import { useNavigate } from 'react-router-dom';
import { Select } from '../commons/Select';

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

  if (!companyId) return <div className="p-4">No company selected.</div>;
  if (isLoading) return <div className="p-4">Loading requests…</div>;
  if (isError) return <div className="p-4 text-red-600">Failed to load requests. {error?.message}</div>;

  return (
    <>
      <div className="flex w-full flex-col items-start gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
        <p className="font-semibold">filter requests by status</p>
        <span className="hidden font-semibold sm:inline">-</span>
        <Select
          value={filteredState}
          onChange={(e) => setFilteredState(e.target.value as RequestStatus | 'ALL')}
          className="w-full font-semibold sm:w-64"
        >
          <option value="ALL">ALL</option>
          {REQUEST_STATUS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
        <button
          onClick={() => setReversed((p) => !p)}
          aria-pressed={reversed}
          aria-label={reversed ? 'Sort oldest to newest' : 'Sort newest to oldest'}
          title={reversed ? 'Oldest → Newest' : 'Newest → Oldest'}
          className={` inline-flex items-center gap-2 rounded-xl px-3 py-2 shadow-sm backdrop-blur transition-all duration-200 focus-visible:outline-none active:scale-[0.97] ${reversed ? 'border border-indigo-600 bg-indigo-50 hover:bg-indigo-100 focus-visible:ring-2 focus-visible:ring-indigo-500' : 'border border-gray-200/80 bg-white/80 hover:bg-white hover:shadow-md focus-visible:ring-2 focus-visible:ring-indigo-500'}`}
        >
          <ArrowUpDown
            size={18}
            className={`transition-colors duration-200 ${
              reversed ? 'text-indigo-600' : 'text-gray-500 group-hover:text-gray-700'
            }`}
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
