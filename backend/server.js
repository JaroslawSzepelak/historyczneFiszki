// server.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const flashcardsRoutes = require("./routes/flashcards");
const authRoutes = require("./routes/auth");
const db = require("./db"); // <-- import puli połączeń

const app = express();
const isProduction = process.env.NODE_ENV === "production";

const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = (process.env.CORS_ORIGINS || "")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);

        if (!origin || !allowedOrigins.length || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Origin not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: "50kb" }));
app.use(morgan(isProduction ? "combined" : "dev"));

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX || 300),
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Zbyt wiele zapytań. Spróbuj ponownie za chwilę." }
});

app.use("/api", apiLimiter);


// -----------------------------------------
// 🔍 TEST POŁĄCZENIA Z BAZĄ MySQL
// -----------------------------------------
async function testConnection() {
    try {
        const [rows] = await db.query("SELECT 1 + 1 AS result");
        console.log("✔️ Połączenie z MySQL działa! Wynik:", rows[0].result);
    } catch (err) {
        console.error("❌ Błąd połączenia z MySQL:", err);
    }
}

testConnection();

app.get("/api/health", async(_req, res, next) => {
    try {
        await db.query("SELECT 1");
        res.json({
            ok: true,
            service: "historyczne-fiszki-backend",
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        next(err);
    }
});



// -----------------------------------------
// 📌 Endpointy główne aplikacji
// -----------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/flashcards", flashcardsRoutes);
app.use("/flashcards", flashcardsRoutes);

app.use((_req, res) => {
    res.status(404).json({ error: "Endpoint nie istnieje" });
});

app.use((err, _req, res, _next) => {
    const status = err.status || 500;
    const payload = {
        error: err.message || "Wewnętrzny błąd serwera"
    };

    if (err.details) {
        payload.details = err.details;
    }

    if (!isProduction) {
        payload.stack = err.stack;
    }

    if (status >= 500) {
        console.error(err);
    }

    res.status(status).json(payload);
});

// -----------------------------------------
// 🚀 Start serwera
// -----------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Backend działa na porcie " + PORT);
});