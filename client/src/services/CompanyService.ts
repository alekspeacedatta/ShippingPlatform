import { BASE_URL, type Pricing } from '../types/Types'

export class CompanyService {
  static async getCompanies() {
    const res = await fetch(`${BASE_URL}/api/company/get-companies`, { method: 'GET' })
    if (!res.ok) throw new Error('Error while getting companies')
    return res.json()
  }

  static async getCompany(companyId: string) {
    const res = await fetch(`${BASE_URL}/api/company/get-company?companyId=${encodeURIComponent(companyId)}`, {
      method: 'GET',
    })
    if (!res.ok) throw new Error('Error while getting company')
    return res.json()
  }

  static async updateCompanyPricing(params: { companyId: string; pricing: Pricing }) {
    const res = await fetch(`${BASE_URL}/api/company/update-pricing`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
    if (!res.ok) throw new Error('Error updating pricing')
    return res.json()
  }

  static async updateCompanyData(params: { userId: string, companyId: string, name?: string, contactEmail?: string, phone?: string, logoUrl?: string, currentPassword?: string, newPassword?: string, }) {
    const res = await fetch(`${BASE_URL}/api/company/update-data`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
    if (!res.ok) throw new Error('Error updating company data')
    return res.json()
  }
}
