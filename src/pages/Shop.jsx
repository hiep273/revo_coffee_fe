import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Giả lập dữ liệu sản phẩm mới theo yêu cầu kiến trúc e-commerce
import image1 from '../assets/img/section2/image1.png';
import image2 from '../assets/img/section2/image2.png';
import image3 from '../assets/img/section2/image3.png';
import image4 from '../assets/img/section2/image4.png';
import image5 from '../assets/img/section2/image5.png';

const allProducts = [
  { id: 1, name: 'REVO Morning', price: 99000, image: image1, type: 'arabica', region: 'dalat', process: 'washed', roast: 'light' },
  { id: 2, name: 'REVO Everyday', price: 139000, image: image2, type: 'blend', region: 'daklak', process: 'honey', roast: 'medium' },
  { id: 3, name: 'REVO Origin', price: 149000, image: image3, type: 'robusta', region: 'daklak', process: 'natural', roast: 'dark' },
  { id: 4, name: 'REVO Đậm Đà', price: 129000, image: image4, type: 'fine-robusta', region: 'gialai', process: 'honey', roast: 'dark' },
  { id: 5, name: 'REVO Robusta', price: 109000, image: image5, type: 'robusta', region: 'daklak', process: 'natural', roast: 'dark' },
];

export default function Shop() {
  const [filterType, setFilterType] = useState('all');
  
  const filteredProducts = filterType === 'all' 
    ? allProducts 
    : allProducts.filter(p => p.type === filterType);

  return (
    <div className="bg-pinky-gray min-h-screen py-12">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Filter */}
          <div className="w-full md:w-1/4 bg-white p-6 rounded-3xl shadow-sm h-fit">
            <h2 className="font-montserrat font-bold text-xl text-primary mb-6 uppercase border-b border-gray-100 pb-4">Bộ Lọc</h2>
            
            <div className="mb-6">
              <h3 className="font-montserrat font-bold text-primary mb-3">Giống cà phê</h3>
              <div className="space-y-2 font-nunito text-primary/80">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="type" checked={filterType === 'all'} onChange={() => setFilterType('all')} className="accent-accent-1" />
                  <span>Tất cả</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="type" checked={filterType === 'arabica'} onChange={() => setFilterType('arabica')} className="accent-accent-1" />
                  <span>Arabica</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="type" checked={filterType === 'robusta'} onChange={() => setFilterType('robusta')} className="accent-accent-1" />
                  <span>Robusta</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="type" checked={filterType === 'fine-robusta'} onChange={() => setFilterType('fine-robusta')} className="accent-accent-1" />
                  <span>Fine Robusta</span>
                </label>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-montserrat font-bold text-primary mb-3">Vùng trồng</h3>
              <div className="space-y-2 font-nunito text-primary/80">
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="accent-accent-1 rounded" /> Đà Lạt</label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="accent-accent-1 rounded" /> Đắk Lắk</label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="accent-accent-1 rounded" /> Cầu Đất</label>
              </div>
            </div>

            <button className="w-full bg-primary text-white font-nunito font-bold py-2 rounded-full hover:bg-accent-1 transition-colors">
              ÁP DỤNG LỌC
            </button>
          </div>

          {/* Product Grid */}
          <div className="w-full md:w-3/4">
            <div className="flex justify-between items-center mb-8">
              <h1 className="font-montserrat font-black text-3xl text-primary">CỬA HÀNG</h1>
              <span className="font-nunito text-primary/70">Hiển thị {filteredProducts.length} sản phẩm</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white rounded-3xl p-6 flex flex-col hover:shadow-lg transition-all group">
                  <div className="flex justify-center mb-4 h-48 relative overflow-hidden">
                    <img src={product.image} alt={product.name} className="h-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="mt-auto">
                    <span className="text-xs font-nunito tracking-widest text-accent-1 uppercase font-bold mb-1 block">{product.type.replace('-', ' ')}</span>
                    <h3 className="font-montserrat font-bold text-xl text-primary mb-2 line-clamp-1">{product.name}</h3>
                    <div className="flex items-center justify-between mt-4">
                      <span className="font-montserrat font-bold text-lg text-primary">{product.price.toLocaleString('vi-VN')}đ</span>
                      <Link to={`/product/${product.id}`} className="bg-primary text-white px-4 py-2 rounded-full text-sm font-nunito font-bold hover:bg-accent-1 transition-colors">
                        XEM CHI TIẾT
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="font-nunito text-xl text-primary/60">Không tìm thấy sản phẩm phù hợp.</p>
              </div>
            )}
            
          </div>

        </div>
      </div>
    </div>
  );
}
