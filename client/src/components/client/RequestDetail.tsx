import { useNavigate, useParams } from 'react-router-dom';
import { useGetRequest } from '../../api/useParcel';
import { Badge } from '../commons/Badge';
import type { Company, ParcelRequest } from '../../types/Types';
import { statusColors } from '../../types/Types';
import { useState } from 'react';
import ClientHeader from './ClientHeader';

const RequestDetail = () => {
  const navigate = useNavigate();
  const { parcelId } = useParams<{ parcelId: string }>();
  const { data, isLoading, isError, error } = useGetRequest(parcelId!);

  const [parcelID] = useState<string>(parcelId!);
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;
  if (!data) return <p>parcel does not exsist</p>;

  const parcel: ParcelRequest = data.parcel;
  const company: Company = data.company;

  return (
    <>
        <ClientHeader />
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-10 flex flex-col gap-4 sm:gap-6">

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <button
            onClick={() => navigate(-1)}
            className="cursor-pointer hover:font-semibold hover:underline underline-offset-4"
          >
            all requests
          </button>
          <span className="text-gray-400">→</span>
          <button
            onClick={() => navigate(1)}
            className="cursor-pointer font-semibold text-indigo-500 underline underline-offset-4"
          >
            request details
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h1 className="text-xl sm:text-2xl font-semibold">Your parcel details</h1>
          <div className="sm:self-end">
            <Badge className={statusColors[parcel.status]}>{parcel.status}</Badge>
          </div>
        </div>

        <div className="rounded border bg-white p-3 sm:p-4 md:p-5">
          <div className="flex flex-col gap-4 md:flex-row">
            <section className="flex flex-col gap-2 md:basis-1/3 min-w-0">
              <h2 className="text-base sm:text-lg font-semibold">
                {parcel.route.origin.country} → {parcel.route.destination.country}
              </h2>

              <div className="flex flex-col gap-4 sm:flex-row sm:gap-10">
                <div>
                  <p className="text-xs text-gray-500 sm:text-sm">Pick up address</p>
                  <p className="text-xs sm:text-sm">
                    {parcel.route.pickupAddress.country}, {parcel.route.pickupAddress.city}
                  </p>
                  <p className="text-xs sm:text-sm">
                    {parcel.route.pickupAddress.line1}, {parcel.route.pickupAddress.postalCode}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 sm:text-sm">Delivery address</p>
                  <p className="text-xs sm:text-sm">
                    {parcel.route.deliveryAddress.country}, {parcel.route.deliveryAddress.city}
                  </p>
                  <p className="text-xs sm:text-sm">
                    {parcel.route.deliveryAddress.line1}, {parcel.route.deliveryAddress.postalCode}
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-500 flex items-end gap-1.5">
                Tracking ID: <span className="font-semibold truncate inline-block max-w-full">{parcelID}</span>
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
                <p className="text-xs sm:text-sm">
                  <span className="text-gray-500">fragile: </span>
                  {String(parcel.parcel.fragile)}, <span className="text-gray-500">kind: </span>
                  {parcel.parcel.kind.toLowerCase()}
                </p>
                <p className="text-xs sm:text-sm">
                  <span className="text-gray-500">declared value: </span>${parcel.parcel.declaredValue}
                </p>
              </div>
            </section>

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
                const when =
                  // @ts-expect-error
                  typeof t.at === 'string' || t.at instanceof Date ? new Date(t.at).toLocaleString() : String(t.at);
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
                        <div className="mt-0.5 rounded bg-white/70 px-3 py-2 text-xs sm:text-sm text-gray-700 border">
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
            Total price <span className="font-bold text-green-500">{parcel.priceEstimate}$</span>
          </h2>
        </div>
      </div>
    </div>
    </>
  );
};

export default RequestDetail;
