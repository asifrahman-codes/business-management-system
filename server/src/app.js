const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

const authRoutes = require("./routes/auth.Routes");
const userRoutes = require("./routes/user.routes");
const errorMiddleware = require("./middleware/error.middleware");
const AppError = require("./utils/app-error.util");

const supplierRoutes = require("./routes/supplier.routes");

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
app.use("/api/users", userRoutes);

app.use(
  "/api/suppliers",
  supplierRoutes
);

app.use((req, res, next) => {
  next(
    new AppError(
      `Route not found: ${req.method} ${req.originalUrl}`,
      404
    )
  );
});

app.use(errorMiddleware);

module.exports = app;