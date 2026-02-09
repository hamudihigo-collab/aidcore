import apiClient from './api.js';

export const noteService = {
    createNote: async (caseId, title, content, isPrivate = false) => {
        const response = await apiClient.post('/notes', {
            caseId,
            title,
            content,
            isPrivate,
        });
        return response.data;
    },

    getNotesByCaseId: async (caseId, page = 1, pageSize = 20) => {
        const response = await apiClient.get(`/notes/case/${caseId}`, {
            params: { page, pageSize },
        });
        return response.data;
    },

    getNoteById: async (id) => {
        const response = await apiClient.get(`/notes/${id}`);
        return response.data;
    },

    updateNote: async (id, updates) => {
        const response = await apiClient.put(`/notes/${id}`, updates);
        return response.data;
    },

    deleteNote: async (id) => {
        const response = await apiClient.delete(`/notes/${id}`);
        return response.data;
    },
};
