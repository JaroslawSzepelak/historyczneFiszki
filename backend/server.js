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


// -----------------------------------------
// 🔍 Testowy endpoint do sprawdzenia działania API
// -----------------------------------------
app.get("/test-db", async(req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM flashcards LIMIT 2");

        res.json({
            message: "Połączenie OK",
            data: rows
        });
    } catch (err) {
        res.status(500).json({
            message: "Błąd w zapytaniu",
            error: err.message
        });
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