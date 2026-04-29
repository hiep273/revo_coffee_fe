import { create } from 'zustand';

const useStore = create((set) => ({
  orders: [
    // Mock data đơn hàng
    { id: 'ORD12345', date: new Date().toISOString(), shippingInfo: { name: 'Nguyễn Văn A' }, total: 150000, status: 'unpaid' }
  ],
  inventory: [
    { id: 'GB-ARA-01', name: 'Arabica Cầu Đất', type: 'Green Beans', quantity: 120, unit: 'kg' },
    { id: 'GB-ROB-02', name: 'Robusta Đắk Lắk', type: 'Green Beans', quantity: 85, unit: 'kg' },
    { id: 'PKG-ZIP-250', name: 'Túi Zipper (250g)', type: 'Packaging', quantity: 1250, unit: 'túi' }
  ],
  
  updateOrderStatus: (id, status) => set((state) => ({
    orders: state.orders.map(o => o.id === id ? { ...o, status } : o)
  })),
  
  restockItem: (id, amount) => set((state) => ({
    inventory: state.inventory.map(i => i.id === id ? { ...i, quantity: i.quantity + Number(amount) } : i)
  }))
}));

export default useStore;