


export interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  offer?: string; // "10% Off" etc.
}

export interface Product {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  description: string;
  category: string;
  image: string;
  rating: number;
}

export interface Deal {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  offerPrice: number;
  percentageOff: number;
  image: string;
  category: string;
}

export interface Review {
  id: string;
  customerName: string;
  serviceName: string;
  address: string;
  description: string;
  photo?: string;
  rating: number;
}

export interface GalleryItem {
  id: string;
  customerName: string;
  service: string;
  description: string;
  date: string;
  image: string;
  isFounder?: boolean; // Type safety if needed
}

export interface User {
  id?: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  favoriteService: string;
  isAdmin?: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'flat';
  value: number;
  applicableTo: 'all' | 'service' | 'product';
  targetId?: string; // Specific Service or Product ID
  targetName?: string; // Name for display
}

export interface Booking {
  id: string;
  customerName: string;
  mobile: string;
  address: string;
  date: string;
  timeSlot: string;
  serviceId?: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  type: 'Service' | 'Product Order' | 'Deal Booking';
  totalAmount: number;
  paymentMethod: 'UPI' | 'COD' | 'Card';
  items?: any[]; // For product orders
  adminNotification?: string; // Custom message from admin
}

export type PageBlockType = 'hero' | 'text' | 'image' | 'video' | 'list' | 'button';

export interface PageBlock {
  id: string;
  type: PageBlockType;
  title?: string;      // Used for Hero Title, Heading, Button Label
  subtitle?: string;   // Used for Hero Subtitle
  content?: string;    // Used for Text body, List items, or Button Alignment (left/center/right)
  url?: string;        // Used for Image/Video src or Button Link
}

export interface CustomPage {
  id: string;
  title: string;
  blocks: PageBlock[]; // Replaces simple content string
}

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
}

export interface PaymentConfig {
  acceptCOD: boolean;
  acceptOnline: boolean;
  acceptCard: boolean;
  upiId: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  social: {
    facebook: string;
    instagram: string;
    whatsapp: string;
  }
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  isFounder: boolean; 
  bio?: string;
  certificate?: string; // URL to certificate image
}

export interface AdminProfile {
  mobile: string;
  email: string;
}

export interface HomeWidget {
  id: string;
  type: 'image' | 'video' | 'text';
  content: string; // URL for image/video, or text body
  linkUrl?: string; // Where it redirects
  caption?: string; // Internal Name or Alt text
  
  // New Features
  title?: string;
  subtitle?: string;
  buttonText?: string;
  layout?: 'full' | 'half'; // Spans 2 cols or 1 col
  price?: number;
  discount?: string;
}

export const TIME_SLOTS = [
  "06:00 AM - 07:00 AM", "07:00 AM - 08:00 AM", "08:00 AM - 09:00 AM",
  "09:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM",
  "12:00 PM - 01:00 PM", "01:00 PM - 02:00 PM", "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM", "04:00 PM - 05:00 PM", "05:00 PM - 06:00 PM",
  "06:00 PM - 07:00 PM", "07:00 PM - 08:00 PM"
];

export const SERVICE_CATEGORIES = [
  "थ्रेडिंग (Threading)",
  "ब्लीच (Bleach)",
  "फेशियल (Facial)",
  "हेयर कट (Hair Cut)",
  "हेयर ट्रीटमेंट (Hair Treatment)",
  "हेयर स्टाइलिंग (Hair Styling)",
  "मेकअप (Makeup)",
  "हेयर कलर (Hair Colour)",
  "वैक्स (Wax)",
  "डी-टैन ट्रीटमेंट (De-tan Treatment)",
  "अन्य सेवाएं (Other Services)"
];