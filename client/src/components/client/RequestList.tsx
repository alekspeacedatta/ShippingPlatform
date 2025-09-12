import { useGetRequests } from '../../api/useParcel';
import { Badge } from '../commons/Badge';
import { useAuthStore } from '../../store/useAuthStore';
import type { ParcelRequest, RequestStatus } from '../../types/Types';
import { useNavigate } from 'react-router-dom';
import { REQUEST_STATUS, statusColors } from '../../types/Types';
import { Select } from '../commons/Select';
import { useMemo, useState } from 'react';
const RequestList = () => {

  type parcelWithId = ParcelRequest & {_id: string};

  const navigate = useNavigate();
  const userId = useAuthStore((state) => state.authInfo?.userId);
  const { data = [] , isLoading, isError, error } = useGetRequests(userId);
  const [ filteredState, setFilteredState ] = useState<RequestStatus | 'ALL'>('ALL');
  const requests = data as parcelWithId[];

  const filtered = useMemo( () => 
    filteredState === 'ALL' ? requests : requests.filter(e => e.status === filteredState), 
    [ requests, filteredState]
  )

  if (!userId) return <div className="p-4">No company selected.</div>;
  if (isLoading) return <div className="p-4">Loading requests…</div>;
  if (isError) return <div className="p-4 text-red-600">Failed to load requests. {error.message}</div>;

  return (
    <div className="flex min-h-screen items-center justify-center p-3">
      <div className="flex flex-col gap-3">
        <div className='flex justify-between items-center'>
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
          <div className='flex items-center gap-3'>
            <p className='font-semibold'>filter requests by status</p>
            <span className='font-semibold'>-</span>
            <Select value={filteredState} onChange={(e) => { setFilteredState(e.target.value as RequestStatus) }} className='font-semibold'>
              <option value="ALL">ALL</option>
              { REQUEST_STATUS.map((req : RequestStatus )  => (
                <option key={req} value={req}>{req}</option>
              ) ) }
            </Select>
          </div>
        </div>
        <div className="h-[90vh] py-1.5  md:h-[90vh]  md:overflow-y-scroll">
          <div className='h-[max-content] w-[max-content] grid grid-cols-1 md:grid-cols-3 gap-3'>
            { filtered.length === 0  ? (
              <div className="text-gray-500">No requests found.</div>) : (
                filtered.map(req => (
                  <div
              key={req._id}
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
                ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
export default RequestList;
