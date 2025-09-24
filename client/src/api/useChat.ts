import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Chat } from "../services/ChatService";

export const useSetMessage = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: Chat.setMessage,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['messages'] })
        },
        onError: (err) => {
            console.error(err.message);
        }
    })
}
export const useGetMessages = (id: string) => {
    return useQuery({
        queryKey: ['CompanyMessages'],
        enabled: !!id,
        refetchInterval: 5 * 6 * 1000,
        queryFn: () => Chat.getMessages(id)
    })
}