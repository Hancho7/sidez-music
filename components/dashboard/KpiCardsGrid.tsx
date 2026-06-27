// components/dashboard/KpiCardsGrid.tsx
"use client";

import { useMemo } from "react";
import type { DashboardKPIs } from "@/services/dashboard/types";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string;
  change: number;
  sparkline: number[];
  accent: string;
}

// Deterministic pseudo-random sparkline seeded from the base value.
// Same inputs → same output on both server and client.
function seededSparkline(base: number, length = 10): number[] {
  const pts: number[] = [base];
  // Simple LCG so there's no Math.random() involved
  let seed = Math.abs(Math.round(base)) || 1;
  for (let i = 1; i < length; i++) {
    seed = (seed * 1664525 + 1013904223) & 0x7fffffff;
    const delta = ((seed % 200) / 1000 - 0.1) * base;
    pts.push(Math.max(0, pts[i - 1] + delta));
  }
  return pts;
}

function Sparkline({ data, accent }: { data: number[]; accent: string }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const W = 80;
  const H = 32;

  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - ((v - min) / range) * H,
  }));

  const pointStr = pts.map(p => `${p.x},${p.y}`).join(" ");
  const first = pts[0];
  const last = pts[pts.length - 1];
  const fillPath = [
    `M${first.x},${first.y}`,
    ...pts.slice(1).map(p => `L${p.x},${p.y}`),
    `L${last.x},${H}`,
    `L${first.x},${H}`,
    "Z",
  ].join(" ");

  const gradId = `sg-${accent.replace("#", "")}`;

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none" aria-hidden>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.3" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fillPath} fill={`url(#${gradId})`} />
      <polyline
        points={pointStr}
        stroke={accent}
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function KpiCard({ label, value, change, sparkline, accent }: KpiCardProps) {
  const positive = change >= 0;
  return (
    <div className="bg-surface border border-[color:var(--border-subtle)] rounded-[10px] p-5 flex flex-col gap-3.5 transition-all duration-200 hover:border-[color:var(--border-default)] hover:-translate-y-0.5 cursor-default">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold tracking-widest uppercase text-[color:var(--text-muted)]">
            {label}
          </span>
          <span className="text-2xl font-bold text-foreground tracking-tight leading-none">
            {value}
          </span>
        </div>
        <Sparkline data={sparkline} accent={accent} />
      </div>
      <div className="flex items-center gap-1.5">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[10px] text-xs font-semibold
          ${positive ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}
        >
          {positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {positive ? "+" : ""}{change}%
        </span>
        <span className="text-xs text-[color:var(--text-muted)]">vs last period</span>
      </div>
    </div>
  );
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}k`;
  return `$${n}`;
}
function fmtCount(n: number): string {
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return `${n}`;
}

interface Props {
  kpis: DashboardKPIs;
}

export default function KpiCardsGrid({ kpis }: Props) {
  // useMemo so sparklines are stable across re-renders on the client too
  const cards = useMemo((): KpiCardProps[] => [
    { label: "Total Revenue", value: fmt(kpis.revenue), change: 12.4, sparkline: seededSparkline(kpis.revenue), accent: "#7c3aed" },
    { label: "Total Orders", value: fmtCount(kpis.orders), change: 8.1, sparkline: seededSparkline(kpis.orders), accent: "#06b6d4" },
    { label: "Total Tracks", value: fmtCount(kpis.tracks), change: 5.7, sparkline: seededSparkline(kpis.tracks), accent: "#a855f7" },
    { label: "Total Users", value: fmtCount(kpis.users), change: 18.3, sparkline: seededSparkline(kpis.users), accent: "#06b6d4" },
    { label: "Pending Offers", value: `${kpis.pendingOffers}`, change: -3.2, sparkline: seededSparkline(kpis.pendingOffers), accent: "#f59e0b" },
    { label: "Membership Rev", value: fmt(kpis.membershipRevenue), change: 22.6, sparkline: seededSparkline(kpis.membershipRevenue), accent: "#ec4899" },
  ], [kpis]);

  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
      {cards.map(card => (
        <KpiCard key={card.label} {...card} />
      ))}
    </div>
  );
}
