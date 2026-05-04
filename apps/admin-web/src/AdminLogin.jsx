import React, { useState } from 'react';
import { Coffee, Eye, EyeOff, Lock, UserRound } from 'lucide-react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuthStore } from './useAdminAuthStore';

export default function AdminLogin() {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAdminAuthStore((state) => state.login);
  const isAuthenticated = useAdminAuthStore((state) => state.isAuthenticated);
  const user = useAdminAuthStore((state) => state.user);
  const from = location.state?.from?.pathname || '/';

  if (isAuthenticated && user?.role === 'admin') {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(account, password);
    setIsLoading(false);

    if (result.success) {
      navigate(from, { replace: true });
      return;
    }

    setError(result.message);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-900 grid lg:grid-cols-[minmax(360px,480px)_1fr]">
      <section className="bg-white flex min-h-screen items-center px-6 py-10 sm:px-10">
        <div className="w-full max-w-sm mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-11 w-11 rounded-lg bg-orange-500 text-white flex items-center justify-center">
              <Coffee size={24} />
            </div>
            <div>
              <div className="font-black tracking-widest text-lg text-blue-950">REVO ADMIN</div>
              <div className="text-sm text-slate-500">Bang dieu khien quan tri</div>
            </div>
          </div>

          <h1 className="text-3xl font-black text-blue-950 mb-2">Dang nhap</h1>
          <p className="text-slate-500 mb-8">Su dung tai khoan admin de quan ly cua hang.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            <label className="block">
              <span className="block text-sm font-bold text-slate-700 mb-2">Tai khoan</span>
              <span className="relative block">
                <UserRound size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={account}
                  onChange={(event) => setAccount(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 font-semibold outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  placeholder="Nhap tai khoan admin"
                  autoComplete="username"
                  required
                />
              </span>
            </label>

            <label className="block">
              <span className="block text-sm font-bold text-slate-700 mb-2">Mat khau</span>
              <span className="relative block">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pl-10 pr-12 font-semibold outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  placeholder="Nhap mat khau"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  aria-label={showPassword ? 'An mat khau' : 'Hien mat khau'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-blue-700 px-4 py-3 font-black text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? 'Dang dang nhap...' : 'Dang nhap admin'}
            </button>
          </form>
        </div>
      </section>

      <section className="hidden lg:flex min-h-screen items-end bg-[url('/src/assets/hero.png')] bg-cover bg-center">
        <div className="w-full bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent p-12 text-white">
          <div className="max-w-xl">
            <div className="text-sm font-bold uppercase tracking-[0.18em] text-orange-300">Revo Coffee</div>
            <h2 className="mt-3 text-4xl font-black">Quan ly don hang, san pham va ton kho </h2>
          </div>
        </div>
      </section>
    </main>
  );
}
