import { NavLink } from "react-router-dom";
import {
  BarChart3,
  Box,
  Boxes,
  ClipboardList,
  LayoutDashboard,
  ShoppingCart,
  Users,
  Wallet,
  X,
  History,
  BadgePercent,
  Settings,
  Receipt,
  Package,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { USER_ROLES } from "../../config/constants";
import logoImage from "../../assets/bms.png";

const ALL = [
  USER_ROLES.ADMIN,
  USER_ROLES.CASHIER,
];

const ADMIN = [
  USER_ROLES.ADMIN,
];

const navigationGroups = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
        roles: ALL,
      },
      {
        label: "POS",
        path: "/pos",
        icon: ShoppingCart,
        roles: ALL,
      },
    ],
  },
  {
    title: "Catalog",
    items: [
      {
        label: "Products",
        path: "/products",
        icon: Box,
        roles: ADMIN,
      },
      {
        label: "Categories",
        path: "/Categories",
        icon: Boxes,
        roles: ADMIN,
      },
      {
        label: "Suppliers",
        path: "/Suppliers",
        icon: Package,
        roles: ADMIN,
      },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        label: "Inventory",
        path: "/inventory",
        icon: ClipboardList,
        roles: ADMIN,
      },
      {
        label: "Transactions",
        path: "/inventory/transactions",
        icon: History,
        roles: ADMIN,
      },
      {
        label: "Sales",
        path: "/Sales",
        icon: BadgePercent,
        roles: ALL,
      },
    ],
  },
  {
    title: "People",
    items: [
      {
        label: "Employees",
        path: "/employees",
        icon: Users,
        roles: ADMIN,
      },
    ],
  },
  {
    title: "Finance",
    items: [
      {
        label: "Expenses",
        path: "/Expenses",
        icon: Receipt,
        roles: ADMIN,
      },
      {
        label: "Salary Payments",
        path: "/salary-payments",
        icon: Wallet,
        roles: ADMIN,
      },
      {
        label: "Reports",
        path: "/reports",
        icon: BarChart3,
        roles: ADMIN,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        label: "Settings",
        path: "/settings",
        icon: Settings,
        roles: ADMIN,
      },
    ],
  },
];

function Sidebar({
  isOpen,
  onClose,
}) {
  const { user } = useAuth();
  const userRole = user?.role;

  const groups = navigationGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        item.roles.includes(userRole)
      ),
    }))
    .filter((group) =>
      group.items.length > 0
    );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-slate-200 bg-white transition-transform duration-300 ease-out lg:static lg:translate-x-0 dark:border-slate-800 dark:bg-slate-900 ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Brand */}
          <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white shadow-sm shadow-indigo-600/30 overflow-hidden">
                <img
                  src={logoImage}
                  alt="Logo"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="leading-tight">
                <h1 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                  BMS
                </h1>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Business Management
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
            {groups.map((group) => (
              <div key={group.title}>
                <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400 dark:text-slate-500">
                  {group.title}
                </p>

                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;

                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        end={item.path === "/inventory"}
                        className={({ isActive }) =>
                          `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                            isActive
                              ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300"
                              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <span
                              className={`absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-indigo-600 transition-opacity dark:bg-indigo-400 ${
                                isActive
                                  ? "opacity-100"
                                  : "opacity-0"
                              }`}
                            />

                            <Icon
                              size={18}
                              strokeWidth={
                                isActive
                                  ? 2.3
                                  : 1.9
                              }
                            />

                            <span className="truncate">
                              {item.label}
                            </span>
                          </>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t border-slate-200 p-4 dark:border-slate-800">
            <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800/60">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-[11px] font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                {(user?.name || "U")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>

              <div className="min-w-0 leading-tight">
                <p className="truncate text-xs font-medium text-slate-900 dark:text-white">
                  {user?.name || "User"}
                </p>

                <p className="truncate text-[11px] capitalize text-slate-500 dark:text-slate-400">
                  {user?.role || ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;