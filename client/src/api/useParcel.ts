import { useMutation, useQuery } from "@tanstack/react-query";
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
export const useGetRequests = (id?: string) => {
    return useQuery({
        queryKey: ["requests", id],
        enabled: !!id,
        refetchOnMount: "always",
        refetchInterval: 5 * 60 * 1000,
        queryFn: () => Parcelservice.getParcelRequests(id!),
    });
}
export const useGetRequest = ( parcelId: string ) => {
    return useQuery({
        queryKey: ['requests', parcelId],
        enabled: !!parcelId,
        refetchInterval: 5 * 60 * 1000,
        queryFn: () => Parcelservice.getParcelRequest(parcelId!)
    })
}