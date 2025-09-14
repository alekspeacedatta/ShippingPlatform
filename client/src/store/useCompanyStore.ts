import { create } from 'zustand';

import { createJSONStorage, persist } from 'zustand/middleware';
interface CompanyInfo {
  companyId: string;
  email: string;
}
interface CompanyStore {
  companyInfo: CompanyInfo | null;
  setCompanyInfo: (companyInfo: CompanyInfo | undefined) => void;
  companyLogout: () => void;
}
export const useCompanyStore = create<CompanyStore>()(
  persist(
    (set) => ({
      companyInfo: null,
      setCompanyInfo: (companyInfo) => set({ companyInfo }),
      companyLogout: () => {
        set({ companyInfo: null });
      },
    }),
    {
      name: 'company-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ companyInfo: state.companyInfo }),
    },
  ),
);
