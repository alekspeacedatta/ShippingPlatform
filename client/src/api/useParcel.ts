import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import { Parcelservice } from "../services/ParcelService";

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
export const useGetRequests = (id?: string) =>
  useQuery({
    queryKey: ["requests", id],
    enabled: !!id,
    refetchInterval: 5 * 60 * 1000,
    queryFn: () => Parcelservice.getParcelRequests(id!),
  });