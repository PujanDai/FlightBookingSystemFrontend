import { useEffect, useMemo, useRef, useState } from 'react';
import { notificationsApi } from '../../api/endpoints';

const formatTimeAgo = (dateString) => {
  const createdAt = new Date(dateString).getTime();
  const seconds = Math.max(0, Math.floor((Date.now() - createdAt) / 1000));
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} day ago`;
  return new Date(dateString).toLocaleDateString();
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const wrapperRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const response = await notificationsApi.getAll();
      setNotifications(response.data || []);
    } catch {
      // Ignore temporary failures to avoid noisy UX.
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const poll = setInterval(fetchNotifications, 30000);
    return () => clearInterval(poll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const handleMarkRead = async (notificationId) => {
    try {
      await notificationsApi.markRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
      );
    } catch {
      // no-op
    }
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2.5 rounded-xl text-slate-600 hover:bg-primary-50/80 transition-colors"
        aria-label="Notifications"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0a3 3 0 11-6 0m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-[26rem] overflow-auto rounded-2xl bg-white shadow-soft-lg border border-slate-100 z-50">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <p className="font-semibold text-slate-900">Notifications</p>
            <span className="text-xs font-medium text-slate-500">{unreadCount} unread</span>
          </div>

          {loading ? (
            <div className="p-4 text-sm text-slate-500">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-5 text-sm text-slate-500">No notifications yet.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((n) => (
                <button
                  key={n._id}
                  type="button"
                  onClick={() => handleMarkRead(n._id)}
                  className={`w-full text-left p-4 hover:bg-slate-50 transition-colors ${
                    n.isRead ? 'bg-white' : 'bg-primary-50/40'
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-900">{n.title || 'Notification'}</p>
                  <p className="text-sm text-slate-600 mt-0.5">{n.message}</p>
                  <p className="text-xs text-slate-400 mt-2">{formatTimeAgo(n.createdAt)}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
