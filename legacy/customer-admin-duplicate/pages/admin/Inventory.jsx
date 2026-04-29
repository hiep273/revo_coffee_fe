import React, { useState } from 'react';
import { Archive, Plus, X } from 'lucide-react';
import useStore from './useStore';

export default function Inventory() {
  const inventory = useStore(state => state.inventory);
  const restockItem = useStore(state => state.restockItem);
  
  const [restockForm, setRestockForm] = useState(null);
  const [restockAmount, setRestockAmount] = useState('');

  const handleRestock = (e, id) => {
    e.preventDefault();
    if(restockAmount && Number(restockAmount) > 0) {
      if(window.confirm(`Xác nhận nhập thêm ${restockAmount} cho mã ${id}?`)) {
        restockItem(id, restockAmount);
        setRestockForm(null);
        setRestockAmount('');
        alert('Nhập kho thành công!');
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="font-bold text-2xl">Quản Lý Tồn Kho</h1>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-bold text-lg mb-6 flex items-center gap-2"><Archive size={20} /> Vật tư & Bao bì</h2>
        <div className="space-y-4">
            {inventory.map(item => (
              <div key={item.id} className="flex justify-between items-center pb-4 border-b border-gray-50 last:border-0">
                <div>
                  <div className="font-bold">{item.name}</div>
                  <div className="text-xs text-gray-500">Mã: {item.id} | Loại: {item.type}</div>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <div className="font-bold text-xl">{item.quantity} {item.unit}</div>
                  {restockForm === item.id ? (
                    <form onSubmit={(e) => handleRestock(e, item.id)} className="flex items-center gap-2">
                      <input type="number" autoFocus value={restockAmount} onChange={(e) => setRestockAmount(e.target.value)} className="w-20 px-2 py-1 text-sm border border-blue-600 rounded-md outline-none" placeholder="+ SL" />
                      <button type="submit" className="bg-blue-600 text-white p-1 rounded hover:bg-blue-700"><Plus size={16}/></button>
                      <button type="button" onClick={() => setRestockForm(null)} className="text-gray-400 p-1 hover:text-red-500"><X size={16}/></button>
                    </form>
                  ) : (
                    <button onClick={() => setRestockForm(item.id)} className="text-xs text-blue-600 font-bold flex items-center bg-blue-50 px-2 py-1 rounded">
                      <Plus size={12} className="mr-1"/> Nhập thêm
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}