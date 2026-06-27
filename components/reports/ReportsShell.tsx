// components/reports/ReportsShell.tsx
// ReportsHeader + ReportsTabs + GlobalFilters + KPIGrid
"use client";

import { Download, Calendar, ChevronDown, TrendingUp, TrendingDown, Minus } from "lucide-react";
import Button from "@/components/ui/Button";
import type { KPIItem, ReportsTab, DateRangePreset, ReportFilter, TrendDirection } from "@/services/reports/types";

// ── Header ───────────────────────────────────────────────────────

export function ReportsHeader({ onExport, onSchedule }: { onExport: () => void; onSchedule: () => void }) {
  return (
    <div className="flex items-end justify-between flex-wrap gap-4">
      <div>
        <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[color:var(--text-muted)] mb-1.5">
          BI
        </div>
        <h1 className="text-2xl font-bold text-foreground m-0 tracking-tight leading-tight">Reports</h1>
        <p className="mt-1.5 text-sm text-muted">Analyze business performance across the entire platform.</p>
      </div>
      <div className="flex items-center gap-2.5">
        <Button variant="secondary" size="md" icon={<Calendar size={14} />} onClick={onSchedule}>Schedule Report</Button>
        <Button variant="primary" size="md" icon={<Download size={14} />} onClick={onExport}>Export Report</Button>
      </div>
    </div>
  );
}

// ── Tabs ──────────────────────────────────────────────────────────

const TABS: { key: ReportsTab; label: string }[] = [
  { key: "sales", label: "Sales" },
  { key: "customers", label: "Customers" },
  { key: "music", label: "Music" },
  { key: "licensing", label: "Licensing" },
  { key: "marketing", label: "Marketing" },
  { key: "finance", label: "Finance" },
  { key: "exports", label: "Exports" },
];

export function ReportsTabs({ active, onChange }: { active: ReportsTab; onChange: (t: ReportsTab) => void }) {
  return (
    <div className="flex gap-0 border-b border-[color:var(--border-subtle)] overflow-x-auto">
      {TABS.map(t => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={[
            "px-4 py-3 text-sm font-semibold whitespace-nowrap border-0 bg-transparent cursor-pointer transition-colors border-b-2 -mb-px",
            active === t.key ? "text-accent border-accent" : "text-[color:var(--text-muted)] border-transparent hover:text-foreground",
          ].join(" ")}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ── Global Filters ────────────────────────────────────────────────

const DATE_PRESETS: { value: DateRangePreset; label: string }[] = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "12m", label: "Last 12 months" },
  { value: "ytd", label: "Year to date" },
  { value: "all", label: "All time" },
];

const CURRENCIES = ["USD", "EUR", "GBP", "CAD"];
const COUNTRIES = ["All Countries", "United States", "United Kingdom", "Nigeria", "Germany", "Canada", "Ghana", "Brazil"];
const GENRES = ["All Genres", "Trap", "R&B", "Afrobeats", "Drill", "Lo-Fi", "House", "Pop"];

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] | string[] }) {
  const opts = typeof options[0] === "string"
    ? (options as string[]).map(o => ({ value: o, label: o }))
    : (options as { value: string; label: string }[]);

  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl text-sm text-foreground font-inherit px-3 py-2 pr-8 outline-none focus:border-accent appearance-none cursor-pointer [&>option]:bg-surface min-w-[120px]"
      >
        {opts.map(o => <option key={o.value} value={o.value} className="bg-surface">{o.label}</option>)}
      </select>
      <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)] pointer-events-none" />
    </div>
  );
}

export function GlobalFilters({ filters, onChange }: { filters: ReportFilter; onChange: (patch: Partial<ReportFilter>) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <FilterSelect
        label="Date Range"
        value={filters.dateRange}
        onChange={v => onChange({ dateRange: v as DateRangePreset })}
        options={DATE_PRESETS}
      />
      <FilterSelect
        label="Currency"
        value={filters.currency}
        onChange={v => onChange({ currency: v })}
        options={CURRENCIES}
      />
      <FilterSelect
        label="Genre"
        value={filters.genreId || "All Genres"}
        onChange={v => onChange({ genreId: v === "All Genres" ? "" : v })}
        options={GENRES}
      />
      <FilterSelect
        label="Country"
        value={filters.country || "All Countries"}
        onChange={v => onChange({ country: v === "All Countries" ? "" : v })}
        options={COUNTRIES}
      />
      <div className="ml-auto flex items-center gap-1.5 text-[11px] text-[color:var(--text-muted)]">
        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
        Live data
      </div>
    </div>
  );
}

// ── KPI Grid ──────────────────────────────────────────────────────

const TREND_ICONS: Record<TrendDirection, React.ReactNode> = {
  up: <TrendingUp size={12} />,
  down: <TrendingDown size={12} />,
  flat: <Minus size={12} />,
};

function kpiChangeColor(kpi: KPIItem) {
  // For refund rate, down is good
  const inverseMetrics = ["refund", "conversion"]; // conversion down is bad, refund down is good
  if (kpi.id === "refund") return kpi.trend === "up" ? "text-danger" : "text-success";
  return kpi.trend === "up" ? "text-success" : kpi.trend === "down" ? "text-danger" : "text-[color:var(--text-muted)]";
}

export function KPIGrid({ kpis }: { kpis: KPIItem[] }) {
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
      {kpis.map(kpi => {
        const changeColor = kpiChangeColor(kpi);
        return (
          <div key={kpi.id} className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4 flex flex-col gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[color:var(--text-muted)]">{kpi.title}</p>
            <p className={`text-2xl font-black tracking-tight leading-none ${kpi.color}`}>{kpi.value}</p>
            <div className="flex items-center gap-1.5 mt-auto">
              <span className={`flex items-center gap-0.5 text-xs font-bold ${changeColor}`}>
                {TREND_ICONS[kpi.trend]}
                {kpi.change > 0 ? "+" : ""}{kpi.change}%
              </span>
              <span className="text-[10px] text-[color:var(--text-muted)]">{kpi.comparison}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
