import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  credits: number;
  subscriptionTier: 'free' | 'basic' | 'pro' | 'enterprise';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  updateCredits: (amount: number) => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: true,

        // Вызвать после монтирования на клиенте
        initialize: () => set({ isLoading: false }),

        setUser: (user) => set({ user, isAuthenticated: !!user }),

        setToken: (token) => set({ token }),

        setLoading: (isLoading) => set({ isLoading }),

        logout: () => set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        }),

        updateCredits: (amount) =>
          set((state) => ({
            user: state.user
              ? { ...state.user, credits: state.user.credits + amount }
              : null,
          })),
      }),
      { name: 'auth-storage' }
    )
  )
);
