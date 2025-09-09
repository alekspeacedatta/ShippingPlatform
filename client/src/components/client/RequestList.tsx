import { useGetRequests } from '../../api/useParcel';
import { Badge } from '../commons/Badge';
import { useAuthStore } from '../../store/useAuthStore';
import type { ParcelRequest } from '../../types/Types';
import { useNavigate } from 'react-router-dom';
import { statusColors } from '../../types/Types';
const RequestList = () => {
  const navigate = useNavigate();
  const userId = useAuthStore((state) => state.authInfo?.userId);
  const { data: requests, isLoading, isError, error } = useGetRequests(userId);

  if (!userId) return <div className="p-4">No company selected.</div>;
  if (isLoading) return <div className="p-4">Loading requests…</div>;
  if (isError)
    return <div className="p-4 text-red-600">Failed to load requests. {error.message}</div>;

  return (
    <div className="flex min-h-screen items-center justify-center p-3">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <p
            className="cursor-pointer hover:font-semibold hover:underline hover:underline-offset-4"
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
        <div className="grid h-[90vh] grid-cols-1 gap-3 py-5 md:h-[90vh] md:h-auto md:grid-cols-3 md:overflow-auto md:overflow-y-scroll">
          {requests.map((req: ParcelRequest, i: number) => (
            //@ts-ignore
            <div
              key={i}
              onClick={() => navigate(`/client/requests/${req._id}`)}
              className="flex h-[10vh] w-[30vw] transform cursor-pointer items-center justify-between gap-3 rounded border bg-white p-3 transition-transform duration-200 hover:-translate-y-2 hover:shadow-lg"
            >
              <section className="flex flex-col gap-2">
                <p className="text-xl font-semibold">
                  {req.route.origin.country} → {req.route.destination.country}
                </p>
                <section className="flex items-center gap-3">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Type:</span> {req.shippingType}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Price estimate:</span> {req.priceEstimate}$
                  </p>
                </section>
              </section>
              <Badge className={statusColors[req.status]}> {req.status.replace(/_/g, ' ')} </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default RequestList;
