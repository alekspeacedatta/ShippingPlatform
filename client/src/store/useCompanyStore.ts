import { create } from "zustand";
import type { Company } from "../types/Types";
import { createJSONStorage, persist } from "zustand/middleware";

// store/useCompanyStore.ts
interface CompanyStore {
  company: Company | null;
  setCompany: (company: Company | null) => void;
}
export const useCompanyStore = create<CompanyStore>()(
  persist(
    (set) => ({
      company: null,
      setCompany: (company) => set({ company }),
    }),
    {
      name: 'company-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ company: state.company }),
    }
  )
);
