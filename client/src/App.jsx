import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import CashierDashboard from "./pages/CashierDashboard";
import Unauthorized from "./pages/Unauthorized";

import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";

import PublicRoute from "./routes/PublicRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}

        <Route element={<PublicRoute />}>
        <Route
        path="/login"
        element={<Login />}
        />
      </Route>

        <Route
          path="/unauthorized"
          element={<Unauthorized />}
        />


        {/* Protected Routes */}

        <Route element={<ProtectedRoute />}>

          {/* Admin Routes */}

          <Route element={<RoleRoute allowedRoles={["admin"]} />}>

            <Route
              path="/admin"
              element={<AdminDashboard />}
            />

          </Route>


          {/* Cashier Routes */}

          <Route element={<RoleRoute allowedRoles={["cashier"]} />}>

            <Route
              path="/cashier"
              element={<CashierDashboard />}
            />

          </Route>

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;