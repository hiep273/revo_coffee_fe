import React from 'react';
import giftset1Img from '../assets/img/section3/giftset1Img.png';
import giftset2Img from '../assets/img/section3/giftset2Img.png';
import giftset3Img from '../assets/img/section3/giftset3Img.png';
import coffeeBeansIcon from '../assets/img/section3/coffeeBeansIcon.svg';
import mountainIcon from '../assets/img/section3/mountainIcon.svg';
import useStore from '../store/useStore';

const giftsets = [
  {
    id: 1,
    name: 'GIFTSET 1',
    price: '285.000',
    desc: 'Món quà tuyệt vời dành cho người sành cà phê',
    coffeeTypes: 'Loại hạt: Fine Robusta Blend',
    altitude: 'Độ cao: 700 - 800m',
    image: giftset1Img
  },
  {
    id: 2,
    name: 'GIFTSET 2',
    price: '305.000',
    desc: 'Dành tặng cho những ai yêu thích hương vị đậm đà',
    coffeeTypes: 'Loại hạt: 100% Robusta Honey',
    altitude: 'Độ cao: 800 - 1000m',
    image: giftset2Img
  },
  {
    id: 3,
    name: 'GIFTSET 3',
    price: '345.000',
    desc: 'Trải nghiệm đỉnh cao từ dòng Arabica thượng hạng',
    coffeeTypes: 'Loại hạt: 100% Arabica Cầu Đất',
    altitude: 'Độ cao: > 1500m',
    image: giftset3Img
  }
];

export default function Giftsets() {
  const addToCart = useStore((state) => state.addToCart);

  const handleAddGiftset = (set) => {
    addToCart({
      id: `giftset-${set.id}`,
      name: set.name,
      price: parseInt(set.price.replace('.', '')),
      image: set.image,
      grindType: 'Hộp Quà'
    }, 1, 'Hộp Quà');
    alert(`Đã thêm ${set.name} vào giỏ hàng!`);
  };

  return (
    <section id="giftset" className="py-24 bg-text-light relative">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <div className="text-center mb-16">
          <p className="text-accent-1 font-nunito font-bold tracking-[0.2em] uppercase mb-4">Món quà từ trái tim</p>
          <h2 className="text-4xl md:text-5xl font-montserrat font-black text-primary mb-4">SET QUÀ TẶNG THƯỢNG HẠNG</h2>
          <p className="font-nunito text-primary max-w-2xl mx-auto opacity-70">Trọn bộ quà tặng tinh tế và đẳng cấp từ Revo Coffee. Sự lựa chọn hoàn hảo để dành tặng đối tác, khách hàng hoặc những người thân yêu.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {giftsets.map((set) => (
            <div key={set.id} className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col group">
              <div className="p-8 bg-pinky-gray flex justify-center items-center h-72 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <img src={set.image} alt={set.name} className="h-full object-contain filter drop-shadow-xl group-hover:scale-110 transition-transform duration-500 z-10" />
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="font-montserrat font-bold text-2xl text-primary mb-2">{set.name}</h3>
                <p className="font-nunito text-primary/70 mb-6 italic min-h-[48px]">{set.desc}</p>
                
                <div className="space-y-4 mb-8 flex-1">
                  <div className="flex items-center gap-4">
                    <img src={coffeeBeansIcon} alt="Loại hạt" className="w-5 h-5 object-contain" />
                    <span className="font-nunito text-primary font-medium">{set.coffeeTypes}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <img src={mountainIcon} alt="Độ cao" className="w-5 h-5 object-contain" />
                    <span className="font-nunito text-primary font-medium">{set.altitude}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                  <span className="font-montserrat font-black text-3xl text-accent-1 hover:scale-105 transition-transform">{set.price}đ</span>
                  <button 
                    onClick={() => handleAddGiftset(set)}
                    className="bg-primary hover:bg-accent-1 text-white font-nunito font-bold py-3 px-6 rounded-full shadow hover:shadow-lg transition-all transform hover:-translate-y-1"
                  >
                    CHỌN MUA
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
