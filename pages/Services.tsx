
import React, { useState } from 'react';
import { useApp } from '../store';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

export const Services: React.FC = () => {
  const { services, theme } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Extract unique categories from services
  const categories = ['All', ...Array.from(new Set(services.map(s => s.category)))];

  // Filter Logic
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-12 px-4 max-w-7xl mx-auto min-h-screen bg-gray-50">
      <h2 className="text-4xl font-serif text-center mb-6" style={{ color: theme.secondaryColor }}>Our Premium Services</h2>
      
      {/* Search & Filter Section */}
      <div className="mb-10 max-w-4xl mx-auto space-y-6">
          {/* Search Bar */}
          <div className="relative">
              <input 
                  type="text" 
                  placeholder="Search services (e.g., Facial, Bridal...)" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold shadow-sm"
              />
              <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          </div>

          {/* Category Buttons */}
          <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
              {categories.map(cat => (
                  <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition border ${
                          selectedCategory === cat 
                          ? 'bg-brand-gold text-black border-brand-gold shadow-md' 
                          : 'bg-white text-gray-600 border-gray-200 hover:border-brand-gold'
                      }`}
                  >
                      {cat}
                  </button>
              ))}
          </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
              <p className="text-xl font-serif">No services found matching your criteria.</p>
              <button onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }} className="mt-4 text-brand-gold underline">Clear Filters</button>
          </div>
      ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <motion.div 
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 flex flex-col"
              >
                <div className="h-64 overflow-hidden relative">
                  <img src={service.image} alt={service.name} className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500" />
                  <span className="absolute top-2 right-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded uppercase tracking-wider backdrop-blur-sm">
                      {service.category}
                  </span>
                  {service.offer && (
                      <span className="absolute bottom-0 left-0 bg-brand-gold text-black text-xs font-bold px-3 py-1">
                          {service.offer}
                      </span>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-brand-gold transition">{service.name}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">{service.description}</p>
                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-50">
                    <span className="text-xl font-bold text-gray-900">₹{service.price}</span>
                    <Link 
                      to={`/booking?serviceId=${service.id}`}
                      className="px-6 py-2 rounded-lg text-sm font-bold text-white transition hover:opacity-90 shadow-md transform hover:-translate-y-1"
                      style={{ backgroundColor: theme.primaryColor }}
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
      )}
    </div>
  );
};
