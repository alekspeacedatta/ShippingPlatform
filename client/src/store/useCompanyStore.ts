// store/useCompanyStore.ts
import { create } from "zustand";
import type { Company } from "../types/Types";

interface CompanyStore {
  companies: Company[];                     // for USER flows (all)
  currentCompany: Company | null;           // for ADMIN flow (one)
  companyHydrated: boolean;                 // <- add (admin’s company)
  setCompanies: (companies: Company[]) => void;
  setCurrentCompany: (company: Company | null) => void;
  setCompanyHydrated: (v: boolean) => void; // <- add
  clear: () => void;
}

export const useCompanyStore = create<CompanyStore>((set) => ({
  companies: [],
  currentCompany: null,
  companyHydrated: false,
  setCompanies: (companies) => set({ companies }),
  setCurrentCompany: (company) => set({ currentCompany: company }),
  setCompanyHydrated: (v) => set({ companyHydrated: v }),
  clear: () => set({ companies: [], currentCompany: null, companyHydrated: false }),
}));
