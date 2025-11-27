

import React from 'react';
import { HashRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Intro } from './pages/Intro';
import { Auth } from './pages/Auth';
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { Deals } from './pages/Deals';
import { Shop } from './pages/Shop';
import { Booking } from './pages/Booking';
import { Admin } from './pages/Admin';
import { About } from './pages/About';
import { Reviews } from './pages/Review';
import { Track } from './pages/Track';
import { Gallery } from './pages/Gallery';
import { Cart } from './pages/Cart';
import { useApp } from './store';
import { PageBlock } from './types';

const CustomPageView: React.FC = () => {
  const { id } = useParams();
  const { customPages } = useApp();
  const page = customPages.find(p => p.id === id);

  if (!page) return <div className="p-10 text-center">Page Not Found</div>;

  const renderBlock = (block: PageBlock) => {
    switch(block.type) {
      case 'hero':
        return (
          <div key={block.id} className="relative h-[500px] w-full mb-12 flex items-center justify-center overflow-hidden">
             {block.url ? (
               <img src={block.url} alt={block.title} className="absolute inset-0 w-full h-full object-cover" />
             ) : (
               <div className="absolute inset-0 bg-gray-900" />
             )}
             <div className="absolute inset-0 bg-black/50" />
             <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-serif text-brand-gold font-bold mb-4 drop-shadow-lg">{block.title}</h2>
                <p className="text-white text-xl md:text-2xl font-light tracking-wide drop-shadow-md">{block.subtitle}</p>
             </div>
          </div>
        );
      case 'text':
        return (
          <div key={block.id} className="mb-12 max-w-4xl mx-auto px-4 prose prose-lg">
             {block.title && <h3 className="text-3xl font-serif font-bold mb-4 text-gray-900 border-b-2 border-brand-gold/20 pb-2 inline-block">{block.title}</h3>}
             <div className="whitespace-pre-line leading-loose text-gray-700 font-light text-lg">{block.content}</div>
          </div>
        );
      case 'image':
        return (
           <div key={block.id} className="mb-12 max-w-5xl mx-auto px-4">
              <div className="rounded-xl overflow-hidden shadow-2xl border-4 border-white">
                 <img src={block.url} alt={block.title} className="w-full h-auto" />
              </div>
              {block.content && <p className="text-center text-sm text-gray-500 mt-3 font-serif italic border-l-2 border-brand-gold pl-3 inline-block">{block.content}</p>}
           </div>
        );
      case 'video':
        const isYouTube = block.url?.includes('youtube.com') || block.url?.includes('youtu.be');
        const embedUrl = isYouTube && block.url ? block.url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/').split('&')[0] : block.url;
        
        return (
          <div key={block.id} className="mb-12 max-w-4xl mx-auto px-4">
             {block.title && <h3 className="text-2xl font-bold mb-4 border-l-4 border-brand-gold pl-4">{block.title}</h3>}
             <div className="relative pt-[56.25%] bg-black rounded-xl overflow-hidden shadow-2xl">
                {isYouTube ? (
                   <iframe src={embedUrl} className="absolute inset-0 w-full h-full" allowFullScreen title={block.title}></iframe>
                ) : (
                   <video src={block.url} controls className="absolute inset-0 w-full h-full"></video>
                )}
             </div>
             {block.content && <p className="text-gray-600 mt-3 ml-2">{block.content}</p>}
          </div>
        );
      case 'list':
        return (
          <div key={block.id} className="mb-12 max-w-4xl mx-auto px-4 bg-white p-8 rounded-xl border border-gray-100 shadow-md">
             {block.title && <h3 className="text-2xl font-bold mb-6 flex items-center gap-3"><span className="w-1.5 h-8 bg-brand-gold block rounded-full"></span>{block.title}</h3>}
             <ul className="space-y-4">
                {block.content?.split('\n').map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4 group">
                     <span className="text-brand-gold font-bold text-xl group-hover:scale-125 transition">•</span>
                     <span className="text-gray-700 text-lg">{item}</span>
                  </li>
                ))}
             </ul>
          </div>
        );
      case 'button':
        const alignClass = block.content === 'center' ? 'text-center' : block.content === 'right' ? 'text-right' : 'text-left';
        return (
            <div key={block.id} className={`mb-12 max-w-4xl mx-auto px-4 ${alignClass}`}>
                <a 
                  href={block.url} 
                  target={block.url?.startsWith('http') ? '_blank' : '_self'}
                  rel="noreferrer"
                  className="inline-block bg-brand-gold text-black px-10 py-4 rounded font-bold uppercase tracking-widest text-sm shadow-xl hover:bg-black hover:text-white transition duration-300 transform hover:-translate-y-1"
                >
                    {block.title || "Click Here"}
                </a>
            </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream pb-20">
       {/* Use Page Title as browser title logic would go here, for now just render blocks */}
       <div>
         {page.blocks ? page.blocks.map(renderBlock) : (
           // Legacy support
           <div className="prose max-w-4xl mx-auto px-4 py-12" dangerouslySetInnerHTML={{ __html: (page as any).content }}></div>
         )}
       </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/home" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/about" element={<About />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/track" element={<Track />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/page/:id" element={<CustomPageView />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;