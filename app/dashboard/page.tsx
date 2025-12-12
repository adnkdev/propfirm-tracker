"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

import { monthlyPnL, expensesVsPayouts } from "@/libs/mockCharts";

export default function DashboardPage() {
  // Mock data (replace with real data later)
  const summary = {
    netProfit: 12430,
    totalExpenses: 3210,
    totalPayouts: 15640,
    activeAccounts: 4,
  };

  const recentActivity = [
    { type: "Payout", account: "FTMO 100K", amount: 2400, date: "2025-12-01" },
    { type: "Expense", account: "Apex 50K", amount: -167, date: "2025-11-29" },
    { type: "Expense", account: "FundedNext 25K", amount: -49, date: "2025-11-27" },
    { type: "Payout", account: "Topstep 50K", amount: 1200, date: "2025-11-20" },
  ];

  const money = (n: number) =>
    `${n < 0 ? "-" : ""}$${Math.abs(n).toLocaleString()}`;

  return (
    <div className="container-fluid p-0">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <h1 className="h4 mb-1">Dashboard</h1>
          <div className="text-muted small">
            Overview of your net performance across prop firms.
          </div>
        </div>

        {/* Quick actions */}
        <div className="d-flex flex-wrap gap-2">
          <button className="btn btn-sm btn-outline-light rounded-pill px-3">
            + Add Expense
          </button>
          <button className="btn btn-sm btn-outline-light rounded-pill px-3">
            + Add Payout
          </button>
          <button className="btn btn-sm btn-primary rounded-pill px-3">
            + Add Account
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="dash-card p-3 h-100">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="text-muted small">Net Profit</div>
                <div className="fs-4 fw-semibold mt-1">
                  {money(summary.netProfit)}
                </div>
              </div>
              <span className="badge rounded-pill dash-badge">LIVE</span>
            </div>
            <div className="text-muted small mt-2">
              After fees & payouts tracked
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="dash-card p-3 h-100">
            <div className="text-muted small">Total Expenses</div>
            <div className="fs-4 fw-semibold mt-1">
              {money(summary.totalExpenses)}
            </div>
            <div className="text-muted small mt-2">
              Challenge fees, resets, tools
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="dash-card p-3 h-100">
            <div className="text-muted small">Total Payouts</div>
            <div className="fs-4 fw-semibold mt-1">
              {money(summary.totalPayouts)}
            </div>
            <div className="text-muted small mt-2">
              Net received from prop firms
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="dash-card p-3 h-100">
            <div className="text-muted small">Active Accounts</div>
            <div className="fs-4 fw-semibold mt-1">{summary.activeAccounts}</div>
            <div className="text-muted small mt-2">
              Evaluations + funded accounts
            </div>
          </div>
        </div>
      </div>

      {/* Charts + Activity */}
      <div className="row g-3">
        {/* Chart: Monthly Profit */}
        <div className="col-12 col-lg-7">
          <div className="dash-panel p-3 h-100 d-flex flex-column">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <div>
                <div className="fw-semibold">Monthly Profit</div>
                <div className="text-muted small">Last 6 months</div>
              </div>
              <select className="form-select form-select-sm w-auto dash-select">
                <option>All accounts</option>
                <option>FTMO 100K</option>
                <option>Apex 50K</option>
              </select>
            </div>

            {/* Chart area fills remaining height and stays visually centered */}
            <div className="flex-grow-1 d-flex align-items-center">
              <div style={{ width: "100%", height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyPnL} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#020617",
                        border: "1px solid rgba(148,163,184,0.25)",
                        borderRadius: 8,
                      }}
                      labelStyle={{ color: "#e5e7eb" }}
                    />
                    <Line type="monotone" dataKey="profit" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>


        {/* Right column: Expense vs Payouts + Alerts */}
        <div className="col-12 col-lg-5">
          <div className="row g-3">
            <div className="col-12">
              <div className="dash-panel p-3">
                <div className="fw-semibold mb-1">Expenses vs Payouts</div>
                <div className="text-muted small mb-2">Last 30 days</div>

                <div style={{ width: "100%", height: 160 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={expensesVsPayouts}>
                      <defs>
                        {/* Neon Green Gradient */}
                        <linearGradient id="greenGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#22c55e" stopOpacity={1} />
                          <stop offset="100%" stopColor="#16a34a" stopOpacity={0.85} />
                        </linearGradient>

                        {/* Neon Red Gradient */}
                        <linearGradient id="redGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
                          <stop offset="100%" stopColor="#b91c1c" stopOpacity={0.85} />
                        </linearGradient>
                      </defs>

                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                      <XAxis dataKey="month" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#020617",
                          border: "1px solid rgba(148,163,184,0.25)",
                          borderRadius: 8,
                        }}
                        labelStyle={{ color: "#e5e7eb" }}
                      />

                      {/* Expenses (Red) */}
                      <Bar
                        dataKey="expenses"
                        fill="url(#redGlow)"
                        radius={[6, 6, 0, 0]}
                      />

                      {/* Payouts (Green) */}
                      <Bar
                        dataKey="payouts"
                        fill="url(#greenGlow)"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

              </div>
            </div>

            <div className="col-12">
              <div className="dash-panel p-3">
                <div className="fw-semibold mb-2">Alerts</div>

                <div className="d-flex flex-column gap-2">
                  <div className="dash-alert">
                    <div className="fw-semibold small">Payout window</div>
                    <div className="text-muted small">
                      FTMO 100K — eligible in 3 days
                    </div>
                  </div>

                  <div className="dash-alert">
                    <div className="fw-semibold small">Challenge expiry</div>
                    <div className="text-muted small">
                      Apex 50K — 9 days remaining
                    </div>
                  </div>

                  <div className="dash-alert">
                    <div className="fw-semibold small">Spending watch</div>
                    <div className="text-muted small">
                      Fees up 18% vs last month
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent activity table */}
        <div className="col-12">
          <div className="dash-panel p-3">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <div>
                <div className="fw-semibold">Recent activity</div>
                <div className="text-muted small">
                  Latest expenses and payouts across accounts
                </div>
              </div>

              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-outline-light rounded-pill px-3">
                  Export CSV
                </button>
                <button className="btn btn-sm btn-outline-light rounded-pill px-3">
                  View all
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th className="text-muted fw-normal">Type</th>
                    <th className="text-muted fw-normal">Account</th>
                    <th className="text-muted fw-normal">Amount</th>
                    <th className="text-muted fw-normal">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.map((row, idx) => {
                    const isPayout = row.type === "Payout";
                    return (
                      <tr key={idx}>
                        <td>
                          <span
                            className={`badge rounded-pill ${isPayout ? "bg-primary" : "bg-secondary"
                              }`}
                          >
                            {row.type}
                          </span>
                        </td>
                        <td className="fw-semibold">{row.account}</td>
                        <td
                          className={`fw-semibold ${row.amount >= 0 ? "text-info" : "text-warning"
                            }`}
                        >
                          {money(row.amount)}
                        </td>
                        <td className="text-muted">{row.date}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="text-muted small mt-2">
              Tip: keep “Add Expense” and “Add Payout” quick actions always
              visible on mobile.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
