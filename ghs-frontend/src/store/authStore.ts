// src/store/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { api } from '@/lib/api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      error: null,

      login: async (email: string, password: string) => {
        try {
          set({ error: null });
          const response = await api.post('/auth/login', { email, password });
          const { token, user } = response.data;
          
          if (!token || !user) {
            throw new Error('Réponse du serveur invalide');
          }
          
          set({ 
            token, 
            user, 
            isAuthenticated: true,
            error: null 
          });
          
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (error: any) {
          console.error('Login failed:', error);
          const errorMessage = error.response?.data?.message || 'Échec de la connexion';
          set({ error: errorMessage });
          throw new Error(errorMessage);
        }
      },

      logout: () => {
        set({ 
          token: null, 
          user: null, 
          isAuthenticated: false,
          error: null 
        });
        delete api.defaults.headers.common['Authorization'];
      },

      checkAuth: async () => {
        try {
          const { token } = get();
          if (!token) return false;
          
          // Vérifier la validité du token
          const response = await api.get('/auth/me');
          if (!response.data) {
            throw new Error('Session invalide');
          }
          
          set({ 
            user: response.data,
            isAuthenticated: true,
            error: null 
          });
          
          return true;
        } catch (error) {
          console.error('Auth check failed:', error);
          get().logout();
          return false;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
