import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import image1 from '../assets/img/section2/image1.png';
import image3 from '../assets/img/section2/image3.png';
import { Coffee, CalendarSync, CreditCard, ChevronRight, Check } from 'lucide-react';

const products = [
  { id: 1, name: 'REVO Morning (Arabica Blend)', price: 99000, image: image1 },
  { id: 3, name: 'REVO Origin (100% Robusta)', price: 149000, image: image3 },
];

export default function Subscription() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Product, 2: Grind & Qty, 3: Frequency
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [grindType, setGrindType] = useState('whole');
  const [weight, setWeight] = useState(250); // in grams
  const [frequency, setFrequency] = useState('2weeks'); // 1week, 2weeks, 1month

  const createOrder = useStore(state => state.createOrder);

  const handleSubscribe = () => {
    // Generate a fixed price or calculate based on weight for the subscription
    const totalPrice = (selectedProduct.price * (weight / 250)) * (frequency === '1week' ? 0.85 : frequency === '2weeks' ? 0.9 : 0.95);
    
    createOrder({
      fullName: 'Subscription Customer', 
      phone: '09xxxxxx', 
      address: 'Đăng ký nhận định kỳ', 
      paymentMethod: 'COD',
      items: [
        {
          id: `subs-${selectedProduct.id}-${Date.now()}`,
          name: `${selectedProduct.name} - Gói Định Kỳ ${frequency}`,
          price: parseInt(totalPrice),
          quantity: 1,
          image: selectedProduct.image,
          grindType: `${grindType.toUpperCase()} - ${weight}g/lần`
        }
      ],
      totalLength: 1,
      total: parseInt(totalPrice)
    });
    
    alert(`Đã đăng ký thành công gói giao cà phê định kỳ: ${selectedProduct.name} (${weight}g). Đơn hàng đã được lưu báo cáo!`);
    navigate('/orders');
  };

  return (
    <div className="bg-pinky-gray min-h-screen py-12">
      <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
        <div className="text-center mb-12">
          <p className="text-accent-1 font-nunito font-bold tracking-[0.2em] uppercase mb-4">Dịch vụ giao cà phê định kỳ</p>
          <h1 className="font-montserrat font-black text-4xl text-primary">REVO SUBSCRIPTION</h1>
          <p className="font-nunito text-primary/70 mt-4 max-w-2xl mx-auto">Tận hưởng cà phê tươi mới được rang xay và giao đến tận cửa nhà bạn theo lịch trình tuỳ chỉnh. Trải nghiệm tiện lợi đích thực.</p>
        </div>

        {/* Progress Bar */}
        <div className="flex justify-between items-center mb-12 px-0 md:px-20 relative">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-200 -z-10 -translate-y-1/2"></div>
          <div className={`absolute top-1/2 left-0 h-[2px] bg-primary -z-10 -translate-y-1/2 transition-all duration-500`} style={{ width: step === 1 ? '16%' : step === 2 ? '50%' : '83%' }}></div>

          <div className="flex flex-col items-center cursor-pointer" onClick={() => setStep(1)}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-montserrat font-bold text-lg mb-2 transition-colors ${step >= 1 ? 'bg-primary text-white shadow-lg' : 'bg-white border-2 border-gray-200 text-gray-400'}`}>1</div>
            <span className={`font-nunito text-sm font-bold ${step >= 1 ? 'text-primary' : 'text-gray-400'}`}>Chọn Cà phê</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer" onClick={() => selectedProduct && setStep(2)}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-montserrat font-bold text-lg mb-2 transition-colors ${step >= 2 ? 'bg-primary text-white shadow-lg' : 'bg-white border-2 border-gray-200 text-gray-400'}`}>2</div>
            <span className={`font-nunito text-sm font-bold ${step >= 2 ? 'text-primary' : 'text-gray-400'}`}>Định lượng</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer" onClick={() => selectedProduct && step >= 2 && setStep(3)}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-montserrat font-bold text-lg mb-2 transition-colors ${step >= 3 ? 'bg-primary text-white shadow-lg' : 'bg-white border-2 border-gray-200 text-gray-400'}`}>3</div>
            <span className={`font-nunito text-sm font-bold ${step >= 3 ? 'text-primary' : 'text-gray-400'}`}>Chu kỳ Giao</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-[40px] p-8 lg:p-12 shadow-sm min-h-[400px]">
          
          {/* Step 1: Chọn Cà phê */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="font-montserrat font-bold text-2xl text-primary mb-8 text-center"><Coffee className="inline mr-2" /> Bạn muốn uống loại cà phê nào?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {products.map(p => (
                  <div 
                    key={p.id} 
                    onClick={() => setSelectedProduct(p)}
                    className={`border-2 rounded-3xl p-6 cursor-pointer hover:shadow-lg transition-all flex flex-col items-center group relative overflow-hidden ${selectedProduct?.id === p.id ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-primary/30'}`}
                  >
                    {selectedProduct?.id === p.id && <div className="absolute top-4 right-4 bg-primary text-white rounded-full p-1"><Check size={16}/></div>}
                    <div className="h-32 mb-4">
                       <img src={p.image} alt={p.name} className={`h-full object-contain filter drop-shadow-md transition-transform duration-500 ${selectedProduct?.id === p.id ? 'scale-110' : 'group-hover:scale-105'}`} />
                    </div>
                    <h3 className="font-montserrat font-bold text-lg text-primary text-center line-clamp-2">{p.name}</h3>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-12">
                <button 
                  onClick={() => setStep(2)}
                  disabled={!selectedProduct}
                  className="bg-primary text-white font-nunito font-bold py-3 px-12 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-1 transition-colors flex items-center gap-2"
                >
                  Tiếp theo <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Định lượng & Kiểu xay */}
          {step === 2 && (
            <div className="animate-fade-in max-w-3xl mx-auto">
              <h2 className="font-montserrat font-bold text-2xl text-primary mb-8 text-center">Tùy chỉnh thông số</h2>
              
              <div className="mb-10">
                <h3 className="font-nunito font-bold text-primary mb-4">Trọng lượng mỗi lần giao</h3>
                <div className="flex gap-4">
                  {[250, 500, 1000].map(w => (
                     <button 
                       key={w}
                       onClick={() => setWeight(w)}
                       className={`flex-1 py-4 border-2 rounded-2xl font-montserrat font-bold transition-all ${weight === w ? 'border-primary bg-primary text-white shadow-md' : 'border-gray-200 text-primary/70 hover:border-primary/50'}`}
                     >
                       {w >= 1000 ? `${w/1000}kg` : `${w}g`}
                     </button>
                  ))}
                </div>
              </div>

              <div className="mb-10">
                <h3 className="font-nunito font-bold text-primary mb-4">Kiểu xay</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[{id: 'whole', l: 'Nguyên hạt'}, {id: 'phin', l: 'Pha Phin'}, {id: 'espresso', l: 'Machine (Espresso)'}, {id: 'coldbrew', l: 'Cold Brew'}].map(o => (
                     <button 
                       key={o.id}
                       onClick={() => setGrindType(o.id)}
                       className={`py-3 px-4 border-2 rounded-xl font-nunito font-semibold text-sm transition-all ${grindType === o.id ? 'border-primary bg-primary text-white shadow-md' : 'border-gray-200 text-primary/70 hover:border-primary/50'}`}
                     >
                       {o.l}
                     </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between mt-12">
                <button onClick={() => setStep(1)} className="text-primary font-nunito font-bold hover:text-accent-1 px-4">Quay lại</button>
                <button 
                  onClick={() => setStep(3)}
                  className="bg-primary text-white font-nunito font-bold py-3 px-12 rounded-full hover:bg-accent-1 transition-colors flex items-center gap-2"
                >
                  Tiếp theo <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Chu kỳ giao */}
          {step === 3 && (
            <div className="animate-fade-in max-w-3xl mx-auto">
              <h2 className="font-montserrat font-bold text-2xl text-primary mb-8 text-center"><CalendarSync className="inline mr-2" /> Bạn muốn nhận cà phê bao lâu một lần?</h2>
              
              <div className="flex flex-col gap-4 mb-10">
                {[
                  {id: '1week', title: '1 TUẦN / LẦN', desc: 'Lựa chọn phổ biến nhất. Đảm bảo cà phê luôn tươi mới nhất.', discount: 'Giảm 15%'},
                  {id: '2weeks', title: '2 TUẦN / LẦN', desc: 'Phù hợp cho người uống 1-2 ly mỗi ngày.', discount: 'Giảm 10%'},
                  {id: '1month', title: '1 THÁNG / LẦN', desc: 'Cung cấp đủ cho cả tháng của bạn.', discount: 'Giảm 5%'}
                ].map((f) => (
                  <div 
                    key={f.id}
                    onClick={() => setFrequency(f.id)}
                     className={`flex items-center justify-between p-6 border-2 rounded-2xl cursor-pointer transition-all ${frequency === f.id ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-primary/30'}`}
                  >
                    <div>
                      <h4 className="font-montserrat font-bold text-lg text-primary line-clamp-1 flex items-center gap-4">
                        {f.title} <span className="bg-red-custom text-white text-xs px-2 py-0.5 rounded-full whitespace-nowrap">{f.discount}</span>
                      </h4>
                      <p className="font-nunito text-primary/70 text-sm">{f.desc}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${frequency === f.id ? 'border-primary' : 'border-gray-300'}`}>
                       {frequency === f.id && <div className="w-3 h-3 bg-primary rounded-full"></div>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Setup */}
              <div className="bg-pinky-gray p-6 rounded-2xl mb-8 font-nunito border border-gray-200">
                <h4 className="font-bold text-primary mb-4 border-b border-gray-300 pb-2">Tóm tắt Gói Đăng Ký</h4>
                <div className="flex justify-between mb-2"><span>Sản phẩm:</span> <span className="font-bold text-primary">{selectedProduct?.name}</span></div>
                <div className="flex justify-between mb-2"><span>Thể thức:</span> <span className="font-bold text-primary">{weight >= 1000 ? `${weight/1000}kg` : `${weight}g`} - Khối lượng ({grindType})</span></div>
                <div className="flex justify-between"><span>Chu kỳ:</span> <span className="font-bold text-primary">{frequency === '1week' ? 'Mỗi 1 tuần' : frequency === '2weeks' ? 'Mỗi 2 tuần' : 'Mỗi 1 tháng'}</span></div>
              </div>

              <div className="flex justify-between mt-12 items-center">
                <button onClick={() => setStep(2)} className="text-primary font-nunito font-bold hover:text-accent-1 px-4">Quay lại</button>
                <button 
                  onClick={handleSubscribe}
                  className="bg-primary text-white font-nunito font-bold py-4 px-12 rounded-full hover:bg-accent-1 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 block uppercase"
                >
                  XÁC NHẬN ĐĂNG KÝ
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
