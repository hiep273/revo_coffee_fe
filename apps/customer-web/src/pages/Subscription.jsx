import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CalendarSync, Check, ChevronRight, Coffee } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function Subscription() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  const [step, setStep] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [grindSizeId, setGrindSizeId] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [frequency, setFrequency] = useState('biweekly');

  useEffect(() => {
    fetch('http://localhost:8080/api/products')
      .then((res) => res.json())
      .then((data) => {
        const items = Array.isArray(data) ? data : (data.items || []);
        setProducts(items.filter((item) => item.is_active !== false && item.type !== 'gift-set'));
      })
      .catch(() => setError('Could not load products.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubscribe = async () => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    if (!selectedProduct) {
      setError('Please choose a coffee first.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          userId: user.id,
          productId: selectedProduct.id,
          grindSizeId,
          frequency,
          quantity,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Could not create subscription.');
      }

      navigate('/orders');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const grindOptions = [
    { id: 1, label: 'Whole Bean' },
    { id: 2, label: 'Pha phin' },
    { id: 3, label: 'Espresso' },
    { id: 4, label: 'Cold Brew' },
    { id: 5, label: 'French Press' },
  ];

  const frequencyOptions = [
    { id: 'weekly', title: 'Every week', desc: 'Best for daily coffee drinkers.', discount: 'Save 15%' },
    { id: 'biweekly', title: 'Every 2 weeks', desc: 'Balanced schedule for one or two cups per day.', discount: 'Save 10%' },
  ];

  return (
    <div className="bg-pinky-gray min-h-screen py-12">
      <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
        <div className="text-center mb-12">
          <p className="text-accent-1 font-nunito font-bold tracking-[0.2em] uppercase mb-4">Coffee subscription</p>
          <h1 className="font-montserrat font-black text-4xl text-primary">REVO SUBSCRIPTION</h1>
          <p className="font-nunito text-primary/70 mt-4 max-w-2xl mx-auto">
            Choose coffee, grind size, quantity, and delivery frequency. The order service will create the recurring schedule.
          </p>
        </div>

        <div className="flex justify-between items-center mb-12 px-0 md:px-20 relative">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-200 -z-10 -translate-y-1/2"></div>
          <div
            className="absolute top-1/2 left-0 h-[2px] bg-primary -z-10 -translate-y-1/2 transition-all duration-500"
            style={{ width: step === 1 ? '16%' : step === 2 ? '50%' : '83%' }}
          ></div>

          {['Coffee', 'Grind', 'Frequency'].map((label, index) => {
            const number = index + 1;
            return (
              <div key={label} className="flex flex-col items-center cursor-pointer" onClick={() => number === 1 || selectedProduct ? setStep(number) : null}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-montserrat font-bold text-lg mb-2 transition-colors ${step >= number ? 'bg-primary text-white shadow-lg' : 'bg-white border-2 border-gray-200 text-gray-400'}`}>{number}</div>
                <span className={`font-nunito text-sm font-bold ${step >= number ? 'text-primary' : 'text-gray-400'}`}>{label}</span>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-[32px] p-8 lg:p-12 shadow-sm min-h-[400px]">
          {error && (
            <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="font-montserrat font-bold text-2xl text-primary mb-8 text-center">
                <Coffee className="inline mr-2" /> Choose your coffee
              </h2>

              {loading ? (
                <div className="text-center font-nunito text-primary/70">Loading products...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                  {products.map((product) => (
                    <button
                      type="button"
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className={`border-2 rounded-3xl p-6 cursor-pointer hover:shadow-lg transition-all flex flex-col items-center group relative overflow-hidden ${selectedProduct?.id === product.id ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-primary/30'}`}
                    >
                      {selectedProduct?.id === product.id && <div className="absolute top-4 right-4 bg-primary text-white rounded-full p-1"><Check size={16} /></div>}
                      <div className="h-32 mb-4">
                        <img src={product.image || product.image_url} alt={product.name} className="h-full object-contain filter drop-shadow-md transition-transform duration-500 group-hover:scale-105" />
                      </div>
                      <h3 className="font-montserrat font-bold text-lg text-primary text-center line-clamp-2">{product.name}</h3>
                      <p className="font-nunito text-sm text-primary/60 mt-2">{product.roast || product.roast_level}</p>
                    </button>
                  ))}
                </div>
              )}

              <div className="flex justify-center mt-12">
                <button
                  onClick={() => setStep(2)}
                  disabled={!selectedProduct}
                  className="bg-primary text-white font-nunito font-bold py-3 px-12 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-1 transition-colors flex items-center gap-2"
                >
                  Next <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in max-w-3xl mx-auto">
              <h2 className="font-montserrat font-bold text-2xl text-primary mb-8 text-center">Grind and quantity</h2>

              <div className="mb-10">
                <h3 className="font-nunito font-bold text-primary mb-4">Quantity per delivery</h3>
                <div className="flex gap-4">
                  {[1, 2, 3].map((value) => (
                    <button
                      type="button"
                      key={value}
                      onClick={() => setQuantity(value)}
                      className={`flex-1 py-4 border-2 rounded-2xl font-montserrat font-bold transition-all ${quantity === value ? 'border-primary bg-primary text-white shadow-md' : 'border-gray-200 text-primary/70 hover:border-primary/50'}`}
                    >
                      {value} bag{value > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-10">
                <h3 className="font-nunito font-bold text-primary mb-4">Grind size</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {grindOptions.map((option) => (
                    <button
                      type="button"
                      key={option.id}
                      onClick={() => setGrindSizeId(option.id)}
                      className={`py-3 px-4 border-2 rounded-xl font-nunito font-semibold text-sm transition-all ${grindSizeId === option.id ? 'border-primary bg-primary text-white shadow-md' : 'border-gray-200 text-primary/70 hover:border-primary/50'}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between mt-12">
                <button onClick={() => setStep(1)} className="text-primary font-nunito font-bold hover:text-accent-1 px-4">Back</button>
                <button onClick={() => setStep(3)} className="bg-primary text-white font-nunito font-bold py-3 px-12 rounded-full hover:bg-accent-1 transition-colors flex items-center gap-2">
                  Next <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in max-w-3xl mx-auto">
              <h2 className="font-montserrat font-bold text-2xl text-primary mb-8 text-center">
                <CalendarSync className="inline mr-2" /> Delivery frequency
              </h2>

              <div className="flex flex-col gap-4 mb-10">
                {frequencyOptions.map((option) => (
                  <button
                    type="button"
                    key={option.id}
                    onClick={() => setFrequency(option.id)}
                    className={`flex items-center justify-between p-6 border-2 rounded-2xl cursor-pointer transition-all text-left ${frequency === option.id ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-primary/30'}`}
                  >
                    <div>
                      <h4 className="font-montserrat font-bold text-lg text-primary flex items-center gap-4">
                        {option.title} <span className="bg-red-custom text-white text-xs px-2 py-0.5 rounded-full whitespace-nowrap">{option.discount}</span>
                      </h4>
                      <p className="font-nunito text-primary/70 text-sm">{option.desc}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${frequency === option.id ? 'border-primary' : 'border-gray-300'}`}>
                      {frequency === option.id && <div className="w-3 h-3 bg-primary rounded-full"></div>}
                    </div>
                  </button>
                ))}
              </div>

              <div className="bg-pinky-gray p-6 rounded-2xl mb-8 font-nunito border border-gray-200">
                <h4 className="font-bold text-primary mb-4 border-b border-gray-300 pb-2">Subscription summary</h4>
                <div className="flex justify-between mb-2"><span>Product:</span> <span className="font-bold text-primary">{selectedProduct?.name}</span></div>
                <div className="flex justify-between mb-2"><span>Quantity:</span> <span className="font-bold text-primary">{quantity} bag{quantity > 1 ? 's' : ''}</span></div>
                <div className="flex justify-between"><span>Frequency:</span> <span className="font-bold text-primary">{frequency === 'weekly' ? 'Every week' : 'Every 2 weeks'}</span></div>
              </div>

              <div className="flex justify-between mt-12 items-center">
                <button onClick={() => setStep(2)} className="text-primary font-nunito font-bold hover:text-accent-1 px-4">Back</button>
                <button
                  onClick={handleSubscribe}
                  disabled={submitting}
                  className="bg-primary text-white font-nunito font-bold py-4 px-12 rounded-full hover:bg-accent-1 transition-colors shadow-lg disabled:opacity-60 uppercase"
                >
                  {submitting ? 'Creating...' : 'Confirm subscription'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
