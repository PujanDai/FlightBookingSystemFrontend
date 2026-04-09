import apiClient from '../apiClient';

export const bookingsApi = {
    getAll: () => apiClient.get('/bookings'),
    create: (bookingData) => apiClient.post('/bookings', bookingData),
    getMyBookings: () => apiClient.get('/bookings/my'),
    getById: (id) => apiClient.get(`/bookings/${id}`),
    updateStatus: (id, data) => apiClient.put(`/bookings/${id}/status`, data),
    downloadTicket: (id) => apiClient.get(`/bookings/${id}/ticket`, { responseType: 'blob' }),
};
