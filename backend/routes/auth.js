const express = require('express');
const { authMiddleware, signToken, COOKIE_NAME } = require('../middleware/auth');
const { register: registerUser, login: loginUser, getUserById, createHttpError } = require('../services/userService');

const router = express.Router();
const COOKIE_HTTP_ONLY = process.env.COOKIE_HTTP_ONLY !== 'false';
const COOKIE_SECURE = process.env.COOKIE_SECURE === 'true';
const COOKIE_SAME_SITE = process.env.COOKIE_SAME_SITE || 'strict';
const COOKIE_MAX_AGE = 24 * 60 * 60 * 1000; // 24 godziny

function setAuthCookie(res, token) {
    res.cookie(COOKIE_NAME, token, {
        httpOnly: COOKIE_HTTP_ONLY,
        secure: COOKIE_SECURE,
        sameSite: COOKIE_SAME_SITE,
        maxAge: COOKIE_MAX_AGE,
        path: '/'
    });
}

router.post('/register', async (req, res, next) => {
    try {
        const user = await registerUser(req.body);
        const token = signToken({ userId: user.id, email: user.email, isAdmin: user.isAdmin, username: user.username });
        setAuthCookie(res, token);
        res.status(201).json({ user });
    } catch (err) {
        next(err);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const user = await loginUser(req.body);
        const token = signToken({ userId: user.id, email: user.email, isAdmin: user.isAdmin, username: user.username });
        setAuthCookie(res, token);
        res.json({ user });
    } catch (err) {
        next(err);
    }
});

router.post('/logout', (_req, res) => {
    res.clearCookie(COOKIE_NAME, {
        httpOnly: COOKIE_HTTP_ONLY,
        secure: COOKIE_SECURE,
        sameSite: COOKIE_SAME_SITE,
        path: '/'
    });
    res.json({ ok: true });
});

router.get('/me', authMiddleware, async (req, res, next) => {
    try {
        const user = await getUserById(req.user.userId);
        res.json({ user });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
