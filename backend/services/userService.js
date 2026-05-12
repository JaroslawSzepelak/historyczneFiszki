const bcrypt = require('bcrypt');
const db = require('../db');

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

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

async function hashPassword(password) {
    return bcrypt.hash(password, SALT_ROUNDS);
}

async function validatePassword(plainPassword, hash) {
    return bcrypt.compare(plainPassword, hash);
}

async function register({ email, password, username, first_name, last_name }) {
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

    const password_hash = await hashPassword(password);

    try {
        const [result] = await db.query(
            'INSERT INTO users (email, username, password_hash, first_name, last_name) VALUES (?, ?, ?, ?, ?)',
            [normalizedEmail, username || null, password_hash, first_name || null, last_name || null]
        );

        const createdUser = await findUserById(result.insertId);
        return sanitizeUser(createdUser);
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            throw createHttpError(400, 'Email lub nazwa użytkownika jest już zajęta');
        }
        throw err;
    }
}

async function login({ email, password }) {
    if (!email || !password) {
        throw createHttpError(400, 'Email i hasło są wymagane');
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await findUserByEmail(normalizedEmail);

    if (!user) {
        throw createHttpError(401, 'Nieprawidłowe dane logowania');
    }

    const isPasswordValid = await validatePassword(password, user.password_hash);
    if (!isPasswordValid) {
        throw createHttpError(401, 'Nieprawidłowe dane logowania');
    }

    await db.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

    return sanitizeUser(user);
}

async function getUserById(id) {
    const user = await findUserById(id);
    if (!user) {
        throw createHttpError(401, 'Użytkownik nie został odnaleziony');
    }
    return sanitizeUser(user);
}

module.exports = {
    findUserByEmail,
    findUserById,
    sanitizeUser,
    hashPassword,
    validatePassword,
    register,
    login,
    getUserById,
    createHttpError
};
