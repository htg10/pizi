import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { api } from './api';

export type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'owner' | 'tenant' | 'field_executive' | 'telecaller' | 'seo_manager' | 'user';
  avatar?: string;
};

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithPhone: (phone: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        const { data } = await api.post('/auth/login', { email, password });
        const { user, access_token, refresh_token } = data.data;
        Cookies.set('access_token', access_token, { expires: 1 / 96 });
        Cookies.set('refresh_token', refresh_token, { expires: 7 });
        set({ user, isAuthenticated: true, isLoading: false });
      },

      loginWithPhone: async (phone, password) => {
        set({ isLoading: true });
        const { data } = await api.post('/auth/login', { phone, password });
        const { user, access_token, refresh_token } = data.data;
        Cookies.set('access_token', access_token, { expires: 1 / 96 });
        Cookies.set('refresh_token', refresh_token, { expires: 7 });
        set({ user, isAuthenticated: true, isLoading: false });
      },

      register: async (data) => {
        set({ isLoading: true });
        const res = await api.post('/auth/register', data);
        const { user, access_token, refresh_token } = res.data.data;
        Cookies.set('access_token', access_token, { expires: 1 / 96 });
        Cookies.set('refresh_token', refresh_token, { expires: 7 });
        set({ user, isAuthenticated: true, isLoading: false });
      },

      logout: async () => {
        const refresh_token = Cookies.get('refresh_token');
        if (refresh_token) {
          try {
            await api.post('/auth/logout', { refresh_token });
          } catch {}
        }
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        set({ user: null, isAuthenticated: false });
      },

      fetchMe: async () => {
        try {
          const { data } = await api.get('/auth/me');
          set({ user: data.data, isAuthenticated: true });
        } catch {
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'pizi-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    },
  ),
);
