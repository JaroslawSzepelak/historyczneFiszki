const express = require("express");
const router = express.Router();
const db = require("../db");

/**
 * GET /flashcards?area=x&era=y
 * Zwraca tylko fiszki wymagane dla danej ścieżki
 */
router.get("/", async(req, res) => {
    const { area, era } = req.query;

    try {
        let sql = "SELECT * FROM flashcards";
        const params = [];

        if (area && era) {
            sql += " WHERE area = ? AND era = ?";
            params.push(area, era);
        }

        const [rows] = await db.query(sql, params);
        res.json(rows);
    } catch (err) {
        console.error("Błąd pobierania fiszek:", err);
        res.status(500).json({ error: "Database error" });
    }
});

/**
 * POST /flashcards
 * Dodawanie fiszki
 */
router.post("/", async(req, res) => {
    const { area, era, question, answers, correctAnswer } = req.body;

    try {
        const sql = `
            INSERT INTO flashcards (area, era, question, answers, correctAnswer)
            VALUES (?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(sql, [
            area,
            era,
            question,
            JSON.stringify(answers),
            correctAnswer
        ]);

        res.json({ id: result.insertId });
    } catch (err) {
        console.error("Błąd przy dodawaniu fiszki:", err);
        res.status(500).json({ error: "Database error" });
    }
});

module.exports = router;