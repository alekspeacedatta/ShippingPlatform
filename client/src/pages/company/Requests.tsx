// pages/company/Requests.tsx
import { useGetRequests } from "../../api/useParcel";
import { useCompanyStore } from "../../store/useCompanyStore";

const Requests = () => {
  // pages/company/Requests.tsx
    const companyId = useCompanyStore(s => s.companyInfo?.companyId);
    const { data: requests, isLoading, isError, error } = useGetRequests(companyId);


  if (!companyId) return <div className="p-4">No company selected.</div>;
  if (isLoading) return <div className="p-4">Loading requests…</div>;
  if (isError) return <div className="p-4 text-red-600">Failed to load requests. {error.message}</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-3">Requests</h1>
      {(!requests || requests.length === 0) ? (
        <p>No requests yet.</p>
      ) : (
            
          <ul className="space-y-2">
          {//@ts-ignore
          requests.map((r, i) => (
            <li key={i} className="border rounded p-3">
              <div className="font-medium">{r.route.origin.country} → {r.route.destination.country}</div>
              <div className="text-sm text-gray-600">Type: {r.shippingType} • Status: {r.status}</div>
              <div className="text-sm">Estimate: ${r.priceEstimate}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default Requests;
