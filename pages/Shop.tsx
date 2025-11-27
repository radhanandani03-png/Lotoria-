
import React, { useState, useEffect } from 'react';
import { useApp } from '../store';
import { ShoppingCart, Star, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Shop: React.FC = () => {
  const { products, theme, addToCart } = useApp();
  const [showIntro, setShowIntro] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Extract categories
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  // Filter Logic
  const filteredProducts = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
  });

  // Intro shows every time page mounts
  useEffect(() => {
    setShowIntro(true);
    const timer = setTimeout(() => setShowIntro(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <motion.div 
            initial={{ opacity: 1, zIndex: 100 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0a0a0a] flex flex-col items-center justify-center h-screen w-screen z-[100]"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center p-12 border border-brand-gold/30 bg-black/50 backdrop-blur-md"
            >
              <h1 className="text-4xl md:text-7xl font-serif text-white tracking-widest mb-2 font-bold uppercase">LOTORIA</h1>
              <h2 className="text-xl md:text-3xl font-light text-brand-gold tracking-[0.6em] mb-8 uppercase">E - Commerce</h2>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100px" }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="h-0.5 bg-brand-gold mx-auto mb-8"
              ></motion.div>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="text-gray-400 text-sm tracking-widest uppercase"
              >
                Luxury Beauty Products
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="py-12 px-4 max-w-7xl mx-auto min-h-screen bg-brand-cream">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b border-gray-200 pb-6 gap-4">
           <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Shop Collection</h2>
              <span className="text-sm text-gray-500 font-light tracking-wide uppercase">Professional care at home</span>
           </div>
           {/* Search */}
           <div className="relative w-full md:w-auto">
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-brand-gold w-full md:w-64 text-sm transition" 
              />
              <Search className="absolute left-0 top-2 text-gray-400" size={18} />
           </div>
        </div>
        
        {/* Category Filter Chips */}
        <div className="flex overflow-x-auto pb-4 gap-2 mb-8 hide-scrollbar">
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition border ${
                        selectedCategory === cat 
                        ? 'bg-brand-gold text-black border-brand-gold' 
                        : 'bg-white text-gray-500 border-gray-200 hover:border-brand-gold'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>
        
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
              <p>No products found matching your filters.</p>
              <button onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }} className="mt-4 text-brand-gold underline text-sm">Clear All Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white group hover:shadow-2xl transition duration-500 flex flex-col overflow-hidden border border-gray-100">
                <div className="relative aspect-[3/4] bg-gray-50 p-6 flex items-center justify-center overflow-hidden">
                  <img src={product.image} alt={product.name} className="object-contain max-h-full mix-blend-multiply transition duration-700 group-hover:scale-110" />
                  
                  {/* Hover Add Button */}
                  <button 
                    onClick={() => addToCart(product)}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition duration-300 bg-black text-white px-6 py-2 text-xs uppercase tracking-widest font-bold hover:bg-brand-gold hover:text-black w-3/4 text-center whitespace-nowrap"
                  >
                    Add to Cart
                  </button>
                </div>
                
                <div className="p-5 flex-grow flex flex-col">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">{product.category}</p>
                  <h3 className="text-sm md:text-base font-serif font-bold text-gray-900 line-clamp-2 hover:text-brand-gold cursor-pointer mb-2 h-10">{product.name}</h3>
                  
                  <div className="flex items-center mb-3 space-x-1">
                     {[...Array(5)].map((_, i) => (
                       <Star key={i} size={12} fill={i < Math.floor(product.rating) ? "#D4AF37" : "none"} className={i < Math.floor(product.rating) ? "text-brand-gold" : "text-gray-300"} />
                     ))}
                  </div>

                  <div className="mt-auto flex items-baseline gap-3 border-t border-gray-50 pt-3">
                    <span className="text-lg font-bold text-gray-900">₹{product.discountPrice || product.price}</span>
                    <span className="text-xs text-gray-400 line-through">₹{product.price}</span>
                    {product.discountPrice && (
                       <span className="text-[10px] text-red-600 font-bold uppercase tracking-wide">
                         {Math.round(((product.price - product.discountPrice)/product.price)*100)}% off
                       </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
