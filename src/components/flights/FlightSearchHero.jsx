import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import { ROUTES } from '../../utils/constants';

export default function FlightSearchHero({ showAuthCtas = true }) {
  const navigate = useNavigate();

  const [tripType, setTripType] = useState('ONE_WAY');
  const [studentFare, setStudentFare] = useState(false);
  const [laborFare, setLaborFare] = useState(false);

  const [form, setForm] = useState({
    from: '',
    to: '',
    departDate: '',
    returnDate: '',
    travellers: '1 Traveller, ALL',
    nationality: 'Nepalese',
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: Wire this to dedicated flight search API/page.
    // For now, navigate to the flights list placeholder route.
    navigate(ROUTES.FLIGHTS, {
      state: {
        search: {
          ...form,
          tripType,
          studentFare,
          laborFare,
        },
      },
    });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-hero text-white py-12 sm:py-16 px-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.08\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-90" />
      <div className="container-app relative z-10 grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center">
        {/* Left: text */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-100">
            Flixor Travels &amp; Tours
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight max-w-xl">
            International Flight Tickets
          </h1>
          <p className="mt-4 text-base sm:text-lg text-primary-100 max-w-md">
            Easy and affordable bookings for your next trip with real-time availability and secure payments.
          </p>
          {showAuthCtas && (
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to={ROUTES.REGISTER}>
                <Button
                  size="lg"
                  className="bg-accent-500 hover:bg-accent-600 text-white font-bold shadow-lg hover:shadow-xl border-2 border-accent-400"
                >
                  Create free account
                </Button>
              </Link>
              <Link to={ROUTES.LOGIN}>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary-200 bg-white/10 text-white hover:bg-white hover:text-primary-700"
                >
                  Log in
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Right: search card */}
        <div className="bg-white/95 rounded-3xl shadow-soft-lg border border-slate-100 p-5 sm:p-6 backdrop-blur">
          {/* Trip type pills */}
          <div className="flex items-center gap-2 rounded-full bg-slate-100 p-1 text-xs sm:text-sm">
            {[
              { id: 'ONE_WAY', label: 'One Way' },
              { id: 'ROUND_TRIP', label: 'Round Trip' },
              { id: 'MULTI_CITY', label: 'Multi City' },
            ].map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTripType(id)}
                className={`flex-1 rounded-full py-1.5 sm:py-2 px-2 font-medium transition ${tripType === id ? 'bg-primary-500 text-white shadow-soft' : 'text-slate-600'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Extras */}
          <div className="mt-3 flex flex-wrap gap-2 text-xs sm:text-sm">
            <button
              type="button"
              onClick={() => setStudentFare((v) => !v)}
              className={`rounded-full border px-3 py-1 transition ${studentFare ? 'bg-sky-500 border-sky-500 text-white' : 'bg-white border-slate-200 text-slate-700'
                }`}
            >
              Student fares
            </button>
            <button
              type="button"
              onClick={() => setLaborFare((v) => !v)}
              className={`rounded-full border px-3 py-1 transition ${laborFare ? 'bg-sky-500 border-sky-500 text-white' : 'bg-white border-slate-200 text-slate-700'
                }`}
            >
              Labor fares
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSearch} className="mt-4 space-y-3 text-xs sm:text-sm">
            {/* From / To */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 tracking-wide">
                  FROM
                </label>
                <input
                  type="text"
                  required
                  placeholder="City or airport"
                  value={form.from}
                  onChange={(e) => handleChange('from', e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 shadow-xs focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 tracking-wide">
                  TO
                </label>
                <input
                  type="text"
                  required
                  placeholder="City or airport"
                  value={form.to}
                  onChange={(e) => handleChange('to', e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 shadow-xs focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 tracking-wide">
                  Depart date
                </label>
                <input
                  type="date"
                  required
                  value={form.departDate}
                  onChange={(e) => handleChange('departDate', e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 shadow-xs focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none [color-scheme:light]"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 tracking-wide">
                  Return date
                </label>
                <input
                  type="date"
                  disabled={tripType !== 'ROUND_TRIP'}
                  value={form.returnDate}
                  onChange={(e) => handleChange('returnDate', e.target.value)}
                  className={`mt-1 w-full rounded-2xl border px-3 py-2 text-slate-900 shadow-xs outline-none [color-scheme:light] ${tripType === 'ROUND_TRIP'
                      ? 'border-slate-200 bg-slate-50 focus:border-primary-400 focus:ring-2 focus:ring-primary-100'
                      : 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                />
              </div>
            </div>

            {/* Travellers / nationality */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 tracking-wide">
                  Travellers
                </label>
                <input
                  type="text"
                  value={form.travellers}
                  onChange={(e) => handleChange('travellers', e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 shadow-xs focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 tracking-wide">
                  Nationality
                </label>
                <input
                  type="text"
                  value={form.nationality}
                  onChange={(e) => handleChange('nationality', e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 shadow-xs focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
                />
              </div>
            </div>

            {/* CTA */}
            <Button
              type="submit"
              size="lg"
              className="mt-2 w-full justify-center rounded-full bg-primary-500 hover:bg-primary-600 text-white font-semibold tracking-[0.15em] shadow-lg hover:shadow-xl"
            >
              SEARCH
            </Button>

            <p className="mt-2 text-[11px] text-slate-500 text-center">
              24/7 support · Secure payments · Easy cancellations
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

