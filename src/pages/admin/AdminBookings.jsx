import React, { useState, useEffect } from 'react';
import { bookingsApi } from '../../api/endpoints';
import Card from '../../components/common/Card';

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await bookingsApi.getAll();
                setBookings(response.data);
            } catch (err) {
                setError('Failed to load global bookings');
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const handleConfirm = async (id) => {
        if (window.confirm('Are you sure you want to confirm this booking and mark as PAID?')) {
            try {
                await bookingsApi.updateStatus(id, { status: 'CONFIRMED', paymentStatus: 'PAID' });
                setBookings(bookings.map(b => b._id === id ? { ...b, status: 'CONFIRMED', paymentStatus: 'PAID' } : b));
            } catch (err) {
                alert('Failed to confirm booking');
            }
        }
    };

    if (loading) return <div className="p-10 text-center">Loading all bookings...</div>;

    return (
        <div className="container-app py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900">Global Bookings</h1>
                <p className="text-slate-500 font-medium mt-1">Monitor and manage all passenger reservations</p>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-6 rounded-3xl mb-8 font-bold border border-red-100">{error}</div>}

            <Card padding={false} className="overflow-hidden shadow-soft">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Ref / Date</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">User</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Flight</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Passengers</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Total</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {bookings.map((booking) => (
                            <tr key={booking._id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="font-bold text-slate-900 leading-tight">{booking.bookingReference}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{new Date(booking.createdAt).toLocaleDateString()}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-bold text-slate-800">{booking.user?.name}</p>
                                    <p className="text-xs text-slate-500 truncate max-w-[150px]">{booking.user?.email}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-bold text-slate-700">{booking.flight?.origin?.airportCode} → {booking.flight?.destination?.airportCode}</p>
                                    <p className="text-[10px] text-slate-400 font-black italic">{booking.flight?.operatorName}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex -space-x-2">
                                        {booking.passengers.map((p, i) => (
                                            <div key={i} className="w-8 h-8 bg-slate-900 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-black text-white" title={p.name}>
                                                {p.name[0]}
                                            </div>
                                        ))}
                                        {booking.passengers.length > 3 && (
                                            <div className="w-8 h-8 bg-slate-100 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-bold text-slate-600">
                                                +{booking.passengers.length - 3}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-black text-slate-900">
                                    NPR {booking.totalPrice.toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${
                                            booking.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-600' : 
                                            booking.status === 'CANCELLED' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                                        }`}>
                                            {booking.status}
                                        </span>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase ${
                                            booking.paymentStatus === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'
                                        }`}>
                                            {booking.paymentStatus}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {booking.status === 'PENDING' && (
                                        <button 
                                            onClick={() => handleConfirm(booking._id)}
                                            className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-slate-200"
                                        >
                                            Confirm
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export default AdminBookings;
