import React from 'react';
import { useAuthStore } from '../hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-primary-700 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold">AIDCORE</h1>
                    </div>

                    {user && (
                        <div className="flex items-center gap-4">
                            <span className="text-sm">Welcome, {user.firstName}!</span>
                            <button
                                onClick={handleLogout}
                                className="bg-primary-600 hover:bg-primary-800 px-4 py-2 rounded-lg transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export const Sidebar = ({ active }) => (
    <aside className="bg-gray-100 w-64 min-h-screen p-4">
        <nav className="space-y-2">
            <a
                href="/dashboard"
                className={`block px-4 py-2 rounded-lg ${active === 'dashboard' ? 'bg-primary-600 text-white' : 'hover:bg-gray-200'}`}
            >
                📊 Dashboard
            </a>
            <a
                href="/cases"
                className={`block px-4 py-2 rounded-lg ${active === 'cases' ? 'bg-primary-600 text-white' : 'hover:bg-gray-200'}`}
            >
                📋 Cases
            </a>
            <a
                href="/documents"
                className={`block px-4 py-2 rounded-lg ${active === 'documents' ? 'bg-primary-600 text-white' : 'hover:bg-gray-200'}`}
            >
                📄 Documents
            </a>
            <a
                href="/settings"
                className={`block px-4 py-2 rounded-lg ${active === 'settings' ? 'bg-primary-600 text-white' : 'hover:bg-gray-200'}`}
            >
                ⚙️ Settings
            </a>
        </nav>
    </aside>
);
