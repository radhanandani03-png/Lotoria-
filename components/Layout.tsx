
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, User, Facebook, Instagram, Phone, Shield, Home, Mail, MapPin, CreditCard, ArrowRight } from 'lucide-react';
import { useApp } from '../store';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, cart, logout, theme, customPages, contactInfo } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Close menu when route changes
  React.useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  if (location.pathname === '/') return <>{children}</>;

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream font-sans bg-luxury-pattern">
      {/* Navbar - Glass Effect */}
      <nav className="sticky top-0 z-50 transition-all duration-300 glass-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <Link to="/home" className="flex flex-col items-start mr-10 group">
                <span className="text-3xl font-serif font-bold tracking-wider text-brand-gold group-hover:text-white transition">Lotoria</span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 group-hover:text-brand-gold transition">Beauty Salon</span>
              </Link>
              
              {/* Desktop Menu - Exact Order */}
              <div className="hidden lg:flex space-x-6 items-center">
                <Link to="/services" className="hover:text-brand-gold transition text-xs uppercase tracking-widest font-medium">Services</Link>
                <Link to="/deals" className="hover:text-brand-gold transition text-xs uppercase tracking-widest font-medium">Deals</Link>
                <Link to="/shop" className="hover:text-brand-gold transition text-xs uppercase tracking-widest font-medium">Shop</Link>
                <Link to="/gallery" className="hover:text-brand-gold transition text-xs uppercase tracking-widest font-medium">Gallery</Link>
                <Link to="/reviews" className="hover:text-brand-gold transition text-xs uppercase tracking-widest font-medium">Reviews</Link>
                <Link to="/about" className="hover:text-brand-gold transition text-xs uppercase tracking-widest font-medium">About</Link>
                <Link to="/track" className="hover:text-brand-gold transition text-xs uppercase tracking-widest font-medium">Track</Link>
                
                {customPages.map(page => (
                  <Link key={page.id} to={`/page/${page.id}`} className="hover:text-brand-gold transition text-xs uppercase tracking-widest font-medium text-blue-200">
                    {page.title}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Right Side Icons */}
            <div className="flex items-center space-x-5">
               {/* Admin Link for Desktop */}
               <Link to="/admin" className="hidden lg:flex hover:text-brand-gold transition items-center gap-1 px-3 py-1 rounded border border-white/10 hover:border-brand-gold text-xs uppercase">
                  <Shield size={14}/> Admin
                </Link>

              <Link to="/home" className="lg:hidden text-brand-gold hover:text-white transition">
                 <Home size={22} />
              </Link>

              <Link to="/cart" className="relative hover:text-brand-gold transition group">
                <ShoppingBag size={22} className="group-hover:scale-110 transition"/>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-gold text-black text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                    {cart.length}
                  </span>
                )}
              </Link>

              <div className="hidden lg:flex items-center">
                {user ? (
                   <button onClick={handleLogout} className="text-brand-gold border border-brand-gold px-4 py-1.5 rounded-full text-xs hover:bg-brand-gold hover:text-black transition uppercase font-bold tracking-wider">Logout</button>
                ) : (
                  <Link to="/auth" className="flex items-center space-x-1 hover:text-brand-gold text-sm uppercase tracking-wide">
                    <User size={18} /> <span>Login</span>
                  </Link>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden focus:outline-none text-brand-gold">
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="lg:hidden bg-[#121212] border-t border-gray-800 absolute w-full z-50 shadow-2xl h-screen">
            <div className="px-4 pt-6 pb-6 space-y-4 flex flex-col items-center">
              <Link to="/services" className="text-lg font-serif tracking-widest hover:text-brand-gold">Services</Link>
              <Link to="/deals" className="text-lg font-serif tracking-widest hover:text-brand-gold">Deals</Link>
              <Link to="/shop" className="text-lg font-serif tracking-widest hover:text-brand-gold">Buy Products</Link>
              <Link to="/gallery" className="text-lg font-serif tracking-widest hover:text-brand-gold">Gallery</Link>
              <Link to="/reviews" className="text-lg font-serif tracking-widest hover:text-brand-gold">Reviews</Link>
              <Link to="/about" className="text-lg font-serif tracking-widest hover:text-brand-gold">About</Link>
              <Link to="/track" className="text-lg font-serif tracking-widest hover:text-brand-gold">Track Order</Link>
              
               {customPages.map(page => (
                <Link key={page.id} to={`/page/${page.id}`} className="text-lg font-serif tracking-widest text-blue-300 hover:text-brand-gold">
                  {page.title}
                </Link>
              ))}

              <Link to="/admin" className="text-brand-gold mt-4 flex items-center gap-2 border border-brand-gold/30 px-6 py-2 rounded-full"><Shield size={16}/> Admin Panel</Link>

               {user ? (
                 <button onClick={handleLogout} className="text-red-400 font-bold uppercase tracking-widest mt-4">Logout</button>
              ) : (
                <Link to="/auth" className="text-white bg-brand-gold/20 border border-brand-gold px-8 py-2 rounded-full mt-4 uppercase">Login / Signup</Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Professional Luxury Footer */}
      <footer className="bg-[#050505] text-white pt-20 pb-8 border-t border-brand-gold/30 relative overflow-hidden font-sans">
        
        {/* Newsletter Section */}
        <div className="max-w-7xl mx-auto px-4 mb-16 relative z-10">
            <div className="bg-[#111] p-8 md:p-12 rounded-2xl border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl"></div>
                <div className="z-10 text-center md:text-left">
                    <h3 className="text-2xl md:text-3xl font-serif text-brand-gold mb-2">Subscribe for Luxury</h3>
                    <p className="text-gray-400 text-sm">Join our exclusive list for beauty tips & flash sale alerts.</p>
                </div>
                <div className="flex w-full md:w-auto gap-2 z-10">
                    <input type="email" placeholder="Enter your email" className="bg-white/5 border border-gray-700 text-white px-4 py-3 rounded-lg w-full md:w-80 focus:border-brand-gold focus:outline-none transition"/>
                    <button className="bg-brand-gold text-black px-6 py-3 rounded-lg font-bold hover:bg-white transition"><ArrowRight size={20}/></button>
                </div>
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-left relative z-10 border-b border-gray-800 pb-16">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <div className="flex flex-col">
                <span className="text-4xl font-serif font-bold tracking-wider text-brand-gold">Lotoria</span>
                <span className="text-[10px] uppercase tracking-[0.4em] text-gray-400">Beauty & Luxury</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed font-light">Experience the pinnacle of beauty services at the comfort of your home. We bring the professional salon touch directly to your doorstep with certified experts.</p>
            <div className="flex space-x-4">
               {[
                 { icon: <Facebook size={18}/>, url: contactInfo.social.facebook },
                 { icon: <Instagram size={18}/>, url: contactInfo.social.instagram },
                 { icon: <Phone size={18}/>, url: contactInfo.social.whatsapp },
               ].map((item, i) => (
                  <a key={i} href={item.url} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-brand-gold hover:text-black transition duration-300 border border-gray-800">
                      {item.icon}
                  </a>
               ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-[0.2em] text-xs flex items-center gap-2">
                <span className="w-2 h-2 bg-brand-gold rounded-full"></span> Explore
            </h4>
            <ul className="space-y-4 text-sm text-gray-400 font-light">
                <li><Link to="/home" className="hover:text-brand-gold transition flex items-center gap-2"><ArrowRight size={12} className="opacity-0 hover:opacity-100"/> Home</Link></li>
                <li><Link to="/services" className="hover:text-brand-gold transition flex items-center gap-2"><ArrowRight size={12} className="opacity-0 hover:opacity-100"/> Services Menu</Link></li>
                <li><Link to="/shop" className="hover:text-brand-gold transition flex items-center gap-2"><ArrowRight size={12} className="opacity-0 hover:opacity-100"/> Shop Products</Link></li>
                <li><Link to="/deals" className="hover:text-brand-gold transition flex items-center gap-2"><ArrowRight size={12} className="opacity-0 hover:opacity-100"/> Flash Deals</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-[0.2em] text-xs flex items-center gap-2">
                <span className="w-2 h-2 bg-brand-gold rounded-full"></span> Support
            </h4>
            <ul className="space-y-4 text-sm text-gray-400 font-light">
                <li><Link to="/track" className="hover:text-brand-gold transition">Track Order</Link></li>
                <li><Link to="/about" className="hover:text-brand-gold transition">About Us</Link></li>
                <li><Link to="/reviews" className="hover:text-brand-gold transition">Customer Reviews</Link></li>
                <li><Link to="/admin" className="hover:text-brand-gold transition">Partner Login</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-[0.2em] text-xs flex items-center gap-2">
                <span className="w-2 h-2 bg-brand-gold rounded-full"></span> Contact Us
            </h4>
            <div className="space-y-4 text-sm text-gray-400 font-light">
               <div className="flex items-start gap-3">
                   <MapPin className="text-brand-gold shrink-0 mt-1" size={16}/>
                   <span>{contactInfo.address}</span>
               </div>
               <div className="flex items-center gap-3">
                   <Phone className="text-brand-gold shrink-0" size={16}/>
                   <span>{contactInfo.phone}</span>
               </div>
               <div className="flex items-center gap-3">
                   <Mail className="text-brand-gold shrink-0" size={16}/>
                   <span>{contactInfo.email}</span>
               </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto px-4 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
            <p>© {new Date().getFullYear()} Lotoria Beauty Salon. All Rights Reserved.</p>
            <div className="flex gap-4 items-center">
                <span className="uppercase tracking-widest text-[10px] font-bold">Secure Payment:</span>
                <div className="flex gap-2">
                     <span className="bg-white/10 px-2 py-1 rounded text-white flex items-center gap-1"><CreditCard size={12}/> UPI</span>
                     <span className="bg-white/10 px-2 py-1 rounded text-white flex items-center gap-1"><CreditCard size={12}/> VISA</span>
                     <span className="bg-white/10 px-2 py-1 rounded text-white flex items-center gap-1"><CreditCard size={12}/> COD</span>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
};
