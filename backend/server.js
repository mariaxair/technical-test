import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import historyRoutes from "./src/Routes/historyRoutes.js";
import emailRoutes from "./src/Routes/emailRoutes.js";
import templateRoutes from "./src/Routes/templateRoutes.js";
import recipientRoutes from "./src/Routes/recipientRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "bulk_email_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Make pool available to routes
app.locals.db = pool;

// Routes

app.use("/api/templates", templateRoutes);
app.use("/api/recipients", recipientRoutes);
app.use("/api/emails", emailRoutes);
app.use("/api/history", historyRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ error: "Something went wrong!", message: err.message });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
