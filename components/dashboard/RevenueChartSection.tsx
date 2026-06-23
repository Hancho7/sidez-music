// components/dashboard/RevenueChartSection.tsx
"use client";

import { RevenuePoint } from "@/services/dashboard/types";
import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Granularity = "daily" | "weekly" | "monthly";

interface Props {
  data: RevenuePoint[];
}

function aggregateWeekly(data: RevenuePoint[]): RevenuePoint[] {
  const groups: Record<string, number> = {};
  data.forEach(pt => {
    const d = new Date(pt.date);
    const week = new Date(d);
    week.setDate(d.getDate() - d.getDay());
    const key = week.toISOString().split("T")[0];
    groups[key] = (groups[key] || 0) + pt.value;
  });
  return Object.entries(groups).map(([date, value]) => ({ date, value }));
}

function aggregateMonthly(data: RevenuePoint[]): RevenuePoint[] {
  const groups: Record<string, number> = {};
  data.forEach(pt => {
    const key = pt.date.slice(0, 7);
    groups[key] = (groups[key] || 0) + pt.value;
  });
  return Object.entries(groups).map(([date, value]) => ({ date, value }));
}

function formatDate(date: string, granularity: Granularity): string {
  const d = new Date(date);
  if (granularity === "monthly") {
    return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
  }
  if (granularity === "weekly") {
    return `Wk ${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function CustomTooltip({ active, payload, label, granularity }: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
  granularity: Granularity;
}) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  const formatted = label ? formatDate(label, granularity) : "";
  return (
    <div className="bg-elevated border border-[#31386d] rounded-lg px-3.5 py-2.5 text-sm">
      <div className="text-[color:var(--text-muted)] mb-1 text-xs">{formatted}</div>
      <div className="text-foreground font-bold text-[16px] tracking-[-0.02em]">
        ${val.toLocaleString()}
      </div>
    </div>
  );
}

export default function RevenueChartSection({ data }: Props) {
  const [granularity, setGranularity] = useState<Granularity>("daily");

  const chartData = useMemo(() => {
    if (granularity === "weekly") return aggregateWeekly(data);
    if (granularity === "monthly") return aggregateMonthly(data);
    return data;
  }, [data, granularity]);

  const totalRevenue = chartData.reduce((s, p) => s + p.value, 0);
  const avgRevenue = chartData.length ? totalRevenue / chartData.length : 0;

  const toggles: { label: string; value: Granularity }[] = [
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
  ];

  return (
    <div className="bg-surface border border-[color:var(--border-subtle)] rounded-[18px] p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[color:var(--text-muted)] mb-1.5">
            Revenue Analytics
          </div>
          <div className="text-[28px] font-bold text-foreground tracking-[-0.03em] leading-none">
            ${totalRevenue.toLocaleString()}
          </div>
          <div className="text-sm text-[color:var(--text-secondary)] mt-1">
            Avg {avgRevenue.toLocaleString("en-US", { maximumFractionDigits: 0, style: "currency", currency: "USD" })} per {granularity === "daily" ? "day" : granularity === "weekly" ? "week" : "month"}
          </div>
        </div>

        {/* Granularity toggle */}
        <div className="flex bg-input border border-[color:var(--border-subtle)] rounded-lg p-[3px] gap-0.5">
          {toggles.map(t => (
            <button
              key={t.value}
              onClick={() => setGranularity(t.value)}
              className={`px-3.5 py-1.5 rounded-[7px] border-0 cursor-pointer text-sm font-semibold transition-colors duration-150
                ${granularity === t.value
                  ? "bg-accent text-white"
                  : "bg-transparent text-[color:var(--text-muted)] hover:text-foreground"
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#1f2547" strokeDasharray="4 4" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={d => formatDate(d, granularity)}
              tick={{ fill: "#66709b", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
              tick={{ fill: "#66709b", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={48}
            />
            <Tooltip content={<CustomTooltip granularity={granularity} />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#7c3aed"
              strokeWidth={2}
              fill="url(#revGrad)"
              dot={false}
              activeDot={{ r: 5, fill: "#7c3aed", stroke: "#f0f2ff", strokeWidth: 1.5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
