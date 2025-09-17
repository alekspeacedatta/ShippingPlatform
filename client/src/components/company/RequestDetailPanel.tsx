import { useNavigate, useParams } from 'react-router-dom';
import { useGetRequest, useUpdateParcelStatus } from '../../api/useParcel';
import { Badge } from '../commons/Badge';
import type { Company, ParcelRequest } from '../../types/Types';
import { REQUEST_STATUS, statusColors, type RequestStatus } from '../../types/Types';

const prettyStatus = (s?: string) => (s ? s.replace(/_/g, ' ') : '—');

const RequestDetailPanel = () => {
  const navigate = useNavigate();
  const { parcelId } = useParams<{ parcelId: string }>();

  const { data, isLoading, isError, error } = useGetRequest(parcelId!);
  const { mutate: updateStatus, isPending } = useUpdateParcelStatus();

  const raw = data;
  const parcel: ParcelRequest | undefined = raw?.parcel ?? raw;
  const company: Company | undefined = raw?.company;

  const currentStatus = (parcel?.status as RequestStatus | undefined) ?? undefined;
  const badgeClass = currentStatus ? statusColors[currentStatus] : 'bg-gray-400';

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;
  if (!parcel) return <p>parcel does not exsist</p>;

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as RequestStatus;
    if (!parcelId || !next || next === parcel.status) return;
    updateStatus({ parcelId, status: next });
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-10 flex flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <button onClick={() => navigate(-1)} className="hover:font-semibold hover:underline underline-offset-4">
            all request
          </button>
          <span className="text-gray-400">→</span>
          <span className="font-semibold text-indigo-500 underline underline-offset-4">request details panel</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h1 className="text-xl sm:text-2xl font-semibold">Your parcel details</h1>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <Badge className={badgeClass}>{prettyStatus(parcel.status)}</Badge>

            <label className="inline-flex items-center gap-2">
              <span className="sr-only sm:not-sr-only sm:text-sm sm:text-gray-500">Update status:</span>
              <select
                className="w-full sm:w-auto rounded border bg-white px-3 py-2 text-sm disabled:opacity-60"
                value={currentStatus ?? ''}
                onChange={handleStatusChange}
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
          </div>
        </div>

        <div className="grid gap-3 sm:gap-4 rounded border bg-white p-3 sm:p-4 md:p-5 md:grid-cols-3">
          <section className="flex flex-col gap-2">
            <h2 className="text-base sm:text-lg font-semibold">
              {parcel.route.origin.country} → {parcel.route.destination.country}
            </h2>
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-10">
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
          </section>

          <div className="hidden md:block md:h-full md:w-px md:bg-black/5 mx-auto" />

          <section className="flex flex-col gap-2 md:px-4">
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
                  <span className="text-gray-500">declared value: </span>
                  {parcel.parcel.declaredValue}$
                </p>
              )}
            </div>
          </section>

          {company && (
            <section className="flex flex-col gap-2">
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

        <div className="pt-1 sm:pt-2">
          <h2 className="text-xl sm:text-2xl font-semibold">
            Total price <span className="font-bold text-green-500">{parcel.priceEstimate}$</span>
          </h2>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailPanel;
