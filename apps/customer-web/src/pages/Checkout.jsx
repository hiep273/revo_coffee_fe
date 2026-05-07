import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useStore from '../store/useStore';
import { useAuthStore } from '../store/useAuthStore';
import { Info } from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const cart = useStore((state) => state.cart);
  const clearCart = useStore((state) => state.clearCart);
  const createOrder = useStore((state) => state.createOrder);
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  
  // Tổng tiền hàng
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  // Phí ship tuỳ ý (giả lập 30.000)
  const shippingFee = 30000;
  
  const [form, setForm] = useState({
    name: '', phone: '', address: '', note: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const handleOrder = async (e) => {
    e.preventDefault();
    
    const newOrder = {
      userId: user.id,
      userEmail: user.email,
      userName: user.name || user.fullName,
      shippingAddress: form.address,
      shippingPhone: form.phone,
      notes: form.note,
      paymentMethod,
      items: cart.map((item) => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
      })),
    };
    
    try {
      await createOrder(newOrder, token);
      clearCart();
      
      toast.success('Đặt hàng thành công! Đang chuyển đến trang Quản lý đơn hàng...');
      navigate('/orders');
    } catch (err) {
      toast.error('Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại sau.');
    }
  };

  if (cart.length === 0) {
    return <Navigate to="/shop" replace />;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname + location.search }}
        replace
      />
    );
  }

  return (
    <div className="bg-text-light min-h-screen py-12">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <h1 className="font-montserrat font-black text-4xl text-primary mb-10 text-center">THANH TOÁN</h1>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Form Thông tin */}
          <div className="w-full lg:w-3/5">
            <form onSubmit={handleOrder} id="checkout-form">
              <div className="bg-white rounded-[32px] p-8 shadow-sm mb-8">
                <h2 className="font-montserrat font-bold text-xl text-primary mb-6 border-b border-gray-100 pb-4">Thông tin giao hàng</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-nunito font-semibold text-primary/80">Họ và tên <span className="text-red-500">*</span></label>
                    <input required type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-pinky-gray/30 focus:bg-white focus:border-accent-1 outline-none transition-colors font-nunito" placeholder="Nhập họ và tên" 
                      onChange={e => setForm({...form, name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="font-nunito font-semibold text-primary/80">Số điện thoại <span className="text-red-500">*</span></label>
                    <input required type="tel" className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-pinky-gray/30 focus:bg-white focus:border-accent-1 outline-none transition-colors font-nunito" placeholder="Nhập SĐT"
                      onChange={e => setForm({...form, phone: e.target.value})} />
                  </div>
                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="font-nunito font-semibold text-primary/80">Địa chỉ cụ thể <span className="text-red-500">*</span></label>
                    <input required type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-pinky-gray/30 focus:bg-white focus:border-accent-1 outline-none transition-colors font-nunito" placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành"
                      onChange={e => setForm({...form, address: e.target.value})} />
                  </div>
                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="font-nunito font-semibold text-primary/80">Ghi chú đơn hàng (Tùy chọn)</label>
                    <textarea className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-pinky-gray/30 focus:bg-white focus:border-accent-1 outline-none transition-colors font-nunito min-h-[100px]" placeholder="Bạn có lưu ý gì về giờ nhận hàng không?"
                      onChange={e => setForm({...form, note: e.target.value})}></textarea>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[32px] p-8 shadow-sm">
                <h2 className="font-montserrat font-bold text-xl text-primary mb-6 border-b border-gray-100 pb-4">Phương thức thanh toán</h2>
                
                <div className="space-y-4">
                  <label className={`flex items-start gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-gray-100'}`}>
                    <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentMethod === 'cod' ? 'border-primary' : 'border-gray-300'}`}>
                      {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                    </div>
                    <input type="radio" name="payment" value="cod" className="hidden" onChange={() => setPaymentMethod('cod')} />
                    <div>
                      <h3 className="font-montserrat font-bold text-primary mb-1">Thanh toán khi nhận hàng (COD)</h3>
                      <p className="font-nunito text-primary/60 text-sm">Trả bằng tiền mặt hoặc chuyển khoản QR Code cho Shipper khi giao cà phê đến tay bạn.</p>
                    </div>
                  </label>

                  <label className={`flex items-start gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'vnpay' ? 'border-primary bg-primary/5' : 'border-gray-100'}`}>
                    <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentMethod === 'vnpay' ? 'border-primary' : 'border-gray-300'}`}>
                      {paymentMethod === 'vnpay' && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                    </div>
                    <input type="radio" name="payment" value="vnpay" className="hidden" onChange={() => setPaymentMethod('vnpay')} />
                    <div>
                      <h3 className="font-montserrat font-bold text-primary mb-1">Chuyển khoản trực tuyến / VNPAY</h3>
                      <p className="font-nunito text-primary/60 text-sm">Thanh toán qua ví điện tử VNPay hoặc ứng dụng ngân hàng chuẩn bảo mật.</p>
                    </div>
                  </label>
                </div>
              </div>
            </form>
          </div>

          {/* Đơn hàng (Summary) */}
          <div className="w-full lg:w-2/5">
            <div className="bg-pinky-gray/50 rounded-[32px] p-8 border border-gray-200/50 sticky top-24">
              <h2 className="font-montserrat font-bold text-xl text-primary mb-6 border-b border-gray-200 pb-4">Tóm tắt đơn hàng ({cart.length} SP)</h2>
              
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.grindType}`} className="flex gap-4">
                    <div className="w-16 h-16 bg-white rounded-xl p-1 shrink-0 relative">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                      <span className="absolute -top-2 -right-2 bg-primary text-white w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold font-nunito">{item.quantity}</span>
                    </div>
                    <div className="flex-1 font-nunito">
                      <h4 className="font-bold text-primary text-sm line-clamp-1">{item.name}</h4>
                      <p className="text-primary/60 text-xs mb-1">Xay: {item.grindType}</p>
                      <p className="font-bold text-accent-1 text-sm">{(item.price).toLocaleString('vi-VN')}đ</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Loyalty Code / Discount */}
              <div className="flex gap-2 mb-6 border-t border-b border-gray-200 py-6">
                <input type="text" placeholder="Mã giảm giá" className="flex-1 border border-gray-200 rounded-xl px-4 font-nunito outline-none focus:border-primary" />
                <button className="bg-primary hover:bg-accent-1 text-white font-nunito font-bold px-6 py-3 rounded-xl transition-colors">ÁP DỤNG</button>
              </div>

              <div className="space-y-4 mb-8 font-nunito text-primary/80">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span className="font-bold">{subtotal.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí giao hàng</span>
                  <span className="font-bold">{shippingFee.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-gray-200 items-center">
                  <span className="font-montserrat font-bold text-xl text-primary">TỔNG CỘNG</span>
                  <span className="font-montserrat font-black text-3xl text-red-custom">{(subtotal + shippingFee).toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              <button 
                type="submit" 
                form="checkout-form"
                className="w-full bg-primary text-white font-nunito font-bold py-4 rounded-full text-lg hover:bg-accent-1 transition-colors shadow-lg hover:translate-y-[-2px]"
              >
                ĐẶT HÀNG NGAY
              </button>
              <div className="flex items-center justify-center gap-2 mt-4 text-primary/50 font-nunito text-sm">
                <Info size={16} /> Chúng tôi cam kết bảo mật thông tin của bạn
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
