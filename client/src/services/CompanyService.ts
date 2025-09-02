import type { Company } from "../types/Types";
import { BASE_URL } from "../types/Types"; 

export class CompanyService {
  static async getAllCompanies(): Promise<Company[]> {
    const res = await fetch(`${BASE_URL}/api/company/get`, {
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Failed to fetch companies");
    const data = (await res.json()) as { message: string; companies: Company[] };
    return data.companies;
  }
  static async getById(id: string): Promise<Company> {
    const res = await fetch(`${BASE_URL}/api/company/${id}`, { headers: { "Content-Type": "application/json" }});
    if (!res.ok) throw new Error("Failed to fetch company");
    const data = (await res.json()) as { company: Company };
    return data.company;
  }
}