
import React, { useState } from 'react';
import { useApp } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award } from 'lucide-react';

export const About: React.FC = () => {
  const { theme, teamMembers } = useApp();
  const [selectedMember, setSelectedMember] = useState<any>(null);

  const founders = teamMembers.filter(m => m.isFounder);
  const others = teamMembers.filter(m => !m.isFounder);

  return (
    <div className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-serif font-bold mb-4" style={{ color: theme.secondaryColor }}>About Us</h2>
        <div className="w-24 h-1 bg-brand-gold mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <div className="space-y-6">
          <h3 className="text-2xl font-bold">Our Philosophy</h3>
          <p className="text-gray-600">We believe in beauty that comes with a conscience. Our goal is to make professional beauty services accessible and convenient. With our at-home service, you don't have to leave the comfort of your house to look and feel your best.</p>
          
          <h3 className="text-2xl font-bold">True Elegance, Real Confidence</h3>
          <p className="text-gray-600">Looking and feeling your best can boost your confidence and help you achieve your goals in both your personal and professional life. We are here to help every woman embrace her unique elegance and feel truly beautiful.</p>
        </div>
        <div className="bg-gray-100 p-8 rounded-2xl text-center">
           <h3 className="text-xl font-serif italic mb-6">"Building a Relationship"</h3>
           <p className="text-gray-500">If you have a specific look in mind, we can work with you to create a personalized plan to achieve it. We also provide advice on skincare and offer free services with special packages as a way to build a lasting relationship.</p>
        </div>
      </div>

      {/* Founders & Team */}
      <div className="text-center">
        <h3 className="text-3xl font-serif mb-12">Meet The Visionaries</h3>
        
        {/* Founders Circle */}
        <div className="flex flex-col md:flex-row justify-center gap-12 mb-16">
          {founders.map(member => (
            <div key={member.id} className="flex flex-col items-center cursor-pointer group" onClick={() => setSelectedMember(member)}>
               <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-brand-gold mb-4 shadow-xl relative">
                 <img src={member.image} alt={member.name} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                 {member.certificate && (
                     <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                         <span className="text-white font-bold text-xs uppercase border border-white px-2 py-1">View Bio</span>
                     </div>
                 )}
               </div>
               <h4 className="text-xl font-bold group-hover:text-brand-gold transition">{member.name}</h4>
               <p className="text-brand-gold">{member.role}</p>
            </div>
          ))}
        </div>

        {/* Other Team Members */}
        {others.length > 0 && (
          <>
            <h4 className="text-2xl font-serif mb-8 text-gray-500">Our Experts</h4>
            <div className="flex flex-wrap justify-center gap-8">
              {others.map(member => (
                <div key={member.id} className="flex flex-col items-center cursor-pointer group" onClick={() => setSelectedMember(member)}>
                   <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 mb-3 shadow-md relative">
                     <img src={member.image} alt={member.name} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                   </div>
                   <h5 className="font-bold text-sm group-hover:text-brand-gold">{member.name}</h5>
                   <p className="text-xs text-gray-400">{member.role}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Certificate/Bio Modal */}
      <AnimatePresence>
          {selectedMember && (
              <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={() => setSelectedMember(null)}>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="bg-white rounded-xl overflow-hidden max-w-2xl w-full relative border border-brand-gold shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                      <button onClick={() => setSelectedMember(null)} className="absolute top-4 right-4 z-10 bg-black text-white p-1 rounded-full"><X size={20}/></button>
                      <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/3 h-64 md:h-auto">
                              <img src={selectedMember.image} className="w-full h-full object-cover" alt={selectedMember.name} />
                          </div>
                          <div className="p-8 md:w-2/3 bg-brand-cream">
                              <h3 className="text-3xl font-serif font-bold text-black">{selectedMember.name}</h3>
                              <p className="text-brand-gold font-bold mb-4">{selectedMember.role}</p>
                              <p className="text-gray-600 mb-6 italic">"{selectedMember.bio || 'Professional Beauty Expert dedicated to excellence.'}"</p>
                              
                              {selectedMember.certificate && (
                                  <div className="border-t border-gray-300 pt-4">
                                      <h4 className="text-sm font-bold uppercase mb-2 flex items-center gap-2"><Award size={16}/> Certification</h4>
                                      <div className="border-4 border-double border-brand-gold p-1 inline-block bg-white shadow-lg">
                                          <img src={selectedMember.certificate} className="h-32 object-contain" alt="Certificate" />
                                      </div>
                                  </div>
                              )}
                          </div>
                      </div>
                  </motion.div>
              </div>
          )}
      </AnimatePresence>
    </div>
  );
};
