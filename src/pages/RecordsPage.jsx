import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRecords } from "../hooks/useRecords";
import RecordModal from "../components/RecordModal";
import ConfirmModal from "../components/ConfirmModal";
import { format } from "date-fns";

const CATEGORIES = [
  "salary",
  "freelance",
  "investment",
  "food",
  "transport",
  "housing",
  "entertainment",
  "health",
  "education",
  "other",
];

export default function RecordsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [filters, setFilters] = useState({
    type: "",
    category: "",
    search: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const {
    records,
    loading,
    total,
    page,
    setPage,
    limit,
    createRecord,
    updateRecord,
    deleteRecord,
  } = useRecords(filters);

  const totalPages = Math.ceil(total / limit) || 1;

  const handleFilter = (key, val) => {
    setFilters((f) => ({ ...f, [key]: val }));
    setPage(1);
  };

  const handleSave = async (data) => {
    try {
      if (editRecord) await updateRecord(editRecord._id, data);
      else await createRecord(data);
      setShowModal(false);
      setEditRecord(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = (rec) => {
    setEditRecord(rec);
    setShowModal(true);
  };

  const handleDeleteConfirm = async () => {
    await deleteRecord(deleteId);
    setDeleteId(null);
  };

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Records</h1>
          <p className="text-gray-500 text-sm mt-0.5">{total} total entries</p>
        </div>
        {isAdmin && (
          <button
            className="btn-primary"
            onClick={() => {
              setEditRecord(null);
              setShowModal(true);
            }}
          >
            <PlusIcon /> Add Record
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search notes..."
          className="input-field flex-1 min-w-[180px]"
          value={filters.search}
          onChange={(e) => handleFilter("search", e.target.value)}
        />
        <select
          className="input-field w-36"
          value={filters.type}
          onChange={(e) => handleFilter("type", e.target.value)}
        >
          <option value="">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select
          className="input-field w-40"
          value={filters.category}
          onChange={(e) => handleFilter("category", e.target.value)}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {(filters.type || filters.category || filters.search) && (
          <button
            className="btn-ghost"
            onClick={() => setFilters({ type: "", category: "", search: "" })}
          >
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-bg-border">
                <th className="text-left px-5 py-3.5 text-gray-400 font-medium">
                  Date
                </th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-medium">
                  Type
                </th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-medium">
                  Category
                </th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-medium">
                  Notes
                </th>
                <th className="text-right px-5 py-3.5 text-gray-400 font-medium">
                  Amount
                </th>
                {isAdmin && (
                  <th className="px-5 py-3.5 text-gray-400 font-medium text-center">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="text-center py-12">
                    <div className="w-5 h-5 border-2 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              )}
              {!loading && records.length === 0 && (
                <tr>
                  <td
                    colSpan={isAdmin ? 6 : 5}
                    className="text-center py-12 text-gray-500"
                  >
                    No records found
                  </td>
                </tr>
              )}
              {!loading &&
                records.map((rec) => (
                  <tr
                    key={rec._id}
                    className="border-b border-bg-border last:border-0 hover:bg-bg-hover transition-colors"
                  >
                    <td className="px-5 py-3.5 text-gray-400 font-mono text-xs">
                      {rec.date
                        ? format(new Date(rec.date), "dd MMM yyyy")
                        : "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={
                          rec.type === "income" ? "badge-green" : "badge-red"
                        }
                      >
                        {rec.type}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="badge-blue capitalize">
                        {rec.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-300 max-w-[200px] truncate">
                      {rec.notes || <span className="text-gray-600">—</span>}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono font-medium">
                      <span
                        className={
                          rec.type === "income"
                            ? "text-green-400"
                            : "text-red-400"
                        }
                      >
                        {rec.type === "income" ? "+" : "-"}₹
                        {rec.amount?.toLocaleString()}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(rec)}
                            className="text-gray-500 hover:text-white transition-colors p-1"
                          >
                            <EditIcon />
                          </button>
                          <button
                            onClick={() => setDeleteId(rec._id)}
                            className="text-gray-500 hover:text-red-400 transition-colors p-1"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-bg-border">
            <p className="text-gray-500 text-xs">
              Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)}{" "}
              of {total}
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 text-xs rounded-lg bg-bg-secondary border border-bg-border text-gray-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                ← Prev
              </button>
              {Array.from(
                { length: Math.min(totalPages, 5) },
                (_, i) => i + 1,
              ).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 text-xs rounded-lg transition-all ${
                    p === page
                      ? "bg-accent-blue text-white"
                      : "bg-bg-secondary border border-bg-border text-gray-400 hover:text-white"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 text-xs rounded-lg bg-bg-secondary border border-bg-border text-gray-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <RecordModal
          record={editRecord}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setEditRecord(null);
          }}
        />
      )}
      {deleteId && (
        <ConfirmModal
          message="Are you sure you want to delete this record?"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}

function PlusIcon() {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
function EditIcon() {
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
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
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
