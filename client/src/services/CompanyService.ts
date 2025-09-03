import { BASE_URL } from "../types/Types";

export class CompanyService {
    static async getCompanies () {
        const res = await fetch(`${BASE_URL}/api/company/get`, {
            method: 'GET'
        });
        if(!res.ok) throw new Error("Error while getting companies");
        
        return res.json();
    }
}