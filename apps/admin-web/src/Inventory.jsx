import React, { useEffect, useState } from 'react';
import { Archive, Plus, RefreshCw, X } from 'lucide-react';

const API_BASE = 'http://localhost:8080';

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [restockForm, setRestockForm] = useState(null);
  const [restockAmount, setRestockAmount] = useState('');
  const [loading, setLoading] = useState(true);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/inventory`);
      const data = await response.json();
      setInventory(Array.isArray(data) ? data : data.items || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleRestock = async (event, item) => {
    event.preventDefault();
    const amount = Number(restockAmount);
    if (!amount || amount <= 0) return;
    if (!window.confirm(`Xác nhận nhập thêm ${amount} cho ${item.productName}?`)) return;

    const response = await fetch(`${API_BASE}/api/inventory/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...item,
        quantityAvailable: Number(item.quantityAvailable || 0) + amount,
      }),
    });

    if (!response.ok) {
      alert('Nhập kho thất bại.');
      return;
    }

    setRestockForm(null);
    setRestockAmount('');
    await loadInventory();
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-bold text-2xl">Quản Lý Tồn Kho</h1>
        <button onClick={loadInventory} className="bg-white border border-gray-200 px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50">
          <RefreshCw size={18} /> Tải lại
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-bold text-lg mb-6 flex items-center gap-2"><Archive size={20} /> Hàng hóa trong kho</h2>
        <div className="space-y-4">
          {loading ? (
            <div className="text-gray-500">Đang tải...</div>
          ) : inventory.length === 0 ? (
            <div className="text-gray-500">Chưa có dữ liệu tồn kho.</div>
          ) : inventory.map((item) => (
            <div key={item.id} className="flex justify-between items-center pb-4 border-b border-gray-50 last:border-0">
              <div>
                <div className="font-bold">{item.productName}</div>
                <div className="text-xs text-gray-500">Mã: {item.productId} | Vị trí: {item.warehouseLocation || '-'}</div>
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                <div className="font-bold text-xl">
                  {item.quantityAvailable} khả dụng
                  <span className="text-sm text-gray-500 ml-2">({item.quantityReserved} giữ chỗ)</span>
                </div>
                {restockForm === item.id ? (
                  <form onSubmit={(event) => handleRestock(event, item)} className="flex items-center gap-2">
                    <input type="number" autoFocus value={restockAmount} onChange={(event) => setRestockAmount(event.target.value)} className="w-20 px-2 py-1 text-sm border border-blue-600 rounded-md outline-none" placeholder="+ SL" />
                    <button type="submit" className="bg-blue-600 text-white p-1 rounded hover:bg-blue-700"><Plus size={16} /></button>
                    <button type="button" onClick={() => setRestockForm(null)} className="text-gray-400 p-1 hover:text-red-500"><X size={16} /></button>
                  </form>
                ) : (
                  <button onClick={() => setRestockForm(item.id)} className="text-xs text-blue-600 font-bold flex items-center bg-blue-50 px-2 py-1 rounded">
                    <Plus size={12} className="mr-1" /> Nhập thêm
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
