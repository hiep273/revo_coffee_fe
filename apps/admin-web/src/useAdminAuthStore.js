import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_BASE = 'http://localhost:8080';

export const useAdminAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (identifier, password) => {
        try {
          const account = identifier.trim();
          const email = account.toLowerCase() === 'admin' ? 'admin@revo.coffee' : account;
          const response = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          const data = await parseJsonResponse(response);

          if (!response.ok) {
            return { success: false, message: 'Tai khoan hoac mat khau khong dung.' };
          }

          if (data.user?.role !== 'admin') {
            return { success: false, message: 'Tai khoan nay khong co quyen admin.' };
          }

          set({ user: data.user, token: data.access_token, isAuthenticated: true });
          return { success: true };
        } catch {
          return { success: false, message: 'Khong ket noi duoc may chu.' };
        }
      },

      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: 'revo-admin-auth-storage' }
  )
);

async function parseJsonResponse(response) {
  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}
