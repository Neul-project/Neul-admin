// stores/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  user: { id: number; name: string } | null;
  isLoggedIn: boolean;
  login: (user: { id: number; name: string }) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      login: (user) => {
        console.log("zustand login 실행됨, user:", user);
        set({ user, isLoggedIn: true });
      },
      logout: () => set({ user: null, isLoggedIn: false }),
    }),
    {
      name: "auth-storage", // localStorage에 저장될 키
    }
  )
);
