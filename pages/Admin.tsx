
import React, { useState, useEffect } from 'react';
import { useApp } from '../store';
import { useNavigate } from 'react-router-dom';
import { Trash2, Edit, Plus, Bell, Users, Ticket, Image as ImageIcon, FileText, Settings, ShoppingBag, Scissors, LogOut, CreditCard, Phone, UserPlus, X, Save, Lock, Video, Link as LinkIcon, AlertTriangle, ArrowUp, ArrowDown, Layout as LayoutIcon, Type, List, Image, MousePointerClick, Sparkles, Star, MessageSquare, Key, Menu } from 'lucide-react';
import { SERVICE_CATEGORIES, PageBlock, PageBlockType } from '../types';

// --- Modal Component ---
const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode; width?: string }> = ({ title, onClose, children, width = "max-w-lg" }) => (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
    <div className={`bg-white rounded-xl shadow-2xl w-full ${width} overflow-hidden animate-fade-in max-h-[90vh] flex flex-col border border-brand-gold`}>
      <div className="bg-brand-gold p-4 flex justify-between items-center text-white shrink-0">
        <h3 className="font-bold text-lg font-serif">{title}</h3>
        <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition"><X size={20}/></button>
      </div>
      <div className="p-6 overflow-y-auto">
        {children}
      </div>
    </div>
  </div>
);

// --- Delete Confirmation Modal ---
const DeleteModal: React.FC<{ onConfirm: () => void; onCancel: () => void }> = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[110] p-4">
    <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-2xl text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="text-red-600" size={32} />
      </div>
      <h3 className="text-xl font-bold mb-2 text-black">Are you sure?</h3>
      <p className="text-gray-500 mb-6">This action cannot be undone. This item will be permanently deleted.</p>
      <div className="flex gap-3 justify-center">
        <button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded font-bold hover:bg-gray-300 text-black">Cancel</button>
        <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-700">Yes, Delete</button>
      </div>
    </div>
  </div>
);

