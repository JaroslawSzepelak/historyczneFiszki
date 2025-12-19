// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const flashcardsRoutes = require("./routes/flashcards");
const db = require("./db"); // <-- import puli połączeń

const app = express();
app.use(cors());
app.use(express.json());


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

app.get("/api/flashcards", async(req, res) => {
    const { area, era } = req.query;

    let sql = "SELECT * FROM flashcards WHERE 1=1";
    const params = [];

    if (area) {
        sql += " AND area = ?";
        params.push(area);
    }

    if (era) {
        sql += " AND era = ?";
        params.push(era);
    }

    try {
        const [rows] = await db.query(sql, params);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Błąd zapytania do bazy" });
    }
});



// -----------------------------------------
// 📌 Endpointy główne aplikacji
// -----------------------------------------
app.use("/flashcards", flashcardsRoutes);


// -----------------------------------------
// 🚀 Start serwera
// -----------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Backend działa na porcie " + PORT);
});