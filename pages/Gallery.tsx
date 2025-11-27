
import React from 'react';
import { useApp } from '../store';

export const Gallery: React.FC = () => {
  const { gallery, theme } = useApp();

  return (
    <div className="py-12 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif mb-2" style={{ color: theme.secondaryColor }}>Our Portfolio</h2>
        <p className="text-gray-500">Real clients, Real results</p>
      </div>
      
      {gallery.length === 0 ? (
        <p className="text-center text-gray-400">Gallery is being updated...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {gallery.map(item => (
            <div key={item.id} className="relative group overflow-hidden rounded-lg shadow-lg">
              <div className="aspect-square bg-gray-100">
                <img src={item.image} alt={item.service} className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700" />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition duration-300 flex flex-col items-center justify-center text-center p-4">
                <div className="transform translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition duration-500">
                  <h3 className="font-bold text-xl text-brand-gold">{item.service}</h3>
                  <p className="text-white text-sm mt-1">Client: {item.customerName}</p>
                  <p className="text-gray-300 text-xs mt-2 italic">"{item.description}"</p>
                  <p className="text-gray-400 text-xs mt-4 border-t border-gray-600 pt-2">{item.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