export const Admin: React.FC = () => {
  const { 
    user, login, logout, users,
    theme, setTheme, 
    homeContent, updateHomeContent, 
    products, setProducts, updateProduct,
    services, setServices, updateService,
    deals, setDeals, updateDeal,
    gallery, setGallery, updateGalleryItem,
    reviews, setReviews, updateReview,
    coupons, setCoupons,
    customPages, setCustomPages,
    bookings, updateBookingStatus, sendBookingNotification,
    paymentConfig, setPaymentConfig,
    contactInfo, setContactInfo,
    teamMembers, setTeamMembers,
    adminProfile, setAdminProfile,
    homeWidgets, setHomeWidgets, updateHomeWidget
  } = useApp();
  
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  // Load admin password from localStorage or default to 'admin123'
  const [adminPassword, setAdminPassword] = useState(() => localStorage.getItem('lotoria_admin_password') || 'admin123');
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showForgot, setShowForgot] = useState(false);
  const navigate = useNavigate();

  // Mobile Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modal States
  const [modalType, setModalType] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>(null);

  // Delete Confirmation State
  const [deleteConfig, setDeleteConfig] = useState<{id: string, type: string} | null>(null);

  // Notification State
  const [notificationConfig, setNotificationConfig] = useState<{id: string, name: string} | null>(null);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Profile/Password Update State
  const [profileUpdateType, setProfileUpdateType] = useState<'mobile' | 'email' | 'password' | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [newProfileValue, setNewProfileValue] = useState('');
  const [resetMethod, setResetMethod] = useState<'mobile' | 'email'>('mobile');

  // Page Builder State
  const [pageTitle, setPageTitle] = useState('');
  const [pageBlocks, setPageBlocks] = useState<PageBlock[]>([]);

  // Coupon Specific Selection
  const [couponApplicableType, setCouponApplicableType] = useState<string>('all');

  // Check if already logged in as admin
  useEffect(() => {
    if (user?.isAdmin) {
      setIsAdminAuth(true);
    }
  }, [user]);

  // Admin Login
  const handleAdminLogin = () => {
    if (passwordInput === adminPassword) {
      setIsAdminAuth(true);
      login({ 
        id: 'admin',
        name: 'Admin', 
        email: adminProfile.email, 
        mobile: adminProfile.mobile, 
        address: 'Office', 
        favoriteService: 'All', 
        isAdmin: true 
      });
    } else {
      alert('Invalid Password');
    }
  };

  // --- Reset Password Logic (Login Screen) ---
  const handleSendResetOtp = () => {
      const target = resetMethod === 'mobile' ? adminProfile.mobile : adminProfile.email;
      alert(`OTP sent to ${target} (Simulated OTP: 1234)`);
      setOtpSent(true);
  };

  const handleVerifyResetOtp = () => {
      if(otpInput === '1234') {
          if(!newProfileValue) return alert("Please enter new password");
          setAdminPassword(newProfileValue);
          localStorage.setItem('lotoria_admin_password', newProfileValue);
          alert("Password Reset Successfully! Please login.");
          setShowForgot(false);
          setOtpSent(false);
          setOtpInput('');
          setNewProfileValue('');
          setPasswordInput('');
      } else {
          alert("Incorrect OTP");
      }
  };


  // --- Profile/Password Update Logic (Inside Admin) ---
  const initiateProfileUpdate = (type: 'mobile' | 'email' | 'password') => {
      setProfileUpdateType(type);
      setOtpSent(false);
      setOtpInput('');
      setNewProfileValue('');
      setModalType('profileUpdate');
  };

  const sendOtp = () => {
      // For password change, we can choose where to send, default to mobile for now
      const target = adminProfile.mobile; 
      alert(`OTP sent to ${target} (Simulated OTP: 1234)`);
      setOtpSent(true);
  };

  const verifyOtpAndUpdate = () => {
      if(otpInput === '1234') {
          if(!newProfileValue) return alert("Please enter new value");
          
          if (profileUpdateType === 'password') {
              setAdminPassword(newProfileValue);
              localStorage.setItem('lotoria_admin_password', newProfileValue);
              alert("Password Changed Successfully!");
          } else if (profileUpdateType) {
              setAdminProfile({
                  ...adminProfile,
                  [profileUpdateType]: newProfileValue
              });
              alert("Profile Updated Successfully!");
          }
          setModalType(null);
      } else {
          alert("Incorrect OTP");
      }
  };

  // --- NEW DELETE LOGIC ---
  const requestDelete = (id: string, type: string) => {
    setDeleteConfig({ id, type });
  };

  const executeDelete = () => {
    if (!deleteConfig) return;
    const { id, type } = deleteConfig;

    if (type === 'service') setServices(services.filter(i => i.id !== id));
    if (type === 'product') setProducts(products.filter(i => i.id !== id));
    if (type === 'deal') setDeals(deals.filter(i => i.id !== id));
    if (type === 'team') setTeamMembers(teamMembers.filter(i => i.id !== id));
    if (type === 'widget') setHomeWidgets(homeWidgets.filter(i => i.id !== id));
    if (type === 'gallery') setGallery(gallery.filter(i => i.id !== id));
    if (type === 'coupon') setCoupons(coupons.filter(i => i.id !== id));
    if (type === 'page') setCustomPages(customPages.filter(i => i.id !== id));
    if (type === 'review') setReviews(reviews.filter(i => i.id !== id));

    setDeleteConfig(null);
  };

  // --- NOTIFICATION LOGIC ---
  const handleSendNotification = () => {
    if(notificationConfig && notificationMessage) {
      sendBookingNotification(notificationConfig.id, notificationMessage);
      setNotificationConfig(null);
      setNotificationMessage('');
      alert("Custom Message Sent to Customer!");
    }
  };

  // --- FORM HANDLERS ---
  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
      description: formData.get('description') as string,
      image: formData.get('image') as string,
      category: formData.get('category') as string,
      offer: formData.get('offer') as string,
    };

    if (editData) {
      updateService({ ...editData, ...data });
    } else {
      setServices([...services, { id: Date.now().toString(), ...data }]);
    }
    setModalType(null); setEditData(null);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
      discountPrice: Number(formData.get('discountPrice')) || undefined,
      category: formData.get('category') as string,
      description: formData.get('description') as string,
      image: formData.get('image') as string,
      rating: 5
    };
    if(editData) updateProduct({ ...editData, ...data });
    else setProducts([...products, { id: Date.now().toString(), ...data }]);
    setModalType(null); setEditData(null);
  };

  const handleSaveDeal = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const original = Number(formData.get('originalPrice'));
    const offer = Number(formData.get('offerPrice'));
    const percent = Math.round(((original - offer)/original)*100);
    
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      originalPrice: original,
      offerPrice: offer,
      percentageOff: percent,
      image: formData.get('image') as string,
      category: formData.get('category') as string,
    };
    if(editData) updateDeal({ ...editData, ...data });
    else setDeals([...deals, { id: Date.now().toString(), ...data }]);
    setModalType(null); setEditData(null);
  };

  const handleSaveTeam = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get('name') as string,
      role: formData.get('role') as string,
      image: formData.get('image') as string,
      bio: formData.get('bio') as string,
      certificate: formData.get('certificate') as string,
      isFounder: formData.get('isFounder') === 'on'
    };
    if(editData) {
        setTeamMembers(teamMembers.map(t => t.id === editData.id ? { ...editData, ...data } : t));
    } else {
        setTeamMembers([...teamMembers, { id: Date.now().toString(), ...data }]);
    }
    setModalType(null); setEditData(null);
  };

  const handleSaveWidget = (e: React.FormEvent) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      const data = {
          type: formData.get('type') as any,
          content: formData.get('content') as string,
          linkUrl: formData.get('linkUrl') as string,
          caption: formData.get('caption') as string,
          // New Features
          title: formData.get('title') as string,
          subtitle: formData.get('subtitle') as string,
          buttonText: formData.get('buttonText') as string,
          layout: formData.get('layout') as any,
          price: Number(formData.get('price')) || undefined,
          discount: formData.get('discount') as string,
      };

      if (editData) {
          updateHomeWidget({ ...editData, ...data });
      } else {
          setHomeWidgets([...homeWidgets, { id: Date.now().toString(), ...data }]);
      }
      setModalType(null); setEditData(null);
  };

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const applicableTo = formData.get('applicable') as 'all' | 'service' | 'product';
    const targetId = formData.get('targetId') as string;
    
    let targetName = undefined;
    if (targetId) {
        if (applicableTo === 'service') {
            targetName = services.find(s => s.id === targetId)?.name;
        } else if (applicableTo === 'product') {
            targetName = products.find(p => p.id === targetId)?.name;
        }
    }

    const data = {
      id: Date.now().toString(),
      code: formData.get('code') as string,
      discountType: formData.get('type') as 'percentage' | 'flat',
      value: Number(formData.get('value')),
      applicableTo,
      targetId: targetId || undefined,
      targetName: targetName
    };
    setCoupons([...coupons, data]);
    setModalType(null);
  };

  const handleSaveGallery = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      customerName: formData.get('customer') as string,
      service: formData.get('service') as string,
      description: formData.get('desc') as string,
      image: formData.get('image') as string,
      date: editData ? editData.date : new Date().toISOString().split('T')[0],
    };

    if (editData) {
        updateGalleryItem({ ...editData, ...data });
    } else {
        setGallery([...gallery, { id: Date.now().toString(), ...data }]);
    }
    setModalType(null); setEditData(null);
  };

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      customerName: formData.get('customerName') as string,
      serviceName: formData.get('serviceName') as string,
      address: formData.get('address') as string,
      description: formData.get('description') as string,
      photo: formData.get('photo') as string,
      rating: Number(formData.get('rating')),
    };

    if (editData) {
        updateReview({ ...editData, ...data });
    } else {
        setReviews([...reviews, { id: Date.now().toString(), ...data }]);
    }
    setModalType(null); setEditData(null);
  };


  // --- PAGE BUILDER LOGIC ---
  const addBlock = (type: PageBlockType) => {
    setPageBlocks([...pageBlocks, { id: Date.now().toString(), type: type, content: '', url: '', title: '' }]);
  };

  const updateBlock = (id: string, field: keyof PageBlock, value: string) => {
    setPageBlocks(pageBlocks.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const removeBlock = (id: string) => {
    setPageBlocks(pageBlocks.filter(b => b.id !== id));
  };

  const handleSavePage = () => {
    if(!pageTitle) return alert("Please enter page title");
    
    const data = {
      id: editData ? editData.id : Date.now().toString(),
      title: pageTitle,
      blocks: pageBlocks
    };
    
    if (editData) {
        setCustomPages(customPages.map(p => p.id === editData.id ? { ...p, ...data } : p));
    } else {
        setCustomPages([...customPages, data]);
    }
    
    setModalType(null);
    setPageBlocks([]); setPageTitle(''); setEditData(null);
  };

  const commonInputClass = "w-full border border-gray-300 p-2 rounded text-black bg-white focus:outline-none focus:border-brand-gold shadow-sm";

  if (!isAdminAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-brand-gold">Admin Panel</h2>
            <p className="text-gray-500 text-sm mt-2">Restricted Access</p>
          </div>
          
          {!showForgot ? (
            <>
              <input 
                type="password" 
                placeholder="Enter Admin Password" 
                className="w-full border p-3 mb-6 rounded focus:ring-2 focus:ring-brand-gold outline-none text-black bg-white"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
              />
              <button onClick={handleAdminLogin} className="w-full bg-black text-white py-3 rounded font-bold hover:opacity-90 transition">Login</button>
              <button onClick={() => { setShowForgot(true); setOtpSent(false); setOtpInput(''); }} className="w-full text-blue-600 text-sm mt-4 hover:underline">Forgot Password?</button>
            </>
          ) : (
            <div className="text-center">
                {!otpSent ? (
                    <div className="space-y-4">
                        <p className="text-sm font-bold text-gray-700">Select Reset Method:</p>
                        <div className="flex gap-2 justify-center mb-4">
                            <button onClick={() => setResetMethod('mobile')} className={`px-4 py-2 rounded text-xs font-bold ${resetMethod === 'mobile' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`}>Mobile</button>
                            <button onClick={() => setResetMethod('email')} className={`px-4 py-2 rounded text-xs font-bold ${resetMethod === 'email' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`}>Email</button>
                        </div>
                        <p className="mb-4 text-xs text-gray-500">We will send an OTP to {resetMethod === 'mobile' ? adminProfile.mobile : adminProfile.email}</p>
                        <button onClick={handleSendResetOtp} className="w-full bg-brand-gold text-white py-3 rounded font-bold">Send OTP</button>
                    </div>
                ) : (
                    <div className="space-y-4 text-left">
                         <p className="text-green-600 font-bold text-center text-sm">OTP Sent Successfully!</p>
                         <input 
                            value={otpInput}
                            onChange={(e) => setOtpInput(e.target.value)}
                            placeholder="Enter 4-digit OTP"
                            className={commonInputClass}
                        />
                        <input 
                            value={newProfileValue}
                            onChange={(e) => setNewProfileValue(e.target.value)}
                            placeholder="Enter New Password"
                            type="password"
                            className={commonInputClass}
                        />
                        <button onClick={handleVerifyResetOtp} className="w-full bg-black text-white py-3 rounded font-bold">Verify & Reset Password</button>
                    </div>
                )}
                
                <button onClick={() => setShowForgot(false)} className="w-full text-gray-500 text-sm mt-4 hover:text-black">Back to Login</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 overflow-hidden relative">
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Mobile Responsive Drawer */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white flex flex-col h-full transform transition-transform duration-300 ease-in-out shadow-2xl
        md:static md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex justify-between items-center">
           <div>
              <h2 className="text-2xl font-serif text-brand-gold font-bold">CMS Panel</h2>
              <p className="text-xs text-gray-400 mt-1">Lotoria Beauty</p>
           </div>
           <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-gray-400 hover:text-white">
              <X size={24}/>
           </button>
        </div>
        <nav className="flex-1 space-y-1 px-2 pb-4 overflow-y-auto hide-scrollbar">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <div className="w-4 h-4 rounded bg-blue-500"/> },
            { id: 'bookings', label: 'Orders & Bookings', icon: <ShoppingBag size={16}/> },
            { id: 'contact', label: 'Contact & Socials', icon: <Phone size={16}/> },
            { id: 'team', label: 'Team & About', icon: <Users size={16}/> },
            { id: 'content', label: 'Home Content', icon: <FileText size={16}/> },
            { id: 'services', label: 'Services', icon: <Scissors size={16}/> },
            { id: 'products', label: 'Products', icon: <ShoppingBag size={16}/> },
            { id: 'deals', label: 'Deals', icon: <Ticket size={16}/> },
            { id: 'gallery', label: 'Gallery', icon: <ImageIcon size={16}/> },
            { id: 'reviews', label: 'Reviews', icon: <Star size={16}/> },
            { id: 'coupons', label: 'Coupons', icon: <Ticket size={16}/> },
            { id: 'pages', label: 'Custom Pages', icon: <LayoutIcon size={16}/> },
            { id: 'payment', label: 'Payment Settings', icon: <CreditCard size={16}/> },
            { id: 'users', label: 'Users', icon: <Users size={16}/> },
            { id: 'settings', label: 'Theme & Profile', icon: <Settings size={16}/> },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all duration-200 ${activeTab === tab.id ? 'bg-gradient-to-r from-brand-gold to-rose-600 text-white font-bold shadow-lg transform scale-105' : 'hover:bg-gray-800 text-gray-300'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800 bg-gray-900 z-10">
           <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition font-bold text-sm">
             <LogOut size={16}/> Logout
           </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 relative w-full">
        {/* Mobile Header */}
        <div className="flex items-center gap-4 mb-6 border-b pb-4 md:hidden sticky top-0 bg-gray-100 z-30 pt-2">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 bg-white rounded shadow text-black hover:bg-brand-gold hover:text-white transition">
                <Menu size={24}/>
            </button>
            <h1 className="text-xl font-bold capitalize text-gray-800">{activeTab.replace('-', ' ')}</h1>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex justify-between items-center mb-6 border-b pb-4">
           <h1 className="text-2xl md:text-3xl font-bold capitalize text-gray-800">{activeTab.replace('-', ' ')}</h1>
           {/* Add Button Logic based on Tab */}
           {['services', 'products', 'deals', 'team', 'content', 'gallery', 'coupons', 'reviews'].includes(activeTab) && (
              <button 
                onClick={() => { setModalType(activeTab); setEditData(null); }} 
                className="bg-black text-white px-4 py-2 rounded flex items-center gap-2 font-bold shadow-lg hover:bg-brand-gold transition"
              >
                <Plus size={18}/> Add New
              </button>
           )}
        </div>

        {/* Mobile Add Button (Floating) */}
        {['services', 'products', 'deals', 'team', 'content', 'gallery', 'coupons', 'reviews'].includes(activeTab) && (
            <button 
              onClick={() => { setModalType(activeTab); setEditData(null); }} 
              className="md:hidden fixed bottom-6 right-6 bg-brand-gold text-white p-4 rounded-full shadow-2xl z-40 border-2 border-white animate-bounce"
            >
              <Plus size={24}/>
            </button>
        )}

        {activeTab === 'dashboard' && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500">
                    <h3 className="text-gray-500 text-sm font-bold uppercase">Total Bookings</h3>
                    <p className="text-3xl font-bold mt-2 text-black">{bookings.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500">
                    <h3 className="text-gray-500 text-sm font-bold uppercase">Products</h3>
                    <p className="text-3xl font-bold mt-2 text-black">{products.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow border-l-4 border-rose-500">
                    <h3 className="text-gray-500 text-sm font-bold uppercase">Services</h3>
                    <p className="text-3xl font-bold mt-2 text-black">{services.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow border-l-4 border-purple-500">
                    <h3 className="text-gray-500 text-sm font-bold uppercase">Revenue (Est)</h3>
                    <p className="text-3xl font-bold mt-2 text-black">₹{bookings.reduce((acc, curr) => acc + curr.totalAmount, 0)}</p>
                </div>
            </div>
        )}

        {/* --- BOOKINGS --- */}
        {activeTab === 'bookings' && (
           <div className="space-y-4">
              {bookings.map(booking => (
                 <div key={booking.id} className="bg-white p-6 rounded-lg shadow border border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                       <div>
                          <p className="font-bold text-lg text-black">{booking.customerName}</p>
                          <p className="text-sm text-gray-500">{booking.mobile}</p>
                          <p className="text-sm mt-2 font-mono bg-gray-100 inline-block px-2">{booking.type} - {booking.date} @ {booking.timeSlot}</p>
                          <p className="mt-2 text-black">Amount: <span className="font-bold">₹{booking.totalAmount}</span> ({booking.paymentMethod})</p>
                          <p className="text-sm text-gray-600 mt-1 max-w-md">{booking.address}</p>
                       </div>
                       <div className="text-right space-y-2 w-full md:w-auto">
                          <select 
                             value={booking.status} 
                             onChange={(e) => updateBookingStatus(booking.id, e.target.value as any)}
                             className="border p-2 rounded bg-white text-black w-full md:w-auto"
                          >
                             <option value="Pending">Pending</option>
                             <option value="Confirmed">Confirmed</option>
                             <option value="Completed">Completed</option>
                             <option value="Cancelled">Cancelled</option>
                          </select>
                          <button 
                             onClick={() => setNotificationConfig({ id: booking.id, name: booking.customerName })}
                             className="block w-full text-xs bg-blue-100 text-blue-700 py-2 rounded hover:bg-blue-200 flex items-center justify-center gap-1"
                          >
                             <MessageSquare size={14}/> Send Msg
                          </button>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        )}

        {/* --- SERVICES --- */}
        {activeTab === 'services' && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map(service => (
                 <div key={service.id} className="bg-white rounded-lg shadow overflow-hidden group">
                    <div className="h-40 overflow-hidden relative">
                       <img src={service.image} className="w-full h-full object-cover" alt={service.name}/>
                       <div className="absolute top-2 right-2 flex gap-2">
                           <button onClick={() => { setEditData(service); setModalType('services'); }} className="bg-white p-2 rounded-full shadow hover:text-blue-600"><Edit size={16}/></button>
                           <button onClick={() => requestDelete(service.id, 'service')} className="bg-white p-2 rounded-full shadow hover:text-red-600"><Trash2 size={16}/></button>
                       </div>
                    </div>
                    <div className="p-4">
                       <h4 className="font-bold text-black">{service.name}</h4>
                       <p className="text-brand-gold font-bold">₹{service.price}</p>
                       <p className="text-xs text-gray-500 mt-1">{service.category}</p>
                    </div>
                 </div>
              ))}
           </div>
        )}

        {/* --- PRODUCTS --- */}
        {activeTab === 'products' && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                 <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden relative">
                    <img src={product.image} className="w-full h-40 object-cover" alt={product.name}/>
                    <div className="absolute top-2 right-2 flex gap-2">
                        <button onClick={() => { setEditData(product); setModalType('products'); }} className="bg-white p-2 rounded-full shadow hover:text-blue-600"><Edit size={16}/></button>
                        <button onClick={() => requestDelete(product.id, 'product')} className="bg-white p-2 rounded-full shadow hover:text-red-600"><Trash2 size={16}/></button>
                    </div>
                    <div className="p-4">
                       <h4 className="font-bold text-black">{product.name}</h4>
                       <p className="text-brand-gold font-bold">₹{product.price}</p>
                    </div>
                 </div>
              ))}
           </div>
        )}

        {/* --- DEALS --- */}
        {activeTab === 'deals' && (
           <div className="space-y-4">
              {deals.map(deal => (
                 <div key={deal.id} className="bg-white p-4 rounded shadow flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4 w-full">
                       <img src={deal.image} className="w-16 h-16 rounded object-cover" alt={deal.title}/>
                       <div>
                          <h4 className="font-bold text-black">{deal.title}</h4>
                          <p className="text-sm text-red-500 font-bold">{deal.percentageOff}% OFF</p>
                       </div>
                    </div>
                    <div className="flex gap-2 self-end md:self-auto">
                        <button onClick={() => { setEditData(deal); setModalType('deals'); }} className="text-blue-500"><Edit size={20}/></button>
                        <button onClick={() => requestDelete(deal.id, 'deal')} className="text-red-500"><Trash2 size={20}/></button>
                    </div>
                 </div>
              ))}
           </div>
        )}

        {/* --- TEAM --- */}
        {activeTab === 'team' && (
           <div className="space-y-6">
              <div className="bg-white p-6 rounded shadow mb-6">
                 <h3 className="font-bold text-lg mb-4 text-black">Manage Team Members</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teamMembers.map(member => (
                       <div key={member.id} className="border rounded-lg p-4 text-center relative">
                          <img src={member.image} className="w-24 h-24 rounded-full mx-auto mb-2 object-cover" alt={member.name}/>
                          <h4 className="font-bold text-black">{member.name}</h4>
                          <p className="text-sm text-gray-500">{member.role}</p>
                          {member.isFounder && <span className="bg-brand-gold text-white text-[10px] px-2 rounded-full font-bold">FOUNDER</span>}
                          
                          <div className="mt-4 flex justify-center gap-3">
                             <button onClick={() => { setEditData(member); setModalType('team'); }} className="text-blue-500 text-xs font-bold uppercase">Edit</button>
                             <button onClick={() => requestDelete(member.id, 'team')} className="text-red-500 text-xs font-bold uppercase">Remove</button>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        )}

        {/* --- HOME CONTENT (WIDGETS) --- */}
        {activeTab === 'content' && (
            <div className="bg-white p-6 rounded shadow">
                <h3 className="text-lg font-bold mb-4 text-black">Home Page Widgets (Slides/Banners)</h3>
                <p className="text-sm text-gray-500 mb-6">Add Banners, Videos, or Links to the Home Page.</p>
                <div className="space-y-4">
                    {homeWidgets.map(widget => (
                        <div key={widget.id} className="border p-4 rounded flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-4 w-full">
                                <span className="bg-gray-100 text-xs font-bold uppercase px-2 py-1 rounded">{widget.type}</span>
                                <div>
                                    <p className="font-bold text-black truncate w-48">{widget.title || widget.caption || 'No Title'}</p>
                                    <p className="text-xs text-gray-500">{widget.layout === 'full' ? 'Full Width' : 'Grid'}</p>
                                    {widget.price && <p className="text-xs text-brand-gold font-bold">₹{widget.price}</p>}
                                </div>
                            </div>
                            <div className="flex gap-2 self-end md:self-auto">
                                <button onClick={() => { setEditData(widget); setModalType('content'); }} className="text-blue-500"><Edit size={18}/></button>
                                <button onClick={() => requestDelete(widget.id, 'widget')} className="text-red-500"><Trash2 size={18}/></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* --- CONTACT --- */}
        {activeTab === 'contact' && (
           <div className="bg-white p-6 rounded shadow max-w-2xl">
              <h3 className="font-bold text-lg mb-4 text-black">Edit Contact Info</h3>
              <form onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.target as HTMLFormElement);
                  setContactInfo({
                      phone: fd.get('phone') as string,
                      email: fd.get('email') as string,
                      address: fd.get('address') as string,
                      social: {
                          facebook: fd.get('fb') as string,
                          instagram: fd.get('insta') as string,
                          whatsapp: fd.get('wa') as string,
                      }
                  });
                  alert("Contact Info Updated!");
              }} className="space-y-4">
                  <div><label className="text-xs font-bold block mb-1">Phone</label><input name="phone" defaultValue={contactInfo.phone} className={commonInputClass}/></div>
                  <div><label className="text-xs font-bold block mb-1">Email</label><input name="email" defaultValue={contactInfo.email} className={commonInputClass}/></div>
                  <div><label className="text-xs font-bold block mb-1">Address</label><input name="address" defaultValue={contactInfo.address} className={commonInputClass}/></div>
                  
                  <div className="pt-4 border-t"><h4 className="font-bold mb-2">Social Links</h4></div>
                  <div><label className="text-xs font-bold block mb-1">Facebook</label><input name="fb" defaultValue={contactInfo.social.facebook} className={commonInputClass}/></div>
                  <div><label className="text-xs font-bold block mb-1">Instagram</label><input name="insta" defaultValue={contactInfo.social.instagram} className={commonInputClass}/></div>
                  <div><label className="text-xs font-bold block mb-1">WhatsApp</label><input name="wa" defaultValue={contactInfo.social.whatsapp} className={commonInputClass}/></div>
                  
                  <button className="bg-brand-gold text-white px-6 py-2 rounded font-bold w-full mt-4">Save Contact Info</button>
              </form>
           </div>
        )}

        {/* --- GALLERY --- */}
        {activeTab === 'gallery' && (
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gallery.map(item => (
                 <div key={item.id} className="relative group">
                    <img src={item.image} className="w-full h-32 object-cover rounded" alt="gallery"/>
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition gap-2">
                         <button onClick={() => { setEditData(item); setModalType('gallery'); }} className="text-white bg-blue-500 p-1 rounded"><Edit size={16}/></button>
                         <button onClick={() => requestDelete(item.id, 'gallery')} className="text-white bg-red-500 p-1 rounded"><Trash2 size={16}/></button>
                    </div>
                 </div>
              ))}
           </div>
        )}

         {/* --- REVIEWS --- */}
         {activeTab === 'reviews' && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map(item => (
                 <div key={item.id} className="bg-white p-4 rounded shadow border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                             {item.photo && <img src={item.photo} className="w-10 h-10 rounded-full object-cover" alt="user"/>}
                             <div>
                                <h4 className="font-bold text-black">{item.customerName}</h4>
                                <div className="flex text-yellow-500 text-xs">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={10} fill={i < item.rating ? "currentColor" : "none"} />)}
                                </div>
                             </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => { setEditData(item); setModalType('reviews'); }} className="text-blue-500"><Edit size={16}/></button>
                            <button onClick={() => requestDelete(item.id, 'review')} className="text-red-500"><Trash2 size={16}/></button>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 italic">"{item.description}"</p>
                 </div>
              ))}
           </div>
        )}

        {/* --- COUPONS --- */}
        {activeTab === 'coupons' && (
           <div className="bg-white p-6 rounded shadow">
              <div className="space-y-2">
                 {coupons.map(c => (
                    <div key={c.id} className="flex justify-between items-center border-b p-2">
                       <div>
                          <p className="font-mono font-bold text-lg text-black">{c.code}</p>
                          <p className="text-xs text-gray-500">{c.discountType === 'flat' ? `Flat ₹${c.value} Off` : `${c.value}% Off`} on {c.targetName || c.applicableTo}</p>
                       </div>
                       <button onClick={() => requestDelete(c.id, 'coupon')} className="text-red-500"><Trash2 size={18}/></button>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* --- CUSTOM PAGES --- */}
        {activeTab === 'pages' && (
            <div className="bg-white p-6 rounded shadow">
            <div className="flex justify-between mb-6">
              <h3 className="text-xl font-bold text-black">Custom Pages</h3>
              <button className="bg-black text-white px-4 py-2 rounded flex items-center gap-2" onClick={() => { setModalType('pageBuilder'); setPageTitle(''); setPageBlocks([]); setEditData(null); }}>
                <Plus size={16}/> Create Page
              </button>
            </div>
            <div className="space-y-4">
              {customPages.length === 0 && <p className="text-gray-500">No custom pages added.</p>}
              {customPages.map(page => (
                <div key={page.id} className="border p-4 rounded flex justify-between items-center bg-gray-50">
                  <div>
                    <h4 className="font-bold text-black">{page.title}</h4>
                    <p className="text-sm text-gray-500">{page.blocks ? `${page.blocks.length} Sections` : 'Legacy Content'}</p>
                  </div>
                  <div className="flex gap-2">
                     <button onClick={() => { 
                         setEditData(page); 
                         setPageTitle(page.title); 
                         setPageBlocks(page.blocks || []); 
                         setModalType('pageBuilder'); 
                     }} className="text-blue-500"><Edit size={18}/></button>
                     <button onClick={() => requestDelete(page.id, 'page')} className="text-red-500"><Trash2 size={18}/></button>
                  </div>
                </div>
              ))}
            </div>
         </div>
        )}

        {/* --- PAYMENT SETTINGS --- */}
        {activeTab === 'payment' && (
            <div className="bg-white p-6 rounded shadow max-w-lg">
                <h3 className="font-bold text-lg mb-4 text-black">Payment Configuration</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-black">Accept Cash on Delivery</span>
                        <input type="checkbox" checked={paymentConfig.acceptCOD} onChange={e => setPaymentConfig({...paymentConfig, acceptCOD: e.target.checked})} className="w-5 h-5 accent-brand-gold"/>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-black">Accept Online (UPI)</span>
                        <input type="checkbox" checked={paymentConfig.acceptOnline} onChange={e => setPaymentConfig({...paymentConfig, acceptOnline: e.target.checked})} className="w-5 h-5 accent-brand-gold"/>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-black">Accept Card</span>
                        <input type="checkbox" checked={paymentConfig.acceptCard} onChange={e => setPaymentConfig({...paymentConfig, acceptCard: e.target.checked})} className="w-5 h-5 accent-brand-gold"/>
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1 mt-4 text-black">UPI ID</label>
                        <input value={paymentConfig.upiId} onChange={e => setPaymentConfig({...paymentConfig, upiId: e.target.value})} className={commonInputClass}/>
                    </div>
                </div>
            </div>
        )}

        {/* --- USERS --- */}
        {activeTab === 'users' && (
            <div className="bg-white p-6 rounded shadow overflow-x-auto">
             <h3 className="text-xl font-bold mb-4 text-black">Registered Users</h3>
             <table className="w-full text-left border-collapse min-w-[600px]">
               <thead><tr className="bg-gray-100 border-b"><th className="p-3 text-black">Name</th><th className="p-3 text-black">Mobile</th><th className="p-3 text-black">Service Interest</th><th className="p-3 text-black">Address</th></tr></thead>
               <tbody>
                 {users.map(u => (
                   <tr key={u.id || u.mobile} className="border-b">
                     <td className="p-3 font-medium text-black">{u.name}</td>
                     <td className="p-3 text-black">{u.mobile}</td>
                     <td className="p-3 text-black">{u.favoriteService}</td>
                     <td className="p-3 text-sm text-black">{u.address}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
            </div>
        )}

        {/* --- SETTINGS --- */}
        {activeTab === 'settings' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded shadow">
                    <h3 className="font-bold text-lg mb-4 text-black">Admin Profile</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-gray-500">Registered Mobile</label>
                            <div className="flex gap-2">
                                <input value={adminProfile.mobile} disabled className="bg-gray-100 p-2 rounded w-full text-black"/>
                                <button onClick={() => initiateProfileUpdate('mobile')} className="bg-black text-white px-3 rounded text-xs">Change</button>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500">Registered Email</label>
                            <div className="flex gap-2">
                                <input value={adminProfile.email} disabled className="bg-gray-100 p-2 rounded w-full text-black"/>
                                <button onClick={() => initiateProfileUpdate('email')} className="bg-black text-white px-3 rounded text-xs">Change</button>
                            </div>
                        </div>
                        
                        <div className="mt-6 pt-4 border-t">
                            <h4 className="font-bold text-sm mb-2 text-black flex items-center gap-2"><Lock size={14}/> Security</h4>
                            <button onClick={() => initiateProfileUpdate('password')} className="w-full bg-red-600 text-white py-2 rounded font-bold text-sm hover:bg-red-700 flex items-center justify-center gap-2">
                                <Key size={14}/> Change Admin Password
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded shadow">
                    <h3 className="font-bold text-lg mb-4 text-black">App Theme</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-gray-500">Primary Color</label>
                            <input type="color" value={theme.primaryColor} onChange={e => setTheme({...theme, primaryColor: e.target.value})} className="w-full h-10"/>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500">Secondary Color (Dark)</label>
                            <input type="color" value={theme.secondaryColor} onChange={e => setTheme({...theme, secondaryColor: e.target.value})} className="w-full h-10"/>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* --- MODALS --- */}
      {deleteConfig && (
        <DeleteModal onConfirm={executeDelete} onCancel={() => setDeleteConfig(null)} />
      )}

      {/* --- CUSTOM NOTIFICATION MODAL --- */}
      {notificationConfig && (
        <Modal title={`Send Message to ${notificationConfig.name}`} onClose={() => setNotificationConfig(null)}>
            <div className="space-y-4">
               <p className="text-sm text-gray-500">This message will appear on the customer's Track Appointment page.</p>
               <textarea 
                  className={`${commonInputClass} h-32`}
                  placeholder="Type your message here..."
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
               />
               <button onClick={handleSendNotification} className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">Send Message</button>
            </div>
        </Modal>
      )}

      {modalType === 'services' && (
        <Modal title={editData ? "Edit Service" : "Add Service"} onClose={() => setModalType(null)}>
           <form onSubmit={handleSaveService} className="space-y-4">
              <input name="name" placeholder="Service Name" defaultValue={editData?.name} className={commonInputClass} required/>
              <input name="price" type="number" placeholder="Price" defaultValue={editData?.price} className={commonInputClass} required/>
              <textarea name="description" placeholder="Description" defaultValue={editData?.description} className={commonInputClass} required/>
              <input name="image" placeholder="Image URL" defaultValue={editData?.image} className={commonInputClass} required/>
              <input name="category" list="serviceCategories" placeholder="Category" defaultValue={editData?.category} className={commonInputClass} required/>
              <datalist id="serviceCategories">{SERVICE_CATEGORIES.map(c => <option key={c} value={c}/>)}</datalist>
              <input name="offer" placeholder="Offer Tag (e.g. 20% OFF)" defaultValue={editData?.offer} className={commonInputClass}/>
              <button className="w-full bg-brand-gold text-white py-2 font-bold rounded">Save Service</button>
           </form>
        </Modal>
      )}

      {modalType === 'products' && (
        <Modal title={editData ? "Edit Product" : "Add Product"} onClose={() => setModalType(null)}>
           <form onSubmit={handleSaveProduct} className="space-y-4">
              <input name="name" placeholder="Product Name" defaultValue={editData?.name} className={commonInputClass} required/>
              <input name="price" type="number" placeholder="Price" defaultValue={editData?.price} className={commonInputClass} required/>
              <input name="discountPrice" type="number" placeholder="Discounted Price (Optional)" defaultValue={editData?.discountPrice} className={commonInputClass}/>
              <input name="category" placeholder="Category" defaultValue={editData?.category} className={commonInputClass} required/>
              <textarea name="description" placeholder="Description" defaultValue={editData?.description} className={commonInputClass} required/>
              <input name="image" placeholder="Image URL" defaultValue={editData?.image} className={commonInputClass} required/>
              <button className="w-full bg-brand-gold text-white py-2 font-bold rounded">Save Product</button>
           </form>
        </Modal>
      )}

      {modalType === 'deals' && (
        <Modal title={editData ? "Edit Deal" : "Add Deal"} onClose={() => setModalType(null)}>
           <form onSubmit={handleSaveDeal} className="space-y-4">
              <input name="title" placeholder="Deal Title" defaultValue={editData?.title} className={commonInputClass} required/>
              <textarea name="description" placeholder="Description" defaultValue={editData?.description} className={commonInputClass} required/>
              <div className="flex gap-4">
                  <input name="originalPrice" type="number" placeholder="Original Price" defaultValue={editData?.originalPrice} className={commonInputClass} required/>
                  <input name="offerPrice" type="number" placeholder="Offer Price" defaultValue={editData?.offerPrice} className={commonInputClass} required/>
              </div>
              <input name="image" placeholder="Image URL" defaultValue={editData?.image} className={commonInputClass} required/>
              <input name="category" placeholder="Category" defaultValue={editData?.category} className={commonInputClass} required/>
              <button className="w-full bg-brand-gold text-white py-2 font-bold rounded">Save Deal</button>
           </form>
        </Modal>
      )}

      {modalType === 'content' && (
        <Modal title={editData ? "Edit Slide/Widget" : "Add Slide/Widget"} onClose={() => setModalType(null)}>
           <form onSubmit={handleSaveWidget} className="space-y-4">
               <div className="grid grid-cols-2 gap-2">
                   <div>
                       <label className="text-xs font-bold block mb-1 text-black">Widget Type</label>
                       <select name="type" className={commonInputClass} defaultValue={editData?.type}>
                           <option value="image">Banner Image / Slide</option>
                           <option value="video">Video</option>
                           <option value="text">Text Announcement</option>
                       </select>
                   </div>
                   <div>
                       <label className="text-xs font-bold block mb-1 text-black">Layout</label>
                       <select name="layout" className={commonInputClass} defaultValue={editData?.layout || 'full'}>
                           <option value="full">Full Width</option>
                           <option value="half">Grid Card (Half)</option>
                       </select>
                   </div>
               </div>

               <input name="content" placeholder="Content URL (Image/Video) or Text Body" className={commonInputClass} required defaultValue={editData?.content}/>
               
               <div className="grid grid-cols-2 gap-2">
                   <input name="title" placeholder="Title / Heading (Optional)" className={commonInputClass} defaultValue={editData?.title}/>
                   <input name="subtitle" placeholder="Subtitle / Description (Optional)" className={commonInputClass} defaultValue={editData?.subtitle}/>
               </div>

               <div className="grid grid-cols-2 gap-2">
                   <input name="price" type="number" placeholder="Price (Amount) - Optional" className={commonInputClass} defaultValue={editData?.price}/>
                   <input name="discount" placeholder="Discount (e.g. 50% OFF) - Optional" className={commonInputClass} defaultValue={editData?.discount}/>
               </div>

               <div className="grid grid-cols-2 gap-2">
                    <input name="buttonText" placeholder="Button Label (Optional)" className={commonInputClass} defaultValue={editData?.buttonText}/>
                    <input name="linkUrl" placeholder="Redirect URL (Optional)" className={commonInputClass} defaultValue={editData?.linkUrl}/>
               </div>

               <input name="caption" placeholder="Internal Name / Alt Text" className={commonInputClass} defaultValue={editData?.caption}/>
               
               <button className="w-full bg-brand-gold text-white py-2 font-bold rounded">{editData ? "Update Slide" : "Add Slide"}</button>
           </form>
        </Modal>
      )}

      {modalType === 'gallery' && (
        <Modal title={editData ? "Edit Gallery Item" : "Add to Portfolio"} onClose={() => setModalType(null)}>
           <form onSubmit={handleSaveGallery} className="space-y-4">
               <input name="customer" placeholder="Customer Name" defaultValue={editData?.customerName} className={commonInputClass} required/>
               <input name="service" placeholder="Service Done" defaultValue={editData?.service} className={commonInputClass} required/>
               <textarea name="desc" placeholder="Description / Review" defaultValue={editData?.description} className={commonInputClass} required/>
               <input name="image" placeholder="Image URL" defaultValue={editData?.image} className={commonInputClass} required/>
               <button className="w-full bg-brand-gold text-white py-2 font-bold rounded">Save to Gallery</button>
           </form>
        </Modal>
      )}

      {modalType === 'reviews' && (
        <Modal title={editData ? "Edit Review" : "Add Review"} onClose={() => setModalType(null)}>
           <form onSubmit={handleSaveReview} className="space-y-4">
               <input name="customerName" placeholder="Customer Name" defaultValue={editData?.customerName} className={commonInputClass} required/>
               <input name="serviceName" placeholder="Service Taken" defaultValue={editData?.serviceName} className={commonInputClass} required/>
               <input name="address" placeholder="Location/City" defaultValue={editData?.address} className={commonInputClass} required/>
               <textarea name="description" placeholder="Review Content" defaultValue={editData?.description} className={commonInputClass} required/>
               <input name="photo" placeholder="Customer Photo URL (Optional)" defaultValue={editData?.photo} className={commonInputClass} />
               <div>
                  <label className="text-xs font-bold block mb-1 text-black">Rating</label>
                  <select name="rating" className={commonInputClass} defaultValue={editData?.rating || 5}>
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                  </select>
               </div>
               <button className="w-full bg-brand-gold text-white py-2 font-bold rounded">Save Review</button>
           </form>
        </Modal>
      )}

      {modalType === 'team' && (
         <Modal title={editData ? "Edit Team Member" : "Add Team Member"} onClose={() => setModalType(null)}>
            <form onSubmit={handleSaveTeam} className="space-y-4">
               <input name="name" placeholder="Name" defaultValue={editData?.name} className={commonInputClass} required/>
               <input name="role" placeholder="Role" defaultValue={editData?.role} className={commonInputClass} required/>
               <input name="image" placeholder="Photo URL" defaultValue={editData?.image} className={commonInputClass} required/>
               <textarea name="bio" placeholder="Bio / Description" defaultValue={editData?.bio} className={commonInputClass}/>
               <input name="certificate" placeholder="Certificate Image URL (Optional)" defaultValue={editData?.certificate} className={commonInputClass}/>
               <div className="flex items-center gap-2">
                   <input type="checkbox" name="isFounder" defaultChecked={editData?.isFounder}/>
                   <label className="text-black">Is Founder?</label>
               </div>
               <button className="w-full bg-brand-gold text-white py-2 font-bold rounded">Save Team Member</button>
            </form>
         </Modal>
      )}

      {modalType === 'coupons' && (
         <Modal title="Create Coupon" onClose={() => setModalType(null)}>
             <form onSubmit={handleSaveCoupon} className="space-y-4">
                 <input name="code" placeholder="Coupon Code (e.g. SUMMER50)" className={commonInputClass} required/>
                 <div className="flex gap-2">
                    <select name="type" className={commonInputClass}>
                        <option value="percentage">Percentage %</option>
                        <option value="flat">Flat Amount ₹</option>
                    </select>
                    <input name="value" type="number" placeholder="Value" className={commonInputClass} required/>
                 </div>
                 
                 <label className="block text-sm font-bold mt-2 text-black">Applicable To</label>
                 <select 
                    name="applicable" 
                    className={commonInputClass} 
                    value={couponApplicableType}
                    onChange={(e) => setCouponApplicableType(e.target.value)}
                 >
                     <option value="all">All Items</option>
                     <option value="service">Specific Service</option>
                     <option value="product">Specific Product</option>
                 </select>

                 {couponApplicableType === 'service' && (
                     <select name="targetId" className={commonInputClass} required>
                         <option value="">Select Service</option>
                         {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                     </select>
                 )}
                 {couponApplicableType === 'product' && (
                     <select name="targetId" className={commonInputClass} required>
                         <option value="">Select Product</option>
                         {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                     </select>
                 )}

                 <button className="w-full bg-brand-gold text-white py-2 font-bold rounded">Create Coupon</button>
             </form>
         </Modal>
      )}

      {modalType === 'profileUpdate' && (
          <Modal title="Security Check" onClose={() => setModalType(null)}>
              <div className="space-y-4">
                  {!otpSent ? (
                      <>
                          <p className="text-gray-600">To change your {profileUpdateType}, we need to verify your identity.</p>
                          <button onClick={sendOtp} className="w-full bg-black text-white py-2 rounded">Send OTP</button>
                      </>
                  ) : (
                      <>
                          <p className="text-green-600 font-bold">OTP Sent!</p>
                          <input 
                              value={otpInput}
                              onChange={(e) => setOtpInput(e.target.value)}
                              placeholder="Enter OTP"
                              className={commonInputClass}
                          />
                          <input 
                              value={newProfileValue}
                              onChange={(e) => setNewProfileValue(e.target.value)}
                              placeholder={profileUpdateType === 'password' ? "Enter New Password" : `Enter New ${profileUpdateType}`}
                              type={profileUpdateType === 'password' ? "password" : "text"}
                              className={commonInputClass}
                          />
                          <button onClick={verifyOtpAndUpdate} className="w-full bg-brand-gold text-white py-2 rounded font-bold">Verify & Update</button>
                      </>
                  )}
              </div>
          </Modal>
      )}

      {modalType === 'pageBuilder' && (
           <Modal title="Page Builder" onClose={() => setModalType(null)} width="max-w-4xl">
              <div className="space-y-6">
                  {/* Removed AI Generation Section */}

                  <div>
                      <label className="block text-sm font-bold mb-1 text-black">Page Title (Appears in Menu)</label>
                      <input 
                         value={pageTitle}
                         onChange={(e) => setPageTitle(e.target.value)}
                         placeholder="e.g. Terms & Conditions" 
                         className={commonInputClass} 
                      />
                  </div>

                  <div className="bg-gray-50 p-4 rounded border">
                      <h4 className="font-bold mb-2 flex items-center gap-2"><LayoutIcon size={16}/> Page Sections</h4>
                      
                      {pageBlocks.length === 0 && <p className="text-gray-400 italic text-sm text-center py-4">No sections added yet. Add blocks below.</p>}
                      
                      <div className="space-y-4 mb-4">
                          {pageBlocks.map((block, index) => (
                              <div key={block.id} className="bg-white border border-gray-200 rounded p-4 relative shadow-sm">
                                  <div className="flex justify-between items-center mb-2 border-b pb-2">
                                      <span className="text-xs font-bold uppercase text-brand-gold bg-black px-2 py-0.5 rounded">{block.type}</span>
                                      <button onClick={() => removeBlock(block.id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={14}/></button>
                                  </div>
                                  
                                  <div className="space-y-2">
                                      {block.type === 'hero' && (
                                          <>
                                            <input placeholder="Hero Title (Big Text)" value={block.title} onChange={e => updateBlock(block.id, 'title', e.target.value)} className={commonInputClass}/>
                                            <input placeholder="Subtitle (Small Text)" value={block.subtitle} onChange={e => updateBlock(block.id, 'subtitle', e.target.value)} className={commonInputClass}/>
                                            <input placeholder="Background Image URL" value={block.url} onChange={e => updateBlock(block.id, 'url', e.target.value)} className={commonInputClass}/>
                                          </>
                                      )}
                                      {block.type === 'text' && (
                                          <>
                                            <input placeholder="Section Heading (Optional)" value={block.title} onChange={e => updateBlock(block.id, 'title', e.target.value)} className={commonInputClass}/>
                                            <textarea placeholder="Paragraph Content" value={block.content} onChange={e => updateBlock(block.id, 'content', e.target.value)} className={`${commonInputClass} h-32`}/>
                                          </>
                                      )}
                                      {block.type === 'image' && (
                                          <>
                                            <input placeholder="Image URL" value={block.url} onChange={e => updateBlock(block.id, 'url', e.target.value)} className={commonInputClass}/>
                                            <input placeholder="Caption (Optional)" value={block.content} onChange={e => updateBlock(block.id, 'content', e.target.value)} className={commonInputClass}/>
                                          </>
                                      )}
                                      {block.type === 'video' && (
                                          <>
                                            <input placeholder="Video Title" value={block.title} onChange={e => updateBlock(block.id, 'title', e.target.value)} className={commonInputClass}/>
                                            <input placeholder="YouTube Link or MP4 URL" value={block.url} onChange={e => updateBlock(block.id, 'url', e.target.value)} className={commonInputClass}/>
                                            <input placeholder="Description (Optional)" value={block.content} onChange={e => updateBlock(block.id, 'content', e.target.value)} className={commonInputClass}/>
                                          </>
                                      )}
                                      {block.type === 'list' && (
                                          <>
                                            <input placeholder="List Title" value={block.title} onChange={e => updateBlock(block.id, 'title', e.target.value)} className={commonInputClass}/>
                                            <textarea placeholder="List Items (One per line)" value={block.content} onChange={e => updateBlock(block.id, 'content', e.target.value)} className={`${commonInputClass} h-32`}/>
                                          </>
                                      )}
                                      {block.type === 'button' && (
                                          <>
                                            <input placeholder="Button Label (e.g. Book Now)" value={block.title} onChange={e => updateBlock(block.id, 'title', e.target.value)} className={commonInputClass}/>
                                            <input placeholder="Button Link URL (e.g. /booking)" value={block.url} onChange={e => updateBlock(block.id, 'url', e.target.value)} className={commonInputClass}/>
                                            <select 
                                                value={block.content} 
                                                onChange={e => updateBlock(block.id, 'content', e.target.value)}
                                                className={commonInputClass}
                                            >
                                                <option value="left">Align Left</option>
                                                <option value="center">Align Center</option>
                                                <option value="right">Align Right</option>
                                            </select>
                                          </>
                                      )}
                                  </div>
                              </div>
                          ))}
                      </div>

                      <div className="flex flex-wrap gap-2 items-center bg-gray-200 p-2 rounded">
                          <span className="text-xs font-bold uppercase text-gray-600 mr-2">Add New Block:</span>
                          <button onClick={() => addBlock('hero')} className="flex items-center gap-1 bg-white px-3 py-1 rounded text-xs font-bold hover:bg-brand-gold hover:text-white transition"><ImageIcon size={14}/> Hero Banner</button>
                          <button onClick={() => addBlock('text')} className="flex items-center gap-1 bg-white px-3 py-1 rounded text-xs font-bold hover:bg-brand-gold hover:text-white transition"><Type size={14}/> Rich Text</button>
                          <button onClick={() => addBlock('image')} className="flex items-center gap-1 bg-white px-3 py-1 rounded text-xs font-bold hover:bg-brand-gold hover:text-white transition"><Image size={14}/> Image</button>
                          <button onClick={() => addBlock('video')} className="flex items-center gap-1 bg-white px-3 py-1 rounded text-xs font-bold hover:bg-brand-gold hover:text-white transition"><Video size={14}/> Video</button>
                          <button onClick={() => addBlock('list')} className="flex items-center gap-1 bg-white px-3 py-1 rounded text-xs font-bold hover:bg-brand-gold hover:text-white transition"><List size={14}/> Bullet List</button>
                          <button onClick={() => addBlock('button')} className="flex items-center gap-1 bg-white px-3 py-1 rounded text-xs font-bold hover:bg-brand-gold hover:text-white transition"><MousePointerClick size={14}/> Button</button>
                      </div>
                  </div>

                  <button onClick={handleSavePage} className="w-full bg-black text-white py-3 font-bold rounded hover:opacity-90 transition">{editData ? "Update Page" : "Save & Publish Page"}</button>
              </div>
           </Modal>
      )}

    </div>
  );
};
