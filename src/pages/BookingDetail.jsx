import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookingsApi } from '../api/endpoints';
import Card from '../components/common/Card';
import { ROUTES } from '../utils/constants';

const BookingDetail = () => {
    const { id } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPayment, setShowPayment] = useState(false);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const response = await bookingsApi.getById(id);
                setBooking(response.data);
            } catch (err) {
                setError('Failed to load booking details');
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="w-16 h-16 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
    );

    if (error || !booking) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="bg-white p-10 rounded-3xl shadow-sm text-center">
                <p className="text-red-600 font-bold mb-4">{error || 'Booking not found'}</p>
                <Link to={ROUTES.MY_BOOKINGS} className="text-primary-600 font-bold">Back to My Bookings</Link>
            </div>
        </div>
    );

    const { flight, passengers, totalPrice, status, paymentStatus, bookingReference } = booking;

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="container-app max-w-4xl">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Booking Details</h1>
                        <p className="text-slate-500 font-medium mt-1">Reference: {bookingReference}</p>
                    </div>
                    <div className="flex gap-3">
                        <span className={`px-4 py-2 rounded-xl text-sm font-black uppercase tracking-widest ${
                            status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-600' : 
                            status === 'CANCELLED' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                            {status}
                        </span>
                        <span className={`px-4 py-2 rounded-xl text-sm font-black uppercase tracking-widest ${
                            paymentStatus === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                        }`}>
                            {paymentStatus}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        {/* Flight Info */}
                        <Card className="p-8">
                            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-50">
                                <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xl italic">
                                    {flight.operatorName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-xl leading-tight">{flight.operatorName}</h3>
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">{flight.flightNumber}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-8">
                                <div className="text-left">
                                    <div className="text-2xl font-black text-slate-900">
                                        {new Date(flight.origin.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className="text-sm font-bold text-slate-700 mt-1 uppercase tracking-tight">{flight.origin.airportCode}</div>
                                    <div className="text-[11px] text-slate-400 font-medium mt-0.5">{flight.origin.cityName}</div>
                                </div>

                                <div className="flex-1 flex flex-col items-center px-6">
                                    <div className="text-[11px] text-primary-500 font-bold mb-2 tracking-wide uppercase italic">{flight.duration}</div>
                                    <div className="w-full h-px bg-slate-100 relative">
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary-500 rounded-full"></div>
                                    </div>
                                    <div className="text-[10px] text-slate-400 mt-2 font-semibold uppercase tracking-widest">Non-stop</div>
                                </div>

                                <div className="text-right">
                                    <div className="text-2xl font-black text-slate-900">
                                        {new Date(flight.destination.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className="text-sm font-bold text-slate-700 mt-1 uppercase tracking-tight">{flight.destination.airportCode}</div>
                                    <div className="text-[11px] text-slate-400 font-medium mt-0.5">{flight.destination.cityName}</div>
                                </div>
                            </div>
                        </Card>

                        {/* Passengers */}
                        <Card className="p-8">
                            <h3 className="text-lg font-black text-slate-900 mb-6 uppercase tracking-wider">Passenger Information</h3>
                            <div className="space-y-4">
                                {passengers.map((p, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xs">
                                                {i + 1}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800">{p.name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{p.gender} • {p.age} Years</p>
                                            </div>
                                        </div>
                                        {p.passportNumber && (
                                            <div className="text-right">
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Passport/ID</p>
                                                <p className="text-xs font-bold text-slate-700">{p.passportNumber}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        {/* Summary */}
                        <Card className="p-6">
                            <h3 className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-xs">Payment Summary</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-slate-400">Total Amount</span>
                                    <span className="text-slate-900 font-bold">NPR {totalPrice.toLocaleString()}</span>
                                </div>
                                <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                                    <span className="text-slate-900 font-black">Status</span>
                                    <span className={`text-sm font-black uppercase ${paymentStatus === 'PAID' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                        {paymentStatus}
                                    </span>
                                </div>
                            </div>

                            {status === 'PENDING' && paymentStatus === 'UNPAID' && (
                                <button
                                    onClick={() => setShowPayment(!showPayment)}
                                    className="w-full mt-8 bg-slate-900 hover:bg-primary-600 text-white py-4 rounded-2xl font-black text-sm transition-all shadow-xl shadow-slate-200 uppercase tracking-widest"
                                >
                                    {showPayment ? 'Close Payment' : 'Proceed to Payment'}
                                </button>
                            )}
                        </Card>

                        {/* Payment QR Section */}
                        {showPayment && (
                            <Card className="p-6 text-center border-2 border-primary-100 bg-primary-50/10">
                                <h3 className="font-bold text-slate-900 mb-2">Scan & Pay</h3>
                                <p className="text-xs text-slate-500 mb-6">Scan this QR to pay NPR {totalPrice.toLocaleString()}</p>
                                
                                <div className="w-48 h-48 bg-white mx-auto rounded-3xl p-4 shadow-sm border border-slate-100 mb-6 flex items-center justify-center">
                                    {/* Placeholder QR Code */}
                                    <img 
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PAYMENT_FOR_REF_${bookingReference}_AMT_${totalPrice}`} 
                                        alt="Payment QR" 
                                        className="w-full h-full object-contain"
                                    />
                                </div>

                                <div className="text-left bg-white p-4 rounded-2xl border border-slate-100 space-y-2">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Details</p>
                                    <p className="text-xs font-bold text-slate-800">Bank: Flixor Airways Bank</p>
                                    <p className="text-xs font-bold text-slate-800">Acc Name: Flixor Travels Pvt Ltd</p>
                                    <p className="text-xs font-bold text-slate-800">Acc No: 1234567890123</p>
                                </div>

                                <p className="mt-6 text-[10px] text-slate-400 font-medium leading-relaxed italic">
                                    After payment, our team will verify and confirm your booking within 24 hours.
                                </p>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetail;
