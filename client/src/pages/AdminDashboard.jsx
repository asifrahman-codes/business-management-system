import { useNavigate } from "react-router-dom";

import useAuth from "../hooks/use-auth";

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <p>
        Welcome, {user?.name}
      </p>

      <p>
        Role: {user?.role}
      </p>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default AdminDashboard;