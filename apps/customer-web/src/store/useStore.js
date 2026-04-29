import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      users: [], // demo-only local users
      user: null, // { id, name, email }
      cart: [],
      orders: [], // mảng lưu trữ đơn hàng
      inventory: [
        { id: 'GB-ARA-01', name: 'Arabica Cầu Đất (Sơ chế Washed)', type: 'Green Beans', quantity: 120, unit: 'kg' },
        { id: 'GB-ROB-02', name: 'Robusta Đắk Lắk (Sơ chế Honey)', type: 'Green Beans', quantity: 85, unit: 'kg' },
        { id: 'PKG-ZIP-250', name: 'Túi Zipper có van Drip (250g)', type: 'Packaging', quantity: 1250, unit: 'túi' },
        { id: 'PKG-KRF-500', name: 'Túi Kraft Trơn (500g)', type: 'Packaging', quantity: 450, unit: 'túi' }
      ],
      loyaltyPoints: 0,

      register: ({ name, email, password }) =>
        set((state) => {
          const normalizedEmail = String(email || '').trim().toLowerCase();
          if (!normalizedEmail) throw new Error('Email không hợp lệ');
          const exists = state.users.some((u) => u.email === normalizedEmail);
          if (exists) throw new Error('Email đã được đăng ký');

          const newUser = {
            id: `USR${Date.now()}`,
            name: String(name || '').trim() || normalizedEmail.split('@')[0],
            email: normalizedEmail,
            password: String(password || ''), // demo-only; do not use in production
          };

          return {
            users: [newUser, ...state.users],
            user: { id: newUser.id, name: newUser.name, email: newUser.email },
          };
        }),

      login: ({ email, password }) =>
        set((state) => {
          const normalizedEmail = String(email || '').trim().toLowerCase();
          const pwd = String(password || '');
          const found = state.users.find(
            (u) => u.email === normalizedEmail && String(u.password) === pwd
          );
          if (!found) throw new Error('Sai email hoặc mật khẩu');
          return { user: { id: found.id, name: found.name, email: found.email } };
        }),

      logout: () => set({ user: null }),
      
      addToCart: (product, quantity, grindType) => set((state) => {
        const existingItemIndex = state.cart.findIndex(
          item => item.id === product.id && item.grindType === grindType
        );

        if (existingItemIndex >= 0) {
          const newCart = [...state.cart];
          newCart[existingItemIndex].quantity += quantity;
          return { cart: newCart };
        } else {
          return { 
            cart: [...state.cart, { ...product, quantity, grindType }] 
          };
        }
      }),
      
      removeFromCart: (productId, grindType) => set((state) => ({
        cart: state.cart.filter(item => !(item.id === productId && item.grindType === grindType))
      })),
      
      updateQuantity: (productId, grindType, newQuantity) => set((state) => ({
        cart: state.cart.map(item => 
          (item.id === productId && item.grindType === grindType)
            ? { ...item, quantity: Math.max(1, newQuantity) }
            : item
        )
      })),
      
      clearCart: () => set({ cart: [] }),

      createOrder: async (orderData) => {
        try {
          const response = await fetch('http://localhost:8080/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
          });
          const data = await response.json();
          set((state) => ({ 
            orders: [data, ...state.orders]
          }));
          return data;
        } catch (err) {
          console.error('Lỗi tạo đơn hàng:', err);
          throw err;
        }
      },
      
      updateOrderStatus: (orderId, newStatus) => set((state) => ({
        orders: state.orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      })),
      
      restockItem: (itemId, amount) => set((state) => ({
        inventory: state.inventory.map(item =>
          item.id === itemId ? { ...item, quantity: item.quantity + Number(amount) } : item
        )
      })),
      
      addLoyaltyPoints: (points) => set((state) => ({ 
        loyaltyPoints: state.loyaltyPoints + points 
      })),
      
      useLoyaltyPoints: (points) => set((state) => ({ 
        loyaltyPoints: Math.max(0, state.loyaltyPoints - points) 
      })),
    }),
    {
      name: 'revo-coffee-storage', // Lưu vào localStorage
    }
  )
);

export default useStore;
