import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useStore from '../store/useStore';
import { useAuthStore } from '../store/useAuthStore';
import logo from '../assets/img/header/logo.svg';
import cartIcon from '../assets/img/header/cart-icon.svg';
import headerBg from '../assets/img/header/header-half-bg.png';
import { useTranslation } from 'react-i18next';

function LangSwitcher() {
  const { i18n } = useTranslation();
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => i18n.changeLanguage('en')}
        className="text-sm font-bold"
        aria-label="English"
      >
        EN
      </button>
      <span className="text-sm">|</span>
      <button
        onClick={() => i18n.changeLanguage('vi')}
        className="text-sm font-bold"
        aria-label="Vietnamese"
      >
        VI
      </button>
    </div>
  );
}

export default function Header() {
  const location = useLocation();
  const { t } = useTranslation();
  const isHome = location.pathname === '/';
  const cart = useStore((state) => state.cart);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const fromPath = location.pathname + location.search;

  if (!isHome) {
    return (
      <header className="sticky top-0 z-20 w-full bg-accent-2 border-b border-gray-100">
        <nav className="w-full flex items-center justify-between px-6 md:px-12 py-4">
          <div className="flex items-center gap-10">
            <Link to="/" className="transition-colors hover:text-accent-1">
              <img src={logo} alt="Revo Coffee Logo" className="h-9 md:h-10 cursor-pointer" />
            </Link>
            <ul className="hidden lg:flex items-center gap-8 font-nunito font-bold text-primary uppercase tracking-widest text-xs">
              <li><Link to="/" className="transition-colors hover:text-accent-1">{t('home')}</Link></li>
              <li><Link to="/shop" className="transition-colors hover:text-accent-1">{t('shop')}</Link></li>
              <li><Link to="/subscription" className="transition-colors hover:text-accent-1">{t('subscription')}</Link></li>
            </ul>
          </div>
          <div className="flex items-center gap-6">
            <LangSwitcher />
            {!user ? (
              <div className="hidden md:flex items-center gap-4 font-nunito font-bold text-primary uppercase text-sm">
                <Link to="/register" className="transition-colors hover:text-accent-1">Đăng ký</Link>
                <span className="text-primary/30">|</span>
                <Link to="/login" state={{ from: fromPath }} className="transition-colors hover:text-accent-1">Đăng nhập</Link>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-4 font-nunito font-bold text-primary text-sm">
                <span className="uppercase">{user.name}</span>
                <button onClick={logout} className="uppercase transition-colors hover:text-accent-1">Đăng xuất</button>
              </div>
            )}
            <Link to="/orders" className="hidden md:flex items-center gap-2 hover:opacity-75 transition-opacity font-nunito font-bold text-primary uppercase text-sm">
              {t('my_orders')}
            </Link>
            <Link to="/cart" className="flex items-center gap-2 hover:opacity-75 transition-opacity">
              <span className="hidden md:inline-block font-nunito font-bold text-primary uppercase text-sm mr-2">
                {t('cart')}
              </span>
              <div className="bg-primary rounded-full p-2 flex items-center justify-center relative">
                <img src={cartIcon} alt="Cart" className="h-5 w-5 brightness-0 invert" />
                <span className="absolute -top-1 -right-1 bg-red-custom text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              </div>
            </Link>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <header className="relative w-full min-h-screen bg-accent-2 overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-6 md:px-12 py-4 z-50 bg-accent-2/95 backdrop-blur border-b border-primary/10 shadow-sm">
        <div className="flex items-center gap-16">
          <Link to="/" className="transition-colors hover:text-accent-1">
            <img src={logo} alt="Revo Coffee Logo" className="h-10 md:h-12 cursor-pointer" />
          </Link>
          <ul className="hidden lg:flex items-center gap-10 font-nunito font-bold text-primary uppercase tracking-widest text-sm">
            <li><Link to="/" className="transition-colors hover:text-accent-1">Trang chủ</Link></li>
            <li><Link to="/shop" className="transition-colors hover:text-accent-1">Sản phẩm</Link></li>
            <li><Link to="/subscription" className="transition-colors hover:text-accent-1">Subscription</Link></li>
          </ul>
        </div>
        <div className="flex items-center gap-6">
          <LangSwitcher />
          {!user ? (
            <div className="hidden md:flex items-center gap-4 font-nunito font-bold text-primary uppercase text-sm">
              <Link to="/register" className="transition-colors hover:text-accent-1">Đăng ký</Link>
              <span className="text-primary/30">|</span>
              <Link to="/login" state={{ from: fromPath }} className="transition-colors hover:text-accent-1">Đăng nhập</Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4 font-nunito font-bold text-primary text-sm">
              <span className="uppercase">{user.name}</span>
              <button onClick={logout} className="uppercase transition-colors hover:text-accent-1">Đăng xuất</button>
            </div>
          )}
          {/* My Orders / Profile */}
          <Link to="/orders" className="hidden md:flex items-center gap-2 hover:opacity-75 transition-opacity font-nunito font-bold text-primary uppercase text-sm">
             Đơn hàng của tôi
          </Link>
          
          {/* Cart */}
          <Link to="/cart" className="flex items-center gap-2 hover:opacity-75 transition-opacity">
            <span className="hidden md:inline-block font-nunito font-bold text-primary uppercase text-sm mr-2">
              Giỏ hàng
            </span>
            <div className="bg-primary rounded-full p-2 flex items-center justify-center relative">
               <img src={cartIcon} alt="Cart" className="h-5 w-5 brightness-0 invert" />
               <span className="absolute -top-1 -right-1 bg-red-custom text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                 {totalItems}
               </span>
            </div>
          </Link>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative flex flex-col lg:flex-row min-h-screen items-center pt-24 lg:pt-0">
        {/* Left Side: Text */}
        <div className="w-full lg:w-[55%] px-6 md:px-12 lg:pl-24 flex flex-col justify-center z-10 py-12 lg:py-0">
          <h1 className="font-montserrat text-5xl md:text-7xl xl:text-[80px] font-black text-primary leading-[1.1] mb-6">
            {t('hero_title_line1')} <br/>
            <span className="text-accent-1 block my-2">{t('hero_title_personalized')}</span>
            {t('hero_title_line2')}
          </h1>
          <p className="font-nunito text-lg text-primary mb-10 max-w-lg leading-relaxed">
            {t('hero_paragraph')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/shop" className="bg-primary text-text-light font-nunito font-bold py-4 px-10 rounded-full shadow-lg hover:bg-accent-1 transition-all hover:shadow-xl transform hover:-translate-y-1 text-center tracking-wider inline-block">
              {t('view_products')}
            </Link>
            <button className="border-2 border-primary text-primary font-nunito font-bold py-4 px-10 rounded-full hover:bg-primary hover:text-text-light transition-all text-center tracking-wider bg-transparent">
              {t('learn_more')}
            </button>
          </div>
        </div>
        
        {/* Right Side: Image with decorative shape */}
        <div className="w-full lg:w-[45%] h-[50vh] lg:h-screen relative lg:absolute lg:right-0 lg:top-0">
           {/* Visual element behind the image if we want to add any CSS decoration */}
           <div className="absolute inset-0 bg-accent-1 opacity-10 hidden lg:block rounded-bl-[150px]"></div>
           <img 
            src={headerBg} 
            alt="Coffee pouring" 
            className="w-full h-full object-cover lg:rounded-bl-[150px] shadow-2xl"
          />
        </div>
      </div>
    </header>
  );
}
