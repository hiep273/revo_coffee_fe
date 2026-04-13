import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { products } from '../data/products';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const productId = Number(id);
  const product = products.find((item) => item.id === productId);

  const [quantity, setQuantity] = useState(1);
  const [grindType, setGrindType] = useState('whole'); // whole, phin, espresso, coldbrew, frenchpress
  
  const addToCart = useStore((state) => state.addToCart);

  const handleAddToCart = () => {
    addToCart(product, quantity, grindType);
    alert(`Đã thêm ${quantity} x ${product.name} (Kiểu xay: ${grindType}) vào giỏ hàng`);
  };

  const grindOptions = [
    { id: 'whole', label: 'Nguyên hạt (Whole Bean)' },
    { id: 'phin', label: 'Pha Phin (Vietnamese Filter)' },
    { id: 'espresso', label: 'Pha Máy (Espresso)' },
    { id: 'coldbrew', label: 'Ủ Lạnh (Cold Brew)' },
    { id: 'frenchpress', label: 'Kiểu Pháp (French Press)' },
  ];
  const regionLabels = {
    dalat: 'Đà Lạt',
    daklak: 'Đắk Lắk',
    gialai: 'Gia Lai',
  };

  if (!product) {
    return (
      <div className="bg-text-light min-h-screen py-12">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl text-center">
          <h1 className="font-montserrat font-black text-3xl text-primary mb-4">Không tìm thấy sản phẩm</h1>
          <p className="font-nunito text-primary/70 mb-8">Sản phẩm bạn đang tìm hiện không tồn tại hoặc đã bị gỡ.</p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-primary text-white font-nunito font-bold py-3 px-8 rounded-full hover:bg-accent-1 transition-colors"
          >
            Quay lại cửa hàng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-text-light min-h-screen py-12">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <button onClick={() => navigate('/shop')} className="text-primary font-nunito font-bold mb-8 hover:text-accent-1 flex items-center gap-2">
           ← Quay lại cửa hàng
        </button>

        <div className="bg-white rounded-[40px] p-8 lg:p-12 shadow-sm flex flex-col lg:flex-row gap-12">
          {/* Product Image Gallery */}
          <div className="w-full lg:w-1/2 flex items-center justify-center bg-pinky-gray rounded-3xl p-8 relative">
             <div className="absolute inset-0 bg-accent-1/5 opacity-50 rounded-3xl"></div>
             <img src={product.image} alt={product.name} className="max-h-[500px] object-contain drop-shadow-2xl relative z-10" />
          </div>

          {/* Product Details Form */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <h1 className="font-montserrat font-black text-4xl lg:text-5xl text-primary mb-2 line-clamp-1">{product.name}</h1>
            <p className="font-nunito text-primary/70 mb-6 text-lg">{product.desc}</p>
            <div className="font-montserrat font-black text-3xl text-accent-1 mb-8">{product.price.toLocaleString('vi-VN')}đ</div>

            {/* Spec Table */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-8 font-nunito text-sm border-t border-b border-gray-100 py-6">
              <div><span className="text-primary/60 block mb-1">Giống cà phê</span><span className="font-bold text-primary">{product.type.replace('-', ' ')}</span></div>
              <div><span className="text-primary/60 block mb-1">Vùng trồng</span><span className="font-bold text-primary">{regionLabels[product.region] || product.region}</span></div>
              <div><span className="text-primary/60 block mb-1">Phương pháp sơ chế</span><span className="font-bold text-primary">{product.process}</span></div>
              <div><span className="text-primary/60 block mb-1">Mức độ rang</span><span className="font-bold text-primary">{product.roast}</span></div>
              <div className="col-span-2"><span className="text-primary/60 block mb-1">Hương vị (Flavor Notes)</span><span className="font-bold text-primary">{product.flavorNotes}</span></div>
            </div>

            {/* Grind Type Selection - Mức ưu tiên thiết kế trải nghiệm */}
            <div className="mb-8">
              <h3 className="font-montserrat font-bold text-primary mb-4 uppercase">Chọn kiểu xay</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {grindOptions.map((option) => (
                  <button 
                    key={option.id}
                    onClick={() => setGrindType(option.id)}
                    className={`border-2 py-3 px-4 rounded-xl font-nunito font-semibold text-sm transition-all text-left ${
                      grindType === option.id 
                        ? 'border-primary bg-primary text-white shadow-md' 
                        : 'border-gray-200 text-primary/70 hover:border-primary/50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              {/* Quantity Input */}
              <div className="flex items-center border border-gray-200 rounded-full h-14 bg-white px-2 w-full sm:w-32 justify-between">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-primary/50 hover:bg-pinky-gray font-bold text-xl"
                >-</button>
                <span className="font-montserrat font-bold text-lg w-8 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-primary/50 hover:bg-pinky-gray font-bold text-xl"
                >+</button>
              </div>

              {/* Add to Cart */}
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-primary text-white font-nunito font-bold text-lg h-14 rounded-full hover:bg-accent-1 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 uppercase tracking-wider"
              >
                Thêm vào giỏ hàng
              </button>
            </div>
            
            {/* Link to Subscription */}
            <div className="mt-6 text-center">
              <button onClick={() => navigate('/subscription')} className="text-accent-1 font-nunito font-bold hover:underline">
                Hoặc đăng ký gói giao định kỳ (Tiết kiệm 15%)
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
