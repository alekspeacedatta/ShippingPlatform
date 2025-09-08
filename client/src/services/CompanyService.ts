import { BASE_URL } from "../types/Types";

export class CompanyService {
    static async getCompanies () {
        const res = await fetch(`${BASE_URL}/api/company/get-companies`, {
            method: 'GET'
        });
        if(!res.ok) throw new Error("Error while getting companies");
        return res.json();
    }
    static async getCompany (companyId: string) {
        const res = await fetch(`${BASE_URL}/api/company/get-company?companyId=${encodeURIComponent(companyId)}`, { method: "GET" });
        if(!res.ok) throw new Error("Error while getting company");
        return res.json();
    }
}