import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      cart: [],
      orders: [], // mảng lưu trữ đơn hàng
      inventory: [
        { id: 'GB-ARA-01', name: 'Arabica Cầu Đất (Sơ chế Washed)', type: 'Green Beans', quantity: 120, unit: 'kg' },
        { id: 'GB-ROB-02', name: 'Robusta Đắk Lắk (Sơ chế Honey)', type: 'Green Beans', quantity: 85, unit: 'kg' },
        { id: 'PKG-ZIP-250', name: 'Túi Zipper có van Drip (250g)', type: 'Packaging', quantity: 1250, unit: 'túi' },
        { id: 'PKG-KRF-500', name: 'Túi Kraft Trơn (500g)', type: 'Packaging', quantity: 450, unit: 'túi' }
      ],
      loyaltyPoints: 0,
      
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

      createOrder: (orderData) => set((state) => {
        // orderData bao gồm: id, items, total, status (unpaid, processing, shipping, completed, cancelled), date, shippingInfo
        return { 
          orders: [{ ...orderData, id: `ORD${Date.now()}`, date: new Date().toISOString() }, ...state.orders]
        };
      }),
      
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
