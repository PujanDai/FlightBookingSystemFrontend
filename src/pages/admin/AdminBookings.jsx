import React, { useState, useEffect } from 'react';
import { bookingsApi } from '../../api/endpoints';
import Card from '../../components/common/Card';

const formatRemainingTime = (seconds) => {
    const safeSeconds = Math.max(0, Number(seconds) || 0);
    const hrs = Math.floor(safeSeconds / 3600);
    const mins = Math.floor((safeSeconds % 3600) / 60);
    const secs = safeSeconds % 60;
    return [hrs, mins, secs].map((unit) => String(unit).padStart(2, '0')).join(':');
};

const getLiveRemainingSeconds = (booking, nowMs) => {
    if (booking.paymentStatus === 'PAID') return null;
    if (booking.isExpired) return 0;
    const expiresAtMs = booking.expiresAt ? new Date(booking.expiresAt).getTime() : null;
    if (!expiresAtMs || Number.isNaN(expiresAtMs)) return Math.max(0, Number(booking.remainingTime) || 0);
    return Math.max(0, Math.floor((expiresAtMs - nowMs) / 1000));
};

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [uiMessage, setUiMessage] = useState(null);
    const [paymentFilter, setPaymentFilter] = useState('ALL');
    const [nowMs, setNowMs] = useState(Date.now());
    const [priceModal, setPriceModal] = useState({
        open: false,
        booking: null,
        mode: 'FIXED',
        newPrice: '',
        percentage: '',
        reason: '',
        submitting: false,
        error: null,
    });

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await bookingsApi.getAll();
                setBookings(response.data);
            } catch (err) {
                setError('Failed to load global bookings');
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => setNowMs(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleConfirm = async (id) => {
        if (window.confirm('Are you sure you want to confirm this booking and mark as PAID?')) {
            try {
                await bookingsApi.updateStatus(id, { status: 'CONFIRMED', paymentStatus: 'PAID' });
                setBookings(bookings.map(b => b._id === id ? { ...b, status: 'CONFIRMED', paymentStatus: 'PAID' } : b));
                setUiMessage({ type: 'success', text: 'Booking confirmed and marked as paid.' });
            } catch (err) {
                setUiMessage({ type: 'error', text: 'Failed to confirm booking.' });
            }
        }
    };

    const openPriceModal = (booking) => {
        if (booking.paymentStatus === 'PAID') {
            setUiMessage({ type: 'error', text: 'Price cannot be updated after payment is completed.' });
            return;
        }
        setPriceModal({
            open: true,
            booking,
            mode: 'FIXED',
            newPrice: String(booking.totalPrice),
            percentage: '',
            reason: '',
            submitting: false,
            error: null,
        });
    };

    const closePriceModal = () => {
        setPriceModal({
            open: false,
            booking: null,
            mode: 'FIXED',
            newPrice: '',
            percentage: '',
            reason: '',
            submitting: false,
            error: null,
        });
    };

    const submitPriceUpdate = async () => {
        const booking = priceModal.booking;
        const isPercentageMode = priceModal.mode !== 'FIXED';
        const newPrice = Number(priceModal.newPrice);
        const percentage = Number(priceModal.percentage);

        if (isPercentageMode) {
            if (!Number.isFinite(percentage) || percentage <= 0) {
                setPriceModal((prev) => ({ ...prev, error: 'Please enter a valid positive percentage.' }));
                return;
            }
        } else {
            if (!Number.isFinite(newPrice) || newPrice <= 0) {
                setPriceModal((prev) => ({ ...prev, error: 'Please enter a valid positive price.' }));
                return;
            }
        }

        if (!priceModal.reason.trim()) {
            setPriceModal((prev) => ({ ...prev, error: 'Reason is required for price update.' }));
            return;
        }

        try {
            setPriceModal((prev) => ({ ...prev, submitting: true, error: null }));
            const payload = isPercentageMode
                ? {
                    changeType: priceModal.mode,
                    percentage,
                    reason: priceModal.reason.trim(),
                }
                : {
                    newPrice,
                    reason: priceModal.reason.trim(),
                };
            const response = await bookingsApi.updatePrice(booking._id, payload);
            const updated = response.data?.booking;
            if (updated?._id) {
                setBookings((prev) => prev.map((b) => (b._id === updated._id ? { ...b, ...updated } : b)));
            }
            setUiMessage({ type: 'success', text: response.data?.message || 'Booking price updated successfully.' });
            closePriceModal();
        } catch (err) {
            setPriceModal((prev) => ({
                ...prev,
                submitting: false,
                error: err.response?.data?.message || 'Failed to update booking price.',
            }));
        }
    };

    const currentPrice = Number(priceModal.booking?.totalPrice || 0);
    const enteredFixedPrice = Number(priceModal.newPrice || 0);
    const enteredPercentage = Number(priceModal.percentage || 0);

    let previewPrice = currentPrice;
    if (priceModal.mode === 'FIXED' && Number.isFinite(enteredFixedPrice) && enteredFixedPrice > 0) {
        previewPrice = enteredFixedPrice;
    } else if (
        priceModal.mode === 'PERCENTAGE_INCREASE' &&
        Number.isFinite(enteredPercentage) &&
        enteredPercentage > 0
    ) {
        previewPrice = Number((currentPrice * (1 + enteredPercentage / 100)).toFixed(2));
    } else if (
        priceModal.mode === 'PERCENTAGE_DECREASE' &&
        Number.isFinite(enteredPercentage) &&
        enteredPercentage > 0
    ) {
        previewPrice = Number((currentPrice * (1 - enteredPercentage / 100)).toFixed(2));
    }
    const previewDifference = Number((previewPrice - currentPrice).toFixed(2));
    const filteredBookings = bookings.filter((booking) => {
        if (paymentFilter === 'ALL') return true;
        return booking.paymentStatus === paymentFilter;
    });

    if (loading) return <div className="p-10 text-center">Loading all bookings...</div>;

    return (
        <div className="container-app py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900">Global Bookings</h1>
                <p className="text-slate-500 font-medium mt-1">Monitor and manage all passenger reservations</p>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-6 rounded-3xl mb-8 font-bold border border-red-100">{error}</div>}
            {uiMessage && (
                <div
                    className={`p-4 rounded-2xl mb-6 border text-sm font-semibold ${
                        uiMessage.type === 'success'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : 'bg-red-50 text-red-700 border-red-100'
                    }`}
                >
                    {uiMessage.text}
                </div>
            )}

            <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Filter</span>
                {[
                    { key: 'ALL', label: `All (${bookings.length})` },
                    { key: 'UNPAID', label: `Pending (${bookings.filter((b) => b.paymentStatus === 'UNPAID').length})` },
                    { key: 'PAID', label: `Paid (${bookings.filter((b) => b.paymentStatus === 'PAID').length})` },
                ].map((item) => (
                    <button
                        key={item.key}
                        type="button"
                        onClick={() => setPaymentFilter(item.key)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-widest border transition ${
                            paymentFilter === item.key
                                ? 'border-primary-500 bg-primary-50 text-primary-700'
                                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            <Card padding={false} className="overflow-hidden shadow-soft">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Ref / Date</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">User</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Flight</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Passengers</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Total</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredBookings.map((booking) => (
                            (() => {
                                const remainingSeconds = getLiveRemainingSeconds(booking, nowMs);
                                const isUnpaidExpired = booking.paymentStatus !== 'PAID' && (booking.isExpired || remainingSeconds === 0);
                                return (
                            <tr key={booking._id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="font-bold text-slate-900 leading-tight">{booking.bookingReference}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{new Date(booking.createdAt).toLocaleDateString()}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-bold text-slate-800">{booking.user?.name}</p>
                                    <p className="text-xs text-slate-500 truncate max-w-[150px]">{booking.user?.email}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-bold text-slate-700">{booking.flight?.origin?.airportCode} → {booking.flight?.destination?.airportCode}</p>
                                    <p className="text-[10px] text-slate-400 font-black italic">{booking.flight?.operatorName}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex -space-x-2">
                                        {booking.passengers.map((p, i) => (
                                            <div key={i} className="w-8 h-8 bg-slate-900 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-black text-white" title={p.name}>
                                                {p.name[0]}
                                            </div>
                                        ))}
                                        {booking.passengers.length > 3 && (
                                            <div className="w-8 h-8 bg-slate-100 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-bold text-slate-600">
                                                +{booking.passengers.length - 3}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-black text-slate-900">
                                    NPR {booking.totalPrice.toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${
                                            booking.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-600' : 
                                            booking.status === 'CANCELLED' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                                        }`}>
                                            {booking.status}
                                        </span>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase ${
                                            booking.paymentStatus === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'
                                        }`}>
                                            {booking.paymentStatus}
                                        </span>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase ${
                                            isUnpaidExpired ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-700'
                                        }`}>
                                            {booking.paymentStatus === 'PAID'
                                                ? 'No timer (paid)'
                                                : isUnpaidExpired
                                                    ? 'Expired'
                                                    : `Time left ${formatRemainingTime(remainingSeconds)}`}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex gap-2 justify-end">
                                        {booking.paymentStatus !== 'PAID' && !isUnpaidExpired && (
                                            <button
                                                onClick={() => openPriceModal(booking)}
                                                className="px-4 py-2 border border-primary-200 text-primary-700 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary-50 transition-colors"
                                            >
                                                Update Price
                                            </button>
                                        )}
                                        {booking.status === 'PENDING' && !isUnpaidExpired && (
                                            <button
                                                onClick={() => handleConfirm(booking._id)}
                                                className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-slate-200"
                                            >
                                                Confirm
                                            </button>
                                        )}
                                        {isUnpaidExpired && (
                                            <span className="px-4 py-2 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-red-100">
                                                Booking Expired
                                            </span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                                );
                            })()
                        ))}
                        {filteredBookings.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-6 py-10 text-center text-slate-500 font-medium">
                                    No bookings found for selected filter.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </Card>

            {priceModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
                    <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl border border-slate-100">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="text-lg font-black text-slate-900">Update Booking Price</h3>
                            <p className="text-sm text-slate-500 mt-1">
                                Ref: {priceModal.booking?.bookingReference} • Current: NPR{' '}
                                {priceModal.booking?.totalPrice?.toLocaleString()}
                            </p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Update Type</label>
                                <div className="mt-2 grid grid-cols-3 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setPriceModal((prev) => ({ ...prev, mode: 'FIXED', error: null }))}
                                        className={`rounded-xl px-3 py-2 text-xs font-bold border transition ${
                                            priceModal.mode === 'FIXED'
                                                ? 'border-primary-500 bg-primary-50 text-primary-700'
                                                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        Fixed
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPriceModal((prev) => ({ ...prev, mode: 'PERCENTAGE_INCREASE', error: null }))}
                                        className={`rounded-xl px-3 py-2 text-xs font-bold border transition ${
                                            priceModal.mode === 'PERCENTAGE_INCREASE'
                                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        +%
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPriceModal((prev) => ({ ...prev, mode: 'PERCENTAGE_DECREASE', error: null }))}
                                        className={`rounded-xl px-3 py-2 text-xs font-bold border transition ${
                                            priceModal.mode === 'PERCENTAGE_DECREASE'
                                                ? 'border-amber-500 bg-amber-50 text-amber-700'
                                                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        -%
                                    </button>
                                </div>
                                <p className="mt-2 text-xs text-slate-500">
                                    {priceModal.mode === 'FIXED' && 'Fixed = set the final total booking price directly.'}
                                    {priceModal.mode === 'PERCENTAGE_INCREASE' &&
                                        'Increase % = raise current booking price by selected percentage.'}
                                    {priceModal.mode === 'PERCENTAGE_DECREASE' &&
                                        'Decrease % = reduce current booking price by selected percentage.'}
                                </p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">New Price</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={priceModal.newPrice}
                                    onChange={(e) => setPriceModal((prev) => ({ ...prev, newPrice: e.target.value }))}
                                    disabled={priceModal.mode !== 'FIXED'}
                                    className={`mt-1 w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-primary-100 outline-none ${
                                        priceModal.mode === 'FIXED' ? 'border-slate-200' : 'border-slate-100 bg-slate-100 text-slate-400'
                                    }`}
                                />
                            </div>
                            {priceModal.mode !== 'FIXED' && (
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                        Percentage ({priceModal.mode === 'PERCENTAGE_INCREASE' ? 'Increase' : 'Decrease'})
                                    </label>
                                    <input
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        value={priceModal.percentage}
                                        onChange={(e) => setPriceModal((prev) => ({ ...prev, percentage: e.target.value }))}
                                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-primary-100 outline-none"
                                        placeholder="e.g. 10"
                                    />
                                </div>
                            )}
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                    Price Preview
                                </p>
                                <div className="mt-2 flex items-center justify-between text-sm">
                                    <span className="text-slate-600">Current</span>
                                    <span className="font-semibold text-slate-900">
                                        NPR {currentPrice.toLocaleString()}
                                    </span>
                                </div>
                                <div className="mt-1 flex items-center justify-between text-sm">
                                    <span className="text-slate-600">New</span>
                                    <span className="font-semibold text-slate-900">
                                        NPR {previewPrice.toLocaleString()}
                                    </span>
                                </div>
                                <div className="mt-1 flex items-center justify-between text-sm">
                                    <span className="text-slate-600">Difference</span>
                                    <span
                                        className={`font-bold ${
                                            previewDifference > 0
                                                ? 'text-emerald-700'
                                                : previewDifference < 0
                                                    ? 'text-amber-700'
                                                    : 'text-slate-500'
                                        }`}
                                    >
                                        {previewDifference > 0 ? '+' : ''}
                                        NPR {previewDifference.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Reason</label>
                                <textarea
                                    rows={3}
                                    value={priceModal.reason}
                                    onChange={(e) => setPriceModal((prev) => ({ ...prev, reason: e.target.value }))}
                                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-primary-100 outline-none"
                                    placeholder="Why is the fare being changed?"
                                />
                            </div>
                            {priceModal.error && (
                                <div className="rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm font-semibold p-3">
                                    {priceModal.error}
                                </div>
                            )}
                        </div>
                        <div className="p-6 pt-0 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={closePriceModal}
                                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                                disabled={priceModal.submitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={submitPriceUpdate}
                                disabled={priceModal.submitting}
                                className="px-4 py-2 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:opacity-50"
                            >
                                {priceModal.submitting ? 'Updating...' : 'Update Price'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBookings;
