import React, { useEffect, useState } from 'react';
import { DollarSign, Package, ShoppingBag, Users } from 'lucide-react';

const API_BASE = 'http://localhost:8080';

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/api/orders`).then((res) => res.json()).catch(() => []),
      fetch(`${API_BASE}/api/inventory`).then((res) => res.json()).catch(() => ({ items: [] })),
      fetch(`${API_BASE}/api/auth/users`).then((res) => res.ok ? res.json() : { items: [] }).catch(() => ({ items: [] })),
    ]).then(([orderData, inventoryData, userData]) => {
      setOrders(Array.isArray(orderData) ? orderData : orderData.items || []);
      setInventory(Array.isArray(inventoryData) ? inventoryData : inventoryData.items || []);
      setUsers(Array.isArray(userData) ? userData : userData.items || []);
    });
  }, []);

  const totalRevenue = orders.reduce((acc, order) => {
    if (order.status === 'delivered' || order.status === 'shipped') {
      return acc + Number(order.totalAmount || 0);
    }
    return acc;
  }, 0);

  const newOrdersCount = orders.filter((order) => ['pending', 'confirmed', 'processing'].includes(order.status)).length;
  const stockTotal = inventory.reduce((acc, item) => acc + Number(item.quantityAvailable || 0), 0);

  return (
    <div className="animate-fade-in">
      <h1 className="font-bold text-2xl mb-8">Tổng Quan Hoạt Động</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-bold mb-1">Doanh thu dự kiến</p>
            <h3 className="font-black text-xl">{totalRevenue.toLocaleString('vi-VN')}đ</h3>
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
            <p className="text-sm text-gray-500 font-bold mb-1">Tồn kho khả dụng</p>
            <h3 className="font-black text-2xl">{stockTotal}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-bold mb-1">Thành viên</p>
            <h3 className="font-black text-2xl">{users.length || '-'}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-lg">Đơn hàng mới nhất</h2>
          <a href="/orders" className="text-blue-600 text-sm font-bold hover:underline">Xem tất cả</a>
        </div>
        {orders.length === 0 ? (
          <p className="text-gray-500 py-4">Chưa có đơn hàng nào.</p>
        ) : (
          <ul className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <li key={order.id} className="border-b pb-2">Đơn <b>{order.orderCode || order.id}</b> - {order.status}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
