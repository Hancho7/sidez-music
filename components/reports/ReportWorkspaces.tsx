// components/reports/ReportWorkspaces.tsx
"use client";

import { useState } from "react";
import { Download, RefreshCw, Trash2, Mail, Calendar, FileText, FileSpreadsheet, File, Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import { MetricCard, BarChart, RankTable, RevenueBreakdown, SectionTitle } from "./ChartPrimitives";
import type {
  SalesData, CustomerData, MusicData, LicensingData,
  MarketingData, FinanceData, ScheduledReport, ExportHistoryItem, ExportFormat,
} from "@/services/reports/types";

// ── Sales Workspace ──────────────────────────────────────────────

export function SalesWorkspace({ data }: { data: SalesData }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MetricCard label="Total Revenue" value={`$${data.totalRevenue.toLocaleString()}`} change={12.4} color="text-success" />
        <MetricCard label="Total Orders" value={data.totalOrders.toLocaleString()} change={8.1} color="text-accent" />
        <MetricCard label="Total Refunds" value={`$${data.totalRefunds.toLocaleString()}`} change={-3.2} color="text-danger" />
        <MetricCard label="Avg. Order Value" value={`$${data.avgOrderValue.toFixed(2)}`} change={3.8} color="text-[color:var(--accent-magenta)]" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <BarChart title="Revenue Over Time" data={data.revenueOverTime} color="#7c3aed" formatValue={v => `$${(v / 1000).toFixed(0)}k`} />
        <BarChart title="Orders Over Time" data={data.ordersOverTime} color="#06b6d4" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <RankTable title="Top Selling Products" items={data.topProducts} accentColor="#7c3aed" />
        <RankTable title="Top Categories" items={data.topCategories} accentColor="#06b6d4" />
      </div>
    </div>
  );
}

// ── Customers Workspace ──────────────────────────────────────────

export function CustomersWorkspace({ data }: { data: CustomerData }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MetricCard label="New Customers" value={data.newCustomers.toLocaleString()} change={5.3} color="text-accent" />
        <MetricCard label="Returning" value={data.returningCustomers.toLocaleString()} change={2.1} color="text-accent-cyan" />
        <MetricCard label="Avg. Lifetime Value" value={`$${data.avgLifetimeValue}`} change={8.4} color="text-[color:var(--accent-magenta)]" />
        <MetricCard label="Retention Rate" value={`${data.retentionRate}%`} change={1.2} color="text-success" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <BarChart title="New Customers Over Time" data={data.newOverTime} color="#7c3aed" />
        <RankTable title="Geographic Distribution" items={data.byCountry} accentColor="#06b6d4" />
      </div>
      <RankTable title="Top Customers by Lifetime Value" items={data.topCustomers} accentColor="#7c3aed" />
    </div>
  );
}

// ── Music Workspace ──────────────────────────────────────────────

export function MusicWorkspace({ data }: { data: MusicData }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MetricCard label="Total Downloads" value={data.totalDownloads.toLocaleString()} change={21.6} color="text-accent" />
        <MetricCard label="Total Purchases" value={data.totalPurchases.toLocaleString()} change={8.1} color="text-success" />
        <MetricCard label="Music Revenue" value={`$${data.musicRevenue.toLocaleString()}`} change={12.4} color="text-[color:var(--accent-magenta)]" />
        <MetricCard label="Inactive Tracks" value={data.inactiveTracks.toString()} color="text-[color:var(--color-warning)]" />
      </div>
      <BarChart title="Downloads Over Time" data={data.downloadsOverTime} color="#7c3aed" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <RankTable title="Top Tracks" items={data.topTracks} accentColor="#7c3aed" />
        <RankTable title="Top Artists" items={data.topArtists} accentColor="#06b6d4" />
        <RankTable title="Top Genres" items={data.topGenres} accentColor="#10b981" />
      </div>
    </div>
  );
}

// ── Licensing Workspace ──────────────────────────────────────────

