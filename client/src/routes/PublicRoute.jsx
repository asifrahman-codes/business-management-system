import { Navigate, Outlet } from "react-router-dom";

import useAuth from "../hooks/use-auth";

const PublicRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    if (user.role === "cashier") {
      return <Navigate to="/cashier" replace />;
    }
  }

  return <Outlet />;
};

export default PublicRoute;