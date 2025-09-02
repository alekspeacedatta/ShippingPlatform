import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
interface AuthInfo {
    token: string | null,
    userID: string | null,
    role: 'USER' | "COMPANY_ADMIN"
}
interface AuthStore {
    authInfo : AuthInfo | null
    setAuthInfo: ( authInfo: AuthInfo  ) => void;
    logout: () => void
}
export const useAuthStore = create<AuthStore>()(
    persist((set) => ({
        user: null,
        authInfo: null,
        setAuthInfo: (authInfo) => set({authInfo}),
        logout: () => { set({ authInfo: null })}
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ authInfo: state.authInfo })
        }
    )
)