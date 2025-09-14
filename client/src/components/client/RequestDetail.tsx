import { useNavigate, useParams } from 'react-router-dom';
import { useGetRequest } from '../../api/useParcel';
import { Badge } from '../commons/Badge';
import type { Company, ParcelRequest } from '../../types/Types';
import { statusColors } from '../../types/Types';

const RequestDetail = () => {
  const navigate = useNavigate();

  const { parcelId } = useParams<{ parcelId: string }>();
  const { data, isLoading, isError, error } = useGetRequest(parcelId!);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;
  if (!data) return <p>parcel does not exsist</p>;

  const parcel: ParcelRequest = data.parcel;
  const company: Company = data.company;
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="min-w-5xl mx-auto flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <p
              className="cursor-pointer hover:font-semibold hover:underline hover:underline-offset-4"
              onClick={() => navigate(-1)}
            >
              all requests
            </p>
            <span>→</span>
            <p
              className="cursor-pointer font-semibold text-indigo-500 underline underline-offset-4 transition-all duration-200"
              onClick={() => navigate(1)}
            >
              request details
            </p>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Your parcel details</h1>
            <Badge className={statusColors[parcel.status]}>{parcel.status}</Badge>
          </div>
          <div className="gap-4 rounded border bg-white p-3 md:flex md:flex-wrap md:items-start">
            <div className="flex flex-col gap-2 rounded p-4">
              <h2 className="text-lg font-semibold">
                {parcel.route.origin.country} → {parcel.route.destination.country} - route:{' '}
              </h2>
              <div className="flex items-center gap-10">
                <div>
                  <p className="text-sm text-gray-500">pick up address: </p>
                  <p className="text-sm">
                    {parcel.route.pickupAddress.country}, {parcel.route.pickupAddress.city}
                  </p>
                  <p className="text-sm">
                    {parcel.route.pickupAddress.line1}, {parcel.route.pickupAddress.postalCode}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Delivery Address: </p>
                  <p className="text-sm">
                    {parcel.route.deliveryAddress.country}, {parcel.route.deliveryAddress.city}
                  </p>
                  <p className="text-sm">
                    {parcel.route.deliveryAddress.line1}, {parcel.route.deliveryAddress.postalCode}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 rounded p-4 md:border-l md:border-r md:px-10">
              <h2 className="text-lg font-semibold">Parcel Details: </h2>
              <div>
                <p className="text-sm">
                  <span className="text-gray-500">width: </span> {parcel.parcel.widthCm}cm,{' '}
                  <span className="text-gray-500">height: </span> {parcel.parcel.lengthCm}cm
                </p>
                <p className="text-sm">
                  <span className="text-gray-500">height: </span> {parcel.parcel.heightCm}cm,{' '}
                  <span className="text-gray-500">weight: </span> {parcel.parcel.weightKg}kg
                </p>
                <p className="text-sm">
                  <span className="text-gray-500">fragile:</span> {parcel.parcel.fragile},{' '}
                  <span className="text-gray-500">kind: </span>
                  {parcel.parcel.kind.toLocaleLowerCase()}
                </p>
                <p className="text-sm">
                  <span className="text-gray-500">declared value: </span>
                  {parcel.parcel.declaredValue}$
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 rounded p-4">
              <h2 className="text-lg font-semibold">Company & shipping: </h2>
              <div>
                <p className="text-sm">
                  <span className="text-gray-500">company: </span>
                  {company.name}
                </p>
                <p className="text-sm">
                  <span className="text-gray-500">shipping type: </span>
                  {parcel.shippingType}
                </p>
                <p className="text-sm">
                  <span className="text-gray-500">type multiplier: </span>
                  {company.pricing.typeMultipliers[parcel.shippingType]}x
                </p>
              </div>
            </div>
          </div>

          <div className="h-[45vh] overflow-y-scroll rounded border bg-white p-4">
            <h2 className="mb-4 text-xl font-semibold">Timeline</h2>

            {parcel.timeline.length === 0 ? (
              <p className="text-sm text-gray-500">No events yet.</p>
            ) : (
              <div className="space-y-6">
                {parcel.timeline.map((t, idx) => {
                  const isFirst = idx === 0;
                  const isLast = idx === parcel.timeline.length - 1;
                  const color = statusColors[t.status];
                  const label = t.status.replace(/_/g, ' ');
                  const when =
                    // @ts-ignore
                    typeof t.at === 'string' || t.at instanceof Date ? new Date(t.at).toLocaleString() : String(t.at);

                  return (
                    <div key={`${t.at}-${t.status}-${idx}`} className="grid grid-cols-[24px_1fr] gap-3">
                      <div className="relative flex h-full w-6 items-center justify-center">
                        {!isFirst && (
                          <span className="absolute left-1/2 top-0 h-1/2 w-px -translate-x-1/2 bg-gray-200" />
                        )}

                        <span
                          className={`relative z-10 h-3.5 w-3.5 rounded-full border-2 border-white ${color} shadow`}
                        />

                        {!isLast && (
                          <span className="absolute bottom-0 left-1/2 h-1/2 w-px -translate-x-1/2 bg-gray-200" />
                        )}
                      </div>

                      <div className="flex items-center justify-between rounded-lg border bg-gray-50 px-3 py-2">
                        <Badge className={color}>{label}</Badge>
                        <time className="text-sm text-gray-500">{when}</time>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-semibold">
              Total price <span className="font-bold text-green-500">{parcel.priceEstimate}$</span>
            </h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default RequestDetail;
