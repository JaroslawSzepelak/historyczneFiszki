const userService = require('../services/userService');
const db = require('../db');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@historycznefiszki.local';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';

async function ensureAdminExists() {
    try {
        const existingAdmin = await userService.findUserByEmail(ADMIN_EMAIL);
        if (existingAdmin) {
            console.log('Admin już istnieje:', ADMIN_EMAIL);
            return;
        }

        const newAdmin = await userService.register({
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            username: ADMIN_USERNAME,
            first_name: 'Admin',
            last_name: 'System'
        });

        await db.query('UPDATE users SET is_admin = 1 WHERE id = ?', [newAdmin.id]);
        console.log('Utworzono konto administratora:', ADMIN_EMAIL);
    } catch (err) {
        console.error('Nie udało się utworzyć konta administratora:', err.message);
    }
}

module.exports = ensureAdminExists;
