import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const verifyJWT = async (req, res, next) => {
    const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'fallback_secret_key_12345');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ success: false, message: 'Forbidden: Invalid or expired token' });
    }
};

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized: Please log in' });
        }
        
        const userRole = req.user.role;
        const hasRole = Array.isArray(userRole) 
            ? userRole.some(r => roles.includes(r))
            : roles.includes(userRole);

        if (!hasRole) {
            return res.status(403).json({ 
                success: false, 
                message: `Forbidden: Requires one of the following roles: [${roles.join(', ')}]` 
            });
        }
        next();
    };
};
