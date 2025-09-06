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
    static async getParcelRequests(companyId: string) {
    const url = `${BASE_URL}/api/company/get-requests?companyId=${encodeURIComponent(companyId)}`;
    const res = await fetch(url, { method: "GET" }); // ❌ no body on GET
    if (!res.ok) throw new Error("Error while fetching requests");
    return res.json();
  }
}