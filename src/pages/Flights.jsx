import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { flightsApi } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';
import FlightCard from '../components/flights/FlightCard';
import FlightSearchHero from '../components/flights/FlightSearchHero';

const Flights = () => {
    const location = useLocation();
    const { isAuthenticated } = useAuth();
    const searchParams = location.state?.search;

    const [flights, setFlights] = useState([]);
    const [filteredFlights, setFilteredFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter states
    const [filters, setFilters] = useState({
        maxPrice: 300000,
        airlines: [],
        maxDuration: 20
    });

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                setLoading(true);
                // Map frontend search fields to backend query fields
                const query = searchParams ? {
                    origin: searchParams.from,
                    destination: searchParams.to,
                    date: searchParams.departDate
                } : {};

                const response = await flightsApi.getAll(query);
                setFlights(response.data);
                setFilteredFlights(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching flights:', err);
                setError('Failed to load flights. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchFlights();
    }, [searchParams]);

    // Update filtered flights when filters change
    useEffect(() => {
        let res = flights;

        if (filters.maxPrice) {
            res = res.filter(f => f.price.totalDisplayFare <= filters.maxPrice);
        }

        if (filters.airlines.length > 0) {
            res = res.filter(f => filters.airlines.includes(f.operatorName));
        }

        setFilteredFlights(res);
    }, [filters, flights]);

    const uniqueAirlines = [...new Set(flights.map(f => f.operatorName))];

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Search Header */}
            <FlightSearchHero showAuthCtas={!isAuthenticated} onSearch={() => { }} />

            <div className="container-app mt-10">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-72 space-y-6">
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                Filter Results
                            </h3>

                            {/* Price Filter */}
                            <div className="mb-8">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                                    Max Price: <span className="text-slate-900 ml-1">NPR {filters.maxPrice.toLocaleString()}</span>
                                </label>
                                <input
                                    type="range"
                                    min="10000"
                                    max="500000"
                                    step="5000"
                                    value={filters.maxPrice}
                                    onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary-500"
                                />
                            </div>

                            {/* Airlines Filter */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                                    Airlines
                                </label>
                                <div className="space-y-3">
                                    {uniqueAirlines.map(airline => (
                                        <label key={airline} className="flex items-center group cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={filters.airlines.includes(airline)}
                                                onChange={(e) => {
                                                    const newAirlines = e.target.checked
                                                        ? [...filters.airlines, airline]
                                                        : filters.airlines.filter(a => a !== airline);
                                                    setFilters({ ...filters, airlines: newAirlines });
                                                }}
                                                className="w-4 h-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
                                            />
                                            <span className="ml-3 text-sm font-medium text-slate-600 group-hover:text-primary-600 transition-colors uppercase tracking-tight">
                                                {airline}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Promo Card */}
                        <div className="bg-slate-900 rounded-3xl p-6 text-white overflow-hidden relative group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                                </svg>
                            </div>
                            <h4 className="font-bold mb-2">Student Deals</h4>
                            <p className="text-xs text-slate-400 mb-4 leading-relaxed">Get up to 15% discount on international flights with valid student ID.</p>
                            <button className="text-[11px] font-bold bg-white text-slate-900 px-4 py-2 rounded-xl hover:bg-primary-50 transition-colors">Learn More</button>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                                    {filteredFlights.length} Flights Found
                                </h2>
                                <p className="text-sm text-slate-500 font-medium">Showing best rates for your journey</p>
                            </div>
                            <div className="hidden sm:flex items-center gap-3 text-sm">
                                <span className="font-bold text-slate-400 text-xs uppercase tracking-widest">Sort by:</span>
                                <select className="bg-white border border-slate-100 rounded-xl px-4 py-2 font-bold text-slate-900 focus:ring-2 focus:ring-primary-100 outline-none text-xs">
                                    <option>Cheapest First</option>
                                    <option>Fastest Flight</option>
                                    <option>Earliest Departure</option>
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <div className="space-y-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-48 bg-white rounded-3xl animate-pulse shadow-sm border border-slate-50"></div>
                                ))}
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 text-red-600 p-10 rounded-3xl text-center border border-red-100">
                                <p className="font-bold text-lg mb-2">Oops! Something went wrong</p>
                                <p className="text-sm opacity-80 mb-6">{error}</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="bg-red-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-red-700 transition"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : filteredFlights.length === 0 ? (
                            <div className="bg-white p-16 rounded-3xl text-center shadow-sm border border-slate-100">
                                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-12 h-12 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">No flights available</h3>
                                <p className="text-slate-500 mt-2 font-medium">Try adjusting your filters or search criteria.</p>
                                <button
                                    onClick={() => setFilters({ maxPrice: 500000, airlines: [], maxDuration: 24 })}
                                    className="mt-6 text-primary-600 font-bold hover:underline"
                                >
                                    Reset all filters
                                </button>
                            </div>
                        ) : (
                            <div className="animate-fade-in">
                                {filteredFlights.map((flight) => (
                                    <FlightCard key={flight._id} flight={flight} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Flights;
