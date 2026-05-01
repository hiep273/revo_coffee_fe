import React, { useEffect, useState } from 'react';
import { History, Plus, RefreshCw, Trash2 } from 'lucide-react';

const API_BASE = 'http://localhost:8080';

export default function Batches() {
  const [batches, setBatches] = useState([]);
  const [products, setProducts] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    productId: '',
    quantity: 100,
    roastDate: new Date().toISOString().slice(0, 10),
    roastLevel: 'Medium',
    status: 'roasting',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [batchRes, productRes] = await Promise.all([
        fetch(`${API_BASE}/api/batches`),
        fetch(`${API_BASE}/api/products`),
      ]);
      const batchData = await batchRes.json();
      const productData = await productRes.json();
      setBatches(Array.isArray(batchData) ? batchData : batchData.items || []);
      const productItems = Array.isArray(productData) ? productData : productData.items || [];
      setProducts(productItems);
      if (!form.productId && productItems[0]) {
        setForm((current) => ({ ...current, productId: productItems[0].id }));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createBatch = async (event) => {
    event.preventDefault();
    const product = products.find((item) => item.id === form.productId);
    const payload = {
      batchCode: `BT-${Date.now()}`,
      productId: form.productId,
      productName: product?.name || form.productId,
      quantity: Number(form.quantity),
      roastDate: form.roastDate,
      roastLevel: form.roastLevel,
      originRegion: product?.region || '',
      processMethod: product?.processing_method || product?.process || '',
      status: form.status,
      createdBy: 'Admin',
    };

    const response = await fetch(`${API_BASE}/api/batches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      alert('Tạo lô rang thất bại.');
      return;
    }

    setFormOpen(false);
    await loadData();
  };

  const updateStatus = async (batch, status) => {
    const response = await fetch(`${API_BASE}/api/batches/${batch.id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      alert('Cập nhật trạng thái thất bại.');
      return;
    }

    await loadData();
  };

  const deleteBatch = async (batch) => {
    if (!window.confirm(`Xóa lô ${batch.batchCode}?`)) return;
    const response = await fetch(`${API_BASE}/api/batches/${batch.id}`, { method: 'DELETE' });
    if (!response.ok) {
      alert('Xóa lô rang thất bại.');
      return;
    }
    await loadData();
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-bold text-2xl">Quản Lý Lô Rang</h1>
          <p className="text-gray-500 text-sm mt-1">Theo dõi lịch sử các mẻ rang.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={loadData} className="bg-white border border-gray-200 px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50">
            <RefreshCw size={18} /> Tải lại
          </button>
          <button onClick={() => setFormOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700">
            <Plus size={18} /> Ghi Lô Mới
          </button>
        </div>
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
                <th className="px-4 py-4 text-center">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td className="px-4 py-8 text-center text-gray-500" colSpan="7">Đang tải...</td></tr>
              ) : batches.length === 0 ? (
                <tr><td className="px-4 py-8 text-center text-gray-500" colSpan="7">Chưa có lô rang.</td></tr>
              ) : batches.map((batch) => (
                <tr key={batch.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 font-bold">{batch.batchCode}</td>
                  <td className="px-4 py-4">{batch.roastDate}</td>
                  <td className="px-4 py-4 font-bold">{batch.productName}</td>
                  <td className="px-4 py-4 text-center"><span className="bg-gray-200 px-2 py-1 rounded">{batch.roastLevel}</span></td>
                  <td className="px-4 py-4 text-right font-bold text-orange-500">{batch.quantity} kg</td>
                  <td className="px-4 py-4 text-center">
                    <select value={batch.status} onChange={(event) => updateStatus(batch, event.target.value)} className="bg-green-50 text-green-700 px-2 py-1 rounded-full outline-none">
                      <option value="roasting">roasting</option>
                      <option value="cooling">cooling</option>
                      <option value="quality_check">quality_check</option>
                      <option value="packaging">packaging</option>
                      <option value="completed">completed</option>
                      <option value="rejected">rejected</option>
                    </select>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button onClick={() => deleteBatch(batch)} className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {formOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <form onSubmit={createBatch} className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-xl grid grid-cols-2 gap-4">
            <h2 className="col-span-2 font-bold text-xl">Ghi lô rang mới</h2>
            <select className="border rounded-xl px-3 py-2 col-span-2" value={form.productId} onChange={(event) => setForm({ ...form, productId: event.target.value })}>
              {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
            </select>
            <input required type="number" className="border rounded-xl px-3 py-2" value={form.quantity} onChange={(event) => setForm({ ...form, quantity: event.target.value })} placeholder="Khối lượng kg" />
            <input required type="date" className="border rounded-xl px-3 py-2" value={form.roastDate} onChange={(event) => setForm({ ...form, roastDate: event.target.value })} />
            <input className="border rounded-xl px-3 py-2" value={form.roastLevel} onChange={(event) => setForm({ ...form, roastLevel: event.target.value })} placeholder="Mức rang" />
            <select className="border rounded-xl px-3 py-2" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
              <option value="roasting">roasting</option>
              <option value="cooling">cooling</option>
              <option value="quality_check">quality_check</option>
              <option value="packaging">packaging</option>
              <option value="completed">completed</option>
              <option value="rejected">rejected</option>
            </select>
            <div className="col-span-2 flex justify-end gap-3">
              <button type="button" onClick={() => setFormOpen(false)} className="px-4 py-2 rounded-xl border font-bold">Hủy</button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold">Lưu</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
