
import React from 'react';
import { useApp } from '../store';
import { Clock, CheckCircle, XCircle, Bell } from 'lucide-react';

export const Track: React.FC = () => {
  const { bookings, user } = useApp();

  if (!user) {
    return <div className="p-10 text-center">Please Login to track orders.</div>;
  }

  // Filter bookings for logged in user (in a real app, backend does this)
  const myBookings = bookings.filter(b => b.customerName === user.name || b.mobile === user.mobile);

  return (
    <div className="py-12 px-4 max-w-4xl mx-auto min-h-screen">
      <h2 className="text-3xl font-serif text-center mb-8">Track Appointment & Orders</h2>

      {myBookings.length === 0 ? (
        <div className="text-center text-gray-500">No active bookings or orders found.</div>
      ) : (
        <div className="space-y-6">
          {myBookings.map(booking => (
            <div key={booking.id} className="bg-white p-6 rounded-xl shadow border-l-4" style={{ borderLeftColor: booking.status === 'Confirmed' ? 'green' : 'orange' }}>
              <div className="flex flex-col md:flex-row justify-between items-start">
                 <div className="flex-1">
                   <span className="inline-block px-2 py-1 text-xs font-bold rounded bg-gray-100 text-gray-600 mb-2">{booking.type.toUpperCase()}</span>
                   <p className="font-bold text-lg">ID: #{booking.id.slice(-6)}</p>
                   <p className="text-gray-600">{booking.date} at {booking.timeSlot}</p>
                   <p className="text-sm text-gray-500 mt-1">{booking.address}</p>
                   
                   {/* Products List if Order */}
                   {booking.items && booking.items.length > 0 && (
                     <div className="mt-2 bg-gray-50 p-2 rounded text-sm">
                       <span className="font-bold">Items:</span> {booking.items.map(i => i.name).join(', ')}
                     </div>
                   )}
                 </div>
                 <div className="flex flex-col items-end mt-4 md:mt-0">
                    <div className="flex items-center gap-2 mb-2">
                      {booking.status === 'Confirmed' && <CheckCircle className="text-green-500" />}
                      {booking.status === 'Pending' && <Clock className="text-yellow-500" />}
                      {booking.status === 'Completed' && <CheckCircle className="text-blue-500" />}
                      {booking.status === 'Cancelled' && <XCircle className="text-red-500" />}
                      <span className="font-bold">{booking.status}</span>
                    </div>
                    {booking.status === 'Confirmed' && <p className="text-xs text-green-600">Beautician assigned.</p>}
                 </div>
              </div>
              
              {/* Notification from Admin */}
              {booking.adminNotification && (
                <div className="mt-4 bg-blue-50 border border-blue-200 p-3 rounded flex items-start gap-2">
                  <Bell size={16} className="text-blue-600 mt-1" />
                  <div>
                    <p className="text-xs font-bold text-blue-800 uppercase">Message from Lotoria:</p>
                    <p className="text-sm text-blue-900">{booking.adminNotification}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
