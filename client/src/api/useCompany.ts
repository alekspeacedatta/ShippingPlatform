import { useQuery } from "@tanstack/react-query"
import { CompanyService } from "../services/CompanyService"

export const useGetCompanies = () => {
    return useQuery({
        queryKey: ['companies'],
        queryFn: CompanyService.getCompanies,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: true
    })
}
export const useGetCompany = (companyId: string) => {
    return useQuery({
        queryKey: ['company', companyId],
        enabled: !!companyId,
        refetchInterval: 5 * 60 * 1000,
        queryFn: () => CompanyService.getCompany(companyId!),
    })
}