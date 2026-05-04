import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Edit2, Plus, RefreshCw, Trash2 } from 'lucide-react';

const API_BASE = 'http://localhost:8080';

const emptyProduct = {
  name: '',
  price: '',
  stock: 0,
  type: 'arabica',
  region: 'dalat',
  roast_level: 'medium',
  category_id: 1,
  description: '',
  image_url: '/images/product-001.png',
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/api/products`);
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : data.items || []);
    } catch {
      setError('Không tải được danh sách sản phẩm.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openCreate = () => setForm({ mode: 'create', values: emptyProduct });
  const openEdit = (product) => setForm({ mode: 'edit', values: { ...product } });

  const saveProduct = async (event) => {
    event.preventDefault();
    const values = form.values;
    const payload = {
      ...values,
      price: Number(values.price),
      stock: Number(values.stock || 0),
      category_id: Number(values.category_id || 1),
      roast_level: values.roast_level || values.roast || 'medium',
      image_url: values.image_url || values.image || '/images/product-001.png',
      is_active: true,
    };

    const url = form.mode === 'edit'
      ? `${API_BASE}/api/products/${values.id}`
      : `${API_BASE}/api/products`;

    const response = await fetch(url, {
      method: form.mode === 'edit' ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      toast.error(data.error || 'Lưu sản phẩm thất bại.');
      return;
    }

    setForm(null);
    await loadProducts();
  };

  const deleteProduct = async (product) => {
    if (!window.confirm(`Xóa sản phẩm "${product.name}" khỏi danh sách?`)) return;

    const response = await fetch(`${API_BASE}/api/products/${product.id}`, { method: 'DELETE' });
    if (!response.ok) {
      toast.error('Xóa sản phẩm thất bại.');
      return;
    }

    await loadProducts();
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-bold text-2xl">Danh Mục Sản Phẩm</h1>
        <div className="flex gap-3">
          <button onClick={loadProducts} className="bg-white border border-gray-200 px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50">
            <RefreshCw size={18} /> Tải lại
          </button>
          <button onClick={openCreate} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700">
            <Plus size={18} /> Thêm Sản Phẩm
          </button>
        </div>
      </div>

      {error && <div className="mb-4 text-red-600 font-bold">{error}</div>}

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
            {loading ? (
              <tr><td className="px-6 py-8 text-center text-gray-500" colSpan="5">Đang tải...</td></tr>
            ) : products.length === 0 ? (
              <tr><td className="px-6 py-8 text-center text-gray-500" colSpan="5">Chưa có sản phẩm.</td></tr>
            ) : products.map((prod) => (
              <tr key={prod.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-bold text-gray-500">{prod.id}</td>
                <td className="px-6 py-4 font-bold">{prod.name}</td>
                <td className="px-6 py-4 text-orange-500 font-bold">{Number(prod.price).toLocaleString('vi-VN')}đ</td>
                <td className="px-6 py-4 text-center font-bold">{prod.stock}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => openEdit(prod)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => deleteProduct(prod)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {form && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <form onSubmit={saveProduct} className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl grid grid-cols-2 gap-4">
            <h2 className="col-span-2 font-bold text-xl">{form.mode === 'edit' ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h2>
            <input required className="border rounded-xl px-3 py-2 col-span-2" placeholder="Tên sản phẩm" value={form.values.name} onChange={(e) => setForm({ ...form, values: { ...form.values, name: e.target.value } })} />
            <input required type="number" className="border rounded-xl px-3 py-2" placeholder="Giá" value={form.values.price} onChange={(e) => setForm({ ...form, values: { ...form.values, price: e.target.value } })} />
            <input type="number" className="border rounded-xl px-3 py-2" placeholder="Tồn kho" value={form.values.stock} onChange={(e) => setForm({ ...form, values: { ...form.values, stock: e.target.value } })} />
            <input className="border rounded-xl px-3 py-2" placeholder="Loại hạt" value={form.values.type || ''} onChange={(e) => setForm({ ...form, values: { ...form.values, type: e.target.value } })} />
            <input className="border rounded-xl px-3 py-2" placeholder="Vùng trồng" value={form.values.region || ''} onChange={(e) => setForm({ ...form, values: { ...form.values, region: e.target.value } })} />
            <select className="border rounded-xl px-3 py-2" value={form.values.roast_level || form.values.roast || 'medium'} onChange={(e) => setForm({ ...form, values: { ...form.values, roast_level: e.target.value } })}>
              <option value="light">Light</option>
              <option value="medium">Medium</option>
              <option value="medium-dark">Medium Dark</option>
              <option value="dark">Dark</option>
              <option value="mixed">Mixed</option>
              <option value="various">Various</option>
            </select>
            <input className="border rounded-xl px-3 py-2" placeholder="Image URL" value={form.values.image_url || form.values.image || ''} onChange={(e) => setForm({ ...form, values: { ...form.values, image_url: e.target.value } })} />
            <textarea className="border rounded-xl px-3 py-2 col-span-2" placeholder="Mô tả" value={form.values.description || form.values.desc || ''} onChange={(e) => setForm({ ...form, values: { ...form.values, description: e.target.value } })} />
            <div className="col-span-2 flex justify-end gap-3">
              <button type="button" onClick={() => setForm(null)} className="px-4 py-2 rounded-xl border font-bold">Hủy</button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold">Lưu</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
