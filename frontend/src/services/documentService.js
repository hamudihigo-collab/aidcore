import apiClient from './api.js';

export const documentService = {
    uploadDocument: async (caseId, file, documentType, description) => {
        const formData = new FormData();
        formData.append('caseId', caseId);
        formData.append('file', file);
        formData.append('documentType', documentType);
        formData.append('description', description);

        const response = await apiClient.post('/documents', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    getDocumentsByCaseId: async (caseId, page = 1, pageSize = 20) => {
        const response = await apiClient.get(`/documents/case/${caseId}`, {
            params: { page, pageSize },
        });
        return response.data;
    },

    getDocumentById: async (id) => {
        const response = await apiClient.get(`/documents/${id}`);
        return response.data;
    },

    updateDocument: async (id, updates) => {
        const response = await apiClient.put(`/documents/${id}`, updates);
        return response.data;
    },

    deleteDocument: async (id) => {
        const response = await apiClient.delete(`/documents/${id}`);
        return response.data;
    },
};
