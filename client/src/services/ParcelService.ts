import { BASE_URL, type ParcelRequest } from "../types/Types";

export class Parcelservice {
    static async createParcelRequest (parcel: ParcelRequest) {
        const res = await fetch(`${BASE_URL}/api/client/create-request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(parcel)
        });
        if(!res.ok) throw new Error("Error while sending request to back (parcel create)");
        return res.json()
    };
    static async getParcelRequests(id: string) {
        const res = await fetch(`${BASE_URL}/api/parcel/get-requests?id=${encodeURIComponent(id)}`, { method: "GET" });
        if (!res.ok) throw new Error("Error while fetching requests");
        return res.json();
    }
    static async getParcelRequest( parcelId: string ){
        const res = await fetch(`${BASE_URL}/api/parcel/get?parcelId=${encodeURIComponent(parcelId)}`, { method: 'GET' });
        if(!res.ok) throw new Error("Error while fetching selected request");
        return res.json();
    }
}