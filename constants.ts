
import { Service, Product, Deal, Review, GalleryItem } from './types';

export const INITIAL_SERVICES: Service[] = [
  { id: '1', name: 'Royal Facial', price: 999, description: 'Deep cleansing and glow', image: 'https://picsum.photos/400/300?random=1', category: 'Facial' },
  { id: '2', name: 'Bridal Makeup', price: 15000, description: 'Complete bridal package', image: 'https://picsum.photos/400/300?random=2', category: 'Makeup' },
  { id: '3', name: 'Hair Spa', price: 1200, description: 'Rejuvenating hair treatment', image: 'https://picsum.photos/400/300?random=3', category: 'Hair Treatment' },
  { id: '4', name: 'Fruit Bleach', price: 450, description: 'Natural fruit extract bleach', image: 'https://picsum.photos/400/300?random=4', category: 'Bleach' },
  { id: '5', name: 'Eyebrow Threading', price: 50, description: 'Precise shaping', image: 'https://picsum.photos/400/300?random=5', category: 'Threading' },
];

export const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Gold Serum', price: 599, discountPrice: 499, description: 'For glowing skin', category: 'Skin', image: 'https://picsum.photos/300/300?random=10', rating: 4.5 },
  { id: '2', name: 'Keratin Shampoo', price: 899, discountPrice: 799, description: 'Smooth and silky hair', category: 'Hair', image: 'https://picsum.photos/300/300?random=11', rating: 4.8 },
  { id: '3', name: 'Matte Lipstick', price: 1299, discountPrice: 999, description: 'Long lasting red shade', category: 'Makeup', image: 'https://picsum.photos/300/300?random=12', rating: 5 },
];

export const INITIAL_DEALS: Deal[] = [
  { id: '1', title: 'Summer Glow Package', description: 'Facial + Waxing + Threading', originalPrice: 2500, offerPrice: 1499, percentageOff: 40, image: 'https://picsum.photos/400/200?random=20', category: 'Seasonal' },
  { id: '2', title: 'Wedding Combo', description: 'Full Body Wax + Bridal Makeup', originalPrice: 20000, offerPrice: 16999, percentageOff: 15, image: 'https://picsum.photos/400/200?random=21', category: 'Bridal' },
];

export const INITIAL_REVIEWS: Review[] = [
  { id: '1', customerName: 'Priya Singh', serviceName: 'Bridal Makeup', address: 'Kanpur, Civil Lines', description: 'Absolutely loved the service! Very professional.', rating: 5 },
  { id: '2', customerName: 'Sneha Gupta', serviceName: 'Hair Spa', address: 'Kanpur, Swaroop Nagar', description: 'My hair feels so soft. Great home service.', rating: 4 },
];

export const INITIAL_GALLERY: GalleryItem[] = [
  { id: '1', customerName: 'Anjali', service: 'Party Makeup', description: 'Look for evening reception', date: '2023-10-15', image: 'https://picsum.photos/400/400?random=30' },
  { id: '2', customerName: 'Riya', service: 'Mehendi', description: 'Bridal Mehendi Design', date: '2023-11-20', image: 'https://picsum.photos/400/400?random=31' },
];

export const FOUNDERS = {
  main: {
    name: 'Aryan Kumar',
    role: 'Founder & Lead',
    image: 'https://img.sanishtech.com/u/13a00a495c7c890d5a711a94154d2bf8.jpg'
  },
  co: {
    name: 'Jyoti',
    role: 'Co-Founder',
    image: 'https://img.sanishtech.com/u/e1656cab28cdbc64c126a747787c11b4.jpg'
  }
};

export const CONTACT_INFO = {
  phone: '8210667364',
  email: 'buylotoria@gmail.com',
  address: 'Kanpur, India',
  social: {
    facebook: 'https://www.facebook.com/share/1acgbkUrSL/',
    instagram: 'https://www.instagram.com/_lotoria?igsh=ZnI2bTZocW0zNHow',
    whatsapp: 'https://whatsapp.com/channel/0029VbBFj097IUYSac2k7O0U'
  }
};

export const ADMIN_CONTACT = {
  mobile: '9110111970',
  email: 'arayankumarfb3@gmail.com'
};
