import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, Link, useLocation } from 'react-router-dom';
import { create } from 'zustand';
import { LoginPage, RegisterPage } from './pages/Login.jsx';
import { DashboardPage } from './pages/Dashboard.jsx';
import { CasesPage } from './pages/Cases.jsx';
import { CaseDetailPage } from './pages/CaseDetail.jsx';
import { CreateCasePage } from './pages/CreateCase.jsx';
import aidcoreLogo from './aidcore_logo.png';

// ─── Auth Store ──────────────────────────────────────────
export const useAuth = create((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,

    login: (user, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, token, isAuthenticated: true });
    },

    logout: () => {
        localStorage.clear();
        set({ user: null, token: null, isAuthenticated: false });
    },

    loadFromStorage: () => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token && user) {
            set({ token, user: JSON.parse(user), isAuthenticated: true });
        }
    },
}));

// ─── Protected Route ─────────────────────────────────────
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
};

// ─── Layout ──────────────────────────────────────────────
const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <header className="h-14 border-b border-border bg-background flex items-center justify-between px-6">
            <Link to="/dashboard" className="text-base font-semibold tracking-tight text-foreground">
                <img src={aidcoreLogo} alt="AidCore" className="h-12 w-auto mr-2 inline-block" />
            </Link>
            {user && (
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                            <span className="text-xs font-medium text-primary-foreground">
                                {user.firstName?.[0]}{user.lastName?.[0]}
                            </span>
                        </div>
                        <span className="text-sm text-muted-foreground">{user.firstName} {user.lastName}</span>
                    </div>
                    <button
                        onClick={() => { logout(); navigate('/login'); }}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-3 border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        Logout
                    </button>
                </div>
            )}
        </header>
    );
};

const Sidebar = () => {
    const location = useLocation();
    const links = [
        {
            to: '/dashboard', label: 'Dashboard', icon: (
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
            )
        },
        {
            to: '/cases', label: 'Cases', icon: (
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 13H8" /><path d="M16 17H8" /><path d="M16 13h-2" /></svg>
            )
        },
    ];

    return (
        <aside className="w-[16rem] bg-sidebar border-r border-sidebar-border min-h-[calc(100vh-3.5rem)] flex flex-col">
            <div className="p-2 flex-1">
                <div className="px-2 py-1.5 mb-1">
                    <span className="text-xs font-medium text-sidebar-foreground/70">Navigation</span>
                </div>
                <nav className="flex flex-col gap-1">
                    {links.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${location.pathname === link.to || location.pathname.startsWith(link.to + '/')
                                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                                }`}
                        >
                            {link.icon}
                            <span>{link.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>
        </aside>
    );
};

const Layout = ({ children }) => (
    <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6">{children}</main>
        </div>
    </div>
);

// ─── App ─────────────────────────────────────────────────
export default function App() {
    React.useEffect(() => {
        useAuth.getState().loadFromStorage();
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Layout><DashboardPage /></Layout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/cases"
                    element={
                        <ProtectedRoute>
                            <Layout><CasesPage /></Layout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/cases/new"
                    element={
                        <ProtectedRoute>
                            <Layout><CreateCasePage /></Layout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/cases/:id"
                    element={
                        <ProtectedRoute>
                            <Layout><CaseDetailPage /></Layout>
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
        </BrowserRouter>
    );
}
