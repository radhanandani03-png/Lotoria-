import React, { useState, useEffect } from 'react';
import { useApp } from '../store';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TIME_SLOTS } from '../types';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, CreditCard, Banknote, Smartphone, ChevronDown, Calendar, Clock } from 'lucide-react';

export const Booking: React.FC = () => {
  const { user, theme, addBooking, cart, clearCart, coupons, paymentConfig, services, deals } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    mobile: user?.mobile || '',
    address: user?.address || '',
    date: '',
    timeSlot: '',
  });

  // Identify what is being booked
  const serviceIdParam = searchParams.get('serviceId');
  const dealIdParam = searchParams.get('dealId');

  // Find the object
  const selectedService = services.find(s => s.id === serviceIdParam);
  const selectedDeal = deals.find(d => d.id === dealIdParam);
  const bookingItem = selectedService || selectedDeal;

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // --- AMOUNT CALCULATION ---
  const isProductOrder = cart.length > 0;
  
  // 1. Calculate Product Total
  const cartTotal = cart.reduce((sum, item) => sum + (item.discountPrice || item.price), 0);
  
  // 2. Determine Base Amount (Service Price OR Deal Offer Price OR Cart Total)
  let baseAmount = 0;
  if (isProductOrder) {
      baseAmount = cartTotal;
  } else if (selectedService) {
      baseAmount = selectedService.price;
  } else if (selectedDeal) {
      baseAmount = selectedDeal.offerPrice;
  }
  
  // 3. Final Total
  const totalAmount = Math.max(0, baseAmount - discount);

  // Sync Service/Deal from URL to ensure price updates immediately
  useEffect(() => {
    // This effect ensures that if the URL changes, we re-evaluate pricing logic
    // The variables selectedService/selectedDeal are derived from URL params directly
    // so React will re-render this component automatically. 
    // We just need to ensure discount is reset if item changes.
    setDiscount(0);
    setCouponCode('');
  }, [serviceIdParam, dealIdParam]);

  const applyCoupon = () => {
    const coupon = coupons.find(c => c.code === couponCode);
    if (coupon) {
      // Check applicability (General Type)
      if(coupon.applicableTo === 'service' && isProductOrder) {
          alert("This coupon is only for Services.");
          return;
      }
      if(coupon.applicableTo === 'product' && !isProductOrder) {
          alert("This coupon is only for Products.");
          return;
      }

      // Check Specific Target
      let amountToDiscount = baseAmount;
      
      if (coupon.targetId) {
          if (isProductOrder) {
              const targetProduct = cart.find(p => p.id === coupon.targetId);
              if (!targetProduct) {
                  alert(`This coupon is only valid for product: ${coupon.targetName || 'Specific Product'}`);
                  return;
              }
              if (coupon.discountType === 'percentage') {
                  amountToDiscount = targetProduct.discountPrice || targetProduct.price;
              }
          } else {
              // Service Booking
              // Check if the coupon target matches the selected service or deal
              if (bookingItem?.id !== coupon.targetId) {
                  alert(`This coupon is only valid for: ${coupon.targetName || 'Specific Item'}`);
                  return;
              }
          }
      }

      let val = 0;
      if (coupon.discountType === 'flat') val = coupon.value;
      if (coupon.discountType === 'percentage') val = (amountToDiscount * coupon.value) / 100;
      
      setDiscount(Math.floor(val));
    } else {
      alert('Invalid Coupon Code');
      setDiscount(0);
    }
  };

  const processBooking = (method: 'UPI' | 'COD' | 'Card') => {
    // Basic validation
    if(!isProductOrder && !bookingItem) {
        alert("No Service or Deal selected!");
        return;
    }
    
    if (formData.mobile.length !== 10) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
    }

    addBooking({
      id: Date.now().toString(),
      customerName: formData.name,
      mobile: formData.mobile,
      address: formData.address,
      date: formData.date,
      timeSlot: formData.timeSlot,
      serviceId: !isProductOrder ? bookingItem?.id : undefined, // Stores Deal ID or Service ID
      status: 'Pending',
      type: isProductOrder ? 'Product Order' : (selectedDeal ? 'Deal Booking' : 'Service'),
      totalAmount: totalAmount,
      paymentMethod: method,
      items: isProductOrder ? [...cart] : (bookingItem ? [bookingItem] : [])
    });
    
    if (isProductOrder) {
      setSuccessMessage("Thanks for purchasing Lotoria Beauty Salon!");
      clearCart();
    } else {
      setSuccessMessage("Thanks for booking Lotoria Beauty Salon!");
    }
    setShowSuccessModal(true);
  };

  const closeSuccess = () => {
    setShowSuccessModal(false);
    navigate('/track');
  };

  const handlePayNow = () => {
    const upiLink = `upi://pay?pa=${paymentConfig.upiId}&pn=LotoriaBeauty&am=${totalAmount}&cu=INR`;
    window.location.href = upiLink;
    setTimeout(() => {
        const confirm = window.confirm("Did you complete the payment via your UPI App?");
        if(confirm) processBooking('UPI');
    }, 5000);
  };

  const handleCardPayment = () => {
    alert("Redirecting to Secure Card Payment Gateway...");
    setTimeout(() => {
        const confirm = window.confirm("Simulate Successful Payment?");
        if(confirm) processBooking('Card');
    }, 1000);
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Allow only digits and max 10 chars
    if (/^\d{0,10}$/.test(val)) {
        setFormData({...formData, mobile: val});
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 text-center">
        <h2 className="text-2xl mb-4 font-serif">Please Login to Book</h2>
        <p className="mb-6 text-gray-500">You need an account to schedule services or order products.</p>
        <button onClick={() => navigate('/auth')} className="bg-brand-gold px-8 py-3 rounded text-white font-bold shadow-lg hover:scale-105 transition">Login / Signup</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 relative">
      <h2 className="text-3xl font-serif text-center mb-8">
        {isProductOrder ? 'Checkout & Order' : 'Book Appointment'}
      </h2>
      
      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Col: Details Form */}
            <div className="md:col-span-2 bg-white p-8 rounded-xl shadow-lg space-y-4 border border-gray-100 h-fit">
                <h3 className="font-bold text-lg mb-4 border-b pb-2">Personal Details</h3>
                <div>
                    <label className="block text-sm font-bold mb-1 text-gray-700">Full Name</label>
                    <input 
                    type="text" value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full p-3 border rounded bg-gray-50 focus:ring-1 focus:ring-brand-gold outline-none transition"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1 text-gray-700">Mobile Number (10 Digits)</label>
                    <input 
                    type="tel" 
                    value={formData.mobile} 
                    onChange={handleMobileChange}
                    maxLength={10}
                    placeholder="9876543210"
                    className="w-full p-3 border rounded bg-gray-50 focus:ring-1 focus:ring-brand-gold outline-none transition"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1 text-gray-700">Address (Home Service)</label>
                    <textarea 
                    value={formData.address} 
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    className="w-full p-3 border rounded bg-gray-50 focus:ring-1 focus:ring-brand-gold outline-none transition"
                    rows={3}
                    />
                </div>

                {!isProductOrder && (
                    <div className="pt-4 mt-4 border-t border-gray-100">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Clock size={18}/> Schedule</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-1 text-gray-700">Select Date</label>
                                <div className="relative">
                                    <input 
                                        type="date" 
                                        onChange={e => setFormData({...formData, date: e.target.value})}
                                        className="w-full p-3 border rounded bg-gray-50 focus:ring-1 focus:ring-brand-gold outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1 text-gray-700">Time Slot</label>
                                <div className="relative">
                                    <select 
                                        onChange={e => setFormData({...formData, timeSlot: e.target.value})}
                                        className="w-full p-3 border rounded bg-gray-50 focus:ring-1 focus:ring-brand-gold outline-none appearance-none"
                                    >
                                        <option value="">-- Select Slot --</option>
                                        {TIME_SLOTS.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={16}/>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Right Col: Order Summary */}
            <div className="md:col-span-1 space-y-6">
                {/* Selected Item Card (Service/Deal) */}
                {!isProductOrder && bookingItem ? (
                     <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-brand-gold/30">
                        <div className="h-32 overflow-hidden">
                            <img src={bookingItem.image} alt="Selected" className="w-full h-full object-cover"/>
                        </div>
                        <div className="p-4">
                            <span className="bg-brand-gold text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase mb-2 inline-block">
                                {selectedDeal ? 'Deal' : 'Service'}
                            </span>
                            <h4 className="font-bold font-serif text-lg leading-tight mb-1">
                                {(bookingItem as any).name || (bookingItem as any).title}
                            </h4>
                            <p className="text-xs text-gray-500 line-clamp-2 mb-3">{bookingItem.description}</p>
                            <div className="flex justify-between items-center border-t pt-2">
                                <span className="text-sm font-bold text-gray-500">Price</span>
                                <span className="text-xl font-bold text-brand-gold">₹{baseAmount}</span>
                            </div>
                        </div>
                     </div>
                ) : !isProductOrder && (
                    <div className="bg-red-50 p-4 rounded text-red-600 text-sm">
                        Please select a service or deal from the menu first.
                    </div>
                )}

                {/* Pricing Breakdown */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h3 className="font-bold text-lg mb-4">Payment Summary</h3>
                    
                    {/* Coupon Input */}
                    <div className="flex gap-2 mb-4">
                        <input 
                            type="text" 
                            placeholder="COUPON CODE" 
                            value={couponCode}
                            onChange={e => setCouponCode(e.target.value)}
                            className="flex-1 p-2 border rounded uppercase text-sm"
                        />
                        <button onClick={applyCoupon} className="bg-gray-800 text-white px-3 text-xs font-bold rounded hover:bg-black transition">APPLY</button>
                    </div>

                    <div className="space-y-2 text-sm border-t pt-4">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>₹{baseAmount}</span>
                        </div>
                        {discount > 0 && (
                             <div className="flex justify-between text-green-600 font-bold">
                                <span>Discount</span>
                                <span>-₹{discount}</span>
                            </div>
                        )}
                        <div className="flex justify-between font-bold text-xl text-black border-t pt-2 mt-2">
                            <span>Total</span>
                            <span>₹{totalAmount}</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => setStep(2)} 
                        disabled={
                            !formData.name || !formData.mobile || formData.mobile.length !== 10 || !formData.address || 
                            (isProductOrder && cart.length === 0) ||
                            (!isProductOrder && (!formData.date || !formData.timeSlot || !bookingItem))
                        }
                        className="w-full mt-6 py-3 text-white rounded-lg font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-sm uppercase tracking-wider transition"
                        style={{ backgroundColor: theme.primaryColor }}
                    >
                        {formData.mobile.length !== 10 ? 'Enter Valid Mobile' : 'Proceed to Pay'}
                    </button>
                </div>
            </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white p-8 rounded-xl shadow-lg text-center space-y-6 max-w-lg mx-auto border border-brand-gold/20">
          <h3 className="text-2xl font-bold font-serif">Payment Method</h3>
          <div className="bg-rose-50 p-4 rounded border border-rose-200">
             <p className="text-lg font-bold text-gray-800">Total Payable: ₹{totalAmount}</p>
          </div>
          
          <div className="space-y-4">
            {paymentConfig.acceptOnline && (
                <div className="bg-white border p-6 rounded-lg shadow-sm group hover:border-brand-gold transition cursor-pointer">
                    <p className="font-bold mb-4 text-gray-700 flex items-center justify-center gap-2"><Smartphone size={20}/> UPI / QR Code</p>
                    
                    <div className="flex justify-center mb-4 p-4 bg-white inline-block rounded shadow">
                        <QRCodeSVG 
                            value={`upi://pay?pa=${paymentConfig.upiId}&pn=LotoriaBeauty&am=${totalAmount}&cu=INR`} 
                            size={160} 
                            level="H" 
                        />
                    </div>
                    <p className="text-xs font-mono bg-gray-100 p-2 rounded text-center break-all text-gray-500">ID: {paymentConfig.upiId}</p>
                    
                    <button onClick={handlePayNow} className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow transition flex justify-center items-center gap-2">
                        Pay via UPI App
                    </button>
                </div>
            )}

            {paymentConfig.acceptCard && (
                <button onClick={handleCardPayment} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow transition flex justify-center items-center gap-2">
                   <CreditCard size={20}/> Pay with Credit / Debit Card
                </button>
            )}

            {paymentConfig.acceptCOD && (
               <button onClick={() => processBooking('COD')} className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow transition flex justify-center items-center gap-2">
                 <Banknote size={20}/> Cash on Delivery
               </button>
             )}
          </div>
          
          <button onClick={() => setStep(1)} className="text-sm text-gray-500 underline mt-4 hover:text-gray-800">Back to Details</button>
        </div>
      )}

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center relative border-2 border-brand-gold"
            >
              <div className="flex justify-center mb-4">
                 <CheckCircle size={64} className="text-green-500" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-2">Success!</h3>
              <p className="text-gray-600 mb-8">{successMessage}</p>
              
              <button 
                onClick={closeSuccess}
                className="w-full py-3 rounded-lg font-bold text-white shadow hover:opacity-90 transition uppercase text-sm tracking-wider"
                style={{ backgroundColor: theme.primaryColor }}
              >
                Track Status
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};