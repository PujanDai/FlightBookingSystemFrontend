import Card from '../../components/common/Card';
import { useEffect, useState } from 'react';
import { notificationsApi } from '../../api/endpoints';

function timeAgo(dateStr) {
  const d = new Date(dateStr);
  const sec = Math.floor((Date.now() - d) / 1000);
  if (sec < 60) return 'Just now';
  if (sec < 3600) return `${Math.floor(sec / 60)} min ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)} hours ago`;
  if (sec < 604800) return `${Math.floor(sec / 86400)} days ago`;
  return d.toLocaleDateString();
}

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const response = await notificationsApi.getAll();
      setNotifications(response.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const poll = setInterval(fetchNotifications, 30000);
    return () => clearInterval(poll);
  }, []);

  const markRead = async (id) => {
    await notificationsApi.markRead(id);
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
  };

  return (
    <div className="container-app py-10">
      <h1 className="page-heading text-slate-900 mb-2">Notifications</h1>
      <p className="text-slate-600 mb-8">Booking updates and smart alerts</p>

      <Card padding={false} className="overflow-hidden shadow-soft">
        {loading ? (
          <div className="p-6 text-slate-500">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-6 text-slate-500">No notifications yet.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((n) => (
              <button
                key={n._id}
                type="button"
                onClick={() => markRead(n._id)}
                className={`w-full text-left p-6 flex gap-4 ${
                  !n.isRead ? 'bg-primary-50/40' : ''
                } hover:bg-slate-50/50 transition-colors`}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm">
                  🔔
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900">{n.title || 'Notification'}</h3>
                  <p className="text-sm text-slate-600 mt-1">{n.message}</p>
                  <p className="text-xs text-slate-400 mt-2">{timeAgo(n.createdAt)} · {n.type}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
