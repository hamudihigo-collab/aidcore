import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuth.js';
import { useForm } from '../hooks/useForm.js';
import { authService } from '../services/authService.js';
import { Button, Card } from '../components/UI.jsx';

export const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuthStore();
    const [error, setError] = React.useState('');

    const form = useForm(
        { email: '', password: '', rememberMe: false },
        async (values) => {
            try {
                setError('');
                const response = await authService.login(values.email, values.password, values.rememberMe);
                login(response.data.user, response.data.accessToken, response.data.refreshToken);
                navigate('/dashboard');
            } catch (err) {
                setError(err.response?.data?.message || 'Login failed');
            }
        }
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
            <Card className="w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-8">AIDCORE</h1>

                <form onSubmit={form.handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.values.email}
                            onChange={form.handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={form.values.password}
                            onChange={form.handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            required
                        />
                    </div>

                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="rememberMe"
                            checked={form.values.rememberMe}
                            onChange={form.handleChange}
                            className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Remember me</span>
                    </label>

                    <Button type="submit" loading={form.isSubmitting} className="w-full">
                        Login
                    </Button>
                </form>

                <p className="text-center mt-4 text-gray-600">
                    Don't have an account? <a href="/register" className="text-primary-600 font-medium">Register</a>
                </p>
            </Card>
        </div>
    );
};

export const RegisterPage = () => {
    const navigate = useNavigate();
    const { login } = useAuthStore();
    const [error, setError] = React.useState('');

    const form = useForm(
        { email: '', password: '', firstName: '', lastName: '', phone: '' },
        async (values) => {
            try {
                setError('');
                const response = await authService.register(
                    values.email,
                    values.password,
                    values.firstName,
                    values.lastName,
                    values.phone
                );
                login(response.data.user, response.data.accessToken, response.data.refreshToken);
                navigate('/dashboard');
            } catch (err) {
                setError(err.response?.data?.message || 'Registration failed');
            }
        }
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
            <Card className="w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-8">AIDCORE Register</h1>

                <form onSubmit={form.handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={form.values.firstName}
                                onChange={form.handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={form.values.lastName}
                                onChange={form.handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.values.email}
                            onChange={form.handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={form.values.password}
                            onChange={form.handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={form.values.phone}
                            onChange={form.handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    <Button type="submit" loading={form.isSubmitting} className="w-full">
                        Register
                    </Button>
                </form>

                <p className="text-center mt-4 text-gray-600">
                    Already have an account? <a href="/login" className="text-primary-600 font-medium">Login</a>
                </p>
            </Card>
        </div>
    );
};
