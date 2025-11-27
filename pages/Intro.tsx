
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../store';

export const Intro: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Redirect to Home if logged in, else Auth
      if (user) {
        navigate('/home');
      } else {
        navigate('/auth');
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate, user]);

  return (
    <div className="h-screen w-full bg-black flex flex-col items-center justify-center text-center px-4 overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50"></div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="z-10 border-4 border-[#D4AF37] p-8 md:p-12 bg-black/30 backdrop-blur-sm"
      >
        <h1 className="text-5xl md:text-8xl font-serif text-[#D4AF37] mb-2 tracking-wider">
          Lotoria
        </h1>
        <div className="h-0.5 w-full bg-[#D4AF37] mb-4"></div>
        <motion.p 
          initial={{ opacity: 0, letterSpacing: "0.2em" }}
          animate={{ opacity: 1, letterSpacing: "0.5em" }}
          transition={{ delay: 1, duration: 1.5 }}
          className="text-white text-lg md:text-2xl font-light uppercase"
        >
          Beauty & Luxury
        </motion.p>
      </motion.div>
    </div>
  );
};