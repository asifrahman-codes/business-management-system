const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const errorMiddleware = require("./middleware/error.middleware");
const AppError = require("./utils/app-error.util");

const categoryRoutes = require("./routes/category.routes");

const supplierRoutes = require("./routes/supplier.routes");

const productRoutes = require("./routes/product.routes");
const inventoryTransactionRoutes =
  require(
    "./routes/inventory-transaction.routes"
  );

const expenseRoutes = require(
  "./routes/expense.routes"
);

const employeeRoutes = require(
  "./routes/employee.routes"
);

const salaryPaymentRoutes =
  require(
    "./routes/salary-payment.routes"
  );

const dashboardRoutes =
  require(
    "./routes/dashboard.routes"
  );

const reportRoutes =
  require(
    "./routes/report.routes"
  );

const saleRoutes =
  require(
    "./routes/sale.routes"
  );

const settingsRoutes =
  require(
    "./routes/settings.routes"
  );


app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
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

app.use("/api/categories", categoryRoutes);

app.use(
  "/api/suppliers",
  supplierRoutes
);

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/inventory-transactions",
  inventoryTransactionRoutes
);

app.use(
  "/api/expenses",
  expenseRoutes
);

app.use(
  "/api/employees",
  employeeRoutes
);

app.use(
  "/api/salary-payments",
  salaryPaymentRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(
  "/api/reports",
  reportRoutes
);

app.use(
  "/api/sales",
  saleRoutes
);

app.use(
  "/api/settings",
  settingsRoutes
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