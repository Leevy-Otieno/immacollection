const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const connectDB = require("./config/db");
const router = require("./routes");

const app = express();

// Allowed frontend origins for CORS
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://immacollection.vercel.app",
  "https://joyce-perfumier-hcc9-sable.vercel.app",
  "http://localhost:5173",
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, curl, or M-Pesa callbacks)
    if (!origin) return callback(null, true);

    if (!allowedOrigins.includes(origin)) {
      return callback(null, false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

// Root route to prevent "Cannot GET /" error on backend deployment
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Immacollection Backend API is running successfully!",
  });
});

// API routes
app.use("/api", router);

const PORT = process.env.PORT || 8080;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Connected to DB");
    console.log("Server is running on port " + PORT);
  });
});

// Global safety nets to prevent server crashes on unexpected errors
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});
