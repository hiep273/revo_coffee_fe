import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email, password) => {
        try {
          const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          const data = await response.json();
          
          if (response.ok) {
            set({ user: data.user, token: data.access_token, isAuthenticated: true });
            return { success: true };
          }
          return { success: false, message: data.message };
        } catch (error) {
          console.error("Lỗi đăng nhập:", error);
          return { success: false, message: "Lỗi kết nối đến máy chủ" };
        }
      },

      register: async (name, email, password) => {
        try {
          const response = await fetch('http://localhost:8080/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
          });
          const data = await response.json();

          if (response.ok) {
            return { success: true };
          }
          return { success: false, message: data.message || "Đăng ký thất bại" };
        } catch (error) {
          console.error("Lỗi đăng ký:", error);
          return { success: false, message: "Lỗi kết nối đến máy chủ" };
        }
      },

      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: 'revo-auth-storage' }
  )
);