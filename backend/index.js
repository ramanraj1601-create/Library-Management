const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express'); 
const app = express(); 
const cors = require('cors'); 
const mongoose = require("mongoose");
require('dotenv').config();
const users = require("./routes/user.js") 
const books = require("./routes/books.js")
const admin = require("./routes/admin.js")
const librarian = require("./routes/librarian.js")
const home = require("./routes/home.js")

const allowedOrigins = [
  "http://localhost:5173",
  "https://library-management-self-iota.vercel.app",
  "https://library-management-yaen.vercel.app",
  "https://library-management-7y9eezcwj-raman-guptas-projects-8c143760.vercel.app",
];

const normalizeOrigin = (origin) => origin?.replace(/\/$/, "");

app.use(express.json()); // Parse JSON
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(normalizeOrigin(origin))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use("/users",users);
app.use("/books",books);
app.use("/admin",admin);
app.use("/librarian",librarian);
app.use("/home",home);

app.get("/", (req, res) => {
    res.send("API is running...");
  });

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  res.status(err.status || 500).json({
    error: true,
    message: err.message || "Internal Server Error",
    details: err.details || err
  });
});

const PORT = process.env.PORT || 5000;

const uri = process.env.MONGO_URI;

mongoose.connect(uri)
  .then(() => console.log("DB Connected"))
  .catch((err) => {
    console.error("DB Connection Error:", err);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
