import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingsApi } from '../api/endpoints';
import { ROUTES } from '../utils/constants';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await bookingsApi.getMyBookings();
                setBookings(response.data);
            } catch (err) {
                setError('Failed to load your bookings.');
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="w-16 h-16 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="container-app max-w-5xl">
                <div className="mb-10">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Reservations</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage your upcoming flights and booking history</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-6 rounded-3xl border border-red-100 mb-8 font-bold">
                        {error}
                    </div>
                )}

                {bookings.length === 0 ? (
                    <div className="bg-white p-20 rounded-[40px] text-center shadow-sm border border-slate-100">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">No bookings yet</h3>
                        <p className="text-slate-500 mt-2 font-medium">Your upcoming flights will appear here once booked.</p>
                        <Link
                            to={ROUTES.FLIGHTS}
                            className="inline-block mt-8 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary-600 transition-all shadow-lg shadow-slate-200"
                        >
                            Explore Flights
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {bookings.map((booking) => (
                            <div key={booking._id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    {/* Flight Info */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xs italic">
                                            {booking.flight.operatorName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-slate-900">{booking.flight.origin.cityName} to {booking.flight.destination.cityName}</h4>
                                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest ${booking.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                                                Ref: {booking.bookingReference} • {new Date(booking.flight.origin.dateTime).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Passengers & Price */}
                                    <div className="flex items-center gap-8 text-right">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Passengers</p>
                                            <p className="text-sm font-black text-slate-700">{booking.passengers.length} Adult{booking.passengers.length > 1 ? 's' : ''}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Paid</p>
                                            <p className="text-lg font-black text-primary-600">NPR {booking.totalPrice.toLocaleString()}</p>
                                        </div>
                                        <button className="bg-slate-50 hover:bg-slate-100 p-3 rounded-xl transition-colors">
                                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
