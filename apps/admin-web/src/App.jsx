import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AdminLayout from './AdminLayout';
import AdminLogin from './AdminLogin';
import RequireAdmin from './RequireAdmin';
import Dashboard from './Dashboard';
import Orders from './Orders';
import Products from './Products';
import Batches from './Batches';
import Inventory from './Inventory';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="products" element={<Products />} />
          <Route path="batches" element={<Batches />} />
          <Route path="inventory" element={<Inventory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
