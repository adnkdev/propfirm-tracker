"use client";

import { useMemo, useState } from "react";

type Payout = {
  id: string;
  firm?: string;
  account: string;
  grossAmount: number;
  netToTrader: number;
  split?: number; // %
  currency: string;
  payoutDate: string; // YYYY-MM-DD
  method?: string;
  notes?: string;
};

const money = (n: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(n);

export default function PayoutsPage() {
  const [payouts, setPayouts] = useState<Payout[]>([
    {
      id: "p1",
      firm: "FTMO",
      account: "FTMO 100K",
      grossAmount: 3000,
      split: 80,
      netToTrader: 2400,
      currency: "USD",
      payoutDate: "2025-12-01",
      method: "Bank transfer",
      notes: "First payout",
    },
    {
      id: "p2",
      firm: "Topstep",
      account: "Topstep 50K",
      grossAmount: 1500,
      split: 80,
      netToTrader: 1200,
      currency: "USD",
      payoutDate: "2025-11-20",
      method: "Wise",
    },
    {
      id: "p3",
      firm: "Apex",
      account: "Apex 50K",
      grossAmount: 1000,
      split: 80,
      netToTrader: 800,
      currency: "USD",
      payoutDate: "2025-11-05",
      method: "PayPal",
    },
  ]);

  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    firm: "",
    account: "",
    grossAmount: "",
    split: "80",
    netToTrader: "",
    currency: "USD",
    payoutDate: "",
    method: "",
    notes: "",
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return payouts.filter((p) => {
      return (
        !q ||
        p.account.toLowerCase().includes(q) ||
        (p.firm ?? "").toLowerCase().includes(q) ||
        (p.method ?? "").toLowerCase().includes(q)
      );
    });
  }, [payouts, query]);

  const stats = useMemo(() => {
    const totalNet = payouts.reduce((s, p) => s + p.netToTrader, 0);
    const totalGross = payouts.reduce((s, p) => s + p.grossAmount, 0);

    // This month (based on first payout's month for demo; replace with real current month later)
    const monthPrefix = "2025-12";
    const monthNet = payouts
      .filter((p) => p.payoutDate.startsWith(monthPrefix))
      .reduce((s, p) => s + p.netToTrader, 0);

    return { totalNet, totalGross, monthNet };
  }, [payouts]);

  function updateForm<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function resetForm() {
    setForm({
      firm: "",
      account: "",
      grossAmount: "",
      split: "80",
      netToTrader: "",
      currency: "USD",
      payoutDate: "",
      method: "",
      notes: "",
    });
  }

  function autoComputeNet(grossStr: string, splitStr: string) {
    const gross = Number(grossStr);
    const split = Number(splitStr);
    if (!Number.isFinite(gross) || gross <= 0) return "";
    if (!Number.isFinite(split) || split <= 0 || split > 100) return "";
    const net = (gross * split) / 100;
    return String(Math.round(net * 100) / 100);
  }

  function createPayout() {
    const gross = Number(form.grossAmount);
    const split = Number(form.split);
    const net = Number(form.netToTrader);

    if (!form.account.trim()) {
      alert("Account is required.");
      return;
    }
    if (!Number.isFinite(gross) || gross <= 0) {
      alert("Enter a valid gross amount.");
      return;
    }
    if (!Number.isFinite(net) || net <= 0) {
      alert("Enter a valid net amount (or use auto-calc).");
      return;
    }

    const newPayout: Payout = {
      id: crypto.randomUUID(),
      firm: form.firm || undefined,
      account: form.account.trim(),
      grossAmount: gross,
      split: Number.isFinite(split) ? split : undefined,
      netToTrader: net,
      currency: form.currency,
      payoutDate: form.payoutDate || new Date().toISOString().slice(0, 10),
      method: form.method || undefined,
      notes: form.notes || undefined,
    };

    setPayouts((prev) => [newPayout, ...prev]);
    resetForm();
    setShowModal(false);
  }

  return (
    <div className="container-fluid p-0">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
        <div>
          <h1 className="h4 mb-1">Payouts</h1>
          <div className="text-muted small">
            Track withdrawals and net payouts received from prop firms.
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn btn-sm btn-primary rounded-pill px-3"
        >
          + Add Payout
        </button>
      </div>

      {/* Summary */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-4">
          <div className="dash-card p-3">
            <div className="text-muted small">Total Net to Trader</div>
            <div className="fs-4 fw-semibold mt-1">{money(stats.totalNet)}</div>
            <div className="text-muted small mt-2">After firm split</div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-4">
          <div className="dash-card p-3">
            <div className="text-muted small">Total Gross Payouts</div>
            <div className="fs-4 fw-semibold mt-1">{money(stats.totalGross)}</div>
            <div className="text-muted small mt-2">Before split</div>
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <div className="dash-card p-3">
            <div className="text-muted small">This Month (Net)</div>
            <div className="fs-4 fw-semibold mt-1">{money(stats.monthNet)}</div>
            <div className="text-muted small mt-2">Current month net received</div>
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
              placeholder="Search payouts (firm, account, method)..."
            />
          </div>
        </div>
      </div>

      {/* Mobile list */}
      <div className="d-md-none d-flex flex-column gap-2">
        {filtered.map((p) => (
          <div key={p.id} className="dash-panel p-3">
            <div className="d-flex justify-content-between align-items-start gap-2">
              <div>
                <div className="fw-semibold">{p.account}</div>
                <div className="text-muted small">
                  {(p.firm ?? "—")} {p.method ? `• ${p.method}` : ""}
                </div>
              </div>
              <div className="text-end">
                <div className="fw-semibold text-info">{money(p.netToTrader, p.currency)}</div>
                <div className="text-muted small">{p.payoutDate}</div>
              </div>
            </div>

            <div className="mt-2 d-flex flex-wrap gap-2">
              <span className="badge rounded-pill bg-secondary">
                Gross: {money(p.grossAmount, p.currency)}
              </span>
              {typeof p.split === "number" && (
                <span className="badge rounded-pill bg-dark border border-secondary">
                  Split: {p.split}%
                </span>
              )}
            </div>

            {p.notes && <div className="text-muted small mt-2">{p.notes}</div>}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="dash-panel p-3 text-center text-muted">
            No payouts match your search.
          </div>
        )}
      </div>

      {/* Desktop table */}
      <div className="d-none d-md-block dash-panel p-3">
        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle mb-0">
            <thead>
              <tr>
                <th className="text-muted fw-normal">Firm</th>
                <th className="text-muted fw-normal">Account</th>
                <th className="text-muted fw-normal">Net</th>
                <th className="text-muted fw-normal">Gross</th>
                <th className="text-muted fw-normal">Split</th>
                <th className="text-muted fw-normal">Method</th>
                <th className="text-muted fw-normal">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td className="fw-semibold">{p.firm ?? "—"}</td>
                  <td>{p.account}</td>
                  <td className="fw-semibold text-info">{money(p.netToTrader, p.currency)}</td>
                  <td>{money(p.grossAmount, p.currency)}</td>
                  <td className="text-muted">{typeof p.split === "number" ? `${p.split}%` : "—"}</td>
                  <td className="text-muted">{p.method ?? "—"}</td>
                  <td className="text-muted">{p.payoutDate}</td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-muted text-center py-4">
                    No payouts match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Payout Modal */}
      {showModal && (
        <>
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{ background: "rgba(0,0,0,.65)", zIndex: 1050 }}
            onClick={() => setShowModal(false)}
          />
          <div
            className="position-fixed top-50 start-50 translate-middle w-100 px-3"
            style={{ maxWidth: 560, zIndex: 1060 }}
            role="dialog"
            aria-modal="true"
          >
            <div className="dash-panel p-3">
              <div className="d-flex align-items-start justify-content-between mb-2">
                <div>
                  <div className="fw-semibold">Add payout</div>
                  <div className="text-muted small">Store gross, split, and net received.</div>
                </div>
                <button
                  className="btn btn-sm btn-outline-light rounded-pill"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>

              <div className="row g-2">
                <div className="col-12 col-md-6">
                  <label className="form-label small text-muted mb-1">Firm (optional)</label>
                  <input
                    className="form-control"
                    placeholder="e.g., FTMO"
                    value={form.firm}
                    onChange={(e) => updateForm("firm", e.target.value)}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label small text-muted mb-1">Account *</label>
                  <input
                    className="form-control"
                    placeholder="e.g., FTMO 100K"
                    value={form.account}
                    onChange={(e) => updateForm("account", e.target.value)}
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label small text-muted mb-1">Gross *</label>
                  <input
                    className="form-control"
                    inputMode="decimal"
                    placeholder="3000"
                    value={form.grossAmount}
                    onChange={(e) => {
                      const grossStr = e.target.value;
                      updateForm("grossAmount", grossStr);
                      const auto = autoComputeNet(grossStr, form.split);
                      if (auto) updateForm("netToTrader", auto);
                    }}
                  />
                </div>

                <div className="col-6 col-md-4">
                  <label className="form-label small text-muted mb-1">Split %</label>
                  <input
                    className="form-control"
                    inputMode="numeric"
                    placeholder="80"
                    value={form.split}
                    onChange={(e) => {
                      const splitStr = e.target.value;
                      updateForm("split", splitStr);
                      const auto = autoComputeNet(form.grossAmount, splitStr);
                      if (auto) updateForm("netToTrader", auto);
                    }}
                  />
                </div>

                <div className="col-6 col-md-4">
                  <label className="form-label small text-muted mb-1">Net to you *</label>
                  <input
                    className="form-control"
                    inputMode="decimal"
                    placeholder="2400"
                    value={form.netToTrader}
                    onChange={(e) => updateForm("netToTrader", e.target.value)}
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
                  <label className="form-label small text-muted mb-1">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={form.payoutDate}
                    onChange={(e) => updateForm("payoutDate", e.target.value)}
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label small text-muted mb-1">Method</label>
                  <input
                    className="form-control"
                    placeholder="Wise / PayPal / Bank"
                    value={form.method}
                    onChange={(e) => updateForm("method", e.target.value)}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small text-muted mb-1">Notes</label>
                  <input
                    className="form-control"
                    placeholder="Optional"
                    value={form.notes}
                    onChange={(e) => updateForm("notes", e.target.value)}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-3">
                <button
                  className="btn btn-sm btn-outline-light rounded-pill px-3"
                  onClick={resetForm}
                >
                  Reset
                </button>
                <button
                  className="btn btn-sm btn-primary rounded-pill px-3"
                  onClick={createPayout}
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