export function LicensingWorkspace({ data }: { data: LicensingData }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MetricCard label="Exclusive Sales" value={data.exclusiveSales.toString()} change={15.2} color="text-[color:var(--color-warning)]" />
        <MetricCard label="Premium Sales" value={data.premiumSales.toLocaleString()} change={8.1} color="text-accent" />
        <MetricCard label="Basic Sales" value={data.basicSales.toLocaleString()} change={3.4} color="text-accent-cyan" />
        <MetricCard label="License Conversion" value={`${data.licenseConversionRate}%`} change={1.8} color="text-success" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <BarChart title="License Revenue Over Time" data={data.licenseRevenueOverTime} color="#7c3aed" formatValue={v => `$${(v / 1000).toFixed(0)}k`} />
        <RankTable title="Revenue by License Type" items={data.revenueByLicense} accentColor="#7c3aed" />
      </div>
      <div className="bg-accent/5 border border-accent/20 rounded-xl px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
          <FileText size={16} className="text-accent" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Most Popular License</p>
          <p className="text-xs text-[color:var(--text-muted)]">{data.mostPopularLicense} — highest purchase frequency this period</p>
        </div>
      </div>
    </div>
  );
}

// ── Marketing Workspace ──────────────────────────────────────────

export function MarketingReportWorkspace({ data }: { data: MarketingData }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MetricCard label="Campaign Revenue" value={`$${data.campaignRevenue.toLocaleString()}`} change={18.4} color="text-success" />
        <MetricCard label="Banner Clicks" value={data.bannerClicks.toLocaleString()} change={11.2} color="text-accent" />
        <MetricCard label="Email Open Rate" value={`${data.emailOpenRate}%`} change={3.1} color="text-accent-cyan" />
        <MetricCard label="Avg. CTR" value={`${data.avgCtr}%`} change={0.8} color="text-[color:var(--accent-magenta)]" />
      </div>
      <BarChart title="Campaign Revenue Over Time" data={data.campaignRevenueOverTime} color="#7c3aed" formatValue={v => `$${(v / 1000).toFixed(0)}k`} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <RankTable title="Top Campaigns" items={data.topCampaigns} accentColor="#7c3aed" />
        <RankTable title="Top Featured Tracks" items={data.topFeaturedTracks} accentColor="#06b6d4" />
      </div>
    </div>
  );
}

// ── Finance Workspace ────────────────────────────────────────────

export function FinanceWorkspace({ data }: { data: FinanceData }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MetricCard label="Gross Revenue" value={`$${data.grossRevenue.toLocaleString()}`} change={12.4} color="text-success" />
        <MetricCard label="Net Revenue" value={`$${data.netRevenue.toLocaleString()}`} change={11.8} color="text-accent" />
        <MetricCard label="Monthly Growth" value={`${data.monthlyGrowth}%`} change={2.1} color="text-[color:var(--accent-magenta)]" />
        <MetricCard label="Annual Growth" value={`${data.annualGrowth}%`} change={14.2} color="text-accent-cyan" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MetricCard label="Taxes" value={`$${data.taxes.toLocaleString()}`} color="text-[color:var(--color-warning)]" />
        <MetricCard label="Refunds" value={`$${data.refunds.toLocaleString()}`} color="text-danger" />
        <MetricCard label="Outstanding" value={`$${data.outstandingPayments.toLocaleString()}`} color="text-[color:var(--color-warning)]" />
        <MetricCard label="Net Margin" value={`${((data.netRevenue / data.grossRevenue) * 100).toFixed(1)}%`} color="text-success" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <BarChart title="Monthly Revenue" data={data.monthlyRevenue} color="#7c3aed" formatValue={v => `$${(v / 1000).toFixed(0)}k`} />
        <RevenueBreakdown title="Revenue by Category" items={data.revenueBreakdown} total={data.grossRevenue} />
      </div>
    </div>
  );
}

// ── Exports Workspace ────────────────────────────────────────────

const FORMAT_ICONS: Record<ExportFormat, React.ReactNode> = {
  csv: <FileText size={14} className="text-accent-cyan" />,
  xlsx: <FileSpreadsheet size={14} className="text-success" />,
  pdf: <File size={14} className="text-danger" />,
};

