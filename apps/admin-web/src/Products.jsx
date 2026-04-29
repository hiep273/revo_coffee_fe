import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function Products() {
  const [products] = useState([
    { id: 'SP001', name: 'REVO Morning', price: 99000, stock: 150, status: 'Còn hàng' },
    { id: 'SP002', name: 'REVO Everyday', price: 85000, stock: 200, status: 'Còn hàng' },
  ]);

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-bold text-2xl">Danh Mục Sản Phẩm</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors">
          <Plus size={18} /> Thêm Sản Phẩm
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Mã SP</th>
              <th className="px-6 py-4">Tên Sản Phẩm</th>
              <th className="px-6 py-4">Đơn Giá</th>
              <th className="px-6 py-4 text-center">Tồn Kho</th>
              <th className="px-6 py-4 text-center">Hành Động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map(prod => (
              <tr key={prod.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-bold text-gray-500">{prod.id}</td>
                <td className="px-6 py-4 font-bold">{prod.name}</td>
                <td className="px-6 py-4 text-orange-500 font-bold">{prod.price.toLocaleString('vi-VN')}₫</td>
                <td className="px-6 py-4 text-center font-bold">{prod.stock}</td>
                <td className="px-6 py-4">
                   <div className="flex items-center justify-center gap-2">
                     <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                       <Edit2 size={18} />
                     </button>
                     <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                       <Trash2 size={18} />
                     </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}