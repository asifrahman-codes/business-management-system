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

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/unauthorized"
          element={<UnauthorizedPage />}
        />

        <Route element={<ProtectedRoute />}>
  <Route element={<AppLayout />}>
    <Route
      path="/dashboard"
      element={<DashboardPage />}
    />

    <Route
      element={
        <RoleRoute
          allowedRoles={[USER_ROLES.ADMIN]}
        />
      }
    >
      {/* Admin routes */}
<Route
  element={
    <RoleRoute
      allowedRoles={[USER_ROLES.ADMIN]}
    />
  }
>
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
</Route>

<Route
  element={
    <RoleRoute
      allowedRoles={[USER_ROLES.ADMIN]}
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
</Route>
<Route
  path="/inventory"
  element={<InventoryPage />}
/>
<Route
  path="/inventory/transactions"
  element={<InventoryTransactionsPage />}
/>
    </Route>

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
      {/* Admin + Cashier routes */}
    </Route>
  </Route>
</Route>

        <Route
          path="*"
          element={<NotFoundPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;