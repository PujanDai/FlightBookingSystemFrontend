import React, { useState, useEffect } from 'react';
import { flightsApi } from '../../api/endpoints';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const AdminFlights = () => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentFlight, setCurrentFlight] = useState(null);

    const [formData, setFormData] = useState({
        operatorName: '',
        flightNumber: '',
        origin: { cityName: '', airportCode: '', dateTime: '' },
        destination: { cityName: '', airportCode: '', dateTime: '' },
        duration: '',
        price: { currency: 'NPR', totalDisplayFare: 0 },
        attr: { baggage: '25kg', isRefundable: true, availableSeats: 100 }
    });

    useEffect(() => {
        fetchFlights();
    }, []);

    const fetchFlights = async () => {
        try {
            const response = await flightsApi.getAll();
            setFlights(response.data);
        } catch (err) {
            setError('Failed to fetch flights');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this flight?')) {
            try {
                await flightsApi.delete(id);
                setFlights(flights.filter(f => f._id !== id));
            } catch (err) {
                alert('Failed to delete flight');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentFlight) {
                await flightsApi.update(currentFlight._id, formData);
            } else {
                await flightsApi.create(formData);
            }
            setIsModalOpen(false);
            fetchFlights();
        } catch (err) {
            alert('Failed to save flight');
        }
    };

    const openModal = (flight = null) => {
        if (flight) {
            setCurrentFlight(flight);
            setFormData(flight);
        } else {
            setCurrentFlight(null);
            setFormData({
                operatorName: '',
                flightNumber: '',
                origin: { cityName: '', airportCode: '', dateTime: '' },
                destination: { cityName: '', airportCode: '', dateTime: '' },
                duration: '',
                price: { currency: 'NPR', totalDisplayFare: 35000 },
                attr: { baggage: '25kg', isRefundable: true, availableSeats: 100 }
            });
        }
        setIsModalOpen(true);
    };

    if (loading) return <div className="p-10 text-center">Loading flights...</div>;

    return (
        <div className="container-app py-10">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Manage Flights</h1>
                    <p className="text-slate-500 font-medium">Add or update flight schedules and pricing</p>
                </div>
                <Button onClick={() => openModal()}>Add New Flight</Button>
            </div>

            <Card padding={false} className="overflow-hidden shadow-soft">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Airline</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Route</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Departure</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Price</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Seats</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {flights.map((flight) => (
                            <tr key={flight._id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="font-bold text-slate-900">{flight.operatorName}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">{flight.flightNumber}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="font-bold text-slate-700">{flight.origin.airportCode} → {flight.destination.airportCode}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-medium text-slate-600">{new Date(flight.origin.dateTime).toLocaleString()}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="font-bold text-primary-600">NPR {flight.price.totalDisplayFare.toLocaleString()}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${flight.attr.availableSeats < 10 ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-600'}`}>
                                        {flight.attr.availableSeats} LEFT
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-3">
                                        <button onClick={() => openModal(flight)} className="text-blue-500 hover:text-blue-700 text-xs font-bold uppercase tracking-widest">Edit</button>
                                        <button onClick={() => handleDelete(flight._id)} className="text-red-500 hover:text-red-700 text-xs font-bold uppercase tracking-widest">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
                        <h2 className="text-2xl font-black text-slate-900 mb-6">{currentFlight ? 'Edit Flight' : 'Add New Flight'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Airline Name</label>
                                    <input required value={formData.operatorName} onChange={(e) => setFormData({ ...formData, operatorName: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-medium outline-none focus:ring-2 focus:ring-primary-100" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Flight Number</label>
                                    <input required value={formData.flightNumber} onChange={(e) => setFormData({ ...formData, flightNumber: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-medium outline-none focus:ring-2 focus:ring-primary-100" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 p-6 bg-slate-50 rounded-[24px]">
                                <div className="space-y-4">
                                    <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Origin</p>
                                    <input placeholder="City" required value={formData.origin.cityName} onChange={(e) => setFormData({ ...formData, origin: { ...formData.origin, cityName: e.target.value } })} className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary-100" />
                                    <input placeholder="Code (e.g. KTM)" required value={formData.origin.airportCode} onChange={(e) => setFormData({ ...formData, origin: { ...formData.origin, airportCode: e.target.value } })} className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary-100" />
                                    <input type="datetime-local" required value={formData.origin.dateTime.slice(0, 16)} onChange={(e) => setFormData({ ...formData, origin: { ...formData.origin, dateTime: e.target.value } })} className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary-100" />
                                </div>
                                <div className="space-y-4">
                                    <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Destination</p>
                                    <input placeholder="City" required value={formData.destination.cityName} onChange={(e) => setFormData({ ...formData, destination: { ...formData.destination, cityName: e.target.value } })} className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary-100" />
                                    <input placeholder="Code (e.g. DXB)" required value={formData.destination.airportCode} onChange={(e) => setFormData({ ...formData, destination: { ...formData.destination, airportCode: e.target.value } })} className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary-100" />
                                    <input type="datetime-local" required value={formData.destination.dateTime.slice(0, 16)} onChange={(e) => setFormData({ ...formData, destination: { ...formData.destination, dateTime: e.target.value } })} className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary-100" />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Price (NPR)</label>
                                    <input type="number" required value={formData.price.totalDisplayFare} onChange={(e) => setFormData({ ...formData, price: { ...formData.price, totalDisplayFare: Number(e.target.value) } })} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-medium outline-none focus:ring-2 focus:ring-primary-100" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Available Seats</label>
                                    <input type="number" required value={formData.attr.availableSeats} onChange={(e) => setFormData({ ...formData, attr: { ...formData.attr, availableSeats: Number(e.target.value) } })} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-medium outline-none focus:ring-2 focus:ring-primary-100" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Duration</label>
                                    <input required placeholder="e.g. 4h 30m" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-medium outline-none focus:ring-2 focus:ring-primary-100" />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">Cancel</button>
                                <button type="submit" className="flex-1 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-primary-600 transition-all shadow-lg shadow-slate-200">Save Flight</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminFlights;
