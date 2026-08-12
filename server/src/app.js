const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

const authRoutes = require("./routes/auth.Routes");

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  const databaseStatus =
    mongoose.connection.readyState === 1
      ? "connected"
      : "disconnected";

  res.status(200).json({
    success: true,
    message: "Business Management API is running",
    database: databaseStatus,
  });
});

app.use("/api/auth", authRoutes);

module.exports = app;