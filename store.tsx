import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Service, Product, Deal, Review, GalleryItem, User, Booking, ThemeConfig, Coupon, CustomPage, PaymentConfig, ContactInfo, TeamMember, AdminProfile, HomeWidget } from './types';

// Re-importing inside Store to initialize default data
import { 
  INITIAL_SERVICES as INIT_S, 
  INITIAL_PRODUCTS as INIT_P, 
  INITIAL_DEALS as INIT_D, 
  INITIAL_REVIEWS as INIT_R, 
  INITIAL_GALLERY as INIT_G,
  ADMIN_CONTACT
} from './constants';

interface AppContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  
  users: User[]; 
  
  services: Service[];
  products: Product[];
  deals: Deal[];
  reviews: Review[];
  gallery: GalleryItem[];
  bookings: Booking[];
  coupons: Coupon[];
  customPages: CustomPage[];
  theme: ThemeConfig;
  cart: Product[];
  paymentConfig: PaymentConfig;
  contactInfo: ContactInfo;
  teamMembers: TeamMember[];
  adminProfile: AdminProfile;
  homeWidgets: HomeWidget[];
  
  setServices: (s: Service[]) => void;
  updateService: (s: Service) => void;
  setProducts: (p: Product[]) => void;
  updateProduct: (p: Product) => void;
  setDeals: (d: Deal[]) => void;
  updateDeal: (d: Deal) => void;
  setReviews: (r: Review[]) => void;
  updateReview: (r: Review) => void; // Added update function
  setGallery: (g: GalleryItem[]) => void;
  updateGalleryItem: (g: GalleryItem) => void; 
  setCoupons: (c: Coupon[]) => void;
  setCustomPages: (p: CustomPage[]) => void;
  setTheme: (t: ThemeConfig) => void;
  setPaymentConfig: (p: PaymentConfig) => void;
  setContactInfo: (c: ContactInfo) => void;
  setTeamMembers: (t: TeamMember[]) => void;
  setAdminProfile: (a: AdminProfile) => void;
  setHomeWidgets: (w: HomeWidget[]) => void;
  updateHomeWidget: (w: HomeWidget) => void;
  
  addBooking: (b: Booking) => void;
  addToCart: (p: Product) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  sendBookingNotification: (id: string, message: string) => void;
  
  // CMS Content
  homeContent: any;
  updateHomeContent: (c: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_THEME = {
  primaryColor: '#E11D48', // Updated to Rose
  secondaryColor: '#121212'
};

const DEFAULT_PAYMENT_CONFIG: PaymentConfig = {
  acceptCOD: true,
  acceptOnline: true,
  acceptCard: true,
  upiId: 'buyfuturemart@okicici'
};

const DEFAULT_CONTACT_INFO: ContactInfo = {
  phone: '8210667364',
  email: 'buylotoria@gmail.com',
  address: 'Kanpur, India',
  social: {
    facebook: 'https://www.facebook.com/share/1acgbkUrSL/',
    instagram: 'https://www.instagram.com/_lotoria?igsh=ZnI2bTZocW0zNHow',
    whatsapp: 'https://whatsapp.com/channel/0029VbBFj097IUYSac2k7O0U'
  }
};

const DEFAULT_TEAM: TeamMember[] = [
  { id: '1', name: 'Aryan Kumar', role: 'Founder & Lead', image: 'https://img.sanishtech.com/u/13a00a495c7c890d5a711a94154d2bf8.jpg', isFounder: true, bio: 'Visionary leader transforming home salon services.' },
  { id: '2', name: 'Jyoti', role: 'Co-Founder', image: 'https://img.sanishtech.com/u/e1656cab28cdbc64c126a747787c11b4.jpg', isFounder: true, bio: 'Expert in beauty therapy and customer experience.' }
];

const DEFAULT_HOME_CONTENT = {
  introTitle: "Only Beauty Rules",
  introText: "Are you looking for a fresh, new look? Or do you just want your skin to feel amazing? We can help you achieve that natural, healthy glow. Book your appointment with us at Lotoria Beauty Salon.",
  heroImage: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80",
  serviceTitle: "Lotoria Beauty Salon: Professional Beauty Services Delivered to Your Home",
  serviceText: "Prioritize your comfort and convenience. Lotoria Beauty Salon provides Professional Beauty Services right at your doorstep. Simply book an appointment, and our highly experienced and certified beauticians will arrive at your location ready to serve you.",
  specializationText: "We specialize in delivering a seamless, hygienic, and premium salon experience in the comfort of your home."
};

// Helper to load from local storage
const loadState = (key: string, fallback: any) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    return fallback;
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => loadState('lotoria_user', null));
  const [users, setUsers] = useState<User[]>(() => loadState('lotoria_users', [])); 
  
  const [services, setServices] = useState<Service[]>(() => loadState('lotoria_services', INIT_S));
  const [products, setProducts] = useState<Product[]>(() => loadState('lotoria_products', INIT_P));
  const [deals, setDeals] = useState<Deal[]>(() => loadState('lotoria_deals', INIT_D));
  const [reviews, setReviews] = useState<Review[]>(() => loadState('lotoria_reviews', INIT_R));
  const [gallery, setGallery] = useState<GalleryItem[]>(() => loadState('lotoria_gallery', INIT_G));
  const [coupons, setCoupons] = useState<Coupon[]>(() => loadState('lotoria_coupons', []));
  const [bookings, setBookings] = useState<Booking[]>(() => loadState('lotoria_bookings', []));
  const [customPages, setCustomPages] = useState<CustomPage[]>(() => loadState('lotoria_pages', []));
  const [theme, setTheme] = useState<ThemeConfig>(() => loadState('lotoria_theme', DEFAULT_THEME));
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>(() => loadState('lotoria_payment', DEFAULT_PAYMENT_CONFIG));
  const [cart, setCart] = useState<Product[]>(() => loadState('lotoria_cart', []));
  const [homeContent, setHomeContent] = useState(() => loadState('lotoria_home_content', DEFAULT_HOME_CONTENT));
  const [contactInfo, setContactInfo] = useState<ContactInfo>(() => loadState('lotoria_contact', DEFAULT_CONTACT_INFO));
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => loadState('lotoria_team', DEFAULT_TEAM));
  const [adminProfile, setAdminProfile] = useState<AdminProfile>(() => loadState('lotoria_admin_profile', { mobile: ADMIN_CONTACT.mobile, email: ADMIN_CONTACT.email }));
  const [homeWidgets, setHomeWidgets] = useState<HomeWidget[]>(() => loadState('lotoria_home_widgets', []));

  // Persist effects
  useEffect(() => localStorage.setItem('lotoria_user', JSON.stringify(user)), [user]);
  useEffect(() => localStorage.setItem('lotoria_users', JSON.stringify(users)), [users]);
  useEffect(() => localStorage.setItem('lotoria_services', JSON.stringify(services)), [services]);
  useEffect(() => localStorage.setItem('lotoria_products', JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem('lotoria_deals', JSON.stringify(deals)), [deals]);
  useEffect(() => localStorage.setItem('lotoria_reviews', JSON.stringify(reviews)), [reviews]);
  useEffect(() => localStorage.setItem('lotoria_gallery', JSON.stringify(gallery)), [gallery]);
  useEffect(() => localStorage.setItem('lotoria_coupons', JSON.stringify(coupons)), [coupons]);
  useEffect(() => localStorage.setItem('lotoria_bookings', JSON.stringify(bookings)), [bookings]);
  useEffect(() => localStorage.setItem('lotoria_pages', JSON.stringify(customPages)), [customPages]);
  useEffect(() => localStorage.setItem('lotoria_theme', JSON.stringify(theme)), [theme]);
  useEffect(() => localStorage.setItem('lotoria_payment', JSON.stringify(paymentConfig)), [paymentConfig]);
  useEffect(() => localStorage.setItem('lotoria_cart', JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem('lotoria_home_content', JSON.stringify(homeContent)), [homeContent]);
  useEffect(() => localStorage.setItem('lotoria_contact', JSON.stringify(contactInfo)), [contactInfo]);
  useEffect(() => localStorage.setItem('lotoria_team', JSON.stringify(teamMembers)), [teamMembers]);
  useEffect(() => localStorage.setItem('lotoria_admin_profile', JSON.stringify(adminProfile)), [adminProfile]);
  useEffect(() => localStorage.setItem('lotoria_home_widgets', JSON.stringify(homeWidgets)), [homeWidgets]);

  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', theme.secondaryColor);
  }, [theme]);

  const login = (userData: User) => {
    setUser(userData);
    if (!userData.isAdmin) {
      setUsers(prev => {
        const exists = prev.find(u => u.mobile === userData.mobile);
        if (!exists) return [...prev, { ...userData, id: Date.now().toString() }];
        return prev;
      });
    }
  };
  
  const logout = () => setUser(null);

  const addBooking = (booking: Booking) => {
    setBookings(prev => [booking, ...prev]);
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const sendBookingNotification = (id: string, message: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, adminNotification: message } : b));
  };

  const updateService = (updated: Service) => {
    setServices(prev => prev.map(item => item.id === updated.id ? updated : item));
  };

  const updateProduct = (updated: Product) => {
    setProducts(prev => prev.map(item => item.id === updated.id ? updated : item));
  };

  const updateDeal = (updated: Deal) => {
    setDeals(prev => prev.map(item => item.id === updated.id ? updated : item));
  };
  
  const updateGalleryItem = (updated: GalleryItem) => {
    setGallery(prev => prev.map(item => item.id === updated.id ? updated : item));
  };

  const updateReview = (updated: Review) => {
    setReviews(prev => prev.map(item => item.id === updated.id ? updated : item));
  };

  const updateHomeWidget = (updated: HomeWidget) => {
    setHomeWidgets(prev => prev.map(item => item.id === updated.id ? updated : item));
  };

  const addToCart = (product: Product) => setCart(prev => [...prev, product]);
  
  const removeFromCart = (indexToRemove: number) => {
    setCart(prev => prev.filter((_, index) => index !== indexToRemove));
  };
  
  const clearCart = () => setCart([]);
  const updateHomeContent = (content: any) => setHomeContent(content);

  return (
    <AppContext.Provider value={{
      user, login, logout, users,
      services, setServices, updateService,
      products, setProducts, updateProduct,
      deals, setDeals, updateDeal,
      reviews, setReviews, updateReview,
      gallery, setGallery, updateGalleryItem,
      coupons, setCoupons,
      customPages, setCustomPages,
      bookings, addBooking, updateBookingStatus, sendBookingNotification,
      theme, setTheme,
      paymentConfig, setPaymentConfig,
      contactInfo, setContactInfo,
      teamMembers, setTeamMembers,
      adminProfile, setAdminProfile,
      cart, addToCart, removeFromCart, clearCart,
      homeContent, updateHomeContent,
      homeWidgets, setHomeWidgets, updateHomeWidget
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};