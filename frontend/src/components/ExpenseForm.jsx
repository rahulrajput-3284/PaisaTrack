import { useEffect, useState } from "react";
import {
  Plus, IndianRupee, AlertCircle, StickyNote, CalendarDays, Tag, Check, X, Pencil,
} from "lucide-react";
import { CATEGORIES } from "../lib/categories.js";

const EMPTY = { title: "", amount: "", category: "Food", date: "", note: "" };

export default function ExpenseForm({ onAdd, editing, onUpdate, onCancelEdit }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Edit mode: row select hone par form bhar jata hai
  useEffect(() => {
    if (editing) {
      setForm({
        title: editing.title || "",
        amount: String(editing.amount ?? ""),
        category: editing.category || "Food",
        date: editing.date ? new Date(editing.date).toISOString().slice(0, 10) : "",
        note: editing.note || "",
      });
      setError("");
    } else {
      setForm(EMPTY);
    }
  }, [editing]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim() || !form.amount) {
      setError("Title aur amount dono zaroori hain");
      return;
    }
    if (Number(form.amount) <= 0) {
      setError("Amount 0 se bada hona chahiye");
      return;
    }

    const payload = {
      title: form.title.trim(),
      amount: Number(form.amount),
      category: form.category,
      note: form.note.trim(),
    };
    if (form.date) payload.date = form.date;

    setBusy(true);
    try {
      if (editing) await onUpdate(editing._id, payload);
      else await onAdd(payload);
      setForm(EMPTY);
    } catch (err) {
      setError(err?.response?.data?.message || "Kuch galat ho gaya, dobara try karo");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className={`card${editing ? " card--editing" : ""}`}>
      <div className="card__head">
        <h2 className="card__title">
          {editing ? <Pencil size={16} /> : <Plus size={16} />}
          {editing ? "Edit Expense" : "New Expense"}
        </h2>
        <span className="card__sub">{editing ? "Changes save karo" : "Ek entry add karo"}</span>
      </div>

      <form className="card__body" onSubmit={submit}>
        {error && (
          <div className="alert alert--error" style={{ marginBottom: 16 }}>
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        <div className="form-grid">
          <div className="field form-grid--full">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              className="input"
              name="title"
              placeholder="e.g. Metro card top-up"
              value={form.title}
              onChange={change}
              autoComplete="off"
            />
          </div>

          <div className="field">
            <label htmlFor="amount">Amount</label>
            <div className="amount-wrap">
              <IndianRupee size={14} />
              <input
                id="amount"
                className="input"
                name="amount"
                type="number"
                min="1"
                step="any"
                placeholder="0"
                value={form.amount}
                onChange={change}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="category">Category</label>
            <div className="amount-wrap">
              <Tag size={13} />
              <select id="category" className="input" name="category" value={form.category} onChange={change}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="field form-grid--full">
            <label htmlFor="date">Date</label>
            <div className="amount-wrap">
              <CalendarDays size={14} />
              <input id="date" className="input" name="date" type="date" value={form.date} onChange={change} />
            </div>
            <span className="field__hint">Khali chhodo to aaj ki date lag jayegi</span>
          </div>

          <div className="field form-grid--full">
            <label htmlFor="note">Note <span className="field__hint">(optional)</span></label>
            <div className="amount-wrap">
              <StickyNote size={14} />
              <input
                id="note"
                className="input"
                name="note"
                placeholder="Kis cheez ka kharcha tha?"
                value={form.note}
                onChange={change}
                autoComplete="off"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button className="btn btn--primary" disabled={busy}>
            {busy ? "Saving…" : editing ? (<><Check size={15} /> Save changes</>) : (<><Plus size={15} /> Add Expense</>)}
          </button>
          {editing && (
            <button type="button" className="btn btn--ghost" onClick={onCancelEdit}>
              <X size={15} /> Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
