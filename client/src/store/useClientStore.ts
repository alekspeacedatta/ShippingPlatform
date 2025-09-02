// store/useClientStore.ts
import { create } from "zustand";
import type { User } from "../types/Types";

interface ClientStore {
  user: User | null;
  userHydrated: boolean;                  // <- add
  setUser: (u: User | null) => void;
  setUserHydrated: (v: boolean) => void;  // <- add
  clear: () => void;
}

export const useClientStore = create<ClientStore>((set) => ({
  user: null,
  userHydrated: false,
  setUser: (user) => set({ user }),
  setUserHydrated: (v) => set({ userHydrated: v }),
  clear: () => set({ user: null, userHydrated: false }),
}));
