import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './hooks/useAuth.js';
import { LoginPage, RegisterPage } from './pages/AuthPages.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { CasesPage } from './pages/CasesPage.jsx';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuthStore();
    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default function App() {
    React.useEffect(() => {
        useAuthStore.getState().loadFromStorage();
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/cases"
                    element={
                        <ProtectedRoute>
                            <CasesPage />
                        </ProtectedRoute>
                    }
                />
                <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
        </Router>
    );
}
