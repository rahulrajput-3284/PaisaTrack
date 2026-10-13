import { useMemo, useState } from "react";
import { Search, Trash2, Receipt, Inbox, Pencil } from "lucide-react";
import EmptyState from "./EmptyState.jsx";
import { CATEGORIES, CATEGORY_DOT, CATEGORY_TONE, currency } from "../lib/categories.js";

export default function ExpenseTable({ expenses, onDelete, onEdit }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [pending, setPending] = useState(null);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return expenses.filter((e) => {
      const matchCat = filter === "All" || e.category === filter;
      const matchQ =
        !q ||
        e.title.toLowerCase().includes(q) ||
        (e.note || "").toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [expenses, search, filter]);

  const remove = async (id) => {
    if (!window.confirm("Ye expense delete karna hai?")) return;
    setPending(id);
    try {
      await onDelete(id);
    } finally {
      setPending(null);
    }
  };

  return (
    <section className="card">
      <div className="card__head card__head--wrap">
        <h2 className="card__title">
          <Receipt size={16} /> All Expenses
          <span className="count">{rows.length}</span>
        </h2>
        <div className="table-tools">
          <div className="search">
            <Search size={14} />
            <input
              className="input"
              placeholder="Search title or note..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="input input--select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={expenses.length === 0 ? "Abhi koi expense nahi" : "Kuch match nahi hua"}
          text={
            expenses.length === 0
              ? "Pehli entry add karo — chart aur totals turant ban jayenge."
              : "Filter ya search badal ke dekho."
          }
        />
      ) : (
        <div className="table-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Expense</th>
                <th>Category</th>
                <th>Date</th>
                <th style={{ textAlign: "right" }}>Amount</th>
                <th style={{ width: 88 }}></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((e) => (
                <tr key={e._id}>
                  <td>
                    <p className="cell-title">{e.title}</p>
                    {e.note && <p className="cell-sub">{e.note}</p>}
                  </td>
                  <td>
                    <span className={`badge tone-${CATEGORY_TONE[e.category] || "other"}`}>
                      <span
                        className="badge__dot"
                        style={{ background: CATEGORY_DOT[e.category] || "#64748b" }}
                      />
                      {e.category}
                    </span>
                  </td>
                  <td className="cell-sub" style={{ whiteSpace: "nowrap" }}>
                    {new Date(e.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="num">{currency(e.amount)}</td>
                  <td>
                    <div className="row-actions">
                      {onEdit && (
                        <button
                          className="icon-btn"
                          onClick={() => onEdit(e)}
                          aria-label={`Edit ${e.title}`}
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                      )}
                      <button
                        className="icon-btn icon-btn--danger"
                        onClick={() => remove(e._id)}
                        disabled={pending === e._id}
                        aria-label={`Delete ${e.title}`}
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
