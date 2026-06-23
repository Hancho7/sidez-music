// app/(dashboard)/dashboard/page.tsx
import { Suspense } from "react";
import KpiCardsGrid from "@/components/dashboard/KpiCardsGrid";
import RevenueChartSection from "@/components/dashboard/RevenueChartSection";
import TopTracksTable from "@/components/dashboard/TopTracksTable";
import TopArtistsTable from "@/components/dashboard/TopArtistsTable";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import SystemStatsPanel from "@/components/dashboard/SystemStatsPanel";
import TodayDate from "@/components/dashboard/TodayDate";
import {
  KpiSkeleton,
  ChartSkeleton,
  TableSkeleton,
  ActivitySkeleton,
  SystemSkeleton,
} from "@/components/dashboard/DashboardSkeletons";
import type { DashboardData } from "@/services/dashboard/types";
import { MOCK_DASHBOARD } from "@/services/dashboard/mock-data";

async function fetchDashboardData(): Promise<DashboardData> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // No API configured — use mock data immediately, no network call
  if (!apiUrl) return MOCK_DASHBOARD;

  try {
    const res = await fetch(`${apiUrl}/api/admin/dashboard`, {
      next: { revalidate: 60 },
      // Abort after 5 seconds so a dead server never hangs the page
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    return res.json();
  } catch {
    return MOCK_DASHBOARD;
  }
}

async function KpiSection() {
  const data = await fetchDashboardData();
  return <KpiCardsGrid kpis={data.kpis} />;
}

async function ChartSection() {
  const data = await fetchDashboardData();
  return <RevenueChartSection data={data.revenueChart} />;
}

async function PerformanceSection() {
  const data = await fetchDashboardData();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <TopTracksTable tracks={data.topTracks} />
      <TopArtistsTable artists={data.topArtists} />
    </div>
  );
}

async function ActivitySection() {
  const data = await fetchDashboardData();
  return <ActivityFeed items={data.recentActivity} />;
}

async function SystemSection() {
  const data = await fetchDashboardData();
  return <SystemStatsPanel stats={data.systemStats} />;
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-widest uppercase text-[color:var(--text-muted)] mb-1.5">
            Overview
          </p>
          <h1 className="text-2xl font-bold text-foreground m-0 tracking-tight leading-tight">
            Dashboard
          </h1>
        </div>
        <TodayDate />
      </div>

      <Suspense fallback={<KpiSkeleton />}>
        <KpiSection />
      </Suspense>

      <Suspense fallback={<ChartSkeleton />}>
        <ChartSection />
      </Suspense>

      <Suspense fallback={
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <TableSkeleton />
          <TableSkeleton />
        </div>
      }>
        <PerformanceSection />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">
        <Suspense fallback={<ActivitySkeleton />}>
          <ActivitySection />
        </Suspense>
        <Suspense fallback={<SystemSkeleton />}>
          <SystemSection />
        </Suspense>
      </div>
    </div>
  );
}
