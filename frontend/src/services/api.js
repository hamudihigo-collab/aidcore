import axios from "axios";

// Backend URL from .env or default
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001"; // make sure backend is running on this port

// Create an axios instance
export const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add token to requests if exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle token refresh / unauthorized
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) {
                try {
                    // TODO: implement token refresh if backend supports it
                    return api(originalRequest);
                } catch (refreshError) {
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    window.location.href = "/login";
                }
            }
        }
        return Promise.reject(error);
    }
);

/* ===========================
   CASES
=========================== */

// Get all cases
export const getCases = async () => {
    try {
        const res = await api.get("/cases");
        return res.data;
    } catch (err) {
        console.error("Error fetching cases:", err);
        throw err;
    }
};

// Get a case by ID
export const getCaseById = async (id) => {
    try {
        const res = await api.get(`/cases/${id}`);
        return res.data;
    } catch (err) {
        console.error("Error fetching case:", err);
        throw err;
    }
};

// Create a new case
export const createCase = async (caseData) => {
    try {
        const res = await api.post("/cases", caseData);
        return res.data;
    } catch (err) {
        console.error("Error creating case:", err);
        throw err;
    }
};

/* ===========================
   USERS
=========================== */

// Get all users
export const getUsers = async () => {
    try {
        const res = await api.get("/users");
        return res.data;
    } catch (err) {
        console.error("Error fetching users:", err);
        throw err;
    }
};

// Get user by ID
export const getUserById = async (id) => {
    try {
        const res = await api.get(`/users/${id}`);
        return res.data;
    } catch (err) {
        console.error("Error fetching user:", err);
        throw err;
    }
};

/* ===========================
   DOCUMENTS
=========================== */

// Get all documents
export const getDocuments = async () => {
    try {
        const res = await api.get("/documents");
        return res.data;
    } catch (err) {
        console.error("Error fetching documents:", err);
        throw err;
    }
};

// Upload a document
export const uploadDocument = async (formData) => {
    try {
        const res = await api.post("/documents", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    } catch (err) {
        console.error("Error uploading document:", err);
        throw err;
    }
};

/* ===========================
   NOTES
=========================== */

// Get all notes
export const getNotes = async () => {
    try {
        const res = await api.get("/notes");
        return res.data;
    } catch (err) {
        console.error("Error fetching notes:", err);
        throw err;
    }
};

// Create a new note
export const createNote = async (noteData) => {
    try {
        const res = await api.post("/notes", noteData);
        return res.data;
    } catch (err) {
        console.error("Error creating note:", err);
        throw err;
    }
};
