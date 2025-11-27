
import React, { useState } from 'react';
import { useApp } from '../store';
import { Tag, Clock, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Deals: React.FC = () => {
  const { deals, theme } = useApp();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(deals.map(d => d.category)))];

  // Filter Logic
  const filteredDeals = deals.filter(deal => {
      const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            deal.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || deal.category === selectedCategory;
      return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-12 px-4 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-serif font-bold mb-2" style={{ color: theme.secondaryColor }}>Lotoria Deals</h2>
        <p className="text-gray-500">Limited time offers just for you</p>
      </div>

      {/* Search & Filter Section */}
      <div className="mb-10 max-w-4xl mx-auto space-y-6">
          <div className="relative">
              <input 
                  type="text" 
                  placeholder="Find offers..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold shadow-sm bg-white"
              />
              <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          </div>

          <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar justify-center">
              {categories.map(cat => (
                  <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition border ${
                          selectedCategory === cat 
                          ? 'bg-black text-white border-black' 
                          : 'bg-white text-gray-600 border-gray-200 hover:border-black'
                      }`}
                  >
                      {cat}
                  </button>
              ))}
          </div>
      </div>
      
      {filteredDeals.length === 0 ? (
        <div className="text-center text-gray-500 py-20">
            <p className="text-xl font-serif">No deals found matching your search.</p>
            <button onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }} className="mt-4 text-brand-gold underline">View All Deals</button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredDeals.map((deal) => (
            <div key={deal.id} className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition duration-300">
              {/* Image Section */}
              <div className="md:w-1/3 relative h-64 md:h-auto">
                <img src={deal.image} alt={deal.title} className="w-full h-full object-cover" />
                <div className="absolute top-0 left-0 bg-red-600 text-white px-4 py-2 rounded-br-lg text-lg font-bold shadow-lg z-10">
                  {deal.percentageOff}% OFF
                </div>
              </div>
              
              {/* Content Section */}
              <div className="p-6 md:w-2/3 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-bold mb-2 text-gray-800 font-serif">{deal.title}</h3>
                    <div className="flex items-center text-red-500 text-sm font-bold bg-red-50 px-2 py-1 rounded">
                      <Clock size={14} className="mr-1" /> Limited Time
                    </div>
                  </div>
                  <p className="text-xs font-bold text-gray-400 uppercase mb-2 tracking-wide">{deal.category}</p>
                  <p className="text-gray-600 mb-6 leading-relaxed border-l-4 border-brand-gold pl-4">{deal.description}</p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between mt-4 border-t pt-4">
                  <div className="flex items-baseline gap-4 mb-4 sm:mb-0">
                    <span className="text-gray-400 line-through text-xl">₹{deal.originalPrice}</span>
                    <span className="text-4xl font-bold text-red-600">₹{deal.offerPrice}</span>
                  </div>
                  <button 
                    onClick={() => navigate(`/booking?dealId=${deal.id}`)}
                    className="w-full sm:w-auto px-8 py-3 bg-gray-900 hover:bg-black text-white rounded-lg flex items-center justify-center gap-2 transition shadow-lg transform hover:-translate-y-1 font-bold uppercase tracking-widest text-xs"
                  >
                    <Tag size={18} /> Claim Offer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
