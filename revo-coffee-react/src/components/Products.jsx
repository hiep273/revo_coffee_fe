import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import arrow from '../assets/img/section2/arrow.svg';


export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Gọi qua API Gateway tới C# Product Service
    fetch('http://localhost:8080/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Lỗi khi tải sản phẩm:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="py-24 text-center font-nunito text-primary">Đang tải danh sách sản phẩm...</div>;
  if (!products || products.length === 0) return <div className="py-24 text-center font-nunito text-primary">Chưa có sản phẩm nào.</div>;

  return (
    <section id="products" className="py-24 bg-pinky-gray relative">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-16 gap-6">
          <div>
            <p className="text-accent-1 font-nunito font-bold tracking-[0.2em] uppercase mb-4">Sản Phẩm Của Chúng Tôi</p>
            <h2 className="text-4xl md:text-5xl font-montserrat font-black text-primary">CÁC LOẠI CÀ PHÊ <br className="hidden md:block"/> <span className="text-accent-1">NỔI BẬT</span></h2>
          </div>
          <Link to="/shop" className="flex items-center gap-3 text-primary font-nunito font-bold border-b border-primary hover:text-accent-1 hover:border-accent-1 transition-colors pb-1 w-fit">
            XEM TẤT CẢ SẢN PHẨM <img src={arrow} alt="arrow" className="w-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Featured Product (Large) */}
          <div className="lg:col-span-6 bg-white rounded-[40px] p-10 flex flex-col md:flex-row items-center gap-8 shadow-sm hover:shadow-xl transition-shadow group relative overflow-hidden">
            <div className="w-full md:w-1/2 relative z-10 flex justify-center">
              <img src={products[0].image || 'https://via.placeholder.com/200?text=Coffee'} alt={products[0].name} className="max-w-[200px] md:max-w-full drop-shadow-2xl group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="w-full md:w-1/2 relative z-10 text-center md:text-left">
              <span className="text-accent-1 font-nunito font-bold tracking-widest uppercase text-sm block mb-2">BÁN CHẠY NHẤT</span>
              <h3 className="font-montserrat font-bold text-3xl text-primary mb-3">{products[0].name}</h3>
              <p className="font-nunito text-primary/70 mb-6">{products[0].desc}</p>
              <div className="flex items-center justify-center md:justify-start gap-4">
                <span className="font-montserrat font-bold text-2xl text-accent-1">{Number(products[0].price).toLocaleString('vi-VN')}đ</span>
                <Link to={`/product/${products[0].id}`} className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-accent-1 transition-colors">
                  <span className="font-bold text-lg leading-none mb-1">+</span>
                </Link>
              </div>
            </div>
            {/* Background shape */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-accent-2/30 rounded-l-[100px] -z-0"></div>
          </div>

          {/* Other Products Grid */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {products.slice(1).map((product) => (
              <div key={product.id} className="bg-white rounded-3xl p-6 flex flex-col hover:shadow-lg transition-shadow group h-full">
                <div className="flex justify-center mb-4 h-40">
                  <img src={product.image || 'https://via.placeholder.com/150?text=Coffee'} alt={product.name} className="h-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="mt-auto">
                   <h3 className="font-montserrat font-bold text-xl text-primary mb-2 line-clamp-1">{product.name}</h3>
                   <p className="font-nunito text-primary/70 text-sm mb-4 line-clamp-2 min-h-10">{product.desc}</p>
                   <div className="flex items-center justify-between">
                     <span className="font-montserrat font-bold text-lg text-primary">{Number(product.price).toLocaleString('vi-VN')}đ</span>
                     <Link to={`/product/${product.id}`} className="bg-pinky-gray text-primary w-8 h-8 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                       <span className="font-bold text-sm leading-none mb-0.5">+</span>
                     </Link>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
