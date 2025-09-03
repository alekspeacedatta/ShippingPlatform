import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
interface AuthInfo {
    token: string,
    role: 'USER' | 'COMPANY_ADMIN',
    userId: string,
}
interface AuthState {
    authInfo: AuthInfo | null,
    setAuthInfo: (authInfo: AuthInfo) => void;
    logout: () => void
}
export const useAuthStore = create<AuthState>()(
    persist((set) => ({
        authInfo: null,
        setAuthInfo: (authInfo) => set({authInfo}),
        logout: () => { set({ authInfo: null })}
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ user: state.authInfo })
        }
    )
)