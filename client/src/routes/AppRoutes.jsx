import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import NotFoundPage from "../pages/NotFoundPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";

import AppLayout from "../components/layout/AppLayout";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

import { USER_ROLES } from "../config/constants";

import ProductsPage from "../pages/products/ProductsPage";
import ProductFormPage from "../pages/products/ProductFormPage";
import ProductDetailsPage from "../pages/products/ProductDetailsPage";

import CategoriesPage from "../pages/categories/CategoriesPage";
import CategoryFormPage from "../pages/categories/CategoryFormPage";

import SuppliersPage from "../pages/suppliers/SuppliersPage";
import SupplierFormPage from "../pages/suppliers/SupplierFormPage";

import InventoryPage from "../pages/inventory/InventoryPage";
import InventoryTransactionsPage from "../pages/inventory/InventoryTransactionsPage";

import PosPage from "../pages/pos/PosPage";

import SalesPage from "../pages/sales/SalesPage";
import SaleDetailsPage from "../pages/sales/SaleDetailsPage";

import EmployeesPage from "../pages/employees/EmployeesPage";

import SalaryPaymentsPage from "../pages/salary/SalaryPaymentsPage";

import ReportsPage from "../pages/reports/ReportsPage";

import FinancePage from "../pages/finance/FinancePage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/unauthorized"
          element={<UnauthorizedPage />}
        />

        {/* Protected routes */}

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>

            {/* Dashboard */}

            <Route
              path="/dashboard"
              element={<DashboardPage />}
            />

            {/* Admin routes */}

            <Route
              element={
                <RoleRoute
                  allowedRoles={[
                    USER_ROLES.ADMIN,
                  ]}
                />
              }
            >
              {/* Products */}

              <Route
                path="/products"
                element={<ProductsPage />}
              />

              <Route
                path="/products/new"
                element={<ProductFormPage />}
              />

              <Route
                path="/products/:id"
                element={<ProductDetailsPage />}
              />

              <Route
                path="/products/:id/edit"
                element={<ProductFormPage />}
              />

              {/* Categories */}

              <Route
                path="/categories"
                element={<CategoriesPage />}
              />

              <Route
                path="/categories/new"
                element={<CategoryFormPage />}
              />

              <Route
                path="/categories/:id/edit"
                element={<CategoryFormPage />}
              />

              {/* Suppliers */}

              <Route
                path="/suppliers"
                element={<SuppliersPage />}
              />

              <Route
                path="/suppliers/new"
                element={<SupplierFormPage />}
              />

              <Route
                path="/suppliers/:id/edit"
                element={<SupplierFormPage />}
              />

              {/* Inventory */}

              <Route
                path="/inventory"
                element={<InventoryPage />}
              />

              <Route
                path="/inventory/transactions"
                element={
                  <InventoryTransactionsPage />
                }
              />

              {/* Employees */}

              <Route
                path="/employees"
                element={<EmployeesPage />}
              />

              {/* Salary Payments */}

              <Route
                path="/salary-payments"
                element={
                  <SalaryPaymentsPage />
                }
              />

              <Route
              path="/reports"
              element={<ReportsPage />}
              />

              <Route
              path="/finance"
              element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <FinancePage />
                </ProtectedRoute>
              }
              />

            </Route>

            {/* Admin + Cashier routes */}

            <Route
              element={
                <RoleRoute
                  allowedRoles={[
                    USER_ROLES.ADMIN,
                    USER_ROLES.CASHIER,
                  ]}
                />
              }
            >
              {/* POS */}

              <Route
                path="/pos"
                element={<PosPage />}
              />

              {/* Sales */}

              <Route
                path="/sales"
                element={<SalesPage />}
              />

              <Route
                path="/sales/:id"
                element={<SaleDetailsPage />}
              />
            </Route>
          </Route>
        </Route>

        {/* 404 */}

        <Route
          path="*"
          element={<NotFoundPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;