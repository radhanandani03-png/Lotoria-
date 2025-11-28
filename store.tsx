
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Service, Product, Deal, Review, GalleryItem, User, Booking, ThemeConfig, Coupon, CustomPage, PaymentConfig, ContactInfo, TeamMember, AdminProfile, HomeWidget } from './types';
import { db, auth } from './firebase'; 
import { 
  collection, onSnapshot, addDoc, updateDoc, doc, deleteDoc, setDoc, query, orderBy 
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, signOut, onAuthStateChanged 
} from 'firebase/auth';

// Import Constants for Initial Data Seeding
import { 
  INITIAL_SERVICES, INITIAL_PRODUCTS, INITIAL_DEALS, 
  INITIAL_REVIEWS, INITIAL_GALLERY, ADMIN_CONTACT 
} from './constants';

interface AppContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
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
  homeContent: any;
  
  // Database Actions
  addService: (s: any) => void;
  updateService: (s: Service) => void;
  deleteService: (id: string) => void;

  addProduct: (p: any) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;

  addDeal: (d: any) => void;
  updateDeal: (d: Deal) => void;
  deleteDeal: (id: string) => void;

  addReview: (r: any) => void;
  updateReview: (r: Review) => void;
  deleteReview: (id: string) => void;

  addGalleryItem: (g: any) => void;
  updateGalleryItem: (g: GalleryItem) => void;
  deleteGalleryItem: (id: string) => void;

  addCoupon: (c: any) => void;
  deleteCoupon: (id: string) => void;

  addCustomPage: (p: any) => void;
  updateCustomPage: (p: CustomPage) => void;
  deleteCustomPage: (id: string) => void;

  addTeamMember: (t: any) => void;
  updateTeamMember: (t: TeamMember) => void;
  deleteTeamMember: (id: string) => void;

  addHomeWidget: (w: any) => void;
  updateHomeWidget: (w: HomeWidget) => void;
  deleteHomeWidget: (id: string) => void;

  // Settings Setters
  setTheme: (t: ThemeConfig) => void;
  setPaymentConfig: (p: PaymentConfig) => void;
  setContactInfo: (c: ContactInfo) => void;
  setAdminProfile: (a: AdminProfile) => void;
  updateHomeContent: (c: any) => void;
  
  // Booking & Cart
  addBooking: (b: Booking) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  sendBookingNotification: (id: string, message: string) => void;
  addToCart: (p: Product) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  
  // Helper
  uploadInitialData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_THEME = { primaryColor: '#E11D48', secondaryColor: '#121212' };
