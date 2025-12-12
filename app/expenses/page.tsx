"use client";

import { useMemo, useState } from "react";

type ExpenseType =
  | "CHALLENGE_FEE"
  | "RESET"
  | "EXTENSION"
  | "VPS"
  | "DATA"
  | "SOFTWARE"
  | "OTHER";

type Expense = {
  id: string;
  account?: string;
  firm?: string;
  type: ExpenseType;
  description?: string;
  amount: number;
  currency: string;
  date: string;
};

const money = (n: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(n);

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "e1",
      firm: "FTMO",
      account: "FTMO 100K",
      type: "CHALLENGE_FEE",
      description: "Evaluation fee",
      amount: 540,
      currency: "USD",
      date: "2025-12-01",
    },
    {
      id: "e2",
      firm: "Apex",
      account: "Apex 50K",
      type: "RESET",
      description: "Account reset",
      amount: 167,
      currency: "USD",
      date: "2025-11-28",
    },
    {
      id: "e3",
      firm: "General",
      type: "SOFTWARE",
      description: "Copy trading subscription",
      amount: 35,
      currency: "USD",
      date: "2025-11-20",
    },
  ]);

  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"" | ExpenseType>("");
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    firm: "",
    account: "",
    type: "CHALLENGE_FEE" as ExpenseType,
    description: "",
    amount: "",
    currency: "USD",
    date: "",
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return expenses.filter((e) => {
      const matchesQuery =
        !q ||
        e.description?.toLowerCase().includes(q) ||
        e.account?.toLowerCase().includes(q) ||
        e.firm?.toLowerCase().includes(q);

      const matchesType = !typeFilter || e.type === typeFilter;

      return matchesQuery && matchesType;
    });
  }, [expenses, query, typeFilter]);

  const stats = useMemo(() => {
    const total = expenses.reduce((s, e) => s + e.amount, 0);
    const month = expenses
      .filter((e) => e.date.startsWith("2025-12"))
      .reduce((s, e) => s + e.amount, 0);
    return { total, month };
  }, [expenses]);

  function updateForm<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function resetForm() {
    setForm({
      firm: "",
      account: "",
      type: "CHALLENGE_FEE",
      description: "",
      amount: "",
      currency: "USD",
      date: "",
    });
  }

  function createExpense() {
    const amt = Number(form.amount);
    if (!Number.isFinite(amt) || amt <= 0) {
      alert("Enter a valid amount");
      return;
    }

    const newExpense: Expense = {
      id: crypto.randomUUID(),
      firm: form.firm || "General",
      account: form.account || undefined,
      type: form.type,
      description: form.description || undefined,
      amount: amt,
      currency: form.currency,
      date: form.date || new Date().toISOString().slice(0, 10),
    };

    setExpenses((p) => [newExpense, ...p]);
    resetForm();
    setShowModal(false);
  }

  return (
    <div className="container-fluid p-0">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
        <div>
          <h1 className="h4 mb-1">Expenses</h1>
          <div className="text-muted small">
            Track all costs across prop firms and trading tools.
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn btn-sm btn-primary rounded-pill px-3"
        >
          + Add Expense
        </button>
      </div>

      {/* Summary */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6">
          <div className="dash-card p-3">
            <div className="text-muted small">Total Expenses</div>
            <div className="fs-4 fw-semibold mt-1">
              {money(stats.total)}
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6">
          <div className="dash-card p-3">
            <div className="text-muted small">This Month</div>
            <div className="fs-4 fw-semibold mt-1">
              {money(stats.month)}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="dash-panel p-3 mb-3">
        <div className="row g-2">
          <div className="col-12">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="form-control"
              placeholder="Search expenses..."
            />
          </div>
          <div className="col-12 col-sm-6">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="form-select dash-select"
            >
              <option value="">All Types</option>
              <option value="CHALLENGE_FEE">Challenge Fee</option>
              <option value="RESET">Reset</option>
              <option value="EXTENSION">Extension</option>
              <option value="VPS">VPS</option>
              <option value="DATA">Data</option>
              <option value="SOFTWARE">Software</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mobile list */}
      <div className="d-md-none d-flex flex-column gap-2">
        {filtered.map((e) => (
          <div key={e.id} className="dash-panel p-3">
            <div className="d-flex justify-content-between">
              <div className="fw-semibold">{e.type.replace("_", " ")}</div>
              <div className="fw-semibold text-warning">
                {money(e.amount, e.currency)}
              </div>
            </div>
            <div className="text-muted small">
              {e.firm} {e.account ? `• ${e.account}` : ""}
            </div>
            <div className="text-muted small">{e.date}</div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="d-none d-md-block dash-panel p-3">
        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle mb-0">
            <thead>
              <tr>
                <th className="text-muted fw-normal">Type</th>
                <th className="text-muted fw-normal">Firm</th>
                <th className="text-muted fw-normal">Account</th>
                <th className="text-muted fw-normal">Amount</th>
                <th className="text-muted fw-normal">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id}>
                  <td>{e.type.replace("_", " ")}</td>
                  <td>{e.firm}</td>
                  <td>{e.account ?? "-"}</td>
                  <td className="fw-semibold text-warning">
                    {money(e.amount, e.currency)}
                  </td>
                  <td className="text-muted">{e.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showModal && (
        <>
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{ background: "rgba(0,0,0,.65)", zIndex: 1050 }}
            onClick={() => setShowModal(false)}
          />
          <div
            className="position-fixed top-50 start-50 translate-middle w-100 px-3"
            style={{ maxWidth: 520, zIndex: 1060 }}
          >
            <div className="dash-panel p-3">
              <div className="fw-semibold mb-2">Add Expense</div>

              <div className="row g-2">
                <div className="col-12">
                  <input
                    className="form-control"
                    placeholder="Firm (optional)"
                    value={form.firm}
                    onChange={(e) => updateForm("firm", e.target.value)}
                  />
                </div>

                <div className="col-12">
                  <input
                    className="form-control"
                    placeholder="Account (optional)"
                    value={form.account}
                    onChange={(e) => updateForm("account", e.target.value)}
                  />
                </div>

                <div className="col-6">
                  <select
                    className="form-select dash-select"
                    value={form.type}
                    onChange={(e) => updateForm("type", e.target.value as ExpenseType)}
                  >
                    <option value="CHALLENGE_FEE">Challenge Fee</option>
                    <option value="RESET">Reset</option>
                    <option value="EXTENSION">Extension</option>
                    <option value="VPS">VPS</option>
                    <option value="DATA">Data</option>
                    <option value="SOFTWARE">Software</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div className="col-6">
                  <input
                    className="form-control"
                    placeholder="Amount"
                    inputMode="decimal"
                    value={form.amount}
                    onChange={(e) => updateForm("amount", e.target.value)}
                  />
                </div>

                <div className="col-12">
                  <input
                    className="form-control"
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) => updateForm("description", e.target.value)}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-3">
                <button
                  className="btn btn-sm btn-outline-light rounded-pill"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-sm btn-primary rounded-pill"
                  onClick={createExpense}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
