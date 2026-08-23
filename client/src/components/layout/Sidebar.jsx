import { NavLink } from "react-router-dom";
import {
  BarChart3,
  Box,
  ClipboardList,
  LayoutDashboard,
  ShoppingCart,
  Users,
  Wallet,
  X,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";
import { USER_ROLES } from "../../config/constants";

const navigation = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    roles: [USER_ROLES.ADMIN, USER_ROLES.CASHIER],
  },
  {
    label: "POS",
    path: "/pos",
    icon: ShoppingCart,
    roles: [USER_ROLES.ADMIN, USER_ROLES.CASHIER],
  },
  {
    label: "Products",
    path: "/products",
    icon: Box,
    roles: [USER_ROLES.ADMIN],
  },
  {
    label: "Inventory",
    path: "/inventory",
    icon: ClipboardList,
    roles: [USER_ROLES.ADMIN],
  },
  {
    label: "Employees",
    path: "/employees",
    icon: Users,
    roles: [USER_ROLES.ADMIN],
  },
  {
    label: "Finance",
    path: "/finance",
    icon: Wallet,
    roles: [USER_ROLES.ADMIN],
  },
  {
    label: "Reports",
    path: "/reports",
    icon: BarChart3,
    roles: [USER_ROLES.ADMIN],
  },
];

function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();

  const userRole = user?.role?.toUpperCase();

  const visibleNavigation = navigation.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64
          transform bg-white shadow-xl
          transition-transform duration-300
          lg:static lg:translate-x-0 lg:shadow-none
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b px-5">
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                BMS
              </h1>

              <p className="text-xs text-gray-500">
                Business Management
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {visibleNavigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `
                    flex items-center gap-3 rounded-lg px-4 py-3
                    text-sm font-medium transition
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }
                    `
                  }
                >
                  <Icon size={19} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;