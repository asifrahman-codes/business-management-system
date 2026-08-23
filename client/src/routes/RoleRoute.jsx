import { Navigate, Outlet } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import { USER_ROLES } from "../config/constants";

function RoleRoute({ allowedRoles }) {
  const { user } = useAuth();

  const userRole = user?.role?.toUpperCase();

  const normalizedRoles = allowedRoles.map((role) =>
    role.toUpperCase()
  );

  if (!user || !normalizedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

export default RoleRoute;