const FREQ_LABELS: Record<string, string> = { daily: "Daily", weekly: "Weekly", monthly: "Monthly" };

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function ExportsWorkspace({
  scheduled, history, onDelete,
}: {
  scheduled: ScheduledReport[];
  history: ExportHistoryItem[];
  onDelete: (id: string) => void;
}) {
  const [downloading, setDownloading] = useState<string | null>(null);

  const simulateDownload = async (id: string) => {
    setDownloading(id);
    await new Promise(r => setTimeout(r, 1200));
    setDownloading(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Quick export */}
      <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-5">
        <SectionTitle>Quick Export</SectionTitle>
        <p className="text-sm text-[color:var(--text-secondary)] mb-4">Export the currently filtered dataset in your preferred format.</p>
        <div className="flex flex-wrap gap-3">
          {(["csv", "xlsx", "pdf"] as ExportFormat[]).map(fmt => (
            <Button key={fmt} variant="secondary" size="md" icon={FORMAT_ICONS[fmt]} onClick={() => simulateDownload(fmt)} loading={downloading === fmt}>
              Export as {fmt.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>

      {/* Scheduled reports */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <SectionTitle>Scheduled Reports</SectionTitle>
          <Button variant="secondary" size="md" icon={<Plus size={13} />} onClick={() => { }}>New Schedule</Button>
        </div>
        <div className="flex flex-col gap-2">
          {scheduled.map(r => (
            <div key={r.id} className="flex items-center gap-4 bg-surface border border-[color:var(--border-subtle)] rounded-xl px-4 py-3">
              <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                {FORMAT_ICONS[r.format]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{r.name}</p>
                <p className="text-[11px] text-[color:var(--text-muted)]">
                  {FREQ_LABELS[r.frequency]} · {r.format.toUpperCase()} · {r.recipients.join(", ")}
                </p>
              </div>
              <div className="text-right shrink-0 text-[11px] text-[color:var(--text-muted)]">
                <p className="flex items-center gap-1 justify-end"><Calendar size={10} /> Next: {fmtDate(r.nextRun)}</p>
                {r.lastRun && <p className="mt-0.5">Last: {fmtDate(r.lastRun)}</p>}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Button variant="secondary" size="sm" icon={<RefreshCw size={12} />} onClick={() => { }}>Run Now</Button>
                <button onClick={() => onDelete(r.id)} className="w-7 h-7 rounded-lg flex items-center justify-center bg-transparent border-0 cursor-pointer text-[color:var(--text-muted)] hover:bg-danger/10 hover:text-danger transition-colors">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export history */}
      <div>
        <SectionTitle>Export History</SectionTitle>
        <div className="bg-surface border border-[color:var(--border-subtle)] rounded-xl overflow-hidden">
          <div className="flex items-center gap-4 px-4 py-2 border-b border-[color:var(--border-subtle)] bg-elevated/30 text-[10px] font-semibold uppercase tracking-wide text-[color:var(--text-muted)]">
            <div className="w-8 shrink-0" />
            <div className="flex-1">Report</div>
            <div className="w-14 text-center">Format</div>
            <div className="w-16 text-right">Size</div>
            <div className="w-24 text-right">Generated</div>
            <div className="w-28 shrink-0" />
          </div>
          {history.map(item => (
            <div key={item.id} className="flex items-center gap-4 px-4 py-3 border-b border-[color:var(--border-subtle)] last:border-0 hover:bg-elevated/20 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-elevated flex items-center justify-center shrink-0">
                {FORMAT_ICONS[item.format]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{item.name}</p>
                <p className="text-[11px] text-[color:var(--text-muted)]">{item.generatedBy}</p>
              </div>
              <div className="w-14 text-center">
                <span className="text-[10px] font-bold uppercase text-[color:var(--text-muted)] bg-elevated px-1.5 py-0.5 rounded">{item.format}</span>
              </div>
              <div className="w-16 text-right text-xs text-[color:var(--text-muted)]">{item.size}</div>
              <div className="w-24 text-right text-xs text-[color:var(--text-muted)] whitespace-nowrap">{fmtDate(item.generatedAt)}</div>
              <div className="w-28 flex justify-end">
                <Button variant="secondary" size="sm" icon={<Download size={12} />} onClick={() => simulateDownload(item.id)} loading={downloading === item.id}>
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
