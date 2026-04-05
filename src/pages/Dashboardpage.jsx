import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { dashboardAPI } from "../services/api";
import { format } from "date-fns";

const CATEGORY_COLORS = [
  "#6366f1",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#a855f7",
  "#06b6d4",
  "#ec4899",
];

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [byCategory, setByCategory] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, t, c, r] = await Promise.all([
          dashboardAPI.getSummary(),
          dashboardAPI.getTrends(),
          dashboardAPI.getByCategory(),
          dashboardAPI.getRecent(),
        ]);
        setSummary(s.data);
        setTrends(t.data.trends || []);
        setByCategory(c.data.data || []);
        setRecent(r.data.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-semibold text-white">Overview</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Your financial summary at a glance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Total Income"
          value={summary?.totalIncome || 0}
          change={summary?.incomeChange}
          color="green"
          icon={<IncomeIcon />}
        />
        <StatCard
          label="Total Expense"
          value={summary?.totalExpense || 0}
          change={summary?.expenseChange}
          color="red"
          icon={<ExpenseIcon />}
        />
        <StatCard
          label="Net Balance"
          value={summary?.netBalance || 0}
          change={summary?.balanceChange}
          color="blue"
          icon={<BalanceIcon />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-5 lg:col-span-2">
          <h2 className="text-sm font-medium text-white mb-4">
            Monthly Trends
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={trends} barGap={4}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#232738"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: "#6b7280", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="income"
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
                name="Income"
              />
              <Bar
                dataKey="expense"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
                name="Expense"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h2 className="text-sm font-medium text-white mb-4">By Category</h2>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={byCategory}
                dataKey="total"
                nameKey="_id"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
              >
                {byCategory.map((_, i) => (
                  <Cell
                    key={i}
                    fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {byCategory.slice(0, 4).map((c, i) => (
              <div key={c._id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{
                      background: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                    }}
                  />
                  <span className="text-gray-400 text-xs capitalize">
                    {c._id}
                  </span>
                </div>
                <span className="text-white text-xs font-mono">
                  ₹{c.total?.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="text-sm font-medium text-white mb-4">
          Recent Transactions
        </h2>
        <div className="space-y-2">
          {recent.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-6">
              No recent transactions
            </p>
          )}
          {recent.map((tx) => (
            <div
              key={tx._id}
              className="flex items-center justify-between py-2.5 border-b border-bg-border last:border-0"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${tx.type === "income" ? "bg-green-500/10" : "bg-red-500/10"}`}
                >
                  {tx.type === "income" ? (
                    <IncomeIcon small />
                  ) : (
                    <ExpenseIcon small />
                  )}
                </div>
                <div>
                  <p className="text-white text-sm font-medium capitalize">
                    {tx.category}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {tx.notes || "No notes"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm font-mono font-medium ${tx.type === "income" ? "text-green-400" : "text-red-400"}`}
                >
                  {tx.type === "income" ? "+" : "-"}₹
                  {tx.amount?.toLocaleString()}
                </p>
                <p className="text-gray-600 text-xs">
                  {tx.date ? format(new Date(tx.date), "MMM d") : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, change, color, icon }) {
  const borderColors = {
    green: "border-l-green-500",
    red: "border-l-red-500",
    blue: "border-l-indigo-500",
  };
  const textColors = {
    green: "text-green-400",
    red: "text-red-400",
    blue: "text-indigo-400",
  };
  const isPositive = (change || 0) >= 0;
  return (
    <div className={`card p-5 border-l-2 ${borderColors[color]}`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-gray-400 text-sm">{label}</p>
        <div className={`${textColors[color]} opacity-70`}>{icon}</div>
      </div>
      <p className="text-2xl font-semibold text-white font-mono">
        ₹{value?.toLocaleString()}
      </p>
      {change != null && (
        <p
          className={`text-xs mt-1.5 ${isPositive ? "text-green-400" : "text-red-400"}`}
        >
          {isPositive ? "↑" : "↓"} {Math.abs(change)}% vs last month
        </p>
      )}
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-bg-card border border-bg-border rounded-xl px-3 py-2 text-xs shadow-xl">
      {label && <p className="text-gray-400 mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || p.fill }}>
          {p.name}: ₹{p.value?.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

function IncomeIcon({ small }) {
  const s = small ? 14 : 18;
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#22c55e"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function ExpenseIcon({ small }) {
  const s = small ? 14 : 18;
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#ef4444"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </svg>
  );
}

function BalanceIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#6366f1"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
