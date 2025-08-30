import { create } from "zustand";
import { type User } from "../types/Types";
import { createJSONStorage, persist } from "zustand/middleware";
interface AuthStore {
    user: User | null;
    setUser: (user: User) => void;
    logout: () => void
}
export const useAuthStore = create<AuthStore>()(
    persist((set) => ({
        user: null,
        setUser: (user) => set({user}),
        logout: () => { set({ user: null }); localStorage.removeItem('token') }
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ user: state.user })
        }
    )
)