import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const NAV = [
  { to: "/dashboard", icon: GridIcon, label: "Dashboard" },
  { to: "/records", icon: ListIcon, label: "Records" },
  { to: "/users", icon: UsersIcon, label: "Users", adminOnly: true },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/login");
  };

  const roleBadgeClass =
    {
      admin: "badge-purple",
      analyst: "badge-blue",
      viewer: "badge-amber",
    }[user?.role] || "badge-amber";

  return (
    <div className="flex h-screen overflow-hidden bg-bg-primary">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-bg-secondary border-r border-bg-border flex flex-col">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-bg-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent-blue flex items-center justify-center">
              <span className="text-white font-bold text-sm font-mono">F</span>
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-none">
                FinanceOS
              </p>
              <p className="text-gray-500 text-xs mt-0.5">Dashboard</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ to, icon: Icon, label, adminOnly }) => {
            if (adminOnly && user?.role !== "admin") return null;
            return (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-accent-blue text-white"
                      : "text-gray-400 hover:text-white hover:bg-bg-hover"
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            );
          })}
        </nav>

        {/* User section */}
        <div className="px-3 py-4 border-t border-bg-border">
          <div className="px-3 py-3 rounded-xl bg-bg-card border border-bg-border">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                <span className="text-indigo-400 text-xs font-semibold">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {user?.name}
                </p>
                <p className="text-gray-500 text-xs truncate">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={roleBadgeClass}>{user?.role}</span>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-400 transition-colors text-xs flex items-center gap-1"
              >
                <LogoutIcon size={12} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

/* ── Inline SVG icons ── */
function GridIcon({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}
function ListIcon({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}
function UsersIcon({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function LogoutIcon({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
