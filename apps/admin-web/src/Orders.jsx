import React, { useState } from 'react';
import useStore from './useStore';
import { Search, Filter, Truck, CheckCircle, XCircle } from 'lucide-react';

export default function Orders() {
  const orders = useStore(state => state.orders);
  const updateOrderStatus = useStore(state => state.updateOrderStatus);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (id, newStatus) => {
    if(window.confirm(`Xác nhận chuyển đơn ${id} sang trạng thái mới?`)) {
      updateOrderStatus(id, newStatus);
    }
  };

  const statusOptions = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'unpaid', label: 'Chờ thanh toán' },
    { value: 'processing', label: 'Đang chuẩn bị' },
    { value: 'shipping', label: 'Đang giao hàng' },
    { value: 'completed', label: 'Đã hoàn thành' },
    { value: 'cancelled', label: 'Đã hủy' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-bold text-2xl">Quản Lý Đơn Hàng</h1>
        <div className="flex gap-4">
          <div className="relative w-64">
             <input 
               type="text" 
               placeholder="Tìm mã đơn..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none"
             />
             <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none"
          >
            {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Mã Đơn</th>
              <th className="px-6 py-4">Tổng Tiền</th>
              <th className="px-6 py-4 text-center">Trạng Thái</th>
              <th className="px-6 py-4 text-center">Hành Động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredOrders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-bold">{order.id}</td>
                <td className="px-6 py-4 text-orange-500 font-bold">{order.total?.toLocaleString('vi-VN')}₫</td>
                <td className="px-6 py-4 text-center">
                  <span className="px-3 py-1 bg-gray-100 rounded-full font-bold">{order.status}</span>
                </td>
                <td className="px-6 py-4 text-center space-x-2">
                  {order.status !== 'completed' && order.status !== 'cancelled' && (
                    <>
                      <button onClick={() => handleUpdateStatus(order.id, 'shipping')} className="text-blue-600 hover:underline">Giao hàng</button>
                      <button onClick={() => handleUpdateStatus(order.id, 'completed')} className="text-green-600 hover:underline">Hoàn thành</button>
                      <button onClick={() => handleUpdateStatus(order.id, 'cancelled')} className="text-red-600 hover:underline">Hủy</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}