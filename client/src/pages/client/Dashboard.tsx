// pages/client/Dashboard.tsx
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/commons/Button";
import { useAuthStore } from "../../store/useAuthStore";
import { useCompanies } from "../../api/useCompany";   // triggers fetch -> writes to store
import { useUser } from "../../api/useAuth";           // triggers fetch -> writes to store
import { useCompanyStore } from "../../store/useCompanyStore";
import { useClientStore } from "../../store/useClientStore";

const Dashboard = () => {
  // Run queries JUST to hydrate Zustand (ignore their data, use status for UX)
  const { isPending: cPending, isError: cErr, error: cError } = useCompanies();
  const { isPending: uPending, isError: uErr, error: uError } = useUser();

  // Read actual data from Zustand stores
  const companies = useCompanyStore(s => s.companies);
  const user = useClientStore(s => s.user);

  const logout = useAuthStore(s => s.logout);
  const navigate = useNavigate();
  const go = (r: string) => navigate(r);

  if (cPending || uPending) return <p>Loading...</p>;
  if (cErr) return <p>Error: {cError?.message}</p>;
  if (uErr) return <p>Error: {uError?.message}</p>;

  return (
    <div className="min-h-screen flex justify-center items-center flex-col gap-3">
      <h1>{user?.fullName ?? "User"} — this is your Dashboard</h1>

      <div>
        {companies.length === 0 ? (
          <h2>No companies yet</h2>
        ) : (
          companies.map(c => <h2 key={c._id}>Available Company: {c.name}</h2>)
        )}
      </div>

      <div className="flex gap-10 items-center">
        <Button onClick={() => go("/client/create-request")}>Create Request</Button>
        <Button onClick={() => go("/client/requests/:id")}>All Requests</Button>
        <Button onClick={() => go("/client/track")}>Track</Button>
        <Button onClick={logout}>Logout</Button>
      </div>
    </div>
  );
};

export default Dashboard;
