import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Database, Archive, LogOut } from 'lucide-react';

export default function AdminLayout() {
  const location = useLocation();
  const currentPath = location.pathname;
  const handleLogout = () => {
    localStorage.removeItem('revo-auth-storage');
    window.location.href = 'http://localhost:5173/login';
  };

  const navItems = [
    { name: 'Tổng quan', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Đơn hàng', path: '/orders', icon: <ShoppingCart size={20} /> },
    { name: 'Sản phẩm', path: '/products', icon: <Package size={20} /> },
    { name: 'Lô rang', path: '/batches', icon: <Database size={20} /> },
    { name: 'Tồn kho', path: '/inventory', icon: <Archive size={20} /> },
  ];

  return (
    <div className="flex bg-gray-50 min-h-screen text-gray-800">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10 transition-all duration-300">
        <div className="h-16 flex items-center justify-center border-b border-gray-100">
          <Link to="/" className="font-bold text-xl tracking-widest uppercase">
            <span className="text-blue-900">REVO</span> <span className="text-orange-500">ADMIN</span>
          </Link>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {navItems.map(item => {
            const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
            return (
              <Link key={item.name} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${isActive ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}>
                {item.icon} {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full py-3 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-colors">
            <LogOut size={20} /> Thoát hệ thống
          </button>
        </div>
      </aside>
      
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
