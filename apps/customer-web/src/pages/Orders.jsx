import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarSync, FileText, Package, Truck } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function Orders() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/orders' } });
      return;
    }

    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    Promise.all([
      fetch(`http://localhost:8080/api/orders/user/${user.id}`, { headers }).then((res) => res.ok ? res.json() : []),
      fetch(`http://localhost:8080/api/subscriptions?userId=${user.id}`, { headers }).then((res) => res.ok ? res.json() : { items: [] }),
    ])
      .then(([ordersData, subscriptionsData]) => {
        setOrders(Array.isArray(ordersData) ? ordersData : (ordersData.items || []));
        setSubscriptions(Array.isArray(subscriptionsData) ? subscriptionsData : (subscriptionsData.items || []));
      })
      .catch(() => setError('Could not load your account activity.'))
      .finally(() => setLoading(false));
  }, [navigate, token, user]);

  const cancelSubscription = async (id) => {
    if (!window.confirm('Cancel this subscription?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/subscriptions/${id}/cancel`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Could not cancel subscription.');
      }
      setSubscriptions((items) => items.map((item) => item.id === id ? data : item));
    } catch (err) {
      setError(err.message);
    }
  };

  const statusClass = (status) => {
    const map = {
      pending: 'text-orange-500',
      confirmed: 'text-blue-500',
      processing: 'text-blue-500',
      shipped: 'text-indigo-500',
      delivered: 'text-green-500',
      active: 'text-green-600',
      paused: 'text-orange-500',
      cancelled: 'text-red-500',
    };
    return map[status] || 'text-gray-500';
  };

  return (
    <div className="bg-pinky-gray/30 min-h-screen py-10">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        <h1 className="font-montserrat font-black text-3xl text-primary mb-6">My Coffee Activity</h1>

        <div className="bg-white rounded-t-2xl flex overflow-x-auto border-b border-gray-100 shadow-sm sticky top-0 z-10 custom-scrollbar">
          {[
            { id: 'orders', label: 'Orders' },
            { id: 'subscriptions', label: 'Subscriptions' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[140px] py-4 text-center font-nunito font-bold text-sm transition-all border-b-2 ${activeTab === tab.id ? 'text-accent-1 border-accent-1 bg-accent-1/5' : 'text-primary/60 border-transparent hover:text-primary'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-b-2xl p-16 text-center font-nunito text-primary/70 shadow-sm">
            Loading...
          </div>
        ) : activeTab === 'orders' ? (
          <div className="flex flex-col gap-4 mt-4">
            {orders.length === 0 ? (
              <EmptyState title="No orders yet" action="/shop" actionText="Continue shopping" />
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm p-6 animate-fade-in">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
                    <div className="font-nunito text-sm">
                      <span className="font-bold text-primary mr-2">Order: {order.orderCode || order.id}</span>
                      <span className="text-gray-400 hidden sm:inline-block">| {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}</span>
                    </div>
                    <div className={`font-montserrat font-bold text-sm uppercase tracking-widest flex items-center gap-2 ${statusClass(order.status)}`}>
                      {order.status === 'shipped' && <Truck size={16} />}
                      {order.status}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {(order.items || []).map((item) => (
                      <div key={item.id || item.productId} className="flex justify-between gap-4 font-nunito">
                        <div>
                          <h4 className="font-bold text-primary">{item.productName}</h4>
                          <span className="text-primary/60 text-sm">x{item.quantity}</span>
                        </div>
                        <div className="font-bold text-primary">{Number(item.subtotal || 0).toLocaleString('vi-VN')}</div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 mt-6 pt-4 flex justify-between items-center">
                    <div className="text-sm font-nunito text-primary/60 flex items-center gap-2 bg-pinky-gray px-3 py-1.5 rounded-lg">
                      <Package size={14} /> Delivery
                    </div>
                    <span className="font-montserrat font-bold text-2xl text-accent-1">{Number(order.totalAmount || 0).toLocaleString('vi-VN')}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4 mt-4">
            {subscriptions.length === 0 ? (
              <EmptyState title="No subscriptions yet" action="/subscription" actionText="Create subscription" />
            ) : (
              subscriptions.map((subscription) => (
                <div key={subscription.id} className="bg-white rounded-2xl shadow-sm p-6 animate-fade-in">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 font-montserrat font-bold text-xl text-primary">
                        <CalendarSync size={20} /> Subscription #{subscription.id}
                      </div>
                      <div className="mt-2 font-nunito text-primary/70">
                        Product: <span className="font-bold text-primary">{subscription.productId}</span>
                      </div>
                      <div className="font-nunito text-primary/70">
                        Frequency: <span className="font-bold text-primary">{subscription.frequency}</span> | Quantity: <span className="font-bold text-primary">{subscription.quantity}</span>
                      </div>
                      <div className="font-nunito text-primary/70">
                        Next delivery: <span className="font-bold text-primary">{subscription.nextDeliveryDate}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-3">
                      <span className={`font-montserrat font-bold uppercase ${statusClass(subscription.status)}`}>{subscription.status}</span>
                      {subscription.status === 'active' && (
                        <button
                          onClick={() => cancelSubscription(subscription.id)}
                          className="py-2 px-6 rounded-lg font-nunito font-bold text-red-600 hover:bg-red-50 transition-colors border border-red-100"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ title, action, actionText }) {
  return (
    <div className="bg-white rounded-b-2xl p-16 flex flex-col items-center justify-center text-center shadow-sm h-64">
      <FileText size={48} className="text-gray-300 mb-4" />
      <h3 className="font-montserrat font-bold text-xl text-primary/80 mb-2">{title}</h3>
      <Link to={action} className="text-accent-1 font-nunito font-bold hover:underline">{actionText}</Link>
    </div>
  );
}
