require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");

const app = express();
const port = 3000;

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
  console.log("Connected to MySQL database.");
});

// Health check endpoint
app.get("/health", (req, res) => {
  db.ping((err) => {
    if (err) {
      res.status(500).json({ status: "DOWN", error: err });
    } else {
      res.json({ status: "UP" });
    }
  });
});

// Users endpoint
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      res.status(500).json({ error: "Database query failed" });
    } else {
      res.json(results);
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
