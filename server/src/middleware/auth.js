const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.header('Authorization');

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                error: 'No token, authorization denied'
            });
        }

        // Check if it's Bearer token
        const token = authHeader.startsWith('Bearer ')
            ? authHeader.substring(7)
            : authHeader;

        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'No token, authorization denied'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user to request
        req.userId = decoded.userId;
        req.userRole = decoded.role;

        next();
    } catch (error) {
        console.error('Auth middleware error:', error.message);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                error: 'Invalid token'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: 'Token expired'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Server error in authentication'
        });
    }
};

const adminMiddleware = (req, res, next) => {
    try {
        if (req.userRole !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'Access denied. Admin only.'
            });
        }
        next();
    } catch (error) {
        console.error('Admin middleware error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Server error in admin check'
        });
    }
};

module.exports = { authMiddleware, adminMiddleware };