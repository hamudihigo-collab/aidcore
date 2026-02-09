import { verifyToken } from '../utils/jwt.js';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            status: 'error',
            message: 'No authentication token provided',
        });
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({
            status: 'error',
            message: 'Invalid or expired token',
        });
    }
};

export const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'error',
                message: 'Insufficient permissions',
            });
        }
        next();
    };
};

export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    if (err.message.includes('token')) {
        return res.status(401).json({
            status: 'error',
            message: 'Authentication error',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined,
        });
    }

    res.status(err.statusCode || 500).json({
        status: 'error',
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err : {},
    });
};

export const notFoundHandler = (req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found',
    });
};
