import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES, USER_ROLE } from '../utils/constants';
import FlightSearchHero from '../components/flights/FlightSearchHero';

const FEATURES = [
  { title: 'Global routes', desc: 'Connect to major destinations worldwide with ease.', icon: '🌍' },
  { title: 'Best fares', desc: 'Find affordable tickets with transparent pricing.', icon: '💸' },
  { title: '24/7 support', desc: 'Get help anytime during your journey.', icon: '🕒' },
  { title: 'Secure booking', desc: 'Safe payments and instant confirmations.', icon: '🔒' },
];

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Redirect logged-in users to their dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === USER_ROLE.ADMIN) {
        navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
      } else {
        navigate(ROUTES.STUDENT_DASHBOARD, { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Don't render home content if logged in (will redirect)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-slate-50">
      {/* Hero + search card */}
      <FlightSearchHero showAuthCtas={!isAuthenticated} />

      {/* Why Us / core benefits */}
      <section className="container-app py-10 sm:py-14">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-8">
          Why book with Flixor
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map(({ title, desc, icon }) => (
            <div
              key={title}
              className="p-6 rounded-2xl bg-gradient-card border border-slate-100 shadow-soft hover:shadow-soft-lg hover:border-primary-100 transition-all duration-200"
            >
              <span className="text-3xl block mb-4">{icon}</span>
              <h3 className="font-bold text-slate-900">{title}</h3>
              <p className="text-sm text-slate-600 mt-2">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular destinations */}
      <section className="container-app pb-10 sm:pb-14">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-2">
          Popular destinations
        </h2>
        <p className="text-center text-slate-600 mb-8">
          We&apos;ve selected some of the best locations around the world for you.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              city: 'Abu Dhabi',
              tagline: 'Experience the desert skyline',
            },
            {
              city: 'Bangkok',
              tagline: 'Explore vibrant street life',
            },
            {
              city: 'Kuala Lumpur',
              tagline: 'View the modern skyline',
            },
            {
              city: 'Bali',
              tagline: 'Enjoy a tropical holiday',
            },
          ].map(({ city, tagline, image }) => (
            <div
              key={city}
              className="rounded-2xl overflow-hidden border border-slate-100 bg-white shadow-soft hover:shadow-soft-lg transition-all"
            >
              {image ? (
                <div className="h-36 sm:h-40 w-full overflow-hidden">
                  <img
                    src={image}
                    alt={city}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="h-36 sm:h-40 w-full bg-gradient-to-br from-primary-500/80 via-sky-400/80 to-amber-300/80" />
              )}
              <div className="p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-primary-600 mb-1">
                  Flights to {city}
                </p>
                <h3 className="text-lg font-semibold text-slate-900">{city}</h3>
                <p className="text-sm text-slate-600 mt-1">{tagline}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Explore Nepal */}
      <section className="container-app pb-10 sm:pb-14">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-2">
          Explore Nepal
        </h2>
        <p className="text-center text-slate-600 mb-8">
          Discover the best places in Nepal for your next getaway.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { city: 'Kathmandu', props: '+1000 stays', price: 'From NPR 800–55,000' },
            { city: 'Chitwan', props: '+200 stays', price: 'From NPR 1,500–10,000' },
            { city: 'Pokhara', props: '+200 stays', price: 'From NPR 1,500–10,000' },
            { city: 'Lumbini', props: '+200 stays', price: 'From NPR 1,200–10,000' },
          ].map(({ city, props, price }) => (
            <div
              key={city}
              className="rounded-2xl border border-slate-100 bg-white shadow-soft hover:shadow-soft-lg transition-all p-5 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{city}</h3>
                <p className="text-sm text-slate-600 mt-1">{props}</p>
                <p className="text-xs text-slate-500 mt-1">{price}</p>
              </div>
              <button
                type="button"
                className="mt-4 inline-flex items-center justify-center rounded-full border border-primary-200 px-3 py-1.5 text-xs font-medium text-primary-700 hover:bg-primary-50 transition"
              >
                Know more
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Download app promo (static for now) */}
      <section className="bg-slate-900 py-10 sm:py-14">
        <div className="container-app flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Download the Flixor app
            </h2>
            <p className="text-primary-100 text-sm sm:text-base max-w-xl">
              Discover flight deals exclusively in the app. Get real-time fare alerts, manage your
              trips on the go, and check in faster.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-black text-white px-4 py-2 text-xs sm:text-sm font-medium shadow-soft hover:shadow-soft-lg"
            >
              <span className="text-lg">⬇</span>
              <span>
                <span className="block text-[10px] uppercase tracking-wide opacity-80">
                  Get it on
                </span>
                <span className="block text-sm font-semibold">Google Play</span>
              </span>
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-white text-slate-900 px-4 py-2 text-xs sm:text-sm font-medium shadow-soft hover:shadow-soft-lg"
            >
              <span className="text-lg">⬇</span>
              <span>
                <span className="block text-[10px] uppercase tracking-wide text-slate-500">
                  Download on the
                </span>
                <span className="block text-sm font-semibold">App Store</span>
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
