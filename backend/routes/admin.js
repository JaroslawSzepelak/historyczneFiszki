const express = require('express');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    changeUserStatus,
    toggleAdminRole,
    resetUserPassword,
    getUserStats,
    register,
    createHttpError
} = require('../services/userService');

const router = express.Router();

// Middleware: sprawdzenie autoryzacji i uprawnień admina na wszystkich routach
router.use(authMiddleware, adminMiddleware);

/**
 * GET /api/admin/users
 * Pobierz listę użytkowników z filtrowaniem i paginacją
 * Query params:
 *   - page: numer strony (default: 1)
 *   - limit: ilość rekordów na stronę (default: 50, max: 100)
 *   - search: wyszukiwanie po email, username, first_name, last_name
 *   - status: filtrowanie po statusie (active, inactive, banned)
 *   - isAdmin: filtrowanie po roli (true/false)
 */
router.get('/users', async (req, res, next) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50));
        const offset = (page - 1) * limit;

        const filters = {
            search: req.query.search ? String(req.query.search).trim() : undefined,
            status: req.query.status ? String(req.query.status).toLowerCase() : undefined,
            isAdmin: req.query.isAdmin !== undefined ? req.query.isAdmin === 'true' : undefined
        };

        const result = await getAllUsers(limit, offset, filters);

        res.json({
            users: result.users,
            pagination: {
                total: result.total,
                page,
                limit,
                pages: Math.ceil(result.total / limit)
            }
        });
    } catch (err) {
        next(err);
    }
});

/**
 * POST /api/admin/users
 * Utwórz nowego użytkownika
 * Body:
 *   - email: email użytkownika (wymagany)
 *   - password: hasło (wymagane, min 8 znaków)
 *   - username: nazwa użytkownika (opcjonalne)
 *   - first_name: imię (opcjonalne)
 *   - last_name: nazwisko (opcjonalne)
 *   - isAdmin: czy ma być admin (opcjonalne, default: false)
 */
router.post('/users', async (req, res, next) => {
    try {
        const newUser = await register({
            email: req.body.email,
            password: req.body.password,
            username: req.body.username,
            first_name: req.body.first_name,
            last_name: req.body.last_name
        });

        if (req.body.isAdmin) {
            await toggleAdminRole(newUser.id, true, req.user.userId);
            newUser.isAdmin = true;
        }

        res.status(201).json({ user: newUser });
    } catch (err) {
        next(err);
    }
});

/**
 * GET /api/admin/users/:id
 * Pobierz szczegóły konkretnego użytkownika
 */
router.get('/users/:id', async (req, res, next) => {
    try {
        const userId = parseInt(req.params.id);
        if (isNaN(userId)) {
            throw createHttpError(400, 'Nieprawidłowe ID użytkownika');
        }

        const user = await getUserById(userId);
        res.json({ user });
    } catch (err) {
        next(err);
    }
});

/**
 * PUT /api/admin/users/:id
 * Edycja danych użytkownika
 * Body:
 *   - email: nowy email
 *   - username: nowa nazwa użytkownika
 *   - first_name: imię
 *   - last_name: nazwisko
 *   - preferences: preferencje JSON
 */
router.put('/users/:id', async (req, res, next) => {
    try {
        const userId = parseInt(req.params.id);
        if (isNaN(userId)) {
            throw createHttpError(400, 'Nieprawidłowe ID użytkownika');
        }

        const updatedUser = await updateUser(userId, req.body, req.user.userId);
        res.json({ user: updatedUser });
    } catch (err) {
        next(err);
    }
});

/**
 * DELETE /api/admin/users/:id
 * Usunięcie użytkownika
 */
router.delete('/users/:id', async (req, res, next) => {
    try {
        const userId = parseInt(req.params.id);
        if (isNaN(userId)) {
            throw createHttpError(400, 'Nieprawidłowe ID użytkownika');
        }

        // Zabezpieczenie: admin nie może usunąć siebie
        if (userId === req.user.userId) {
            throw createHttpError(403, 'Nie możesz usunąć własnego konta');
        }

        const result = await deleteUser(userId);
        res.json(result);
    } catch (err) {
        next(err);
    }
});

/**
 * PATCH /api/admin/users/:id/status
 * Zmiana statusu użytkownika
 * Body:
 *   - status: 'active', 'inactive', lub 'banned'
 */
router.patch('/users/:id/status', async (req, res, next) => {
    try {
        const userId = parseInt(req.params.id);
        if (isNaN(userId)) {
            throw createHttpError(400, 'Nieprawidłowe ID użytkownika');
        }

        const { status } = req.body;
        if (!status) {
            throw createHttpError(400, 'Status jest wymagany');
        }

        const updatedUser = await changeUserStatus(userId, status, req.user.userId);
        res.json({ user: updatedUser });
    } catch (err) {
        next(err);
    }
});

/**
 * PATCH /api/admin/users/:id/admin
 * Zmiana roli administratora
 * Body:
 *   - isAdmin: true/false
 */
router.patch('/users/:id/admin', async (req, res, next) => {
    try {
        const userId = parseInt(req.params.id);
        if (isNaN(userId)) {
            throw createHttpError(400, 'Nieprawidłowe ID użytkownika');
        }

        const { isAdmin } = req.body;
        if (isAdmin === undefined) {
            throw createHttpError(400, 'Parametr isAdmin jest wymagany');
        }

        // Zabezpieczenie: admin nie może odebrać sobie uprawnień
        if (userId === req.user.userId && !isAdmin) {
            throw createHttpError(403, 'Nie możesz odebrać sobie uprawnień administratora');
        }

        const updatedUser = await toggleAdminRole(userId, isAdmin, req.user.userId);
        res.json({ user: updatedUser });
    } catch (err) {
        next(err);
    }
});

/**
 * PATCH /api/admin/users/:id/password
 * Reset hasła użytkownika
 * Body:
 *   - password: nowe hasło (min 8 znaków)
 */
router.patch('/users/:id/password', async (req, res, next) => {
    try {
        const userId = parseInt(req.params.id);
        if (isNaN(userId)) {
            throw createHttpError(400, 'Nieprawidłowe ID użytkownika');
        }

        const { password } = req.body;
        if (!password) {
            throw createHttpError(400, 'Hasło jest wymagane');
        }

        const updatedUser = await resetUserPassword(userId, password);
        res.json({ user: updatedUser });
    } catch (err) {
        next(err);
    }
});

/**
 * GET /api/admin/stats
 * Pobierz statystyki użytkowników
 */
router.get('/stats', async (req, res, next) => {
    try {
        const stats = await getUserStats();
        res.json(stats);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
