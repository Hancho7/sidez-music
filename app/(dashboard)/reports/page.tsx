// app/(dashboard)/reports/page.tsx
"use client";

import { useState } from "react";
import {
  ReportsHeader, ReportsTabs, GlobalFilters, KPIGrid,
} from "@/components/reports/ReportsShell";
import {
  SalesWorkspace, CustomersWorkspace, MusicWorkspace,
  LicensingWorkspace, MarketingReportWorkspace, FinanceWorkspace, ExportsWorkspace,
} from "@/components/reports/ReportWorkspaces";
import {
  MOCK_KPIS, MOCK_SALES, MOCK_CUSTOMERS, MOCK_MUSIC,
  MOCK_LICENSING, MOCK_MARKETING_REPORT, MOCK_FINANCE,
  MOCK_SCHEDULED, MOCK_EXPORT_HISTORY,
} from "@/services/reports/mock-data";
import type { ReportsTab, ReportFilter } from "@/services/reports/types";

const DEFAULT_FILTERS: ReportFilter = {
  dateRange: "30d",
  currency: "USD",
  artistId: "",
  genreId: "",
  country: "",
};

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<ReportsTab>("sales");
  const [filters, setFilters] = useState<ReportFilter>(DEFAULT_FILTERS);
  const [scheduled, setScheduled] = useState(MOCK_SCHEDULED);

  const handleDeleteScheduled = (id: string) => {
    if (!window.confirm("Delete this scheduled report?")) return;
    setScheduled(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="flex flex-col gap-6">
      <ReportsHeader
        onExport={() => { }}
        onSchedule={() => { }}
      />

      {/* Global filters */}
      <div className="bg-surface border border-[color:var(--border-subtle)] rounded-2xl px-5 py-4">
        <GlobalFilters filters={filters} onChange={patch => setFilters(prev => ({ ...prev, ...patch }))} />
      </div>

      {/* KPI grid */}
      <KPIGrid kpis={MOCK_KPIS} />

      {/* Workspace */}
      <div className="bg-surface border border-[color:var(--border-subtle)] rounded-2xl overflow-hidden">
        <div className="px-5 pt-4">
          <ReportsTabs active={activeTab} onChange={setActiveTab} />
        </div>

        <div className="p-5">
          {activeTab === "sales" && <SalesWorkspace data={MOCK_SALES} />}
          {activeTab === "customers" && <CustomersWorkspace data={MOCK_CUSTOMERS} />}
          {activeTab === "music" && <MusicWorkspace data={MOCK_MUSIC} />}
          {activeTab === "licensing" && <LicensingWorkspace data={MOCK_LICENSING} />}
          {activeTab === "marketing" && <MarketingReportWorkspace data={MOCK_MARKETING_REPORT} />}
          {activeTab === "finance" && <FinanceWorkspace data={MOCK_FINANCE} />}
          {activeTab === "exports" && (
            <ExportsWorkspace
              scheduled={scheduled}
              history={MOCK_EXPORT_HISTORY}
              onDelete={handleDeleteScheduled}
            />
          )}
        </div>
      </div>
    </div>
  );
}
