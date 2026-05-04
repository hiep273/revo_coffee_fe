import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import combo1 from '../assets/img/section4/combo1.png';
import combo2 from '../assets/img/section4/combo2.png';
import combo3 from '../assets/img/section4/combo3.png';
import useStore from '../store/useStore';
import { useAuthStore } from '../store/useAuthStore';

const combos = [
  { id: 1, name: 'COMBO 1', image: combo1, originalPrice: '145.000', discountPrice: '119.000' },
  { id: 2, name: 'COMBO 2', image: combo2, originalPrice: '175.000', discountPrice: '139.000' },
  { id: 3, name: 'COMBO 3', image: combo3, originalPrice: '210.000', discountPrice: '169.000' },
];

export default function Combos() {
  const navigate = useNavigate();
  const location = useLocation();
  const addToCart = useStore((state) => state.addToCart);
  const user = useAuthStore((state) => state.user);

  const handleAddCombo = (combo) => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để mua hàng.');
      navigate('/login', { state: { from: location.pathname + location.search } });
      return;
    }
    // Treat Combo as a specific product type, grind type is irrelevant or fixed.
    addToCart({
      id: `combo-${combo.id}`,
      name: combo.name,
      price: parseInt(combo.discountPrice.replace('.', '')),
      image: combo.image,
      grindType: 'Combo Gói'
    }, 1, 'Combo Gói');
    toast.success(`Đã thêm ${combo.name} vào giỏ hàng!`);
  };

  return (
    <section id="combos" className="py-24 bg-pinky-gray relative">
      {/* Decorative element background */}
      <div className="absolute left-0 bottom-0 w-64 h-64 bg-accent-1 opacity-10 rounded-tr-full mix-blend-multiply filter blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-6 lg:px-12 max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <p className="text-accent-1 font-nunito font-bold tracking-[0.2em] uppercase mb-4">Combo Tiết Kiệm</p>
          <h2 className="text-4xl md:text-5xl font-montserrat font-black text-primary">TẬN HƯỞNG TRỌN VẸN</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {combos.map((combo) => (
            <div key={combo.id} className="bg-white rounded-[40px] p-8 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-1 border border-transparent hover:border-accent-2">
              <div className="h-52 mb-8 flex justify-center items-center">
                <img src={combo.image} alt={combo.name} className="h-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="font-montserrat font-bold text-2xl text-primary mb-2 uppercase">{combo.name}</h3>
              <p className="font-nunito text-primary/60 text-sm mb-4 italic">Tiết kiệm hơn khi mua theo combo</p>
              <div className="flex items-end justify-center gap-4 mb-8">
                <span className="font-nunito text-primary/50 line-through text-xl font-medium mb-1">{combo.originalPrice}đ</span>
                <span className="font-montserrat font-black text-3xl text-red-custom">{combo.discountPrice}đ</span>
              </div>
              <button 
                onClick={() => handleAddCombo(combo)}
                className="w-full bg-white border-2 border-primary text-primary font-nunito font-bold py-3 rounded-full hover:bg-primary hover:text-white transition-colors uppercase tracking-wider"
              >
                THÊM VÀO GIỎ
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
