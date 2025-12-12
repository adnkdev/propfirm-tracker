"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Wallet, CreditCard, BarChart3 } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Accounts", href: "/accounts", icon: BarChart3 },
    { name: "Expenses", href: "/expenses", icon: CreditCard },
    { name: "Payouts", href: "/payouts", icon: Wallet },
  ];

  return (
    <aside className="app-sidebar h-100 d-flex flex-column px-3 py-4">
      {/* Brand */}
      <div className="mb-4">
        <h2 className="h4 mb-0 app-logo-text">Nexus</h2>
      </div>

      {/* Navigation */}
      <nav className="nav flex-column mb-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link d-flex align-items-center gap-2 px-3 py-2 rounded-3 mb-1 app-nav-link ${
                isActive ? "active" : ""
              }`}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-4 small text-muted">
        Logged in as <span className="fw-semibold text-info">Trader</span>
      </div>
    </aside>
  );
}
