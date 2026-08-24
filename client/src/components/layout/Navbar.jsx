import {
  Menu,
  LogOut,
  UserCircle,
  Moon,
  Sun,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";

import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [darkMode, setDarkMode] =
    useState(() => {
      return localStorage.getItem(
        "theme"
      ) === "dark";
    });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add(
        "dark"
      );

      localStorage.setItem(
        "theme",
        "dark"
      );
    } else {
      document.documentElement.classList.remove(
        "dark"
      );

      localStorage.setItem(
        "theme",
        "light"
      );
    }
  }, [darkMode]);

  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true,
    });
  };

  const toggleDarkMode = () => {
    setDarkMode(
      (currentMode) => !currentMode
    );
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 sm:px-6 dark:border-gray-700 dark:bg-gray-900">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <Menu size={22} />
      </button>

      <div className="hidden lg:block">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Business Management System
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleDarkMode}
          title={
            darkMode
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
          className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          {darkMode ? (
            <Sun size={20} />
          ) : (
            <Moon size={20} />
          )}
        </button>

        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {user?.name || "User"}
          </p>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            {user?.role || ""}
          </p>
        </div>

        <UserCircle
          size={34}
          className="text-gray-500 dark:text-gray-400"
        />

        <button
          type="button"
          onClick={handleLogout}
          title="Logout"
          className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}

export default Navbar;