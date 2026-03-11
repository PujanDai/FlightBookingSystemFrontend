import apiClient from '../apiClient';

export const flightsApi = {
    getAll: (params) => apiClient.get('/flights', { params }),
    getById: (id) => apiClient.get(`/flights/${id}`),
    create: (data) => apiClient.post('/flights', data),
    update: (id, data) => apiClient.put(`/flights/${id}`, data),
    delete: (id) => apiClient.delete(`/flights/${id}`),
};
