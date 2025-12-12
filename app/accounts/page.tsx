"use client";

import { useMemo, useState } from "react";

type AccountType = "EVALUATION" | "CHALLENGE" | "FUNDED";
type AccountStatus = "ACTIVE" | "FAILED" | "COMPLETED";

type Account = {
  id: string;
  propFirm: string;
  accountName: string;
  accountSize: number;
  currency: string;
  type: AccountType;
  status: AccountStatus;
  startDate?: string;
};

const money = (n: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(n);

export default function AccountsPage() {
  // Mock data (replace with real fetch from /api/accounts later)
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: "a1",
      propFirm: "FTMO",
      accountName: "FTMO 100K",
      accountSize: 100000,
      currency: "USD",
      type: "EVALUATION",
      status: "ACTIVE",
      startDate: "2025-12-01",
    },
    {
      id: "a2",
      propFirm: "Apex",
      accountName: "Apex 50K",
      accountSize: 50000,
      currency: "USD",
      type: "CHALLENGE",
      status: "ACTIVE",
      startDate: "2025-11-20",
    },
    {
      id: "a3",
      propFirm: "Topstep",
      accountName: "Topstep 50K",
      accountSize: 50000,
      currency: "USD",
      type: "FUNDED",
      status: "ACTIVE",
      startDate: "2025-10-18",
    },
  ]);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | AccountStatus>("");
  const [typeFilter, setTypeFilter] = useState<"" | AccountType>("");

  const [showModal, setShowModal] = useState(false);

  // Form state
  const [form, setForm] = useState({
    propFirm: "",
    accountName: "",
    accountSize: "",
    currency: "USD",
    type: "EVALUATION" as AccountType,
    status: "ACTIVE" as AccountStatus,
    startDate: "",
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return accounts.filter((a) => {
      const matchesQuery =
        !q ||
        a.propFirm.toLowerCase().includes(q) ||
        a.accountName.toLowerCase().includes(q);

      const matchesStatus = !statusFilter || a.status === statusFilter;
      const matchesType = !typeFilter || a.type === typeFilter;

      return matchesQuery && matchesStatus && matchesType;
    });
  }, [accounts, query, statusFilter, typeFilter]);

  const stats = useMemo(() => {
    const active = accounts.filter((a) => a.status === "ACTIVE").length;
    const funded = accounts.filter((a) => a.type === "FUNDED").length;
    const totalNotional = accounts.reduce((sum, a) => sum + a.accountSize, 0);
    return { active, funded, totalNotional };
  }, [accounts]);

  function closeModal() {
    setShowModal(false);
  }

  function openModal() {
    setShowModal(true);
  }

  function updateForm<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function resetForm() {
    setForm({
      propFirm: "",
      accountName: "",
      accountSize: "",
      currency: "USD",
      type: "EVALUATION",
      status: "ACTIVE",
      startDate: "",
    });
  }

  function onCreateAccount() {
    const size = Number(form.accountSize);
    if (!form.propFirm.trim() || !form.accountName.trim() || !Number.isFinite(size) || size <= 0) {
      alert("Please fill Prop Firm, Account Name, and a valid Account Size.");
      return;
    }

    const newAccount: Account = {
      id: crypto.randomUUID(),
      propFirm: form.propFirm.trim(),
      accountName: form.accountName.trim(),
      accountSize: size,
      currency: form.currency,
      type: form.type,
      status: form.status,
      startDate: form.startDate || undefined,
    };

    setAccounts((prev) => [newAccount, ...prev]);
    resetForm();
    closeModal();
  }

  return (
    <div className="container-fluid p-0">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <h1 className="h4 mb-1">Accounts</h1>
          <div className="text-muted small">
            Manage your prop firm accounts, challenges, and funded profiles.
          </div>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <button onClick={openModal} className="btn btn-sm btn-primary rounded-pill px-3">
            + Add Account
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="dash-card p-3 h-100">
            <div className="text-muted small">Active Accounts</div>
            <div className="fs-4 fw-semibold mt-1">{stats.active}</div>
            <div className="text-muted small mt-2">Currently running</div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="dash-card p-3 h-100">
            <div className="text-muted small">Funded Accounts</div>
            <div className="fs-4 fw-semibold mt-1">{stats.funded}</div>
            <div className="text-muted small mt-2">Live funded profiles</div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-6">
          <div className="dash-card p-3 h-100">
            <div className="text-muted small">Total Notional</div>
            <div className="fs-4 fw-semibold mt-1">{money(stats.totalNotional, "USD")}</div>
            <div className="text-muted small mt-2">Sum of account sizes</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="dash-panel p-3 mb-3">
        <div className="row g-2 align-items-end">
          <div className="col-12 col-md-6">
            <label className="form-label small text-muted mb-1">Search</label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="form-control"
              placeholder="Search by firm or account name..."
              style={{
                backgroundColor: "rgba(2, 6, 23, 0.75)",
                borderColor: "rgba(129, 140, 248, 0.35)",
                color: "#e5e7eb",
              }}
            />
          </div>

          <div className="col-6 col-md-3">
            <label className="form-label small text-muted mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="form-select dash-select"
            >
              <option value="">All</option>
              <option value="ACTIVE">Active</option>
              <option value="FAILED">Failed</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div className="col-6 col-md-3">
            <label className="form-label small text-muted mb-1">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="form-select dash-select"
            >
              <option value="">All</option>
              <option value="EVALUATION">Evaluation</option>
              <option value="CHALLENGE">Challenge</option>
              <option value="FUNDED">Funded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="dash-panel p-3">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div>
            <div className="fw-semibold">Your accounts</div>
            <div className="text-muted small">{filtered.length} shown</div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle mb-0">
            <thead>
              <tr>
                <th className="text-muted fw-normal">Prop Firm</th>
                <th className="text-muted fw-normal">Account</th>
                <th className="text-muted fw-normal">Size</th>
                <th className="text-muted fw-normal">Type</th>
                <th className="text-muted fw-normal">Status</th>
                <th className="text-muted fw-normal">Start</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td className="fw-semibold">{a.propFirm}</td>
                  <td>{a.accountName}</td>
                  <td className="fw-semibold text-info">{money(a.accountSize, a.currency)}</td>
                  <td>
                    <span className="badge rounded-pill bg-secondary">{a.type}</span>
                  </td>
                  <td>
                    <span
                      className={`badge rounded-pill ${
                        a.status === "ACTIVE"
                          ? "bg-primary"
                          : a.status === "FAILED"
                          ? "bg-danger"
                          : "bg-success"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="text-muted">{a.startDate ?? "-"}</td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-muted text-center py-4">
                    No accounts match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal (React-based, Bootstrap-looking) */}
      {showModal && (
        <>
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{ background: "rgba(0,0,0,0.65)", zIndex: 1050 }}
            onClick={closeModal}
          />
          <div
            className="position-fixed top-50 start-50 translate-middle w-100 px-3"
            style={{ maxWidth: 640, zIndex: 1060 }}
            role="dialog"
            aria-modal="true"
          >
            <div className="dash-panel p-3">
              <div className="d-flex align-items-start justify-content-between mb-2">
                <div>
                  <div className="fw-semibold">Add account</div>
                  <div className="text-muted small">Create a new prop firm account profile.</div>
                </div>
                <button className="btn btn-sm btn-outline-light rounded-pill" onClick={closeModal}>
                  Close
                </button>
              </div>

              <div className="row g-2">
                <div className="col-12 col-md-6">
                  <label className="form-label small text-muted mb-1">Prop Firm</label>
                  <input
                    className="form-control"
                    value={form.propFirm}
                    onChange={(e) => updateForm("propFirm", e.target.value)}
                    placeholder="e.g., FTMO"
                    style={{
                      backgroundColor: "rgba(2, 6, 23, 0.75)",
                      borderColor: "rgba(129, 140, 248, 0.35)",
                      color: "#e5e7eb",
                    }}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label small text-muted mb-1">Account Name</label>
                  <input
                    className="form-control"
                    value={form.accountName}
                    onChange={(e) => updateForm("accountName", e.target.value)}
                    placeholder="e.g., FTMO 100K"
                    style={{
                      backgroundColor: "rgba(2, 6, 23, 0.75)",
                      borderColor: "rgba(129, 140, 248, 0.35)",
                      color: "#e5e7eb",
                    }}
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label small text-muted mb-1">Account Size</label>
                  <input
                    className="form-control"
                    value={form.accountSize}
                    onChange={(e) => updateForm("accountSize", e.target.value)}
                    placeholder="100000"
                    inputMode="numeric"
                    style={{
                      backgroundColor: "rgba(2, 6, 23, 0.75)",
                      borderColor: "rgba(129, 140, 248, 0.35)",
                      color: "#e5e7eb",
                    }}
                  />
                </div>

                <div className="col-6 col-md-4">
                  <label className="form-label small text-muted mb-1">Currency</label>
                  <select
                    className="form-select dash-select"
                    value={form.currency}
                    onChange={(e) => updateForm("currency", e.target.value)}
                  >
                    <option value="USD">USD</option>
                    <option value="AUD">AUD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>

                <div className="col-6 col-md-4">
                  <label className="form-label small text-muted mb-1">Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={form.startDate}
                    onChange={(e) => updateForm("startDate", e.target.value)}
                    style={{
                      backgroundColor: "rgba(2, 6, 23, 0.75)",
                      borderColor: "rgba(129, 140, 248, 0.35)",
                      color: "#e5e7eb",
                    }}
                  />
                </div>

                <div className="col-6">
                  <label className="form-label small text-muted mb-1">Type</label>
                  <select
                    className="form-select dash-select"
                    value={form.type}
                    onChange={(e) => updateForm("type", e.target.value as AccountType)}
                  >
                    <option value="EVALUATION">Evaluation</option>
                    <option value="CHALLENGE">Challenge</option>
                    <option value="FUNDED">Funded</option>
                  </select>
                </div>

                <div className="col-6">
                  <label className="form-label small text-muted mb-1">Status</label>
                  <select
                    className="form-select dash-select"
                    value={form.status}
                    onChange={(e) => updateForm("status", e.target.value as AccountStatus)}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="FAILED">Failed</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-3">
                <button className="btn btn-sm btn-outline-light rounded-pill px-3" onClick={resetForm}>
                  Reset
                </button>
                <button className="btn btn-sm btn-primary rounded-pill px-3" onClick={onCreateAccount}>
                  Create
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
