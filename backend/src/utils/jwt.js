import jwt from 'jsonwebtoken';

export const generateToken = (userId, role, remember = false) => {
    const expiresIn = remember ? process.env.JWT_REFRESH_EXPIRE : process.env.JWT_EXPIRE;

    return jwt.sign(
        { userId, role },
        process.env.JWT_SECRET,
        { expiresIn }
    );
};

export const generateRefreshToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRE }
    );
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

export const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
        throw new Error('Invalid or expired refresh token');
    }
};

export const decodeToken = (token) => {
    return jwt.decode(token);
};
