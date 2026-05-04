import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { RefreshCw, Search } from 'lucide-react';

const API_BASE = 'http://localhost:8080';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/orders`);
      const data = await response.json();
      setOrders(Array.isArray(data) ? data : data.items || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const code = String(order.orderCode || order.id || '').toLowerCase();
    const matchesSearch = code.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (id, status) => {
    if (!window.confirm(`Xác nhận chuyển đơn #${id} sang "${status}"?`)) return;

    const response = await fetch(`${API_BASE}/api/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      toast.error('Cập nhật trạng thái thất bại.');
      return;
    }

    await loadOrders();
  };

  const statusOptions = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'pending', label: 'Chờ xử lý' },
    { value: 'confirmed', label: 'Đã xác nhận' },
    { value: 'processing', label: 'Đang chuẩn bị' },
    { value: 'shipped', label: 'Đang giao hàng' },
    { value: 'delivered', label: 'Đã hoàn thành' },
    { value: 'cancelled', label: 'Đã hủy' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-bold text-2xl">Quản Lý Đơn Hàng</h1>
        <div className="flex gap-4">
          <button onClick={loadOrders} className="bg-white border border-gray-200 px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50">
            <RefreshCw size={18} /> Tải lại
          </button>
          <div className="relative w-64">
            <input type="text" placeholder="Tìm mã đơn..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none" />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none">
            {statusOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Mã Đơn</th>
              <th className="px-6 py-4">Khách hàng</th>
              <th className="px-6 py-4">Tổng Tiền</th>
              <th className="px-6 py-4 text-center">Trạng Thái</th>
              <th className="px-6 py-4 text-center">Hành Động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td className="px-6 py-8 text-center text-gray-500" colSpan="5">Đang tải...</td></tr>
            ) : filteredOrders.length === 0 ? (
              <tr><td className="px-6 py-8 text-center text-gray-500" colSpan="5">Chưa có đơn hàng.</td></tr>
            ) : filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-bold">{order.orderCode || `#${order.id}`}</td>
                <td className="px-6 py-4">{order.userName || order.userEmail || order.userId}</td>
                <td className="px-6 py-4 text-orange-500 font-bold">{Number(order.totalAmount || 0).toLocaleString('vi-VN')}đ</td>
                <td className="px-6 py-4 text-center">
                  <span className="px-3 py-1 bg-gray-100 rounded-full font-bold">{order.status}</span>
                </td>
                <td className="px-6 py-4 text-center space-x-2">
                  {order.status !== 'delivered' && order.status !== 'cancelled' && (
                    <>
                      <button onClick={() => handleUpdateStatus(order.id, 'confirmed')} className="text-blue-600 hover:underline">Xác nhận</button>
                      <button onClick={() => handleUpdateStatus(order.id, 'shipped')} className="text-orange-600 hover:underline">Giao hàng</button>
                      <button onClick={() => handleUpdateStatus(order.id, 'delivered')} className="text-green-600 hover:underline">Hoàn thành</button>
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
