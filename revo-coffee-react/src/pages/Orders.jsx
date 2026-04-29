import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useStore from '../store/useStore';
import { FileText, Truck, MapPin, Package, RefreshCw } from 'lucide-react';

export default function Orders() {
  const orders = useStore((state) => state.orders);
  const updateOrderStatus = useStore((state) => state.updateOrderStatus);
  
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'Tất cả' },
    { id: 'unpaid', label: 'Chờ thanh toán' },
    { id: 'processing', label: 'Đang xử lý' },
    { id: 'shipping', label: 'Đang giao' },
    { id: 'completed', label: 'Hoàn thành' },
    { id: 'cancelled', label: 'Đã hủy' }
  ];

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(o => o.status === activeTab);

  const translateStatus = (status) => {
    const statusMap = {
      'unpaid': { text: 'CHỜ THANH TOÁN', color: 'text-orange-500' },
      'processing': { text: 'ĐANG XỬ LÝ', color: 'text-blue-500' },
      'shipping': { text: 'ĐANG GIAO HÀNG', color: 'text-indigo-500' },
      'completed': { text: 'HOÀN THÀNH', color: 'text-green-500' },
      'cancelled': { text: 'ĐÃ HỦY', color: 'text-red-500' },
    };
    return statusMap[status] || { text: status, color: 'text-gray-500' };
  };

  const handleSimulatePayment = (orderId) => {
    // Giả lập thanh toán thành công
    updateOrderStatus(orderId, 'processing');
  };

  const handleCancelOrder = (orderId) => {
    // Hủy đơn
    if(window.confirm('Bạn có chắc chắn muốn huỷ đơn hàng này?')) {
      updateOrderStatus(orderId, 'cancelled');
    }
  };

  return (
    <div className="bg-pinky-gray/30 min-h-screen py-10">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        
        {/* Profile Sidebar & Main Content Layout */}
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Main Order Content */}
          <div className="w-full">
            <h1 className="font-montserrat font-black text-3xl text-primary mb-6">ĐƠN HÀNG CỦA TÔI</h1>
            
            {/* Tabs Navigation (Shopee Style) */}
            <div className="bg-white rounded-t-2xl flex overflow-x-auto border-b border-gray-100 shadow-sm sticky top-0 z-10 custom-scrollbar">
               {tabs.map((tab) => (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={`flex-1 min-w-[120px] py-4 text-center font-nunito font-bold text-sm transition-all border-b-2 ${
                     activeTab === tab.id 
                       ? 'text-accent-1 border-accent-1 bg-accent-1/5' 
                       : 'text-primary/60 border-transparent hover:text-primary'
                   }`}
                 >
                   {tab.label}
                 </button>
               ))}
            </div>

            {/* Orders List */}
            <div className="flex flex-col gap-4 mt-4">
               {filteredOrders.length === 0 ? (
                 <div className="bg-white rounded-b-2xl p-16 flex flex-col items-center justify-center text-center shadow-sm h-64">
                   <FileText size={48} className="text-gray-300 mb-4" />
                   <h3 className="font-montserrat font-bold text-xl text-primary/80 mb-2">Chưa có đơn hàng</h3>
                   <Link to="/shop" className="text-accent-1 font-nunito font-bold hover:underline">Hãy tiếp tục mua sắm nhé!</Link>
                 </div>
               ) : (
                 filteredOrders.map((order) => (
                   <div key={order.id} className="bg-white rounded-2xl shadow-sm p-6 animate-fade-in group">
                     {/* Order Header / Status */}
                     <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
                       <div className="font-nunito text-sm">
                         <span className="font-bold text-primary mr-2">Mã Đơn: {order.id}</span>
                         <span className="text-gray-400 hidden sm:inline-block">| {new Date(order.date).toLocaleDateString('vi-VN', { hour: '2-digit', minute:'2-digit' })}</span>
                       </div>
                       <div className={`font-montserrat font-bold text-sm tracking-widest flex items-center gap-2 ${translateStatus(order.status).color}`}>
                         {order.status === 'shipping' && <Truck size={16} />} 
                         {translateStatus(order.status).text}
                       </div>
                     </div>

                     {/* Order Items */}
                     <div className="space-y-4 cursor-pointer">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex gap-4">
                             <div className="w-20 h-20 bg-pinky-gray rounded-xl p-2 shrink-0 border border-gray-100">
                               <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                             </div>
                             <div className="flex-1 flex flex-col sm:flex-row sm:justify-between font-nunito">
                               <div>
                                 <h4 className="font-bold text-primary text-base line-clamp-1">{item.name}</h4>
                                 <span className="text-primary/60 text-sm block">Phân loại hàng: {item.grindType}</span>
                                 <span className="text-primary font-bold text-sm mt-1 sm:hidden block mt-2">x{item.quantity}</span>
                               </div>
                               <div className="text-right hidden sm:block">
                                 <div className="text-primary/80">x{item.quantity}</div>
                                 <div className="font-bold text-primary mt-1">{(item.price).toLocaleString('vi-VN')}₫</div>
                               </div>
                             </div>
                          </div>
                        ))}
                     </div>

                     {/* Order Footer / Total / Action Buttons */}
                     <div className="border-t border-gray-100 mt-6 pt-4 flex flex-col md:flex-row justify-between items-end gap-4">
                        <div className="text-sm font-nunito text-primary/60 self-start md:self-auto flex items-center gap-2 bg-pinky-gray px-3 py-1.5 rounded-lg">
                          <Package size={14} /> Giao hàng tận nơi
                        </div>
                        
                        <div className="flex flex-col items-end w-full md:w-auto">
                          <div className="font-nunito text-primary flex items-center gap-3 mb-4">
                            <span className="text-sm">Thành tiền:</span>
                            <span className="font-montserrat font-bold text-2xl text-accent-1">{(order.total || order.totalPrice || 0).toLocaleString('vi-VN')}₫</span>
                          </div>
                          
                          <div className="flex gap-3 w-full md:w-auto">
                            {order.status === 'unpaid' && (
                              <>
                                <button onClick={() => handleCancelOrder(order.id)} className="flex-1 md:flex-none py-2 px-6 rounded-lg font-nunito font-bold text-gray-500 hover:bg-gray-100 transition-colors border border-gray-200">
                                  Hủy Đơn Hàng
                                </button>
                                <button onClick={() => handleSimulatePayment(order.id)} className="flex-1 md:flex-none bg-accent-1 hover:bg-opacity-90 text-white py-2 px-10 rounded-lg font-nunito font-bold transition-colors shadow-md">
                                  Thanh Toán VNPAY
                                </button>
                              </>
                            )}
                            
                            {(order.status === 'processing' || order.status === 'shipping') && (
                              <button disabled className="py-2 px-6 rounded-lg font-nunito font-bold text-gray-400 bg-gray-50 border border-gray-200 cursor-not-allowed">
                                Đang Chuẩn Bị
                              </button>
                            )}

                            {(order.status === 'completed' || order.status === 'cancelled') && (
                              <Link to="/shop" className="py-2 px-6 rounded-lg font-nunito font-bold text-accent-1 border border-accent-1 hover:bg-accent-1 hover:text-white transition-colors">
                                Mua Lại Món Này
                              </Link>
                            )}
                          </div>
                        </div>
                     </div>
                   </div>
                 ))
               )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
