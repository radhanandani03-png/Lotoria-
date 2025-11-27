
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ShoppingBag, ArrowRight, Star, Clock, ChevronRight, ChevronLeft, Play, Plus, Heart, Sparkles, ShieldCheck, UserCheck, Quote } from 'lucide-react';
import { SERVICE_CATEGORIES } from '../types';

export const Home: React.FC = () => {
  const { homeContent, services, products, homeWidgets, reviews, deals, addToCart } = useApp();
  const navigate = useNavigate();

  // --- HERO SLIDER LOGIC ---
  const [currentSlide, setCurrentSlide] = useState(0);

  // Combine Widgets, Top Services, and Top Products into one Slider
  const bannerSlides = [
      // 1. Default/Widget Slides
      { 
        id: 'default', 
        type: 'widget',
        image: homeContent.heroImage, 
        title: homeContent.introTitle, 
        subtitle: homeContent.introText,
        link: undefined as string | undefined,
        button: "Explore Services",
        price: undefined as number | undefined,
        discount: undefined as string | undefined
      },
      ...homeWidgets.filter(w => w.type === 'image').map(w => ({ 
          id: w.id, 
          type: 'widget',
          image: w.content, 
          title: w.title, 
          subtitle: w.subtitle, 
          link: w.linkUrl, 
          button: w.buttonText,
          price: w.price,
          discount: w.discount
      })),
      // 2. Featured Services (Take top 3)
      ...services.slice(0, 3).map(s => ({
          id: s.id,
          type: 'service',
          image: s.image,
          title: s.category,
          subtitle: s.name,
          link: `/booking?serviceId=${s.id}`,
          button: "Book Appointment",
          price: s.price,
          discount: s.offer
      })),
      // 3. Featured Products (Take top 3)
      ...products.slice(0, 3).map(p => ({
          id: p.id,
          type: 'product',
          image: p.image,
          title: p.category,
          subtitle: p.name,
          link: '/cart',
          button: "Buy Now",
          price: p.discountPrice || p.price,
          discount: p.discountPrice ? `${Math.round(((p.price - p.discountPrice)/p.price)*100)}% OFF` : undefined,
          originalItem: p // Store full item for add to cart
      }))
  ];

  // Auto-slide logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 4000); // 4 seconds per slide
    return () => clearInterval(timer);
  }, [bannerSlides.length]); // Dependency on length ensures it adapts if items change

  const nextSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  };
  
  const prevSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  };

  // Handle Interaction
  const handleSlideClick = (slide: any) => {
      if (slide.type === 'product' && slide.originalItem) {
          addToCart(slide.originalItem);
          navigate('/cart');
      } else if (slide.link) {
          if (slide.link.startsWith('/')) {
              navigate(slide.link);
          } else {
              window.location.href = slide.link;
          }
      } else {
          navigate('/services');
      }
  };

  // --- VIDEO WIDGETS ---
  const videoWidgets = homeWidgets.filter(w => w.type === 'video');

  // Helper for YouTube Embeds
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    try {
        if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/').split('&')[0];
        if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'youtube.com/embed/').split('?')[0];
        if (url.includes('youtube.com/shorts/')) return url.replace('youtube.com/shorts/', 'youtube.com/embed/').split('?')[0];
    } catch (e) { return url; }
    return url;
  };
  const isYouTube = (url: string) => url.includes('youtube.com') || url.includes('youtu.be');

  return (
    <div className="pb-20 bg-gray-50 font-sans min-h-screen">
      
      {/* --- 1. HERO CAROUSEL (Mixed Content) --- */}
      <div className="relative w-full h-[55vh] md:h-[70vh] overflow-hidden bg-gray-900 cursor-pointer group" onClick={() => handleSlideClick(bannerSlides[currentSlide])}>
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentSlide} // Unique key triggers animation
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <img 
              src={bannerSlides[currentSlide].image} 
              alt="Banner" 
              className="w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40"></div>
            
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white pb-16 md:pb-24 flex items-end">
               <div className="max-w-4xl w-full relative z-10">
                 {/* Discount Badge */}
                 {bannerSlides[currentSlide].discount && (
                     <motion.div 
                        initial={{ scale: 0, y: 20 }} animate={{ scale: 1, y: 0 }}
                        className="inline-block bg-red-600 text-white font-bold px-4 py-1 rounded shadow-lg uppercase text-sm tracking-widest mb-4"
                     >
                         {bannerSlides[currentSlide].discount}
                     </motion.div>
                 )}

                 {bannerSlides[currentSlide].title && (
                   <motion.h2 
                     initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                     className="text-brand-gold font-bold tracking-widest uppercase text-xs md:text-sm mb-2"
                   >
                     {bannerSlides[currentSlide].title}
                   </motion.h2>
                 )}
                 <motion.h1 
                    key={`title-${currentSlide}`}
                    initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
                    className="text-3xl md:text-6xl font-serif font-bold leading-tight mb-4 drop-shadow-lg max-w-2xl"
                 >
                    {bannerSlides[currentSlide].subtitle?.substring(0, 80)}
                    {bannerSlides[currentSlide].subtitle?.length > 80 && "..."}
                 </motion.h1>

                 {/* Price Display */}
                 {bannerSlides[currentSlide].price && (
                     <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-2xl md:text-4xl font-bold text-white mb-6"
                     >
                         ₹{bannerSlides[currentSlide].price}
                     </motion.div>
                 )}
                 
                 {/* Action Buttons for Slide */}
                 <div className="flex gap-3">
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleSlideClick(bannerSlides[currentSlide]); }} 
                        className="bg-brand-gold text-black px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-black transition shadow-lg transform hover:-translate-y-1"
                    >
                        {bannerSlides[currentSlide].button || "Explore Now"}
                    </button>
                 </div>
               </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Manual Navigation Arrows */}
        <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-md transition opacity-0 group-hover:opacity-100 hidden md:block"
        >
            <ChevronLeft size={24} />
        </button>
        <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-md transition opacity-0 group-hover:opacity-100 hidden md:block"
        >
            <ChevronRight size={24} />
        </button>
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
           {bannerSlides.map((_, idx) => (
             <button 
               key={idx} 
               onClick={(e) => { e.stopPropagation(); setCurrentSlide(idx); }}
               className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-8 bg-brand-gold' : 'w-2 bg-gray-500'}`}
             />
           ))}
        </div>
      </div>

      {/* --- INTRO SECTION --- */}
      <div className="py-12 px-6 text-center bg-white border-b border-gray-100">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
        >
          <h2 className="text-3xl font-serif font-bold text-brand-gold mb-4 italic">Only Beauty Rules</h2>
          <p className="text-gray-600 leading-relaxed font-light text-lg">
             Are you looking for a fresh, new look? Or do you just want your skin to feel amazing? We can help you achieve that natural, healthy glow. Book your appointment with us at Lotoria Beauty Salon.
          </p>
        </motion.div>
      </div>

      {/* --- 3. EXCLUSIVE DEALS (Card Slider) --- */}
      {deals.length > 0 && (
        <div className="py-8 pl-4 bg-gradient-to-r from-purple-900 to-black text-white mb-6">
           <div className="flex justify-between items-end pr-4 mb-6">
               <div>
                  <h3 className="font-serif text-2xl mb-1">Flash Deals ⚡</h3>
                  <p className="text-gray-400 text-xs">Limited time offers ending soon</p>
               </div>
               <Link to="/deals" className="text-xs uppercase font-bold text-brand-gold border-b border-brand-gold">View All</Link>
           </div>
           
           <div className="flex overflow-x-auto gap-4 hide-scrollbar pr-4 snap-x">
              {deals.map(deal => (
                 <div key={deal.id} className="min-w-[280px] md:min-w-[350px] bg-white text-black rounded-xl overflow-hidden snap-center relative shadow-xl cursor-pointer transform hover:scale-[1.02] transition" onClick={() => navigate(`/booking?dealId=${deal.id}`)}>
                    <div className="h-40 relative">
                       <img src={deal.image} className="w-full h-full object-cover" alt={deal.title}/>
                       <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">
                          {deal.percentageOff}% OFF
                       </div>
                    </div>
                    <div className="p-4">
                       <h4 className="font-bold font-serif text-lg truncate">{deal.title}</h4>
                       <p className="text-xs text-gray-500 line-clamp-1 mb-3">{deal.description}</p>
                       <div className="flex justify-between items-center">
                          <div>
                             <span className="text-xs text-gray-400 line-through mr-2">₹{deal.originalPrice}</span>
                             <span className="text-lg font-bold text-red-600">₹{deal.offerPrice}</span>
                          </div>
                          <button className="bg-black text-white px-4 py-2 rounded-lg text-xs font-bold uppercase hover:bg-brand-gold hover:text-black transition">
                             Claim
                          </button>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      )}

      {/* --- PROFESSIONAL SERVICES INFO --- */}
      <div className="py-16 bg-brand-cream relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl"></div>
          <div className="max-w-7xl mx-auto px-4 relative z-10">
              <div className="text-center mb-12">
                  <span className="text-xs font-bold tracking-widest uppercase text-brand-gold">Prioritize your comfort</span>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold mt-2 mb-6">Professional Beauty Services <br/>Delivered to Your Home</h2>
                  <p className="max-w-3xl mx-auto text-gray-600 italic">
                      "Simply book an appointment, and our highly experienced and certified beauticians will arrive at your location ready to serve you."
                  </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                  {/* Card 1 */}
                  <motion.div 
                    whileHover={{ y: -10 }}
                    className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-brand-gold"
                  >
                      <div className="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center mb-4 text-brand-gold">
                          <Sparkles size={24} />
                      </div>
                      <h3 className="font-serif font-bold text-xl mb-3">Salon Services At Home</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">Get all essential beauty treatments (facials, waxing, manicures, pedicures, and hair care) without the hassle of visiting a traditional parlor.</p>
                  </motion.div>
                  {/* Card 2 */}
                  <motion.div 
                    whileHover={{ y: -10 }}
                    className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-brand-gold"
                  >
                      <div className="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center mb-4 text-brand-gold">
                          <ShieldCheck size={24} />
                      </div>
                      <h3 className="font-serif font-bold text-xl mb-3">Doorstep Beauty Expertise</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">Our experts utilize high-quality, authentic products and strictly sanitized tools, ensuring a safe and luxurious treatment every time.</p>
                  </motion.div>
                  {/* Card 3 */}
                  <motion.div 
                    whileHover={{ y: -10 }}
                    className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-brand-gold"
                  >
                      <div className="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center mb-4 text-brand-gold">
                          <UserCheck size={24} />
                      </div>
                      <h3 className="font-serif font-bold text-xl mb-3">On-Demand Makeup & Hair</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">We offer personalized services, including Bridal Makeup, Party Makeup, and advanced hairstyling for all your special occasions.</p>
                  </motion.div>
              </div>
          </div>
      </div>

      {/* --- 4. TRENDING SERVICES (Horizontal Scroll) --- */}
      <div className="py-12 px-4 max-w-7xl mx-auto">
         <div className="flex justify-between items-center mb-6">
            <div>
               <h3 className="text-xl font-bold text-gray-900 font-serif">Trending Services</h3>
               <p className="text-xs text-gray-500">Most booked by customers</p>
            </div>
            <Link to="/services" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-brand-gold transition">
               <ArrowRight size={16}/>
            </Link>
         </div>

         <div className="flex overflow-x-auto gap-4 hide-scrollbar pb-4 snap-x">
            {services.slice(0, 8).map(service => (
               <div key={service.id} className="min-w-[200px] md:min-w-[240px] bg-white rounded-lg border border-gray-100 shadow-sm snap-start overflow-hidden group hover:shadow-md transition">
                  <div className="h-32 overflow-hidden relative">
                     <img src={service.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt={service.name}/>
                     {service.offer && (
                        <span className="absolute bottom-0 left-0 bg-brand-gold text-black text-[10px] font-bold px-2 py-0.5">
                           {service.offer}
                        </span>
                     )}
                  </div>
                  <div className="p-3">
                     <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">{service.category}</p>
                     <h4 className="font-bold text-sm text-gray-800 line-clamp-1 mb-2">{service.name}</h4>
                     <div className="flex justify-between items-center">
                        <span className="text-sm font-bold">₹{service.price}</span>
                        <Link to={`/booking?serviceId=${service.id}`} className="text-[10px] font-bold border border-black px-3 py-1 rounded hover:bg-black hover:text-white transition uppercase">
                           Add +
                        </Link>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* --- 5. SHOP ESSENTIALS --- */}
      <div className="py-12 bg-white">
         <div className="px-4 max-w-7xl mx-auto">
             <div className="flex justify-between items-end mb-8">
                <div>
                    <h3 className="text-2xl font-serif font-bold text-gray-900">Salon at Home</h3>
                    <p className="text-sm text-gray-500">Professional products for your daily care</p>
                </div>
                <Link to="/shop" className="text-brand-gold text-xs font-bold uppercase border-b border-brand-gold pb-0.5">Shop All</Link>
             </div>

             <div className="flex overflow-x-auto gap-4 hide-scrollbar pb-8 snap-x">
                {products.map(product => (
                   <div key={product.id} className="min-w-[160px] md:min-w-[200px] bg-white snap-start group relative">
                      <div className="aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden mb-3 relative">
                         <img src={product.image} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition duration-500" alt={product.name}/>
                         <button 
                            onClick={() => addToCart(product)}
                            className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-black hover:bg-brand-gold transition"
                         >
                            <Plus size={18}/>
                         </button>
                         {product.discountPrice && (
                             <span className="absolute top-2 left-2 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                                 SALE
                             </span>
                         )}
                      </div>
                      <div>
                         <h4 className="font-bold text-sm text-gray-900 line-clamp-2 leading-tight mb-1">{product.name}</h4>
                         <div className="flex items-center gap-1 mb-1">
                             <Star size={10} className="text-yellow-400" fill="currentColor"/>
                             <span className="text-[10px] text-gray-500">{product.rating}</span>
                         </div>
                         <div className="flex gap-2 items-baseline">
                             <span className="font-bold text-base">₹{product.discountPrice || product.price}</span>
                             {product.discountPrice && <span className="text-xs text-gray-400 line-through">₹{product.price}</span>}
                         </div>
                      </div>
                   </div>
                ))}
             </div>
         </div>
      </div>

      {/* --- WATCH & LEARN --- */}
      {videoWidgets.length > 0 && (
          <div className="py-12 bg-black text-white">
              <div className="px-4 mb-6 max-w-7xl mx-auto">
                  <h3 className="text-xl font-bold font-serif flex items-center gap-2"><Play size={20} className="text-brand-gold"/> Watch & Learn</h3>
              </div>
              <div className="flex overflow-x-auto gap-4 px-4 hide-scrollbar snap-x max-w-7xl mx-auto">
                  {videoWidgets.map(widget => (
                      <div key={widget.id} className="min-w-[250px] aspect-[9/16] bg-gray-800 rounded-xl overflow-hidden relative snap-center border border-gray-700">
                           {isYouTube(widget.content) ? (
                               <iframe 
                                   src={getEmbedUrl(widget.content)} 
                                   className="w-full h-full pointer-events-none"
                                   title="Video"
                                   frameBorder="0"
                               ></iframe>
                           ) : (
                               <video src={widget.content} className="w-full h-full object-cover" muted loop autoPlay playsInline></video>
                           )}
                           <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                           <div className="absolute bottom-0 left-0 p-4 w-full">
                               <h4 className="font-bold text-sm truncate">{widget.title || "Beauty Tips"}</h4>
                               <p className="text-xs text-gray-400 truncate">{widget.subtitle || "Watch now"}</p>
                           </div>
                           <a href={widget.linkUrl || '#'} target="_blank" rel="noreferrer" className="absolute inset-0 z-10"></a>
                      </div>
                  ))}
              </div>
          </div>
      )}

       {/* --- ABOUT US GRID --- */}
       <div className="py-16 bg-brand-cream/30">
          <div className="max-w-7xl mx-auto px-4">
               <div className="flex items-center justify-center gap-4 mb-12">
                  <div className="h-px bg-gray-300 w-12 md:w-20"></div>
                  <h2 className="text-2xl font-serif font-bold uppercase tracking-widest text-center">About Us</h2>
                  <div className="h-px bg-gray-300 w-12 md:w-20"></div>
               </div>

               <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                   <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition">
                      <h3 className="font-serif font-bold text-lg mb-2 text-brand-gold border-b pb-2 inline-block">Our Philosophy</h3>
                      <p className="text-xs text-gray-600 leading-relaxed mt-2">We believe in beauty that comes with a conscience. Our goal is to make professional beauty services accessible and convenient.</p>
                   </div>
                   <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition">
                      <h3 className="font-serif font-bold text-lg mb-2 text-brand-gold border-b pb-2 inline-block">Quality Commitment</h3>
                      <p className="text-xs text-gray-600 leading-relaxed mt-2">We are committed to 100% transparency. We use only genuine, branded products, ensuring you receive the highest quality service.</p>
                   </div>
                    <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition">
                      <h3 className="font-serif font-bold text-lg mb-2 text-brand-gold border-b pb-2 inline-block">True Elegance</h3>
                      <p className="text-xs text-gray-600 leading-relaxed mt-2">Looking and feeling your best can boost your confidence. We are here to help every woman embrace her unique elegance.</p>
                   </div>
                    <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition">
                      <h3 className="font-serif font-bold text-lg mb-2 text-brand-gold border-b pb-2 inline-block">Relationship</h3>
                      <p className="text-xs text-gray-600 leading-relaxed mt-2">We provide advice on skincare and offer free services with special packages as a way to build a lasting relationship.</p>
                   </div>
               </div>
          </div>
      </div>

      {/* --- TESTIMONIALS --- */}
      <div className="py-12 px-4 max-w-7xl mx-auto mb-8">
          <h3 className="text-center font-serif text-2xl font-bold mb-8">What Clients Say</h3>
          <div className="flex overflow-x-auto gap-6 hide-scrollbar snap-x pb-4">
              {reviews.map(review => (
                  <div key={review.id} className="min-w-[300px] md:min-w-[400px] bg-white p-6 rounded-xl shadow-md border border-gray-100 snap-center relative">
                      <Quote className="absolute top-4 right-4 text-gray-100" size={40} />
                      <div className="flex items-center gap-4 mb-4">
                          <div className="w-10 h-10 rounded-full bg-brand-gold/20 text-brand-gold font-bold flex items-center justify-center font-serif">
                             {review.customerName.charAt(0)}
                          </div>
                          <div>
                             <h4 className="font-bold text-sm">{review.customerName}</h4>
                             <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => <Star key={i} size={10} fill={i < review.rating ? "currentColor" : "none"}/>)}
                             </div>
                          </div>
                      </div>
                      <p className="text-gray-600 text-sm italic leading-relaxed relative z-10">"{review.description}"</p>
                  </div>
              ))}
          </div>
      </div>

    </div>
  );
};
