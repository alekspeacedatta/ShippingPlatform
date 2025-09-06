import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import { Parcelservice } from "../services/ParcelService";
import type { ParcelRequest } from "../types/Types";

export const useCreateParcelRequest = () => {
    return useMutation({
        mutationFn: Parcelservice.createParcelRequest,
        onSuccess: () => {
            console.log("Congrats your parcel request created successfully");
        },
        onError: (error) => {   
            console.error('Error creating parcel from Querry', error.message);
        }
    })
}
export const useGetRequests = (companyId?: string) =>
  useQuery({
    queryKey: ["requests", companyId],
    enabled: !!companyId,
    queryFn: () => Parcelservice.getParcelRequests(companyId!),
  });