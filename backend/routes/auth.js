const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const { authMiddleware, signToken, COOKIE_NAME } = require('../middleware/auth');

const router = express.Router();
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
const COOKIE_HTTP_ONLY = process.env.COOKIE_HTTP_ONLY !== 'false';
const COOKIE_SECURE = process.env.COOKIE_SECURE === 'true';
const COOKIE_SAME_SITE = process.env.COOKIE_SAME_SITE || 'strict';
const COOKIE_MAX_AGE = 24 * 60 * 60 * 1000; // 24 godziny

function createHttpError(status, message, details) {
    const error = new Error(message);
    error.status = status;
    if (details) {
        error.details = details;
    }
    return error;
}

function sanitizeUser(user) {
    if (!user) {
        return null;
    }

    return {
        id: user.id,
        email: user.email,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        isAdmin: user.is_admin === 1,
        status: user.status,
        email_verified: user.email_verified === 1,
        created_at: user.created_at,
        updated_at: user.updated_at,
        last_login: user.last_login
    };
}

async function findUserByEmail(email) {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
}

async function findUserById(id) {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
}

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
        const { email, password, username, first_name, last_name } = req.body;

        if (!email || !password) {
            throw createHttpError(400, 'Email i hasło są wymagane');
        }

        if (typeof password !== 'string' || password.length < 8) {
            throw createHttpError(400, 'Hasło musi mieć co najmniej 8 znaków');
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        const existingUser = await findUserByEmail(normalizedEmail);

        if (existingUser) {
            throw createHttpError(400, 'Konto z takim adresem email już istnieje');
        }

        const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
        const [result] = await db.query(
            'INSERT INTO users (email, username, password_hash, first_name, last_name) VALUES (?, ?, ?, ?, ?)',
            [normalizedEmail, username || null, password_hash, first_name || null, last_name || null]
        );

        const createdUser = await findUserById(result.insertId);
        const token = signToken({ userId: createdUser.id, email: createdUser.email, isAdmin: createdUser.is_admin === 1, username: createdUser.username });

        setAuthCookie(res, token);
        res.status(201).json({ user: sanitizeUser(createdUser) });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return next(createHttpError(400, 'Email lub nazwa użytkownika jest już zajęta'));
        }
        next(err);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw createHttpError(400, 'Email i hasło są wymagane');
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        const user = await findUserByEmail(normalizedEmail);

        if (!user) {
            throw createHttpError(401, 'Nieprawidłowe dane logowania');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            throw createHttpError(401, 'Nieprawidłowe dane logowania');
        }

        await db.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

        const token = signToken({ userId: user.id, email: user.email, isAdmin: user.is_admin === 1, username: user.username });
        setAuthCookie(res, token);

        res.json({ user: sanitizeUser(user) });
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
        const user = await findUserById(req.user.userId);
        if (!user) {
            throw createHttpError(401, 'Użytkownik nie został odnaleziony');
        }
        res.json({ user: sanitizeUser(user) });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
