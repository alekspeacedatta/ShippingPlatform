import { useGetRequests } from "../../api/useParcel";
import { Badge } from "../commons/Badge";
import { useAuthStore } from "../../store/useAuthStore";
import type { ParcelRequest, RequestStatus } from "../../types/Types";
import { useNavigate } from "react-router-dom";

const RequestList = () => {
  const statusColors: Record<RequestStatus, string> = {
    PENDING_REVIEW: "bg-orange-400",
    AWAITING_COMPANY_CONFIRMATION: "bg-yellow-400",
    ACCEPTED: "bg-green-500",
    IN_TRANSIT: "bg-blue-500",
    OUT_FOR_DELIVERY: "bg-purple-500",
    DELIVERED: "bg-teal-500",
    REJECTED: "bg-red-500",
  };

  const navigate = useNavigate();
  const userId = useAuthStore(state => state.authInfo?.userId);
  const { data: requests, isLoading, isError, error } = useGetRequests(userId);


  if (!userId) return <div className="p-4">No company selected.</div>;
  if (isLoading) return <div className="p-4">Loading requests…</div>;
  if (isError) return <div className="p-4 text-red-600">Failed to load requests. {error.message}</div>;

  return (
    <div className="min-h-screen flex items-center justify-center p-3">
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
                <p className="cursor-pointer hover:underline hover:underline-offset-4 hover:font-semibold" onClick={() => navigate(-1)}>Dashboard</p>
                <span>→</span>
                <p className="cursor-pointer underline transition-all duration-200 underline-offset-4 font-semibold text-indigo-500" onClick={() => navigate(1)}>All Request</p>
            </div>            
            <div className="grid grid-cols-1 h-[90vh] md:h-auto overflow-y-scroll md:overflow-auto md:grid-cols-2 gap-3">
              {requests.map((req : ParcelRequest, i: number )=> (
                <div key={i} className="bg-white rounded border p-3 flex items-center justify-between gap-3
             cursor-pointer transform transition-transform duration-200
             hover:-translate-y-2 hover:shadow-lg">
                  <section className="flex flex-col gap-2">
                    <p className="font-semibold text-xl">{req.route.origin.country} → {req.route.destination.country}</p>
                    <section className="flex items-center gap-3">
                      <p className="text-sm text-gray-600"><span className="font-semibold">Type:</span> {req.shippingType}</p>
                      <p className="text-sm text-gray-600"><span className="font-semibold">Price estimate:</span> {req.priceEstimate}$</p>
                    </section>
                  </section>
                    <Badge className={statusColors[req.status]}> {req.status.replace(/_/g, " ")} </Badge>                    
                </div>
              ))}
            </div>
        </div>
    </div>
  );
};
export default RequestList;
