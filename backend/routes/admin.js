const express = require('express');
const { getUserStats } = require('../services/userService');

const adminUsersRoutes = require('./adminUsers');
const adminFlashcardsRoutes = require('./adminFlashcards');

const router = express.Router();

router.use('/users', adminUsersRoutes);
router.use('/flashcards', adminFlashcardsRoutes);

router.get('/stats', async (req, res, next) => {
    try {
        const stats = await getUserStats();
        res.json(stats);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
