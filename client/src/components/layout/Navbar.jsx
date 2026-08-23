import { Menu, LogOut, UserCircle } from "lucide-react";

import useAuth from "../../hooks/useAuth";

import { useNavigate } from "react-router-dom";

function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();

    navigate("/login", {
    replace: true,
  });
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
      >
        <Menu size={22} />
      </button>

      <div className="hidden lg:block">
        <h2 className="text-lg font-semibold text-gray-800">
          Business Management System
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-gray-900">
            {user?.name || "User"}
          </p>

          <p className="text-xs text-gray-500">
            {user?.role || ""}
          </p>
        </div>

        <UserCircle
          size={34}
          className="text-gray-500"
        />

        <button
          type="button"
          onClick={handleLogout}
          title="Logout"
          className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}

export default Navbar;