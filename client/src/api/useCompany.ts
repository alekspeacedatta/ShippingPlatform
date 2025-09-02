import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { CompanyService } from "../services/CompanyService";
import { useCompanyStore } from "../store/useCompanyStore";
import type { Company } from "../types/Types";
import { useAuthStore } from "../store/useAuthStore";
import { useClientStore } from "../store/useClientStore";

export const useCompanies = () => {
  const setCompanies = useCompanyStore((s) => s.setCompanies);

  const q = useQuery<Company[], Error>({
    queryKey: ["companies"],                 
    queryFn: CompanyService.getAllCompanies, 
    staleTime: 0,
  });

  useEffect(() => {
    if (q.data) setCompanies(q.data);
  }, [q.data, setCompanies]);

  return q;
};
export const useAdminCompany = () => {
  const role = useAuthStore((s) => s.authInfo?.role);
  const companyId = useClientStore((s) => s.user?.companyId ?? undefined);
  const setCurrentCompany = useCompanyStore((s) => s.setCurrentCompany);
  const setCompanyHydrated = useCompanyStore((s) => s.setCompanyHydrated);

  const q = useQuery<Company, Error>({
    queryKey: ["company", companyId],
    queryFn: () => CompanyService.getById(companyId!),
    enabled: role === "COMPANY_ADMIN" && !!companyId,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 0,
  });

  useEffect(() => {
    if (q.isSuccess) {
      setCurrentCompany(q.data!);
      setCompanyHydrated(true);
    } else if (q.isError || (role === "COMPANY_ADMIN" && !companyId)) {
      // even if no companyId yet, mark hydrated so UI doesn’t spin forever
      setCompanyHydrated(true);
    }
  }, [q.isSuccess, q.isError, q.data, role, companyId, setCurrentCompany, setCompanyHydrated]);

  return q;
};