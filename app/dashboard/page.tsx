"use client";

import { useState } from "react";
import Sidebar, { type PageId } from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import {
  OverviewPage,
  PricesPage,
  StoresPage,
  SeasonalPage,
  AlertsPage,
  GuidePage,
  FaqPage,
} from "@/components/dashboard";

const PAGE_COMPONENTS: Record<PageId, React.ComponentType> = {
  overview: OverviewPage,
  prices: PricesPage,
  stores: StoresPage,
  seasonal: SeasonalPage,
  alerts: AlertsPage,
  guide: GuidePage,
};

export default function Dashboard() {
  const [activePage, setActivePage] = useState<PageId>("overview");

  const PageComponent = PAGE_COMPONENTS[activePage];

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f6f8f5",
      }}
    >
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Topbar activePage={activePage} />
        <main
          style={{
            flex: 1,
            padding: "20px 24px 48px",
            overflowY: "auto",
          }}
        >
          <PageComponent key={activePage} />
        </main>
      </div>
    </div>
  );
}
