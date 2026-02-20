'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminAuthState {
  isAdminAuthenticated: boolean;
  adminPassword: string | null;
  
  // Actions
  setAdminPassword: (password: string) => void;
  authenticate: (password: string) => boolean;
  logout: () => void;
  isAuthenticated: () => boolean;
}

// Default admin password (should be changed in production)
const DEFAULT_ADMIN_PASSWORD = 'admin123';

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set, get) => ({
      isAdminAuthenticated: false,
      adminPassword: null,
      
      setAdminPassword: (password) => {
        // Hash password (simple hash for demo - use bcrypt in production)
        const hashed = btoa(password);
        set({ adminPassword: hashed });
      },
      
      authenticate: (password: string) => {
        const storedPassword = get().adminPassword;
        const hashed = btoa(password);
        
        // Check against stored password or default
        if (hashed === storedPassword || password === DEFAULT_ADMIN_PASSWORD) {
          set({ isAdminAuthenticated: true });
          return true;
        }
        return false;
      },
      
      logout: () => {
        set({ isAdminAuthenticated: false });
      },
      
      isAuthenticated: () => {
        return get().isAdminAuthenticated;
      },
    }),
    {
      name: 'admin-auth',
    }
  )
);
