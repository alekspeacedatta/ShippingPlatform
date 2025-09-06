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
    }
}