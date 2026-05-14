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

async function getAllUsers(limit = 50, offset = 0, filters = {}) {
    let query = 'SELECT * FROM users WHERE 1=1';
    const params = [];

    if (filters.status) {
        query += ' AND status = ?';
        params.push(filters.status);
    }

    if (filters.isAdmin !== undefined) {
        query += ' AND is_admin = ?';
        params.push(filters.isAdmin ? 1 : 0);
    }

    if (filters.search) {
        query += ' AND (email LIKE ? OR username LIKE ? OR first_name LIKE ? OR last_name LIKE ?)';
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await db.query(query, params);

    let countQuery = 'SELECT COUNT(*) as count FROM users WHERE 1=1';
    const countParams = [];

    if (filters.status) {
        countQuery += ' AND status = ?';
        countParams.push(filters.status);
    }

    if (filters.isAdmin !== undefined) {
        countQuery += ' AND is_admin = ?';
        countParams.push(filters.isAdmin ? 1 : 0);
    }

    if (filters.search) {
        countQuery += ' AND (email LIKE ? OR username LIKE ? OR first_name LIKE ? OR last_name LIKE ?)';
        const searchTerm = `%${filters.search}%`;
        countParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    const [countRows] = await db.query(countQuery, countParams);
    const total = countRows[0].count;

    return {
        users: rows.map(sanitizeUser),
        total,
        limit,
        offset
    };
}

async function updateUser(userId, updateData, updatedByUserId) {
    const user = await findUserById(userId);
    if (!user) {
        throw createHttpError(404, 'Użytkownik nie został odnaleziony');
    }

    const allowedFields = ['email', 'username', 'first_name', 'last_name', 'preferences'];
    const updates = {};

    for (const [key, value] of Object.entries(updateData)) {
        if (allowedFields.includes(key) && value !== undefined) {
            updates[key] = value;
        }
    }

    if (Object.keys(updates).length === 0) {
        return sanitizeUser(user);
    }

    if (updates.email) {
        updates.email = String(updates.email).trim().toLowerCase();
        const existingUser = await findUserByEmail(updates.email);
        if (existingUser && existingUser.id !== userId) {
            throw createHttpError(400, 'Email jest już zajęty');
        }
    }

    let query = 'UPDATE users SET ';
    const params = [];

    Object.keys(updates).forEach((key, index) => {
        if (index > 0) query += ', ';
        query += `${key} = ?`;
        params.push(updates[key]);
    });

    if (updatedByUserId) {
        query += ', updated_by = ?';
        params.push(updatedByUserId);
    }

    query += ' WHERE id = ?';
    params.push(userId);

    await db.query(query, params);

    const updatedUser = await findUserById(userId);
    return sanitizeUser(updatedUser);
}

async function changeUserStatus(userId, status, updatedByUserId) {
    const validStatuses = ['active', 'inactive', 'banned'];
    if (!validStatuses.includes(status)) {
        throw createHttpError(400, 'Niepoprawny status. Dozwolone: active, inactive, banned');
    }

    const user = await findUserById(userId);
    if (!user) {
        throw createHttpError(404, 'Użytkownik nie został odnaleziony');
    }

    let query = 'UPDATE users SET status = ?';
    const params = [status];

    if (updatedByUserId) {
        query += ', updated_by = ?';
        params.push(updatedByUserId);
    }

    query += ' WHERE id = ?';
    params.push(userId);

    await db.query(query, params);

    const updatedUser = await findUserById(userId);
    return sanitizeUser(updatedUser);
}

async function toggleAdminRole(userId, isAdmin, updatedByUserId) {
    const user = await findUserById(userId);
    if (!user) {
        throw createHttpError(404, 'Użytkownik nie został odnaleziony');
    }

    let query = 'UPDATE users SET is_admin = ?';
    const params = [isAdmin ? 1 : 0];

    if (updatedByUserId) {
        query += ', updated_by = ?';
        params.push(updatedByUserId);
    }

    query += ' WHERE id = ?';
    params.push(userId);

    await db.query(query, params);

    const updatedUser = await findUserById(userId);
    return sanitizeUser(updatedUser);
}

async function deleteUser(userId) {
    const user = await findUserById(userId);
    if (!user) {
        throw createHttpError(404, 'Użytkownik nie został odnaleziony');
    }

    await db.query('DELETE FROM users WHERE id = ?', [userId]);
    return { message: 'Użytkownik został usunięty' };
}

async function resetUserPassword(userId, newPassword) {
    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
        throw createHttpError(400, 'Hasło musi mieć co najmniej 8 znaków');
    }

    const user = await findUserById(userId);
    if (!user) {
        throw createHttpError(404, 'Użytkownik nie został odnaleziony');
    }

    const password_hash = await hashPassword(newPassword);
    await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [password_hash, userId]);

    const updatedUser = await findUserById(userId);
    return sanitizeUser(updatedUser);
}

async function getUserStats() {
    const [stats] = await db.query(`
        SELECT 
            COUNT(*) as total_users,
            SUM(CASE WHEN is_admin = 1 THEN 1 ELSE 0 END) as admin_count,
            SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_users,
            SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactive_users,
            SUM(CASE WHEN status = 'banned' THEN 1 ELSE 0 END) as banned_users,
            SUM(CASE WHEN email_verified = 1 THEN 1 ELSE 0 END) as verified_users,
            MAX(created_at) as last_user_created,
            MAX(last_login) as last_login_time
        FROM users
    `);

    return stats[0] || {};
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
    getAllUsers,
    updateUser,
    changeUserStatus,
    toggleAdminRole,
    deleteUser,
    resetUserPassword,
    getUserStats,
    createHttpError
};
