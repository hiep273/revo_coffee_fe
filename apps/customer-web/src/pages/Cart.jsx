import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useStore from '../store/useStore';
import { useAuthStore } from '../store/useAuthStore';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';

export default function Cart() {
  const navigate = useNavigate();
  const cart = useStore((state) => state.cart);
  const user = useAuthStore((state) => state.user);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const updateQuantity = useStore((state) => state.updateQuantity);
  
  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  const translateGrind = (type) => {
    switch (type) {
      case 'whole': return 'Nguyên hạt';
      case 'phin': return 'Pha Phin';
      case 'espresso': return 'Pha Máy';
      case 'coldbrew': return 'Ủ Lạnh';
      case 'frenchpress': return 'Kiểu Pháp';
      default: return type;
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-text-light px-6">
        <h2 className="font-montserrat font-black text-3xl text-primary mb-4">GIỎ HÀNG CỦA BẠN ĐANG TRỐNG</h2>
        <p className="font-nunito text-primary/70 mb-8 max-w-md text-center">
          Hãy khám phá thêm các sản phẩm cà phê tuyệt hảo hoặc thử các gói subscription độc đáo của chúng tôi nhé.
        </p>
        <Link to="/shop" className="bg-primary text-white font-nunito font-bold py-4 rounded-full px-12 hover:bg-accent-1 transition-colors">
          ĐI ĐẾN CỬA HÀNG
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-pinky-gray min-h-screen py-12">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-primary font-nunito font-bold mb-8 hover:text-accent-1 transition-colors">
          <ArrowLeft size={20} /> Quay lại
        </button>

        <h1 className="font-montserrat font-black text-4xl text-primary mb-10">GIỎ HÀNG</h1>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Cart Items List */}
          <div className="w-full lg:w-2/3 bg-white rounded-3xl p-6 md:p-10 shadow-sm">
            <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-gray-100 font-montserrat font-bold text-sm text-primary/60 uppercase tracking-widest mb-6">
              <div className="col-span-6">Sản phẩm</div>
              <div className="col-span-2 text-center">Đơn giá</div>
              <div className="col-span-2 text-center">Số lượng</div>
              <div className="col-span-2 text-right">Tổng</div>
            </div>

            <div className="space-y-8">
              {cart.map((item) => (
                <div key={`${item.id}-${item.grindType}`} className="flex flex-col md:grid md:grid-cols-12 gap-4 items-center pb-8 border-b border-gray-50 last:border-0 last:pb-0">
                  
                  {/* Product Info */}
                  <div className="col-span-6 w-full flex items-center gap-6">
                    <div className="w-24 h-24 bg-pinky-gray rounded-2xl p-2 flex shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex flex-col flex-1">
                      <Link to={`/product/${item.id}`} className="font-montserrat font-bold text-xl text-primary hover:text-accent-1 mb-1 line-clamp-2">
                        {item.name}
                      </Link>
                      <span className="font-nunito text-primary/60 text-sm mb-2">
                        Kiểu xay: <strong className="text-primary">{translateGrind(item.grindType)}</strong>
                      </span>
                      <button 
                        onClick={() => removeFromCart(item.id, item.grindType)}
                        className="flex items-center gap-1 text-red-500 hover:text-red-600 font-nunito text-sm w-fit"
                      >
                        <Trash2 size={16} /> Bỏ phần này
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-2 w-full flex md:justify-center justify-between items-center mt-4 md:mt-0 font-montserrat font-bold text-primary/80">
                    <span className="md:hidden font-nunito text-sm text-primary/60">Đơn giá:</span>
                    {item.price.toLocaleString('vi-VN')}đ
                  </div>

                  {/* Quantity */}
                  <div className="col-span-2 w-full flex md:justify-center justify-between items-center font-montserrat">
                    <span className="md:hidden font-nunito text-sm text-primary/60">Số lượng:</span>
                    <div className="flex items-center border border-gray-200 rounded-full bg-white px-1 py-1">
                      <button 
                        onClick={() => updateQuantity(item.id, item.grindType, item.quantity - 1)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-primary/50 hover:bg-pinky-gray"
                      ><Minus size={14}/></button>
                      <span className="font-bold text-sm w-6 text-center">{item.quantity}</span>
                      <button 
                         onClick={() => updateQuantity(item.id, item.grindType, item.quantity + 1)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-primary/50 hover:bg-pinky-gray"
                      ><Plus size={14}/></button>
                    </div>
                  </div>

                  {/* Total per item */}
                  <div className="col-span-2 w-full flex md:justify-end justify-between items-center font-montserrat font-black text-accent-1 text-lg">
                    <span className="md:hidden font-nunito text-sm text-primary/60 font-bold">Thành tiền:</span>
                    {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Cart Summary Header */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <h2 className="font-montserrat font-bold text-xl text-primary mb-6 border-b border-gray-100 pb-4">Tổng cộng giỏ hàng</h2>
              
              <div className="space-y-4 mb-6 font-nunito">
                <div className="flex justify-between items-center text-primary/80">
                  <span>Tạm tính</span>
                  <span className="font-bold">{totalPrice.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between items-center text-primary/80 pb-4 border-b border-gray-100">
                  <span>Phí giao hàng</span>
                  <span className="italic text-sm text-primary/60">Tính ở bước thanh toán</span>
                </div>
                
                <div className="flex justify-between items-center pt-2">
                  <span className="font-montserrat font-bold text-lg text-primary">Tổng cộng</span>
                  <span className="font-montserrat font-black text-3xl text-red-custom">{totalPrice.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              <button 
                onClick={() => {
                  if (!user) {
                    toast.error('Vui lòng đăng nhập để thanh toán.');
                    navigate('/login', { state: { from: '/checkout' } });
                    return;
                  }
                  navigate('/checkout');
                }}
                className="w-full bg-primary text-white font-nunito font-bold py-4 rounded-full text-lg hover:bg-accent-1 transition-colors shadow-lg shadow-primary/20 uppercase tracking-wider block text-center"
              >
                Tiến hành thanh toán
              </button>
            </div>
            
            {/* Promo / Trust badges could go here */}
            <div className="mt-6 flex flex-col gap-4 bg-white/50 border border-white p-6 rounded-3xl text-sm font-nunito text-primary/70">
              <p>✓ Cà phê rang tươi mỗi ngày, giao hàng nhanh chóng.</p>
              <p>✓ Hỗ trợ đổi trả trong 7 ngày nếu không hài lòng vị.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
