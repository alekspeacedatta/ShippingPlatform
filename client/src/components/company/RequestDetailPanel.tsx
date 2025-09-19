import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useGetRequest, useUpdateParcelStatus } from '../../api/useParcel';
import type { Company, ParcelRequest } from '../../types/Types';
import { REQUEST_STATUS, statusColors, type RequestStatus } from '../../types/Types';
import { Badge } from '../commons/Badge';

const prettyStatus = (s?: string) => (s ? s.replace(/_/g, ' ') : '—');
const RequestDetailPanel = () => {
  const navigate = useNavigate();
  const { parcelId } = useParams<{ parcelId: string }>();

  const { data, isLoading, isError, error } = useGetRequest(parcelId!);
  const { mutate: updateStatus, isPending, error: updateError, isSuccess } = useUpdateParcelStatus();

  const raw = data;
  const parcel: ParcelRequest | undefined = raw?.parcel ?? raw;
  const company: Company | undefined = raw?.company;

  const currentStatus = parcel?.status as RequestStatus | undefined;
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus | ''>(currentStatus ?? '');
  const [note, setNote] = useState('');

  const badgeClass = currentStatus ? statusColors[currentStatus] : 'bg-gray-400';
  const trackingId = parcelId ?? '';

  const isUpdateDisabled = !selectedStatus || isPending;

  const handleStatusUpdate = () => {
    if (!parcelId || !selectedStatus) return;

    updateStatus(
      {
        parcelId,
        status: selectedStatus as RequestStatus,
        note: note.trim() || undefined,
      },
      { onSuccess: () => setNote('') },
    );
  };

  const whenToLocal = (at: unknown) =>
    typeof at === 'string' || at instanceof Date ? new Date(at).toLocaleString() : String(at ?? '');

  if (isLoading) return <p className="p-4">Loading…</p>;
  if (isError) return <p className="p-4 text-red-600">Error: {String((error as Error)?.message || error)}</p>;
  if (!parcel) return <p className="p-4">Parcel does not exist.</p>;

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6 md:py-10 lg:px-8 flex flex-col gap-4 md:gap-6">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <button onClick={() => navigate(-1)} className="hover:font-semibold hover:underline underline-offset-4">
            all requests
          </button>
          <span className="text-gray-400">→</span>
          <span className="font-semibold text-indigo-500 underline underline-offset-4">request details panel</span>
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-xl sm:text-2xl font-semibold">Your parcel details</h1>

          <div className="flex flex-wrap items-stretch gap-2">
            <Badge className={badgeClass}>{prettyStatus(parcel.status)}</Badge>

            <label className="inline-flex w-full sm:w-auto items-center gap-2">
              <span className="sr-only sm:not-sr-only sm:text-sm sm:text-gray-500">Update status:</span>
              <select
                className="w-full sm:w-auto min-w-[160px] rounded border bg-white px-3 py-2 text-sm disabled:opacity-60"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as RequestStatus)}
                disabled={isPending}
              >
                {!currentStatus && (
                  <option value="" disabled>
                    Select status…
                  </option>
                )}
                {REQUEST_STATUS.map((s) => (
                  <option key={s} value={s}>
                    {prettyStatus(s)}
                  </option>
                ))}
              </select>
            </label>

            <input
              type="text"
              placeholder="Optional note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full sm:w-[320px] rounded border bg-white px-3 py-2 text-sm break-words"
              disabled={isPending}
            />

            <button
              type="button"
              onClick={handleStatusUpdate}
              disabled={!selectedStatus || isPending}
              className="rounded bg-[#7c86ff] px-4 py-2 text-sm font-semibold text-white transition
                     disabled:opacity-60 hover:bg-[#6a73d6ff]"
            >
              {isPending ? 'Updating…' : 'Update Status'}
            </button>
          </div>

          {updateError && (
            <p className="text-sm text-red-600">
              {(updateError as Error)?.message || 'Failed to update status. Please try again.'}
            </p>
          )}
          {isSuccess && <p className="text-sm text-green-600">Status updated.</p>}
        </div>

        <div className="rounded border bg-white p-3 sm:p-4 md:p-5">
          <div className="flex flex-col md:flex-row gap-4">
            <section className="flex flex-col gap-2 md:basis-1/3 min-w-0">
              <h2 className="text-base sm:text-lg font-semibold">
                {parcel.route.origin.country} → {parcel.route.destination.country}
              </h2>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-10">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Pick up address</p>
                  <p className="text-xs sm:text-sm">
                    {parcel.route.pickupAddress.country}, {parcel.route.pickupAddress.city}
                  </p>
                  <p className="text-xs sm:text-sm">
                    {parcel.route.pickupAddress.line1}, {parcel.route.pickupAddress.postalCode}
                  </p>
                </div>

                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Delivery address</p>
                  <p className="text-xs sm:text-sm">
                    {parcel.route.deliveryAddress.country}, {parcel.route.deliveryAddress.city}
                  </p>
                  <p className="text-xs sm:text-sm">
                    {parcel.route.deliveryAddress.line1}, {parcel.route.deliveryAddress.postalCode}
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-500">
                Tracking ID:{' '}
                <span className="font-mono text-black truncate inline-block max-w-full align-bottom">{trackingId}</span>
              </p>
            </section>

            <section className="flex flex-col gap-2 md:basis-1/3 md:border-x md:border-black/5 md:px-4 min-w-0">
              <h2 className="text-base sm:text-lg font-semibold">Parcel details</h2>
              <div className="space-y-1">
                <p className="text-xs sm:text-sm">
                  <span className="text-gray-500">width: </span>
                  {parcel.parcel.widthCm}cm, <span className="text-gray-500">length: </span>
                  {parcel.parcel.lengthCm}cm
                </p>
                <p className="text-xs sm:text-sm">
                  <span className="text-gray-500">height: </span>
                  {parcel.parcel.heightCm}cm, <span className="text-gray-500">weight: </span>
                  {parcel.parcel.weightKg}kg
                </p>
                {parcel.parcel.kind && (
                  <p className="text-xs sm:text-sm">
                    <span className="text-gray-500">kind: </span>
                    {parcel.parcel.kind.toLowerCase()}
                  </p>
                )}
                {'declaredValue' in parcel.parcel && (
                  <p className="text-xs sm:text-sm">
                    <span className="text-gray-500">declared value: </span>${parcel.parcel.declaredValue}
                  </p>
                )}
              </div>
            </section>

            {company && (
              <section className="flex flex-col gap-2 md:basis-1/3 md:pl-4 min-w-0">
                <h2 className="text-base sm:text-lg font-semibold">Company & shipping</h2>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm">
                    <span className="text-gray-500">company: </span>
                    {company.name}
                  </p>
                  <p className="text-xs sm:text-sm">
                    <span className="text-gray-500">shipping type: </span>
                    {parcel.shippingType}
                  </p>
                  <p className="text-xs sm:text-sm">
                    <span className="text-gray-500">type multiplier: </span>
                    {company.pricing.typeMultipliers[parcel.shippingType]}x
                  </p>
                </div>
              </section>
            )}
          </div>
        </div>

        <div className="rounded border bg-white p-3 sm:p-4 md:p-5 max-h-80 sm:max-h-96 md:max-h-[45vh] overflow-y-auto">
          <h2 className="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold">Timeline</h2>

          {parcel.timeline.length === 0 ? (
            <p className="text-sm text-gray-500">No events yet.</p>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {parcel.timeline.map((t, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === parcel.timeline.length - 1;
                const color = statusColors[t.status];
                const label = t.status.replace(/_/g, ' ');
                const when = whenToLocal(t.at);

                return (
                  <div key={`${t.at}-${t.status}-${idx}`} className="grid grid-cols-[24px_1fr] gap-3">
                    <div className="relative flex h-full w-6 items-center justify-center">
                      {!isFirst && <span className="absolute left-1/2 top-0 h-1/2 w-px -translate-x-1/2 bg-gray-200" />}
                      <span
                        className={`relative z-10 h-3.5 w-3.5 rounded-full border-2 border-white ${color} shadow`}
                      />
                      {!isLast && (
                        <span className="absolute bottom-0 left-1/2 h-1/2 w-px -translate-x-1/2 bg-gray-200" />
                      )}
                    </div>

                    <div className="flex flex-col gap-1 rounded-lg border bg-gray-50 px-3 py-2">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                        <Badge className={color}>{label}</Badge>
                        <time className="text-xs sm:text-sm text-gray-500">{when}</time>
                      </div>

                      {t.note && (
                        <div className="mt-0.5 rounded border bg-white/70 px-3 py-2 text-xs sm:text-sm text-gray-700 break-words">
                          {t.note}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="pt-1 sm:pt-2">
          <h2 className="text-xl sm:text-2xl font-semibold">
            Total price <span className="font-bold text-green-600">${parcel.priceEstimate}</span>
          </h2>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailPanel;
