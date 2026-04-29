import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import logo from '../assets/img/header/logo.svg'; // Sử dụng logo hiện có của dự án

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);

  // Lấy đường dẫn trước đó người dùng muốn vào (ví dụ: /checkout)
  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);
    
    setIsLoading(false);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message || 'Email hoặc mật khẩu không chính xác');
    }
  };

  return (
    <div className="min-h-screen bg-pinky-gray flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Trang trí background */}
      <div className="absolute top-0 left-0 w-full h-96 bg-accent-2 -z-10 rounded-b-[100px]"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <Link to="/" className="flex justify-center mb-6">
          <img src={logo} alt="Revo Coffee" className="h-12 drop-shadow-md" />
        </Link>
        <h2 className="text-center font-montserrat font-black text-3xl text-primary mb-2">ĐĂNG NHẬP</h2>
        <p className="text-center font-nunito text-primary/70 mb-8">Chào mừng bạn quay trở lại với Revo Coffee</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-white py-8 px-4 shadow-xl rounded-[32px] sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm font-nunito font-bold text-center border border-red-100">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-nunito font-bold text-primary mb-2">Email của bạn</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl bg-pinky-gray/30 focus:outline-none focus:ring-2 focus:ring-accent-1 focus:border-transparent font-nunito transition-all"
                placeholder="hi@revocoffee.com" />
            </div>

            <div>
              <label className="block text-sm font-nunito font-bold text-primary mb-2">Mật khẩu</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl bg-pinky-gray/30 focus:outline-none focus:ring-2 focus:ring-accent-1 focus:border-transparent font-nunito transition-all"
                placeholder="••••••••" />
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-full shadow-md text-sm font-bold font-nunito text-white bg-primary hover:bg-accent-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-1 disabled:opacity-70 disabled:cursor-not-allowed transition-colors uppercase tracking-wider">
              {isLoading ? 'Đang xử lý...' : 'ĐĂNG NHẬP'}
            </button>
          </form>

          <div className="mt-8 text-center font-nunito text-sm text-primary/70 border-t border-gray-100 pt-6">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="font-bold text-accent-1 hover:text-primary transition-colors">
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}