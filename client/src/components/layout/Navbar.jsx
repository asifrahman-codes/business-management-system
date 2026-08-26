// Navbar.jsx
import { Menu, LogOut, Moon, Sun } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const toggleDarkMode = () => setDarkMode((m) => !m);

  const initials = (user?.name || "User")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const iconBtn =
    "inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-md sm:px-6 dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onMenuClick} className={`${iconBtn} lg:hidden`}>
          <Menu size={20} />
        </button>
        <h2 className="hidden text-[15px] font-semibold tracking-tight text-slate-900 lg:block dark:text-white">
          Business Management System
        </h2>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleDarkMode}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          className={iconBtn}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="mx-1 hidden h-6 w-px bg-slate-200 sm:block dark:bg-slate-800" />

        <div className="flex items-center gap-3 rounded-lg py-1 pl-1 pr-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white ring-2 ring-white dark:ring-slate-900">
            {initials}
          </div>
          <div className="hidden leading-tight sm:block">
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              {user?.name || "User"}
            </p>
            <p className="text-xs capitalize text-slate-500 dark:text-slate-400">
              {user?.role || ""}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          title="Logout"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:text-slate-400 dark:hover:bg-red-950/40 dark:hover:text-red-400"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}

export default Navbar;