const DEFAULT_PAYMENT = { acceptCOD: true, acceptOnline: true, acceptCard: true, upiId: 'buyfuturemart@okicici' };
const DEFAULT_CONTACT = { phone: '8210667364', email: 'buylotoria@gmail.com', address: 'Kanpur, India', social: { facebook: '', instagram: '', whatsapp: '' } };

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- STATE ---
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [customPages, setCustomPages] = useState<CustomPage[]>([]);
  const [homeWidgets, setHomeWidgets] = useState<HomeWidget[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  
  const [theme, setThemeState] = useState<ThemeConfig>(DEFAULT_THEME);
  const [paymentConfig, setPaymentConfigState] = useState<PaymentConfig>(DEFAULT_PAYMENT);
  const [contactInfo, setContactInfoState] = useState<ContactInfo>(DEFAULT_CONTACT);
  const [adminProfile, setAdminProfileState] = useState<AdminProfile>({ mobile: ADMIN_CONTACT.mobile, email: ADMIN_CONTACT.email });
  const [homeContent, setHomeContentState] = useState<any>({});
  
  // Cart remains local for guest users
  const [cart, setCart] = useState<Product[]>(() => {
     try { return JSON.parse(localStorage.getItem('lotoria_cart') || '[]'); } catch { return []; }
  });
  useEffect(() => localStorage.setItem('lotoria_cart', JSON.stringify(cart)), [cart]);


  // --- FIREBASE LISTENERS ---
  useEffect(() => {
    // 1. Auth State
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
         const isAdmin = currentUser.email === adminProfile.email; 
         setUser({
             id: currentUser.uid,
             name: currentUser.displayName || 'User',
             email: currentUser.email || '',
             mobile: '',
             address: '',
             favoriteService: '',
             isAdmin: isAdmin
         });
      } else {
        setUser(null);
      }
    });

    // 2. Collections
    const unsubServices = onSnapshot(collection(db, "services"), s => setServices(s.docs.map(d => ({...d.data(), id: d.id} as Service))));
    const unsubProducts = onSnapshot(collection(db, "products"), s => setProducts(s.docs.map(d => ({...d.data(), id: d.id} as Product))));
    const unsubDeals = onSnapshot(collection(db, "deals"), s => setDeals(s.docs.map(d => ({...d.data(), id: d.id} as Deal))));
    const unsubBookings = onSnapshot(query(collection(db, "bookings"), orderBy('date', 'desc')), s => setBookings(s.docs.map(d => ({...d.data(), id: d.id} as Booking))));
    const unsubGallery = onSnapshot(collection(db, "gallery"), s => setGallery(s.docs.map(d => ({...d.data(), id: d.id} as GalleryItem))));
    const unsubReviews = onSnapshot(collection(db, "reviews"), s => setReviews(s.docs.map(d => ({...d.data(), id: d.id} as Review))));
    const unsubCoupons = onSnapshot(collection(db, "coupons"), s => setCoupons(s.docs.map(d => ({...d.data(), id: d.id} as Coupon))));
    const unsubPages = onSnapshot(collection(db, "pages"), s => setCustomPages(s.docs.map(d => ({...d.data(), id: d.id} as CustomPage))));
    const unsubTeam = onSnapshot(collection(db, "team"), s => setTeamMembers(s.docs.map(d => ({...d.data(), id: d.id} as TeamMember))));
    const unsubWidgets = onSnapshot(collection(db, "widgets"), s => setHomeWidgets(s.docs.map(d => ({...d.data(), id: d.id} as HomeWidget))));
    const unsubUsers = onSnapshot(collection(db, "users"), s => setUsers(s.docs.map(d => ({...d.data(), id: d.id} as User))));

    // 3. Single Documents (Settings)
    const unsubSettings = onSnapshot(collection(db, "settings"), (snap) => {
        snap.forEach(doc => {
            if(doc.id === 'theme') setThemeState(doc.data() as ThemeConfig);
            if(doc.id === 'payment') setPaymentConfigState(doc.data() as PaymentConfig);
            if(doc.id === 'contact') setContactInfoState(doc.data() as ContactInfo);
            if(doc.id === 'admin') setAdminProfileState(doc.data() as AdminProfile);
            if(doc.id === 'homeContent') setHomeContentState(doc.data());
        });
    });

    return () => {
        unsubAuth(); unsubServices(); unsubProducts(); unsubDeals(); unsubBookings();
        unsubGallery(); unsubReviews(); unsubCoupons(); unsubPages(); unsubTeam(); unsubWidgets(); unsubSettings(); unsubUsers();
    };
  }, []);

  // --- ACTIONS ---

  const login = async (email: string, pass: string) => {
      await signInWithEmailAndPassword(auth, email, pass);
  };
  const logout = () => signOut(auth);

  // Generic DB Helpers
  const add = (c: string, d: any) => addDoc(collection(db, c), d);
  const upd = (c: string, id: string, d: any) => updateDoc(doc(db, c, id), d);
  const del = (c: string, id: string) => deleteDoc(doc(db, c, id));
  const set = (c: string, id: string, d: any) => setDoc(doc(db, c, id), d, { merge: true });

  // Exposing Actions
  const addService = (d: any) => add("services", d);
  const updateService = (d: Service) => upd("services", d.id, d);
  const deleteService = (id: string) => del("services", id);

  const addProduct = (d: any) => add("products", d);
  const updateProduct = (d: Product) => upd("products", d.id, d);
  const deleteProduct = (id: string) => del("products", id);

  const addDeal = (d: any) => add("deals", d);
  const updateDeal = (d: Deal) => upd("deals", d.id, d);
  const deleteDeal = (id: string) => del("deals", id);

  const addReview = (d: any) => add("reviews", d);
  const updateReview = (d: Review) => upd("reviews", d.id, d);
  const deleteReview = (id: string) => del("reviews", id);

  const addGalleryItem = (d: any) => add("gallery", d);
  const updateGalleryItem = (d: GalleryItem) => upd("gallery", d.id, d);
  const deleteGalleryItem = (id: string) => del("gallery", id);

  const addCoupon = (d: any) => add("coupons", d);
  const deleteCoupon = (id: string) => del("coupons", id);

  const addCustomPage = (d: any) => add("pages", d);
  const updateCustomPage = (d: CustomPage) => upd("pages", d.id, d);
  const deleteCustomPage = (id: string) => del("pages", id);

  const addTeamMember = (d: any) => add("team", d);
  const updateTeamMember = (d: TeamMember) => upd("team", d.id, d);
  const deleteTeamMember = (id: string) => del("team", id);

  const addHomeWidget = (d: any) => add("widgets", d);
  const updateHomeWidget = (d: HomeWidget) => upd("widgets", d.id, d);
  const deleteHomeWidget = (id: string) => del("widgets", id);

  // Settings
  const setTheme = (t: ThemeConfig) => set("settings", "theme", t);
  const setPaymentConfig = (p: PaymentConfig) => set("settings", "payment", p);
  const setContactInfo = (c: ContactInfo) => set("settings", "contact", c);
  const setAdminProfile = (a: AdminProfile) => set("settings", "admin", a);
  const updateHomeContent = (c: any) => set("settings", "homeContent", c);

  // Bookings
  const addBooking = (b: Booking) => add("bookings", b);
  const updateBookingStatus = (id: string, s: string) => upd("bookings", id, { status: s });
  const sendBookingNotification = (id: string, m: string) => upd("bookings", id, { adminNotification: m });

  // Cart
  const addToCart = (p: Product) => setCart([...cart, p]);
  const removeFromCart = (i: number) => setCart(cart.filter((_, idx) => idx !== i));
  const clearCart = () => setCart([]);

  // Data Seeder
  const uploadInitialData = async () => {
    // Only use this once to populate empty DB
    const batchPromises = [];
    INITIAL_SERVICES.forEach(i => batchPromises.push(add("services", i)));
    INITIAL_PRODUCTS.forEach(i => batchPromises.push(add("products", i)));
    INITIAL_DEALS.forEach(i => batchPromises.push(add("deals", i)));
    INITIAL_REVIEWS.forEach(i => batchPromises.push(add("reviews", i)));
    INITIAL_GALLERY.forEach(i => batchPromises.push(add("gallery", i)));
    
    // Default Settings
    batchPromises.push(set("settings", "theme", DEFAULT_THEME));
    batchPromises.push(set("settings", "payment", DEFAULT_PAYMENT));
    batchPromises.push(set("settings", "contact", DEFAULT_CONTACT));
    batchPromises.push(set("settings", "admin", { mobile: ADMIN_CONTACT.mobile, email: ADMIN_CONTACT.email }));

    await Promise.all(batchPromises);
    alert("Database Seeded Successfully! Refresh Page.");
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', theme.secondaryColor);
  }, [theme]);

  return (
    <AppContext.Provider value={{
      user, login, logout, users,
      services, addService, updateService, deleteService,
      products, addProduct, updateProduct, deleteProduct,
      deals, addDeal, updateDeal, deleteDeal,
      reviews, addReview, updateReview, deleteReview,
      gallery, addGalleryItem, updateGalleryItem, deleteGalleryItem,
      coupons, addCoupon, deleteCoupon,
      customPages, addCustomPage, updateCustomPage, deleteCustomPage,
      bookings, addBooking, updateBookingStatus, sendBookingNotification,
      theme, setTheme,
      paymentConfig, setPaymentConfig,
      contactInfo, setContactInfo,
      teamMembers, addTeamMember, updateTeamMember, deleteTeamMember,
      adminProfile, setAdminProfile,
      cart, addToCart, removeFromCart, clearCart,
      homeContent, updateHomeContent,
      homeWidgets, addHomeWidget, updateHomeWidget, deleteHomeWidget,
      uploadInitialData
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
