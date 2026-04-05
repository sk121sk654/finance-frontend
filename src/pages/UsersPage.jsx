import { useState, useEffect } from "react";
import { usersAPI } from "../services/api";
import ConfirmModal from "../components/ConfirmModal";
import toast from "react-hot-toast";
import { format } from "date-fns";

const ROLES = ["viewer", "analyst", "admin"];

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await usersAPI.getAll();
      // handle both { users: [...] } and direct array
      const data = res.data?.users || res.data || [];
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleRoleChange = async (id, role) => {
    try {
      await usersAPI.updateRole(id, role);
      toast.success("Role updated");
      load();
    } catch {
      toast.error("Failed to update role");
    }
  };

  const handleStatusToggle = async (user) => {
    try {
      const newStatus = user.status === "active" ? "inactive" : "active";
      await usersAPI.updateStatus(user._id, newStatus);
      toast.success(
        `User ${newStatus === "active" ? "activated" : "deactivated"}`,
      );
      load();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    try {
      await usersAPI.delete(deleteId);
      toast.success("User deleted");
      setDeleteId(null);
      load();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Users</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {users.length} registered users
          </p>
        </div>
        <span className="badge-purple">Admin only</span>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-bg-border">
                <th className="text-left px-5 py-3.5 text-gray-400 font-medium">
                  User
                </th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-medium">
                  Role
                </th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-medium">
                  Status
                </th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-medium">
                  Joined
                </th>
                <th className="px-5 py-3.5 text-gray-400 font-medium text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <div className="w-5 h-5 border-2 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              )}
              {!loading && users.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
              {!loading &&
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-bg-border last:border-0 hover:bg-bg-hover transition-colors"
                  >
                    {/* User info */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                          <span className="text-indigo-400 text-xs font-semibold">
                            {user.name?.[0]?.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.name}</p>
                          <p className="text-gray-500 text-xs">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role selector */}
                    <td className="px-5 py-3.5">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value)
                        }
                        className="bg-bg-secondary border border-bg-border text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-accent-blue transition-colors"
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Status toggle */}
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => handleStatusToggle(user)}
                        className={`badge cursor-pointer hover:opacity-80 transition-opacity ${
                          user.status === "active" ? "badge-green" : "badge-red"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 inline-block ${
                            user.status === "active"
                              ? "bg-green-400"
                              : "bg-red-400"
                          }`}
                        />
                        {user.status}
                      </button>
                    </td>

                    {/* Joined */}
                    <td className="px-5 py-3.5 text-gray-400 text-xs font-mono">
                      {user.createdAt
                        ? format(new Date(user.createdAt), "dd MMM yyyy")
                        : "—"}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => setDeleteId(user._id)}
                          className="text-gray-500 hover:text-red-400 transition-colors p-1"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role stats */}
      <div className="grid grid-cols-3 gap-4">
        {ROLES.map((role) => {
          const count = users.filter((u) => u.role === role).length;
          const cls = {
            admin: "badge-purple",
            analyst: "badge-blue",
            viewer: "badge-amber",
          }[role];
          return (
            <div key={role} className="card p-4 flex items-center gap-4">
              <span className={cls}>{role}</span>
              <span className="text-white font-semibold text-lg">{count}</span>
              <span className="text-gray-500 text-sm">
                user{count !== 1 ? "s" : ""}
              </span>
            </div>
          );
        })}
      </div>

      {deleteId && (
        <ConfirmModal
          message="Delete this user permanently?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}

function TrashIcon() {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}
