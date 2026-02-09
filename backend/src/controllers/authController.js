import { User } from '../models/User.js';
import { hashPassword, comparePassword, validatePassword } from '../utils/password.js';
import { generateToken, generateRefreshToken } from '../utils/jwt.js';
import { successResponse, errorResponse, validationErrorResponse } from '../utils/response.js';

export const register = async (req, res) => {
    try {
        const { email, password, firstName, lastName, role, phone } = req.body;

        // Validate input
        if (!email || !password || !firstName || !lastName) {
            return validationErrorResponse(res, { message: 'Missing required fields' });
        }

        // Validate password strength
        if (!validatePassword(password)) {
            return validationErrorResponse(res, {
                message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
            });
        }

        // Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({
                status: 'error',
                message: 'User with this email already exists',
            });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        const user = await User.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            role: role || 'viewer',
            phone: phone || null,
        });

        // Generate tokens
        const accessToken = generateToken(user.id, user.role);
        const refreshToken = generateRefreshToken(user.id);

        return successResponse(
            res,
            {
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    role: user.role,
                },
                accessToken,
                refreshToken,
            },
            'User registered successfully',
            201
        );
    } catch (error) {
        console.error('Registration error:', error);
        return errorResponse(res, error);
    }
};

export const login = async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;

        if (!email || !password) {
            return validationErrorResponse(res, { message: 'Email and password required' });
        }

        // Find user
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password',
            });
        }

        if (!user.is_active) {
            return res.status(403).json({
                status: 'error',
                message: 'User account is disabled',
            });
        }

        // Compare passwords
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password',
            });
        }

        // Generate tokens
        const accessToken = generateToken(user.id, user.role, rememberMe);
        const refreshToken = generateRefreshToken(user.id);

        return successResponse(res, {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                role: user.role,
            },
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.error('Login error:', error);
        return errorResponse(res, error);
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found',
            });
        }

        return successResponse(res, {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role,
            phone: user.phone,
        });
    } catch (error) {
        console.error('Get current user error:', error);
        return errorResponse(res, error);
    }
};

export const logout = async (req, res) => {
    // In a real app with refresh tokens in database, you'd invalidate it here
    return successResponse(res, null, 'Logged out successfully');
};
