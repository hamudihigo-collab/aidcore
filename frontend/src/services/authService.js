import apiClient from './api.js';

export const authService = {
    register: async (email, password, firstName, lastName, phone) => {
        const response = await apiClient.post('/auth/register', {
            email,
            password,
            firstName,
            lastName,
            phone,
        });
        return response.data;
    },

    login: async (email, password, rememberMe = false) => {
        const response = await apiClient.post('/auth/login', {
            email,
            password,
            rememberMe,
        });
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await apiClient.get('/auth/me');
        return response.data;
    },

    logout: async () => {
        const response = await apiClient.post('/auth/logout');
        return response.data;
    },
};
