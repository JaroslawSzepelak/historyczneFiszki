const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_with_secret';
const COOKIE_NAME = 'authToken';

function createAuthError(message = 'Brak autoryzacji') {
    const error = new Error(message);
    error.status = 401;
    return error;
}

function getTokenFromRequest(req) {
    if (req.cookies && req.cookies[COOKIE_NAME]) {
        return req.cookies[COOKIE_NAME];
    }

    return null;
}

function authMiddleware(req, res, next) {
    try {
        const token = getTokenFromRequest(req);
        if (!token) {
            throw createAuthError('Token autoryzacji nie został znaleziony');
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token wygasł, zaloguj się ponownie' });
        }

        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Niepoprawny token autoryzacji' });
        }

        const status = err.status || 401;
        res.status(status).json({ error: err.message || 'Nieautoryzowany dostęp' });
    }
}

function adminMiddleware(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ error: 'Brak autoryzacji' });
    }

    if (!req.user.isAdmin) {
        return res.status(403).json({ error: 'Brak uprawnień administratora' });
    }

    next();
}

function signToken(payload) {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    });
}

module.exports = {
    authMiddleware,
    adminMiddleware,
    signToken,
    COOKIE_NAME
};
