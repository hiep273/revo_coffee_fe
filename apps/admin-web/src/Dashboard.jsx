import React from 'react';
import { DollarSign, ShoppingBag, Package, Users } from 'lucide-react';
import useStore from './useStore';

export default function Dashboard() {
  const orders = useStore(state => state.orders);
  
  const totalRevenue = orders.reduce((acc, order) => {
    if(order.status === 'completed' || order.status === 'shipping') {
      return acc + (order.total || 0);
    }
    return acc;
  }, 0);

  const newOrdersCount = orders.filter(o => o.status === 'unpaid' || o.status === 'processing').length;

  return (
    <div className="animate-fade-in">
      <h1 className="font-bold text-2xl mb-8">Tổng Quan Hoạt Động (Hôm Nay)</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <DollarSign size={24} />
           </div>
           <div>
              <p className="text-sm text-gray-500 font-bold mb-1">Doanh thu dự kiến</p>
              <h3 className="font-black text-xl">{totalRevenue.toLocaleString('vi-VN')}₫</h3>
           </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <ShoppingBag size={24} />
           </div>
           <div>
              <p className="text-sm text-gray-500 font-bold mb-1">Đơn cần xử lý</p>
              <h3 className="font-black text-2xl">{newOrdersCount}</h3>
           </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
              <Package size={24} />
           </div>
           <div>
              <p className="text-sm text-gray-500 font-bold mb-1">Cà phê đã rang (Stock)</p>
              <h3 className="font-black text-2xl">124 kg</h3>
           </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
              <Users size={24} />
           </div>
           <div>
              <p className="text-sm text-gray-500 font-bold mb-1">Thành viên mới</p>
              <h3 className="font-black text-2xl">12</h3>
           </div>
        </div>
      </div>
      
      {/* Danh sách đơn hàng mới nhất */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-lg">Đơn hàng mới nhất</h2>
          <button className="text-blue-600 text-sm font-bold hover:underline">Xem tất cả</button>
        </div>
        {orders.length === 0 ? (
          <p className="text-gray-500 py-4">Chưa có đơn hàng nào.</p>
        ) : (
          <ul className="space-y-4">
            {orders.map(order => (
              <li key={order.id} className="border-b pb-2">Đơn <b>{order.id}</b> - {order.status}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}