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

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

import { USER_ROLES } from "../config/constants";

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
          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />

          {/* Admin-only routes will be added here later */}
          <Route element={<RoleRoute allowedRoles={[USER_ROLES.ADMIN]} />}>
            {/* Future admin pages */}
          </Route>

          {/* Admin + Cashier routes will be added here later */}
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
            {/* Future shared routes */}
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