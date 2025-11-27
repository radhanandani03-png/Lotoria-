
import React, { useState } from 'react';
import { useApp } from '../store';
import { Star, Image as ImageIcon } from 'lucide-react';

export const Reviews: React.FC = () => {
  const { reviews, setReviews, theme } = useApp();
  const [newReview, setNewReview] = useState({ name: '', service: '', address: '', description: '', photo: '', rating: 5 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReviews([...reviews, { ...newReview, id: Date.now().toString(), customerName: newReview.name, serviceName: newReview.service }]);
    setNewReview({ name: '', service: '', address: '', description: '', photo: '', rating: 5 });
    alert("Thank you for your review!");
  };

  return (
    <div className="py-12 px-4 max-w-7xl mx-auto">
      <h2 className="text-4xl font-serif text-center mb-12">Client Reviews</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div>
          <h3 className="text-2xl font-bold mb-6">Write a Review</h3>
          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-md">
            <input 
              required
              placeholder="Your Name" 
              value={newReview.name}
              onChange={e => setNewReview({...newReview, name: e.target.value})}
              className="w-full p-3 border rounded focus:outline-none focus:border-brand-gold"
            />
            <input 
              required
              placeholder="Service Taken" 
              value={newReview.service}
              onChange={e => setNewReview({...newReview, service: e.target.value})}
              className="w-full p-3 border rounded focus:outline-none focus:border-brand-gold"
            />
             <input 
              required
              placeholder="City/Address" 
              value={newReview.address}
              onChange={e => setNewReview({...newReview, address: e.target.value})}
              className="w-full p-3 border rounded focus:outline-none focus:border-brand-gold"
            />
            <div className="relative">
                <input 
                  placeholder="Photo URL (Optional)" 
                  value={newReview.photo}
                  onChange={e => setNewReview({...newReview, photo: e.target.value})}
                  className="w-full p-3 border rounded focus:outline-none focus:border-brand-gold pl-10"
                />
                <ImageIcon className="absolute left-3 top-3.5 text-gray-400" size={18}/>
            </div>
            <textarea 
              required
              placeholder="Your experience..." 
              value={newReview.description}
              onChange={e => setNewReview({...newReview, description: e.target.value})}
              className="w-full p-3 border rounded h-32 focus:outline-none focus:border-brand-gold"
            />
             <div className="flex items-center gap-2">
              <span>Rating:</span>
              <select 
                value={newReview.rating} 
                onChange={e => setNewReview({...newReview, rating: Number(e.target.value)})}
                className="p-2 border rounded focus:outline-none focus:border-brand-gold"
              >
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Stars</option>)}
              </select>
            </div>
            <button type="submit" className="w-full py-3 text-white rounded font-bold transition hover:opacity-90" style={{ backgroundColor: theme.primaryColor }}>Submit Review</button>
          </form>
        </div>

        <div className="space-y-6 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
           {reviews.map(review => (
             <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex gap-4">
                {review.photo && (
                    <div className="shrink-0 w-16 h-16 rounded-full overflow-hidden border border-gray-200">
                        <img src={review.photo} alt={review.customerName} className="w-full h-full object-cover" />
                    </div>
                )}
                <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                    <div>
                        <h4 className="font-bold">{review.customerName}</h4>
                        <p className="text-xs text-gray-500">{review.serviceName} • {review.address}</p>
                    </div>
                    <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />)}
                    </div>
                    </div>
                    <p className="text-gray-700 italic">"{review.description}"</p>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};
