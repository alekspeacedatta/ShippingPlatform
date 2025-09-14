import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CompanyService } from '../services/CompanyService';

export const useGetCompanies = () => {
  return useQuery({
    queryKey: ['companies'],
    queryFn: CompanyService.getCompanies,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};
export const useGetCompany = (companyId: string) => {
  return useQuery({
    queryKey: ['company', companyId],
    enabled: !!companyId,
    refetchInterval: 5 * 60 * 1000,
    queryFn: () => CompanyService.getCompany(companyId!),
  });
};
export const usePricingUpdate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: CompanyService.updateCompanyPricing,
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['company', variables.companyId] });
      qc.invalidateQueries({ queryKey: ['companies'] });
      console.log('Pricing updated successfully');
    },
    onError: (err: any) => {
      console.error('Failed to update pricing:', err?.message ?? err);
    },
  });
};
export const useCompanyDataUpdate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: CompanyService.updateCompanyData,
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['company', variables.companyId] });
      qc.invalidateQueries({ queryKey: ['companies'] });
    },
  });
};
