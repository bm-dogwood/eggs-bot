// app/page.tsx
"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  TrendingUp,
  Store,
  Calendar,
  Bell,
  HelpCircle,
  BookOpen,
  Menu,
  X,
} from "lucide-react";
import {
  OverviewPage,
  PricesPage,
  StoresPage,
  SeasonalPage,
  AlertsPage,
  GuidePage,
  FaqPage,
} from "@/components/dashboard";

type TabType =
  | "overview"
  | "prices"
  | "stores"
  | "seasonal"
  | "alerts"
  | "guide"
  | "faq";

const TABS: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "prices", label: "Price History", icon: TrendingUp },
  { id: "stores", label: "Store Finder", icon: Store },
  { id: "seasonal", label: "Seasonal", icon: Calendar },
  { id: "alerts", label: "Alerts", icon: Bell },
  { id: "guide", label: "Egg Guide", icon: BookOpen },
  { id: "faq", label: "FAQ", icon: HelpCircle },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewPage />;
      case "prices":
        return <PricesPage />;
      case "stores":
        return <StoresPage />;
      case "seasonal":
        return <SeasonalPage />;
      case "alerts":
        return <AlertsPage />;
      case "guide":
        return <GuidePage />;
      case "faq":
        return <FaqPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <>
      <div className="app-container">
        {/* Header */}
        <header className="app-header">
          <div className="header-content">
            <div className="logo-section">
              <span className="logo-emoji">🥚</span>
              <h1 className="logo-text">
                Eggs<span className="logo-dot">.</span>bot
              </h1>
            </div>

            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <nav className="desktop-nav">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  className={`nav-item ${activeTab === id ? "active" : ""}`}
                  onClick={() => setActiveTab(id)}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Mobile Navigation */}
          <nav className={`mobile-nav ${mobileMenuOpen ? "open" : ""}`}>
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                className={`mobile-nav-item ${
                  activeTab === id ? "active" : ""
                }`}
                onClick={() => {
                  setActiveTab(id);
                  setMobileMenuOpen(false);
                }}
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </header>

        {/* Main Content */}
        <main className="app-main">
          <div className="content-wrapper">{renderContent()}</div>
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <div className="footer-content">
            <div className="footer-left">
              <span>Eggs.bot — Real-time egg price intelligence</span>
            </div>
            <div className="footer-right">
              <span className="footer-stat">
                <span className="footer-dot live"></span>
                Data updates daily
              </span>
              <span className="footer-divider">•</span>
              <span className="footer-stat">
                <span className="footer-dot source"></span>
                BLS CPI · USDA · Retail APIs
              </span>
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        .app-container {
          min-height: 100vh;
          background: #0f0f12;
          display: flex;
          flex-direction: column;
        }

        /* Header Styles */
        .app-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(15, 15, 18, 0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-emoji {
          font-size: 28px;
          line-height: 1;
        }

        .logo-text {
          font-size: 22px;
          font-weight: 700;
          color: #f0f0f5;
          margin: 0;
          letter-spacing: -0.02em;
        }

        .logo-dot {
          color: #10b981;
        }

        .logo-badge {
          padding: 2px 8px;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 20px;
          font-size: 10px;
          font-weight: 700;
          color: #10b981;
          letter-spacing: 0.05em;
        }

        .mobile-menu-btn {
          display: none;
          padding: 8px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          color: #a1a1aa;
          cursor: pointer;
          transition: all 0.2s;
        }

        .mobile-menu-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #f0f0f5;
        }

        .desktop-nav {
          display: flex;
          gap: 4px;
          background: rgba(255, 255, 255, 0.02);
          padding: 4px;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.04);
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: transparent;
          border: none;
          border-radius: 10px;
          color: #a1a1aa;
          font-size: 13.5px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.04);
          color: #e2e8f0;
        }

        .nav-item.active {
          background: rgba(16, 185, 129, 0.12);
          color: #10b981;
        }

        .mobile-nav {
          display: none;
          flex-direction: column;
          padding: 0 24px 16px;
          gap: 4px;
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }

        .mobile-nav.open {
          max-height: 500px;
        }

        .mobile-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 14px 16px;
          background: transparent;
          border: none;
          border-radius: 12px;
          color: #a1a1aa;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .mobile-nav-item:hover {
          background: rgba(255, 255, 255, 0.04);
          color: #e2e8f0;
        }

        .mobile-nav-item.active {
          background: rgba(16, 185, 129, 0.12);
          color: #10b981;
        }

        /* Main Content */
        .app-main {
          flex: 1;
          padding: 24px;
        }

        .content-wrapper {
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Footer */
        .app-footer {
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          background: rgba(15, 15, 18, 0.8);
          backdrop-filter: blur(8px);
          padding: 16px 24px;
        }

        .footer-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .footer-left {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #71717a;
        }

        .footer-emoji {
          font-size: 16px;
        }

        .footer-right {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 12px;
          color: #52525b;
        }

        .footer-stat {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .footer-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .footer-dot.live {
          background: #10b981;
          animation: pulse 2s infinite;
        }

        .footer-dot.source {
          background: #71717a;
        }

        .footer-divider {
          color: #3a3a45;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .desktop-nav {
            display: none;
          }

          .mobile-menu-btn {
            display: block;
          }

          .mobile-nav {
            display: flex;
          }

          .header-content {
            padding: 14px 20px;
          }

          .app-main {
            padding: 20px 16px;
          }
        }

        @media (max-width: 640px) {
          .logo-text {
            font-size: 18px;
          }

          .logo-emoji {
            font-size: 24px;
          }

          .logo-badge {
            display: none;
          }

          .footer-content {
            flex-direction: column;
            align-items: flex-start;
          }

          .footer-right {
            flex-wrap: wrap;
          }

          .app-main {
            padding: 16px 12px;
          }
        }

        /* Global Reset */
        :global(*) {
          box-sizing: border-box;
        }

        :global(body) {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            "Helvetica Neue", Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        :global(button) {
          font-family: inherit;
        }

        :global(input, select) {
          font-family: inherit;
        }
      `}</style>
    </>
  );
}
