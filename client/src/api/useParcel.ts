import { useMutation } from "@tanstack/react-query";
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