import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Parcelservice } from '../services/ParcelService';
export const useCreateParcelRequest = () => {
  return useMutation({
    mutationFn: Parcelservice.createParcelRequest,
    onSuccess: () => {
      console.log('Congrats your parcel request created successfully');
    },
    onError: (error) => {
      console.error('Error creating parcel from Querry', error.message);
    },
  });
};
export const useGetRequests = (id?: string) => {
  return useQuery({
    queryKey: ['requests', id],
    enabled: !!id,
    refetchOnMount: 'always',
    refetchInterval: 5 * 60 * 1000,
    queryFn: () => Parcelservice.getParcelRequests(id!),
  });
};
export const useGetRequest = (parcelId: string) => {
  return useQuery({
    queryKey: ['requests', parcelId],
    enabled: !!parcelId,
    refetchInterval: 5 * 60 * 1000,
    queryFn: () => Parcelservice.getParcelRequest(parcelId!),
  });
};
export const useUpdateParcelStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: Parcelservice.updateParcelStatus,
    onSuccess: (updated) => {
      // @ts-expect-error
      qc.setQueryData(['requests', updated._id], (prev) => {
        // @ts-expect-error
        if (prev && 'parcel' in prev) {
          return { ...prev, parcel: updated };
        }
        return updated;
      });
      qc.invalidateQueries({ queryKey: ['requests'], exact: false });
    },
  });
};
