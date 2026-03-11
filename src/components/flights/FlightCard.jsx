import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

const FlightCard = ({ flight }) => {
    const { _id, origin, destination, operatorName, flightNumber, duration, price, attr } = flight;

    // Helper to get airline color/initial
    const getAirlineStyle = (name) => {
        const styles = {
            'Vistara': { bg: 'bg-purple-600', text: 'text-white' },
            'Qatar Airways': { bg: 'bg-maroon-900', text: 'text-white' },
            'Turkish Airlines': { bg: 'bg-red-600', text: 'text-white' },
            'IndiGo': { bg: 'bg-blue-800', text: 'text-white' },
            'Air India': { bg: 'bg-red-500', text: 'text-white' },
            'Emirates': { bg: 'bg-red-700', text: 'text-white' },
        };
        return styles[name] || { bg: 'bg-slate-800', text: 'text-white' };
    };

    const style = getAirlineStyle(operatorName);

    return (
        <div className="group bg-white rounded-3xl shadow-sm border border-slate-100 p-6 mb-5 hover:shadow-xl hover:border-primary-100 transition-all duration-300 relative overflow-hidden">
            {/* Top Badge for Featured/Cheap (Optional) */}
            {price.totalDisplayFare < 50000 && (
                <div className="absolute top-0 right-0">
                    <div className="bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl tracking-wider">
                        BEST VALUE
                    </div>
                </div>
            )}

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                {/* 1. Airline Header */}
                <div className="flex items-center gap-4 min-w-[220px]">
                    <div className={`w-14 h-14 ${style.bg} ${style.text} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-300 font-black text-xl italic`}>
                        {operatorName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg leading-tight">{operatorName}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md uppercase tracking-widest">{flightNumber}</span>
                        </div>
                    </div>
                </div>

                {/* 2. Journey Visualization */}
                <div className="flex-1 flex items-center justify-between max-w-lg mx-auto w-full">
                    <div className="text-center group/time">
                        <div className="text-2xl font-black text-slate-900 group-hover/time:text-primary-600 transition-colors">
                            {new Date(origin.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-sm font-bold text-slate-700 mt-1 uppercase tracking-tight">{origin.airportCode}</div>
                        <div className="text-[11px] text-slate-400 font-medium mt-0.5">{origin.cityName}</div>
                    </div>

                    <div className="flex-1 flex flex-col items-center px-6">
                        <div className="text-[11px] text-primary-500 font-bold mb-2 tracking-wide uppercase italic">{duration}</div>
                        <div className="relative w-full flex items-center justify-center">
                            <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-slate-200 to-transparent absolute"></div>
                            {/* Plane Icon Animation placeholder */}
                            <div className="relative bg-white px-2">
                                <svg className="w-5 h-5 text-primary-500 transform rotate-90" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                                </svg>
                            </div>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-2 font-semibold uppercase tracking-widest">Non-stop</div>
                    </div>

                    <div className="text-center group/time">
                        <div className="text-2xl font-black text-slate-900 group-hover/time:text-primary-600 transition-colors">
                            {new Date(destination.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-sm font-bold text-slate-700 mt-1 uppercase tracking-tight">{destination.airportCode}</div>
                        <div className="text-[11px] text-slate-400 font-medium mt-0.5">{destination.cityName}</div>
                    </div>
                </div>

                {/* 3. Pricing & Booking */}
                <div className="lg:border-l lg:border-slate-100 lg:pl-10 flex flex-col justify-center min-w-[200px]">
                    <div className="mb-4">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Price per adult</div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-sm font-bold text-slate-500">{price.currency}</span>
                            <span className="text-3xl font-black text-slate-900 tracking-tight">
                                {Number(price.totalDisplayFare).toLocaleString()}
                            </span>
                        </div>
                    </div>
                    <Link
                        to={ROUTES.BOOKING.replace(':flightId', _id)}
                        className="w-full bg-slate-900 hover:bg-primary-600 text-white py-3.5 rounded-2xl font-bold transition-all duration-300 shadow-lg shadow-slate-200 flex items-center justify-center gap-2 group/btn text-center"
                    >
                        <span>Book Flight</span>
                        <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                </div>
            </div>

            {/* Bottom Info Bar */}
            <div className="mt-7 pt-4 border-t border-slate-50 flex flex-wrap items-center gap-x-8 gap-y-3">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-xs font-bold text-slate-600 italic">
                        {attr.isRefundable ? 'Refundable' : 'Standard Fare'}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span className="text-xs font-bold text-slate-500">{attr.baggage} Check-in</span>
                </div>
                <div className="ml-auto">
                    <span className={`text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${attr.availableSeats < 5 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-orange-50 text-orange-600'
                        }`}>
                        {attr.availableSeats} SEATS LEFT AT THIS PRICE
                    </span>
                </div>
            </div>
        </div>
    );
};

export default FlightCard;
