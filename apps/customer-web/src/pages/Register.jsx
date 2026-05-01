import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import logo from '../assets/img/header/logo.svg';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Mật khẩu nhập lại không khớp!');
    }

    const strongPassword = password.length >= 8
      && /[A-Z]/.test(password)
      && /[a-z]/.test(password)
      && /\d/.test(password)
      && /[^A-Za-z0-9]/.test(password);

    if (!strongPassword) {
      return setError('Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt. Ví dụ: Admin@123');
    }

    setIsLoading(true);
    const result = await register(name, email, password);
    setIsLoading(false);

    if (result.success) {
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } else {
      setError(result.message || 'Đăng ký thất bại, vui lòng thử lại.');
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
        <h2 className="text-center font-montserrat font-black text-3xl text-primary mb-2">TẠO TÀI KHOẢN</h2>
        <p className="text-center font-nunito text-primary/70 mb-8">Trở thành thành viên của Revo Coffee</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-white py-8 px-4 shadow-xl rounded-[32px] sm:px-10 border border-gray-100">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm font-nunito font-bold text-center border border-red-100">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-nunito font-bold text-primary mb-1">Họ và Tên</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl bg-pinky-gray/30 focus:outline-none focus:ring-2 focus:ring-accent-1 focus:border-transparent font-nunito transition-all" />
            </div>

            <div>
              <label className="block text-sm font-nunito font-bold text-primary mb-1">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl bg-pinky-gray/30 focus:outline-none focus:ring-2 focus:ring-accent-1 focus:border-transparent font-nunito transition-all" />
            </div>

            <div>
              <label className="block text-sm font-nunito font-bold text-primary mb-1">Mật khẩu</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl bg-pinky-gray/30 focus:outline-none focus:ring-2 focus:ring-accent-1 focus:border-transparent font-nunito transition-all" />
            </div>

            <div>
              <label className="block text-sm font-nunito font-bold text-primary mb-1">Nhập lại mật khẩu</label>
              <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl bg-pinky-gray/30 focus:outline-none focus:ring-2 focus:ring-accent-1 focus:border-transparent font-nunito transition-all" />
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full flex justify-center py-4 px-4 mt-2 border border-transparent rounded-full shadow-md text-sm font-bold font-nunito text-white bg-primary hover:bg-accent-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-1 disabled:opacity-70 disabled:cursor-not-allowed transition-colors uppercase tracking-wider">
              {isLoading ? 'Đang xử lý...' : 'ĐĂNG KÝ'}
            </button>
          </form>

          <div className="mt-8 text-center font-nunito text-sm text-primary/70 border-t border-gray-100 pt-6">
            Đã có tài khoản?{' '}
            <Link to="/login" className="font-bold text-accent-1 hover:text-primary transition-colors">
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
