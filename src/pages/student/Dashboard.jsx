import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import VerificationBanner from '../../components/common/VerificationBanner';
import { ROUTES } from '../../utils/constants';
import { bookingsApi } from '../../api/endpoints';

const QUICK_LINKS = [
  {
    to: ROUTES.FLIGHTS,
    title: 'Search flights',
    description: 'Find one-way, round-trip, and multi-city routes',
    icon: '✈️',
  },
  {
    to: ROUTES.MY_BOOKINGS,
    title: 'My trips',
    description: 'View your upcoming and past flight bookings',
    icon: '🎫',
  },
  {
    to: ROUTES.STUDENT_NOTIFICATIONS,
    title: 'Alerts',
    description: 'Price drops, schedule changes, and reminders',
    icon: '🔔',
  },
];

export default function StudentDashboard() {
  const { user, isAdmin } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingsApi.getMyBookings();
        setBookings(response.data.slice(0, 3)); // Show top 3 recent bookings
      } catch (err) {
        console.error('Failed to load bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="container-app py-10">
      {user && !user.isVerified && <VerificationBanner />}
      <div className="mb-10">
        <h1 className="page-heading text-slate-900">
          Welcome back, {user?.name?.split(' ')[0] || 'traveller'} ✈️
        </h1>
        <p className="mt-2 text-slate-600">
          Here&apos;s your trip overview. Search flights, manage bookings, and stay updated.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {QUICK_LINKS.map(({ to, title, description, icon }) => (
          <Link key={to} to={to}>
            <Card hover className="h-full shadow-soft hover:shadow-soft-lg">
              <div className="flex items-start gap-4">
                <span className="text-3xl">{icon}</span>
                <div>
                  <h3 className="font-bold text-slate-900">{title}</h3>
                  <p className="text-sm text-slate-600 mt-1">{description}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
        {isAdmin && (
          <Link to={ROUTES.ADMIN_DASHBOARD}>
            <Card hover className="h-full border-2 border-primary-200 bg-primary-50/30 shadow-soft">
              <div className="flex items-start gap-4">
                <span className="text-3xl">⚙️</span>
                <div>
                  <h3 className="font-bold text-primary-700">Admin console</h3>
                  <p className="text-sm text-slate-600 mt-1">Manage flights, fares, and users</p>
                </div>
              </div>
            </Card>
          </Link>
        )}
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Upcoming trips</h2>
          <Link to={ROUTES.MY_BOOKINGS} className="text-sm font-bold text-primary-600 hover:text-primary-700">
            View all
          </Link>
        </div>
        
        <Card className="shadow-soft">
          {loading ? (
            <div className="p-10 text-center text-slate-400 font-medium">Loading trips...</div>
          ) : bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking._id} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-primary-200 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] text-center leading-tight italic">
                    {booking.flight.origin.airportCode}
                    <br />
                    ✈
                    <br />
                    {booking.flight.destination.airportCode}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900">{booking.flight.origin.cityName} → {booking.flight.destination.cityName}</p>
                    <p className="text-sm text-slate-500">
                      {new Date(booking.flight.origin.dateTime).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })} · Flight {booking.flight.flightNumber}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                    booking.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900">No trips booked yet</h3>
              <p className="text-sm text-slate-500 mt-1">Your upcoming flights will appear here.</p>
              <Link to={ROUTES.FLIGHTS} className="inline-block mt-4 text-primary-600 font-bold hover:underline">
                Find a flight
              </Link>
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}
