import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import VerificationBanner from '../../components/common/VerificationBanner';
import { ROUTES } from '../../utils/constants';

const QUICK_LINKS = [
  {
    to: ROUTES.EVENTS,
    title: 'Search flights',
    description: 'Find one-way, round-trip, and multi-city routes',
    icon: '✈️',
  },
  {
    to: ROUTES.STUDENT_MY_BOOKINGS,
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
        <h2 className="text-lg font-bold text-slate-900 mb-4">Upcoming trips (static preview)</h2>
        <Card className="shadow-soft">
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-primary-50/50 border border-primary-100">
              <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xs text-center leading-tight">
                KTM
                <br />
                ✈
                <br />
                DXB
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900">Kathmandu → Dubai</p>
                <p className="text-sm text-slate-500">Mar 10, 2025 · Flight FX 208</p>
              </div>
              <span className="text-xs font-medium text-primary-600 bg-primary-100 px-2 py-1 rounded-lg">
                Confirmed
              </span>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs text-center leading-tight">
                KTM
                <br />
                ✈
                <br />
                DEL
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900">Kathmandu → Delhi</p>
                <p className="text-sm text-slate-500">Apr 02, 2025 · Flight FX 112</p>
              </div>
              <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
                On hold
              </span>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-500 italic">
            This section will show your real upcoming flights once the booking APIs are connected.
          </p>
        </Card>
      </section>
    </div>
  );
}
