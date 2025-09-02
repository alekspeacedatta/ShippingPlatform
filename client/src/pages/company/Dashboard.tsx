// pages/company/Dashboard.tsx
import { Button } from "../../components/commons/Button";
import { useAuthStore } from "../../store/useAuthStore";
import { useClientStore } from "../../store/useClientStore";
import { useCompanyStore } from "../../store/useCompanyStore";
import { useUser } from "../../api/useAuth";
import { useAdminCompany } from "../../api/useCompany";

const Dashboard = () => {
  // kick off background fetches (don’t use their status to block UI)
  useUser();
  useAdminCompany();

  // read only from Zustand
  const user = useClientStore((s) => s.user);
  const userHydrated = useClientStore((s) => s.userHydrated);
  const company = useCompanyStore((s) => s.currentCompany);
  const companyHydrated = useCompanyStore((s) => s.companyHydrated);
  const logout = useAuthStore((s) => s.logout);

  // gate rendering on hydration flags
  const isAdmin = user?.role === "COMPANY_ADMIN";
  const ready = userHydrated && (!isAdmin || companyHydrated);

  if (!ready) return <p>Loading...</p>;

  return (
    <>
      <h1>{user?.fullName} — Company Dashboard</h1>
      <h2>{company ? `Your company: ${company.name}` : "No company linked yet"}</h2>
      <Button onClick={logout}>Logout</Button>
    </>
  );
};

export default Dashboard;
