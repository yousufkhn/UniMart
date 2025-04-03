import {create} from "zustand";
import { getSession, clearSession } from "@/utils/auth";

interface SessionState {
  user: any | null;
  isLoading: boolean;
  setUser: (user: any | null) => void;
  initializeSession: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useSessionStore = create<SessionState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  initializeSession: async () => {
    const session = await getSession();
    if (session) {
      set({ user: session, isLoading: false });
    } else {
      set({ user: null, isLoading: false });
    }
  },
  logout: async () => {
    await clearSession();
    set({ user: null });
  },
}));