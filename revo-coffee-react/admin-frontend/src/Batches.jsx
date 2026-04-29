import React, { useState } from 'react';
import { Plus, History } from 'lucide-react';

export default function Batches() {
  const [batches] = useState([
    { id: 'B20231015-ARA', coffee: 'Arabica Cầu Đất', roastLevel: 'Medium', weight: 15, date: '15/10/2023', status: 'Đã đóng gói' },
    { id: 'B20231016-BLD', coffee: 'Revo Blend', roastLevel: 'Medium Dark', weight: 30, date: '16/10/2023', status: 'Đang de-gas' },
  ]);

  return (
     <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="font-bold text-2xl">Quản Lý Lô Rang</h1>
           <p className="text-gray-500 text-sm mt-1">Theo dõi lịch sử các mẻ rang.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700">
          <Plus size={18} /> Ghi Lô Mới
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
           <History size={20} className="text-blue-600" /> Lịch sử rang gần đây
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-600 border-y border-gray-100">
              <tr>
                <th className="px-4 py-4">Mã Lô</th>
                <th className="px-4 py-4">Ngày Rang</th>
                <th className="px-4 py-4">Loại Cà Phê</th>
                <th className="px-4 py-4 text-center">Mức Rang</th>
                <th className="px-4 py-4 text-right">Khối Lượng</th>
                <th className="px-4 py-4 text-center">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {batches.map(b => (
                 <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 font-bold">{b.id}</td>
                    <td className="px-4 py-4">{b.date}</td>
                    <td className="px-4 py-4 font-bold">{b.coffee}</td>
                    <td className="px-4 py-4 text-center"><span className="bg-gray-200 px-2 py-1 rounded">{b.roastLevel}</span></td>
                    <td className="px-4 py-4 text-right font-bold text-orange-500">{b.weight} kg</td>
                    <td className="px-4 py-4 text-center"><span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">{b.status}</span></td>
                 </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
     </div>
  );
}