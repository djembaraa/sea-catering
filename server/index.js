// server/index.js

const express = require("express");
const mongoose = require("mongoose"); // Kita gunakan mongoose
const cors = require("cors");
require("dotenv").config(); // Untuk memuat file .env
const Subscription = require("./models/subscription.model");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Agar server bisa menerima body JSON dari form

// --- KONEKSI KE DATABASE MONGODB ---
// Ambil Connection String dari .env
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error("FATAL ERROR: MONGO_URI is not defined in .env file");
  process.exit(1); // Keluar dari aplikasi jika URI tidak ada
}

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("✅ MongoDB connected successfully!");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Keluar dari aplikasi jika koneksi gagal
  });
// ------------------------------------

// Definisikan Routes
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to SEA Catering API!" });
});
// Gunakan Auth Routes
app.use("/api/auth", require("./routes/auth"));

app.use("/api/subscriptions", require("./routes/subscriptions"));

app.use("/api/testimonials", require("./routes/testimonials"));

app.use("/api/admin", require("./routes/admin"));

// Di sini nanti kita akan menambahkan API untuk subscription, user, dll.

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
