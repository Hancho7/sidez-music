// components/marketing/AnalyticsWorkspace.tsx
"use client";

import { TrendingUp, MousePointer, BarChart3, Mail, Megaphone, Zap, Image, Star } from "lucide-react";
import type { MarketingAnalytics } from "@/services/marketing/types";

interface Props {
  analytics: MarketingAnalytics;
}

function MiniBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-[color:var(--text-secondary)]">{label}</span>
        <span className="font-semibold text-foreground">{value.toLocaleString()}</span>
      </div>
      <div className="h-1.5 rounded-full bg-elevated overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${max > 0 ? Math.min((value / max) * 100, 100) : 0}%`, background: color }} />
      </div>
    </div>
  );
}

function fmtShort(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function AnalyticsWorkspace({ analytics }: Props) {
  const maxRevenue = Math.max(...analytics.revenueOverTime.map(p => p.amount), 1);
  const maxClicks = Math.max(...analytics.clicksOverTime.map(p => p.count), 1);
  const maxConversions = Math.max(...analytics.conversionsOverTime.map(p => p.count), 1);

  return (
    <div className="flex flex-col gap-6">
      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { label: "Campaign Revenue", value: `$${analytics.totalRevenue.toLocaleString()}`, color: "text-success", icon: <TrendingUp size={14} />, bg: "bg-success/10" },
          { label: "Total Conversions", value: analytics.totalConversions.toLocaleString(), color: "text-accent", icon: <BarChart3 size={14} />, bg: "bg-accent/10" },
          { label: "Avg. CTR", value: `${analytics.averageCtr}%`, color: "text-[color:var(--accent-magenta)]", icon: <MousePointer size={14} />, bg: "bg-[color:var(--accent-magenta)]/10" },
          { label: "Email Open Rate", value: `${analytics.emailOpenRate}%`, color: "text-accent-cyan", icon: <Mail size={14} />, bg: "bg-accent-cyan/10" },
          { label: "Active Campaigns", value: analytics.activeCampaigns.toString(), color: "text-[color:var(--color-warning)]", icon: <Megaphone size={14} />, bg: "bg-[color:var(--color-warning)]/10" },
          { label: "Top Campaign", value: analytics.topCampaign, color: "text-foreground", icon: <Zap size={14} />, bg: "bg-elevated", small: true },
        ].map(kpi => (
          <div key={kpi.label} className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4 flex flex-col gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${kpi.bg} ${kpi.color}`}>{kpi.icon}</div>
            <div className={`${kpi.small ? "text-sm font-bold truncate" : "text-xl font-bold"} ${kpi.color} leading-tight`}>{kpi.value}</div>
            <div className="text-[11px] text-[color:var(--text-muted)]">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Revenue */}
        <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-[color:var(--text-muted)] mb-3">Revenue Over Time</p>
          <div className="flex flex-col gap-2">
            {analytics.revenueOverTime.map(p => (
              <MiniBar key={p.date} label={fmtShort(p.date)} value={p.amount} max={maxRevenue} color="var(--accent-purple)" />
            ))}
          </div>
        </div>

        {/* Clicks */}
        <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-[color:var(--text-muted)] mb-3">Clicks Over Time</p>
          <div className="flex flex-col gap-2">
            {analytics.clicksOverTime.map(p => (
              <MiniBar key={p.date} label={fmtShort(p.date)} value={p.count} max={maxClicks} color="var(--accent-cyan)" />
            ))}
          </div>
        </div>

        {/* Conversions */}
        <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-[color:var(--text-muted)] mb-3">Conversions Over Time</p>
          <div className="flex flex-col gap-2">
            {analytics.conversionsOverTime.map(p => (
              <MiniBar key={p.date} label={fmtShort(p.date)} value={p.count} max={maxConversions} color="#10b981" />
            ))}
          </div>
        </div>
      </div>

      {/* Top performers */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[color:var(--color-warning)]/10 flex items-center justify-center"><Image size={14} className="text-[color:var(--color-warning)]" /></div>
            <p className="text-xs font-semibold text-[color:var(--text-muted)] uppercase tracking-wide">Most Viewed Banner</p>
          </div>
          <p className="text-sm font-bold text-foreground">{analytics.topBanner}</p>
          <p className="text-[11px] text-[color:var(--text-muted)]">Highest CTR this period</p>
        </div>
        <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center"><Star size={14} className="text-success" /></div>
            <p className="text-xs font-semibold text-[color:var(--text-muted)] uppercase tracking-wide">Top Promotion</p>
          </div>
          <p className="text-sm font-bold text-foreground">{analytics.topPromotion}</p>
          <p className="text-[11px] text-[color:var(--text-muted)]">Highest conversion rate</p>
        </div>
      </div>
    </div>
  );
}
