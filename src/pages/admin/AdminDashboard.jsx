import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import VerificationBanner from '../../components/common/VerificationBanner';
import { ROUTES } from '../../utils/constants';

/**
 * Static stats; backend will provide real counts (flights, users, bookings).
 */
const STATS = [
  { label: 'Active routes', value: '32', sub: 'Major international & domestic', icon: '🗺️' },
  { label: 'Total users', value: '248', sub: 'Travellers & admins', icon: '👥' },
  { label: 'Bookings this month', value: '89', sub: 'Confirmed flight tickets', icon: '🎫' },
];

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="container-app py-10">
      {user && !user.isVerified && <VerificationBanner />}
      <h1 className="page-heading text-slate-900 mb-2">Admin console</h1>
      <p className="text-slate-600 mb-10">
        Overview of routes, bookings, and users for your flight booking system.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {STATS.map((stat) => (
          <Card key={stat.label} className="flex items-center gap-4 shadow-soft">
            <span className="text-3xl">{stat.icon}</span>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm font-medium text-slate-600">{stat.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{stat.sub}</p>
            </div>
          </Card>
        ))}
      </div>

      <h2 className="text-lg font-bold text-slate-900 mb-4">Quick actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to={ROUTES.ADMIN_FLIGHTS}>
          <Card hover className="h-full shadow-soft hover:shadow-soft-lg">
            <div className="flex items-start gap-4">
              <span className="text-3xl">✈️</span>
              <div>
                <h3 className="font-bold text-slate-900">Manage Flights</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Configure schedules, routes, and pricing.
                </p>
              </div>
            </div>
          </Card>
        </Link>
        <Link to={ROUTES.ADMIN_BOOKINGS}>
          <Card hover className="h-full shadow-soft hover:shadow-soft-lg">
            <div className="flex items-start gap-4">
              <span className="text-3xl">🎫</span>
              <div>
                <h3 className="font-bold text-slate-900">Manage Bookings</h3>
                <p className="text-sm text-slate-600 mt-1">
                  View and manage all passenger reservations.
                </p>
              </div>
            </div>
          </Card>
        </Link>
        <Link to={ROUTES.ADMIN_USERS}>
          <Card hover className="h-full shadow-soft hover:shadow-soft-lg">
            <div className="flex items-start gap-4">
              <span className="text-3xl">👥</span>
              <div>
                <h3 className="font-bold text-slate-900">Manage Users</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Manage travellers and administrators.
                </p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      <Card className="mt-10 p-6 bg-slate-50/50 border-slate-100 shadow-soft">
        <p className="text-sm text-slate-500 italic">
          Stats above are static placeholders. Real-time flight and booking data will appear
          here once the flight management APIs are connected.
        </p>
      </Card>
    </div>
  );
}
