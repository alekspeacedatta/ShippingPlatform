import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientHeader from '../../components/client/ClientHeader';
import { Input } from '../../components/commons/Input';
import { Button } from '../../components/commons/Button';
import { Badge } from '../../components/commons/Badge';
import { statusColors, type RequestStatus, type ParcelRequest, type Company } from '../../types/Types';
import { useTrackParcel } from '../../api/useParcel';

const isObjectId = (v: string) => /^[a-fA-F0-9]{24}$/.test(v.trim());

type ParcelWithId = ParcelRequest & { _id: string };

export default function Track() {
  const navigate = useNavigate();
  const [typedId, setTypedId] = useState('');
  const [searchId, setSearchId] = useState<string | null>(null);

  const { data, isFetching, isError, error } = useTrackParcel(searchId);

  const parcel = (data && ('parcel' in (data as any) ? (data as any).parcel : data)) as ParcelWithId | undefined;
  const company = (data && ('company' in (data as any) ? (data as any).company : undefined)) as Company | undefined;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = typedId.trim();
    setSearchId(isObjectId(v) ? v : null);
  };

  const statusKey = (parcel?.status ?? 'PENDING_REVIEW') as RequestStatus;

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientHeader />

      <div className="flex items-start justify-center p-3">
        <div className="flex w-[70rem] max-w-full flex-col gap-4">
          <div className="flex items-center gap-2 text-sm">
            <button onClick={() => navigate('/client/dashboard')} className="hover:underline underline-offset-4">
              Dashboard
            </button>
            <span>→</span>
            <span className="font-semibold text-indigo-600 underline underline-offset-4">Track</span>
          </div>

          <form
            onSubmit={onSubmit}
            className="flex flex-col gap-3 rounded-2xl border bg-white p-4 md:flex-row md:items-center"
          >
            <div className="flex-1">
              <label className="mb-1 block text-sm text-gray-600">Tracking ID</label>
              <Input
                value={typedId}
                onChange={(e) => setTypedId(e.target.value)}
                placeholder="Paste your tracking ID (24 hex chars)"
              />
              {!isObjectId(typedId) && typedId.length > 0 && (
                <p className="mt-1 text-xs text-red-600">Invalid ID format. Expecting 24 hex characters.</p>
              )}
            </div>
            <Button type="submit" className="w-full md:w-auto" disabled={isFetching}>
              {isFetching ? 'Searching…' : 'Search'}
            </Button>
          </form>

          <div className="min-h-[10rem]">
            {isFetching && <p className="p-3">Loading…</p>}

            {isError && (
              <p className="p-3 text-red-600">
                {(error as Error)?.message || 'Failed to fetch this tracking ID. Try again.'}
              </p>
            )}

            {searchId && !isFetching && !parcel && !isError && (
              <div className="rounded-lg border bg-white p-6 text-gray-500">No parcel found for this ID.</div>
            )}

            {parcel && (
              <div
                className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border bg-white p-4 transform transition-transform duration-200 hover:-translate-y-2 hover:shadow-lg"
                onClick={() => navigate(`/client/requests/${parcel._id ?? searchId}`)}
                title="Open details"
              >
                <section className="min-w-0 flex flex-col gap-1">
                  <p className="truncate text-sm font-semibold md:text-base lg:text-lg">
                    {parcel.route.origin.country} → {parcel.route.destination.country}
                  </p>

                  <section className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <p className="text-xs text-gray-600 md:text-sm">
                      <span className="font-semibold">Type:</span> {parcel.shippingType}
                    </p>
                    <p className="text-xs text-gray-600 md:text-sm">
                      <span className="font-semibold">Price estimate:</span> {parcel.priceEstimate}$
                    </p>
                    {company && (
                      <p className="text-xs text-gray-600 md:text-sm">
                        <span className="font-semibold">Company:</span> {company.name}
                      </p>
                    )}
                  </section>

                  <p className="text-xs text-gray-600 md:text-sm">
                    <span className="font-semibold">Tracking ID:</span> {parcel._id ?? searchId}
                  </p>
                </section>

                <Badge className={statusColors[statusKey]}>
                  <span className="whitespace-nowrap text-xs md:text-sm lg:text-base">
                    {statusKey.replace(/_/g, ' ')}
                  </span>
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
