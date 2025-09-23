import { BASE_URL } from "../types/Types";

export class Chat {
    static async setMessage (message: { companyId: string, userId: string, sentMessage: string, date: Date }) {
        const res = await fetch(`${BASE_URL}/api/messages/set-message`, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(message)
        })
        if(!res) throw new Error("Error while doing this");
        
        return res.json();
    }
    static async getMessages (id: string) {
        const res = await fetch(`${BASE_URL}/api/messages/get-message?id=${encodeURIComponent(id)}`, {
            method: "GET", 
        })
        if(!res) throw new Error("Error while doing this");
        
        return res.json();
    }
}