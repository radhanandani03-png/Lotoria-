
import React from 'react';
import { useApp } from '../store';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft } from 'lucide-react';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, theme } = useApp();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + (item.discountPrice || item.price), 0);

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 bg-brand-cream">
        <h2 className="text-3xl font-serif mb-4 text-gray-800">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8 font-light">Looks like you haven't made your choice yet.</p>
        <Link to="/shop" className="px-8 py-3 bg-black text-white uppercase tracking-widest text-xs font-bold hover:bg-brand-gold hover:text-black transition">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-16 px-4 min-h-screen bg-brand-cream">
      <h2 className="text-4xl font-serif mb-12 text-center">Shopping Bag <span className="text-brand-gold">({cart.length})</span></h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item, index) => (
            <div key={`${item.id}-${index}`} className="flex gap-6 bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-24 h-24 bg-gray-50 flex items-center justify-center overflow-hidden">
                 <img src={item.image} alt={item.name} className="max-h-full object-cover mix-blend-multiply" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg">{item.name}</h3>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">{item.category}</p>
                </div>
                <div className="flex justify-between items-end mt-4">
                  <p className="font-bold text-xl text-gray-900">₹{item.discountPrice || item.price}</p>
                  <button 
                    onClick={() => removeFromCart(index)}
                    className="text-gray-400 hover:text-red-500 transition flex items-center gap-1 text-xs uppercase font-bold tracking-wider"
                  >
                    <Trash2 size={16} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mt-4 font-medium">
             <ArrowLeft size={16}/> Back to Shop
          </Link>
        </div>
        
        <div className="lg:col-span-1">
           <div className="bg-white p-8 shadow-lg border-t-4 border-brand-gold h-fit sticky top-24">
            <h3 className="text-xl font-serif font-bold mb-6 pb-4 border-b">Order Summary</h3>
            <div className="flex justify-between mb-3 text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-bold">₹{total}</span>
            </div>
            <div className="flex justify-between mb-6 text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="text-green-600 font-bold text-xs uppercase">Free Delivery</span>
            </div>
            <div className="border-t border-dashed border-gray-300 pt-6 flex justify-between items-end mb-8">
              <span className="font-bold text-lg">Total Amount</span>
              <span className="font-bold text-3xl font-serif text-brand-gold">₹{total}</span>
            </div>
            <button 
              onClick={() => navigate('/booking')} 
              className="w-full py-4 text-black bg-brand-gold hover:bg-[#c5a028] transition font-bold uppercase tracking-widest text-xs shadow-lg"
            >
              Proceed to Checkout
            </button>
            <p className="text-[10px] text-gray-400 text-center mt-4">Secure Checkout • 100% Authentic Products</p>
          </div>
        </div>
      </div>
    </div>
  );
};