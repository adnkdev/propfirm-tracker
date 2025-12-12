import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import type { ReactNode } from "react";
import { Sidebar } from "@/components/Layout/Sidebar";

export const metadata = {
  title: "Prop Firm Tracker",
  description: "Track expenses, payouts, and performance across prop firms.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="app-bg text-light">
        <div className="container-fluid vh-100 p-0">
          <div className="row h-100 g-0">
            {/* Sidebar column */}
            <div className="col-12 col-md-3 col-lg-2">
              <Sidebar />
            </div>

            {/* Main content column */}
            <div className="col-12 col-md-9 col-lg-10 d-flex flex-column">
              {/* Top bar */}
              <header className="app-topbar d-flex justify-content-between align-items-center px-3 px-md-4 py-2">
                <div>
                  <small className="text-white">
                    Multi-prop P&amp;L, expenses &amp; payouts in one command centre.
                  </small>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <div className="d-none d-sm-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill app-badge-live">
                    <span className="live-dot" />
                    <span className="small">Live session</span>
                  </div>
                  <button className="btn btn-sm btn-outline-light rounded-pill px-3 app-profile-btn">
                    Profile
                  </button>
                </div>
              </header>

              {/* Main content */}
              <main className="flex-grow-1 p-3 p-md-4 app-main">
                <div className="app-main-card h-100">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
