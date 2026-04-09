import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { flightsApi, bookingsApi } from '../api/endpoints';
import { ROUTES } from '../utils/constants';

const Booking = () => {
    const { flightId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [flight, setFlight] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const [passengers, setPassengers] = useState([
        { name: user?.name || '', age: '', gender: 'MALE', passportNumber: '' }
    ]);

    const handleNumPassengersChange = (num) => {
        const currentCount = passengers.length;
        if (num > currentCount) {
            const extra = Array(num - currentCount).fill(0).map(() => ({
                name: '', age: '', gender: 'MALE', passportNumber: ''
            }));
            setPassengers([...passengers, ...extra]);
        } else if (num < currentCount) {
            setPassengers(passengers.slice(0, num));
        }
    };

    useEffect(() => {
        const fetchFlight = async () => {
            try {
                const response = await flightsApi.getAll(); // Using getAll then filtering for simplicity in this dummy setup
                const foundFlight = response.data.find(f => f._id === flightId);
                if (foundFlight) {
                    setFlight(foundFlight);
                } else {
                    setError('Flight not found');
                }
            } catch (err) {
                setError('Failed to load flight details');
            } finally {
                setLoading(false);
            }
        };
        fetchFlight();
    }, [flightId]);

    const handleAddPassenger = () => {
        setPassengers([...passengers, { name: '', age: '', gender: 'MALE', passportNumber: '' }]);
    };

    const handleRemovePassenger = (index) => {
        const newPassengers = [...passengers];
        newPassengers.splice(index, 1);
        setPassengers(newPassengers);
    };

    const handlePassengerChange = (index, field, value) => {
        const newPassengers = [...passengers];
        newPassengers[index][field] = value;
        setPassengers(newPassengers);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const response = await bookingsApi.create({
                flightId,
                passengers
            });
            // Redirect to success or my bookings
            navigate(ROUTES.MY_BOOKINGS);
            // In a real app, maybe a /booking-success/:id page
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="w-16 h-16 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
    );

    if (error && !flight) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="bg-white p-10 rounded-3xl shadow-sm text-center">
                <p className="text-red-600 font-bold mb-4">{error}</p>
                <button onClick={() => navigate(ROUTES.FLIGHTS)} className="text-primary-600 font-bold">Back to Flights</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="container-app max-w-4xl">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left: Passenger Details Form */}
                    <div className="flex-1 space-y-6">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                            <h2 className="text-2xl font-black text-slate-900 mb-2">Passenger Details</h2>
                            <p className="text-slate-500 text-sm mb-6 font-medium">Please enter the details exactly as they appear on identification.</p>

                            <div className="mb-8 p-6 bg-primary-50/30 rounded-2xl border border-primary-100 flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-slate-900">How many passengers?</h4>
                                    <p className="text-xs text-slate-500 font-medium">Book up to 5 passengers at once</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {[1, 2, 3, 4, 5].map(n => (
                                        <button
                                            key={n}
                                            type="button"
                                            onClick={() => handleNumPassengersChange(n)}
                                            className={`w-10 h-10 rounded-xl font-bold transition-all ${passengers.length === n
                                                    ? 'bg-slate-900 text-white shadow-lg'
                                                    : 'bg-white text-slate-400 hover:text-primary-600 border border-slate-100'
                                                }`}
                                        >
                                            {n}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                {passengers.map((p, index) => (
                                    <div key={index} className="p-6 bg-slate-50 rounded-2xl relative border border-slate-100/50">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wider">
                                                <span className="w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px]">
                                                    {index + 1}
                                                </span>
                                                Passenger {index + 1}
                                            </h3>
                                            {passengers.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemovePassenger(index)}
                                                    className="text-red-500 hover:text-red-700 text-xs font-bold uppercase tracking-widest"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={p.name}
                                                    onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-100 outline-none transition-all font-medium"
                                                    placeholder="As per passport"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Age</label>
                                                <input
                                                    required
                                                    type="number"
                                                    value={p.age}
                                                    onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-100 outline-none transition-all font-medium"
                                                    placeholder="Enter age"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Gender</label>
                                                <select
                                                    value={p.gender}
                                                    onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-100 outline-none transition-all font-medium"
                                                >
                                                    <option value="MALE">Male</option>
                                                    <option value="FEMALE">Female</option>
                                                    <option value="OTHER">Other</option>
                                                </select>
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Passport / ID No.</label>
                                                <input
                                                    type="text"
                                                    value={p.passportNumber}
                                                    onChange={(e) => handlePassengerChange(index, 'passportNumber', e.target.value)}
                                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-100 outline-none transition-all font-medium"
                                                    placeholder="Optional"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={handleAddPassenger}
                                    className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:border-primary-300 hover:text-primary-500 transition-all flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Add Another Passenger
                                </button>

                                {error && <p className="text-red-600 text-sm font-bold bg-red-50 p-4 rounded-xl border border-red-100">{error}</p>}

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-slate-900 hover:bg-primary-600 text-white py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-slate-200 disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    {submitting ? 'Processing...' : `Confirm Booking • ${flight.price.currency} ${(flight.price.totalDisplayFare * passengers.length).toLocaleString()}`}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right: Flight Summary */}
                    <div className="w-full md:w-80 space-y-6">
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 sticky top-24">
                            <h3 className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-xs">Trip Summary</h3>

                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xs italic">
                                        {flight.operatorName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 leading-tight">{flight.operatorName}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{flight.flightNumber}</p>
                                    </div>
                                </div>

                                <div className="space-y-4 py-6 border-y border-slate-50">
                                    <div className="flex justify-between items-start">
                                        <div className="text-left">
                                            <p className="text-lg font-black text-slate-900">{new Date(flight.origin.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            <p className="text-xs font-bold text-slate-500 uppercase">{flight.origin.airportCode}</p>
                                        </div>
                                        <div className="text-center flex-1 px-4">
                                            <p className="text-[10px] font-bold text-primary-500 uppercase italic">{flight.duration}</p>
                                            <div className="w-full h-px bg-slate-100 relative mt-1">
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-black text-slate-900">{new Date(flight.destination.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            <p className="text-xs font-bold text-slate-500 uppercase">{flight.destination.airportCode}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm font-medium">
                                        <span className="text-slate-400">Fare per adult</span>
                                        <span className="text-slate-900 font-bold">{flight.price.currency} {flight.price.totalDisplayFare.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-medium">
                                        <span className="text-slate-400">Passengers</span>
                                        <span className="text-slate-900 font-bold">x {passengers.length}</span>
                                    </div>
                                    <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                                        <span className="text-slate-900 font-black">Total Price</span>
                                        <span className="text-xl font-black text-primary-600">
                                            {flight.price.currency} {(flight.price.totalDisplayFare * passengers.length).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Booking;
