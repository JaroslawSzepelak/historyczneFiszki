const express = require('express');
const db = require('../db');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

const ALLOWED_SORT_COLUMNS = new Set(['id', 'area', 'era', 'question']);
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
let cachedCorrectAnswerColumn = null;

function createHttpError(status, message, details) {
    const error = new Error(message);
    error.status = status;
    if (details) {
        error.details = details;
    }
    return error;
}

function parseAnswers(answers) {
    if (Array.isArray(answers)) {
        return answers;
    }

    if (typeof answers === 'string') {
        try {
            const parsed = JSON.parse(answers);
            return Array.isArray(parsed) ? parsed : [];
        } catch (_error) {
            return [];
        }
    }

    return [];
}

async function getCorrectAnswerColumn() {
    if (cachedCorrectAnswerColumn) {
        return cachedCorrectAnswerColumn;
    }

    const [snakeCaseRows] = await db.query("SHOW COLUMNS FROM flashcards LIKE 'correct_answer'");
    if (snakeCaseRows.length) {
        cachedCorrectAnswerColumn = 'correct_answer';
        return cachedCorrectAnswerColumn;
    }

    const [camelCaseRows] = await db.query("SHOW COLUMNS FROM flashcards LIKE 'correctAnswer'");
    if (camelCaseRows.length) {
        cachedCorrectAnswerColumn = 'correctAnswer';
        return cachedCorrectAnswerColumn;
    }

    throw createHttpError(500, 'Tabela flashcards nie zawiera kolumny correct_answer/correctAnswer');
}

function normalizeRow(row) {
    const correctAnswer = row.correct_answer ?? row.correctAnswer ?? '';
    const answers = parseAnswers(row.answers);

    return {
        id: row.id,
        area: row.area,
        era: row.era,
        question: row.question,
        answers,
        correct_answer: correctAnswer,
        correctAnswer
    };
}

function parsePagination(query) {
    if (query.page === undefined && query.limit === undefined) {
        return null;
    }

    const page = Number(query.page ?? DEFAULT_PAGE);
    const limit = Number(query.limit ?? DEFAULT_LIMIT);

    if (!Number.isInteger(page) || page < 1) {
        throw createHttpError(400, 'Parametr page musi być dodatnią liczbą całkowitą');
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
        throw createHttpError(400, `Parametr limit musi być liczbą całkowitą z zakresu 1-${MAX_LIMIT}`);
    }

    return { page, limit, offset: (page - 1) * limit };
}

function validateFlashcardPayload(payload, { partial = false } = {}) {
    const errors = [];
    const normalized = {};
    const hasField = (field) => Object.prototype.hasOwnProperty.call(payload, field);

    const validateString = (field, label, min = 1, max = 255) => {
        if (!partial || hasField(field)) {
            const value = payload[field];
            if (typeof value !== 'string' || !value.trim()) {
                errors.push(`${label} jest wymagane i musi być niepustym tekstem`);
                return;
            }

            const trimmed = value.trim();
            if (trimmed.length < min || trimmed.length > max) {
                errors.push(`${label} musi mieć od ${min} do ${max} znaków`);
                return;
            }

            normalized[field] = trimmed;
        }
    };

    validateString('area', 'Pole area', 2, 80);
    validateString('era', 'Pole era', 2, 80);
    validateString('question', 'Pole question', 5, 500);

    if (!partial || hasField('answers')) {
        if (!Array.isArray(payload.answers) || payload.answers.length < 2) {
            errors.push('Pole answers musi być tablicą z co najmniej 2 odpowiedziami');
        } else {
            const cleanedAnswers = payload.answers
                .map((answer) => (typeof answer === 'string' ? answer.trim() : ''))
                .filter(Boolean);

            if (cleanedAnswers.length < 2) {
                errors.push('answers musi zawierać co najmniej 2 niepuste odpowiedzi');
            } else {
                normalized.answers = cleanedAnswers;
            }
        }
    }

    if (!partial || hasField('correctAnswer') || hasField('correct_answer')) {
        const rawCorrect = payload.correctAnswer ?? payload.correct_answer;
        if (typeof rawCorrect !== 'string' || !rawCorrect.trim()) {
            errors.push('Pole correctAnswer jest wymagane i musi być tekstem');
        } else {
            normalized.correctAnswer = rawCorrect.trim();
        }
    }

    if (normalized.answers && normalized.correctAnswer && !normalized.answers.includes(normalized.correctAnswer)) {
        errors.push('correctAnswer musi istnieć na liście answers');
    }

    return { errors, value: normalized };
}

