import { useEffect, useState } from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import {
  TrendingUp,
  Hash,
  Crown,
  Sparkles,
  PieChart as PieIcon,
  BarChart3,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";

import AppShell from "../components/AppShell.jsx";
import StatCard from "../components/StatCard.jsx";
import ExpenseForm from "../components/ExpenseForm.jsx";
import ExpenseTable from "../components/ExpenseTable.jsx";
import Skeleton from "../components/Skeleton.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Footer from "../components/Footer.jsx";
import { ChartTooltip } from "../components/ChartTooltip.jsx";

import api from "../api/axios";
import {
  CATEGORY_DOT,
  CHART_COLORS,
  currency,
} from "../lib/categories.js";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const EMPTY_SUMMARY = {
  grandTotal: 0,
  byCategory: [],
  monthly: [],
};

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(EMPTY_SUMMARY);

  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [hideAmounts, setHideAmounts] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch expenses and dashboard summary
  const load = async (silent = false) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const [expenseResponse, summaryResponse] = await Promise.all([
        api.get("/expenses"),
        api.get("/expenses/summary"),
      ]);

      setExpenses(expenseResponse.data);
      setSummary(summaryResponse.data);
      setError("");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to connect to the server. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Add a new expense
  const addExpense = async (payload) => {
    await api.post("/expenses", payload);
    await load();
  };

  // Update an existing expense
  const updateExpense = async (id, payload) => {
    await api.put(`/expenses/${id}`, payload);

    setEditing(null);
    await load();
  };

  // Delete an expense
  const deleteExpense = async (id) => {
    await api.delete(`/expenses/${id}`);

    if (editing?._id === id) {
      setEditing(null);
    }

    await load();
  };

  // Hide or show financial amounts
  const mask = (value) => {
    return hideAmounts ? "••••••" : value;
  };

  // Prepare category chart data
  const categoryData = summary.byCategory.map((category) => ({
    name: category.category,
    value: category.total,
    count: category.count,
    fill:
      CATEGORY_DOT[category.category] ||
      "#64748b",
  }));

  // Prepare monthly spending data
  const monthlyData = summary.monthly.map((month) => ({
    name: `${MONTHS[month.month - 1]} '${String(
      month.year
    ).slice(2)}`,
    total: month.total,
  }));

  // Calculate average expense
  const averageExpense = expenses.length
    ? Math.round(
        Number(summary.grandTotal) / expenses.length
      )
    : 0;

  // Find the highest spending category
  const topCategory = summary.byCategory[0];

  return (
    <AppShell
      title="Dashboard"
      subtitle="Track your expenses. Understand your spending."
      actions={
        <>
          <button
            className="btn btn--ghost btn--sm"
            onClick={() =>
              setHideAmounts((previous) => !previous)
            }
            title={
              hideAmounts
                ? "Show amounts"
                : "Hide amounts"
            }
            aria-label={
              hideAmounts
                ? "Show financial amounts"
                : "Hide financial amounts"
            }
          >
            {hideAmounts ? (
              <Eye size={15} />
            ) : (
              <EyeOff size={15} />
            )}

            <span className="btn__text">
              {hideAmounts ? "Show" : "Hide"}
            </span>
          </button>

          <button
            className="btn btn--ghost btn--sm"
            onClick={() => load(true)}
            disabled={refreshing}
          >
            <RefreshCw
              size={15}
              className={refreshing ? "spin" : ""}
            />

            <span className="btn__text">
              {refreshing ? "Refreshing..." : "Refresh"}
            </span>
          </button>
        </>
      }
    >
      {/* Error message */}
      {error && (
        <div
          className="alert alert--error"
          style={{ marginBottom: 20 }}
          role="alert"
        >
          <span>{error}</span>
        </div>
      )}

      {/* Dashboard welcome panel */}
      <section className="dashboard-hero">
        <div className="dashboard-hero__copy">
          <span className="dashboard-hero__eyebrow"><Sparkles size={14} /> YOUR FINANCIAL OVERVIEW</span>
          <h2>Make every rupee <span>count.</span></h2>
          <p>A clear picture of your spending, all in one place.</p>
        </div>
        <div className="dashboard-hero__meta">
          <div className="dashboard-hero__meta-icon"><TrendingUp size={20} /></div>
          <div>
            <span className="dashboard-hero__meta-label">Expenses tracked</span>
            <strong>{loading ? "—" : expenses.length}</strong>
          </div>
        </div>
        <div className="dashboard-hero__orb dashboard-hero__orb--one" />
        <div className="dashboard-hero__orb dashboard-hero__orb--two" />
      </section>

      {/* Dashboard statistics */}
      <section className="stats">
        {loading ? (
          [0, 1, 2, 3].map((item) => (
            <article key={item} className="stat">
              <Skeleton h={36} w={36} r={11} />

              <div
                className="stat__body"
                style={{ flex: 1 }}
              >
                <Skeleton h={11} w="50%" />

                <div style={{ height: 10 }} />

                <Skeleton h={22} w="72%" />
              </div>
            </article>
          ))
        ) : (
          <>
            <StatCard
              icon={TrendingUp}
              label="Total Spent"
              value={mask(currency(summary.grandTotal))}
              hint={`Data across ${summary.monthly.length} months`}
              tone="accent"
            />

            <StatCard
              icon={Hash}
              label="Total Expenses"
              value={expenses.length}
              hint={`Average ${mask(
                currency(averageExpense)
              )} per expense`}
              tone="info"
            />

            <StatCard
              icon={Crown}
              label="Top Category"
              value={topCategory?.category || "—"}
              hint={
                topCategory
                  ? `${mask(
                      currency(topCategory.total)
                    )} · ${topCategory.count} expenses`
                  : "No data available"
              }
              tone="warn"
            />

            <StatCard
              icon={Sparkles}
              label="This Month"
              value={mask(
                currency(
                  monthlyData.at(-1)?.total || 0
                )
              )}
              hint={monthlyData.at(-1)?.name || "No data yet"}
              tone="violet"
            />
          </>
        )}
      </section>

      {/* Expense form and category chart */}
      <section className="grid grid--main">
        <ExpenseForm
          onAdd={addExpense}
          editing={editing}
          onUpdate={updateExpense}
          onCancelEdit={() => setEditing(null)}
        />

        {/* Category spending chart */}
        <section className="card">
          <div className="card__head">
            <h2 className="card__title">
              <PieIcon size={16} />
              Spending by Category
            </h2>

            <span className="card__sub">
              {categoryData.length} categories
            </span>
          </div>

          <div className="card__body">
            {loading ? (
              <div className="chart-skel">
                <Skeleton h={210} r={12} />
              </div>
            ) : categoryData.length > 0 ? (
              <div className="donut">
                <ResponsiveContainer
                  width="100%"
                  height={210}
                >
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={58}
                      outerRadius={88}
                      paddingAngle={2}
                      stroke="#fff"
                      strokeWidth={2}
                    >
                      {categoryData.map(
                        (category, index) => (
                          <Cell
                            key={category.name}
                            fill={
                              category.fill ||
                              CHART_COLORS[
                                index % CHART_COLORS.length
                              ]
                            }
                          />
                        )
                      )}
                    </Pie>

                    <RTooltip
                      content={<ChartTooltip />}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <ul className="legend">
                  {categoryData.map((category) => (
                    <li key={category.name}>
                      <span
                        className="legend__dot"
                        style={{
                          background: category.fill,
                        }}
                      />

                      <span className="legend__name">
                        {category.name}
                      </span>

                      <span className="legend__val">
                        {mask(currency(category.value))}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <EmptyState
                icon={PieIcon}
                title="No Expenses Yet"
                text="Add your first expense to see a breakdown of your spending by category."
              />
            )}
          </div>
        </section>
      </section>

      {/* Monthly spending trend */}
      <section
        className="card"
        style={{ marginBottom: 22 }}
      >
        <div className="card__head">
          <h2 className="card__title">
            <BarChart3 size={16} />
            Monthly Spending Trend
          </h2>

          <span className="card__sub">
            Track how your spending changes over time
          </span>
        </div>

        <div className="card__body">
          {loading ? (
            <Skeleton h={240} r={12} />
          ) : monthlyData.length > 0 ? (
            <ResponsiveContainer
              width="100%"
              height={240}
            >
              <BarChart
                data={monthlyData}
                margin={{
                  top: 6,
                  right: 8,
                  left: -18,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  stroke="#e8ecf2"
                />

                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: "#64748b",
                    fontSize: 12,
                  }}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: "#64748b",
                    fontSize: 12,
                  }}
                  tickFormatter={(value) =>
                    value >= 1000
                      ? `${value / 1000}k`
                      : value
                  }
                />

                <RTooltip
                  content={<ChartTooltip />}
                  cursor={{
                    fill: "rgba(13,148,136,.06)",
                  }}
                />

                <Bar
                  dataKey="total"
                  fill="#0f9f83"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={44}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState
              icon={BarChart3}
              title="No Spending Data Yet"
              text="Add a few expenses to see your monthly spending trends."
            />
          )}
        </div>
      </section>

      {/* Expense history */}
      {loading ? (
        <section className="card">
          <div className="card__body">
            <Skeleton h={200} r={12} />
          </div>
        </section>
      ) : (
        <ExpenseTable
          expenses={expenses}
          onDelete={deleteExpense}
          onEdit={(expense) => {
            setEditing(expense);

            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
        />
      )}

      {/* Footer */}
      <Footer />
    </AppShell>
  );
}