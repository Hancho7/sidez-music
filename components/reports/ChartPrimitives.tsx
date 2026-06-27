// components/reports/ChartPrimitives.tsx
"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import type { RankItem, TimeSeriesPoint } from "@/services/reports/types";

// ── Section title ────────────────────────────────────────────────

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold tracking-widest uppercase text-[color:var(--text-muted)] mb-3">{children}</p>
  );
}

// ── Metric card ──────────────────────────────────────────────────

export function MetricCard({
  label, value, change, color = "text-foreground",
}: { label: string; value: string; change?: number; color?: string }) {
  return (
    <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
      <p className="text-[11px] text-[color:var(--text-muted)] mb-1.5">{label}</p>
      <p className={`text-xl font-bold tracking-tight ${color}`}>{value}</p>
      {change !== undefined && (
        <div className={`flex items-center gap-0.5 mt-1.5 text-xs font-semibold ${change >= 0 ? "text-success" : "text-danger"}`}>
          {change >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {change >= 0 ? "+" : ""}{change}%
        </div>
      )}
    </div>
  );
}

// ── Mini bar ─────────────────────────────────────────────────────

export function MiniBar({
  label, value, max, color,
}: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-[color:var(--text-secondary)]">{label}</span>
        <span className="font-semibold text-foreground">{value.toLocaleString()}</span>
      </div>
      <div className="h-1.5 rounded-full bg-elevated overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

// ── Bar chart (time series) ───────────────────────────────────────

export function BarChart({
  title, data, color, formatValue,
}: { title: string; data: TimeSeriesPoint[]; color: string; formatValue?: (v: number) => string }) {
  const max = Math.max(...data.map(p => p.value), 1);
  const fmt = formatValue ?? (v => v.toLocaleString());

  return (
    <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
      <SectionTitle>{title}</SectionTitle>
      <div className="flex items-end gap-1.5 h-32">
        {data.map((p, i) => {
          const pct = max > 0 ? (p.value / max) * 100 : 0;
          return (
            <div key={i} className="flex flex-col items-center gap-1 flex-1 group">
              <div className="relative w-full flex items-end" style={{ height: "100px" }}>
                <div
                  className="w-full rounded-t-md transition-all duration-300 cursor-pointer opacity-80 hover:opacity-100"
                  style={{ height: `${pct}%`, background: color, minHeight: 2 }}
                  title={fmt(p.value)}
                />
              </div>
              <span className="text-[9px] text-[color:var(--text-muted)] hidden group-hover:block absolute whitespace-nowrap">
                {new Date(p.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-2 text-[10px] text-[color:var(--text-muted)]">
        <span>{new Date(data[0]?.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
        <span>{new Date(data[data.length - 1]?.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
      </div>
    </div>
  );
}

// ── Rank table ───────────────────────────────────────────────────

export function RankTable({
  title, items, accentColor,
}: { title: string; items: RankItem[]; accentColor?: string }) {
  const max = Math.max(...items.map(i => i.value), 1);

  return (
    <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
      <SectionTitle>{title}</SectionTitle>
      <div className="flex flex-col gap-3">
        {items.map(item => (
          <div key={item.rank}>
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-[11px] font-mono text-[color:var(--text-muted)] w-4 shrink-0">{item.rank}</span>
                {item.thumbnailUrl !== undefined && (
                  <div className="w-7 h-7 rounded-md overflow-hidden bg-elevated shrink-0">
                    {item.thumbnailUrl ? <img src={item.thumbnailUrl} alt={item.label} className="w-full h-full object-cover" /> : null}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{item.label}</p>
                  {item.sublabel && <p className="text-[10px] text-[color:var(--text-muted)] truncate">{item.sublabel}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {item.change !== undefined && (
                  <span className={`text-[10px] font-bold ${item.change >= 0 ? "text-success" : "text-danger"}`}>
                    {item.change >= 0 ? "+" : ""}{item.change}%
                  </span>
                )}
                <span className="text-xs font-bold text-foreground tabular-nums">{item.valueLabel}</span>
              </div>
            </div>
            <div className="h-1 rounded-full bg-elevated overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${(item.value / max) * 100}%`, background: accentColor ?? "var(--accent-purple)" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Donut-style breakdown ─────────────────────────────────────────

export function RevenueBreakdown({
  title, items, total,
}: { title: string; items: { label: string; value: number; color: string }[]; total: number }) {
  return (
    <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
      <SectionTitle>{title}</SectionTitle>
      <div className="flex flex-col gap-2.5">
        {items.map(item => {
          const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : "0";
          return (
            <div key={item.label}>
              <div className="flex justify-between text-xs mb-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.color }} />
                  <span className="text-[color:var(--text-secondary)]">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[color:var(--text-muted)]">{pct}%</span>
                  <span className="font-semibold text-foreground tabular-nums">${item.value.toLocaleString()}</span>
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-elevated overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: item.color }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