function buildFilters(query) {
    const clauses = [];
    const params = [];

    if (query.area) {
        clauses.push('area = ?');
        params.push(query.area);
    }

    if (query.era) {
        clauses.push('era = ?');
        params.push(query.era);
    }

    if (query.q) {
        clauses.push('question LIKE ?');
        params.push(`%${query.q}%`);
    }

    return {
        whereSql: clauses.length ? ` WHERE ${clauses.join(' AND ')}` : '',
        params
    };
}

router.use(authMiddleware, adminMiddleware);

router.get('/', async (req, res, next) => {
    try {
        const { whereSql, params } = buildFilters(req.query);
        const pagination = parsePagination(req.query);
        const sortBy = req.query.sortBy && ALLOWED_SORT_COLUMNS.has(req.query.sortBy) ? req.query.sortBy : 'id';
        const sortOrder = req.query.order === 'asc' ? 'ASC' : 'DESC';

        let sql = `SELECT * FROM flashcards${whereSql} ORDER BY ${sortBy} ${sortOrder}`;
        const sqlParams = [...params];

        if (pagination) {
            sql += ' LIMIT ? OFFSET ?';
            sqlParams.push(pagination.limit, pagination.offset);
        }

        const [rows] = await db.query(sql, sqlParams);
        const data = rows.map(normalizeRow);

        if (!pagination) {
            return res.json(data);
        }

        const [countRows] = await db.query(`SELECT COUNT(*) AS total FROM flashcards${whereSql}`, params);
        return res.json({
            data,
            pagination: {
                page: pagination.page,
                limit: pagination.limit,
                total: countRows[0].total
            }
        });
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id < 1) {
            throw createHttpError(400, 'Niepoprawne ID fiszki');
        }

        const [rows] = await db.query('SELECT * FROM flashcards WHERE id = ? LIMIT 1', [id]);
        if (!rows.length) {
            throw createHttpError(404, 'Fiszka nie istnieje');
        }

        return res.json(normalizeRow(rows[0]));
    } catch (err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const correctAnswerColumn = await getCorrectAnswerColumn();
        const { errors, value } = validateFlashcardPayload(req.body);
        if (errors.length) {
            throw createHttpError(400, 'Niepoprawne dane wejściowe', errors);
        }

        const [result] = await db.query(
            `INSERT INTO flashcards (area, era, question, answers, ${correctAnswerColumn}) VALUES (?, ?, ?, ?, ?)`,
            [
                value.area,
                value.era,
                value.question,
                JSON.stringify(value.answers),
                value.correctAnswer
            ]
        );

        const [rows] = await db.query('SELECT * FROM flashcards WHERE id = ? LIMIT 1', [result.insertId]);
        return res.status(201).json(normalizeRow(rows[0]));
    } catch (err) {
        next(err);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const correctAnswerColumn = await getCorrectAnswerColumn();
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id < 1) {
            throw createHttpError(400, 'Niepoprawne ID fiszki');
        }

        const { errors, value } = validateFlashcardPayload(req.body);
        if (errors.length) {
            throw createHttpError(400, 'Niepoprawne dane wejściowe', errors);
        }

        const [updateResult] = await db.query(
            `UPDATE flashcards SET area = ?, era = ?, question = ?, answers = ?, ${correctAnswerColumn} = ? WHERE id = ?`,
            [value.area, value.era, value.question, JSON.stringify(value.answers), value.correctAnswer, id]
        );

        if (!updateResult.affectedRows) {
            throw createHttpError(404, 'Fiszka nie istnieje');
        }

        const [rows] = await db.query('SELECT * FROM flashcards WHERE id = ? LIMIT 1', [id]);
        return res.json(normalizeRow(rows[0]));
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id < 1) {
            throw createHttpError(400, 'Niepoprawne ID fiszki');
        }

        const [result] = await db.query('DELETE FROM flashcards WHERE id = ?', [id]);
        if (!result.affectedRows) {
            throw createHttpError(404, 'Fiszka nie istnieje');
        }

        return res.status(204).send();
    } catch (err) {
        next(err);
    }
});

module.exports = router;
