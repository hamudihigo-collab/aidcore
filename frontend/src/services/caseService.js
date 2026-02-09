import apiClient from './api.js';

export const caseService = {
    createCase: async (caseData) => {
        const response = await apiClient.post('/cases', caseData);
        return response.data;
    },

    getCaseById: async (id) => {
        const response = await apiClient.get(`/cases/${id}`);
        return response.data;
    },

    getCases: async (filters = {}, page = 1, pageSize = 10) => {
        const response = await apiClient.get('/cases', {
            params: { ...filters, page, pageSize },
        });
        return response.data;
    },

    updateCase: async (id, updates) => {
        const response = await apiClient.put(`/cases/${id}`, updates);
        return response.data;
    },

    deleteCase: async (id) => {
        const response = await apiClient.delete(`/cases/${id}`);
        return response.data;
    },

    getCaseStatistics: async () => {
        const response = await apiClient.get('/cases/stats/summary');
        return response.data;
    },
};
