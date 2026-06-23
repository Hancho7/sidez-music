// services/dashboard/mock-data.ts
import type { DashboardData } from "./types";

function generateRevenuePoints(days: number): { date: string; value: number }[] {
  const points = [];
  const now = new Date();
  let base = 3200;
  for (let i = days; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    base = Math.max(800, base + (Math.random() - 0.42) * 600);
    points.push({
      date: d.toISOString().split("T")[0],
      value: Math.round(base),
    });
  }
  return points;
}

export const MOCK_DASHBOARD: DashboardData = {
  kpis: {
    revenue: 128450,
    orders: 3842,
    tracks: 1247,
    users: 9631,
    pendingOffers: 38,
    membershipRevenue: 24180,
  },
  revenueChart: generateRevenuePoints(29),
  topTracks: [
    { title: "Midnight Bloom", artist: "Aura Keys", sales: 412, revenue: 8240, plays: 91200 },
    { title: "Solar Drift", artist: "KXNG Nova", sales: 388, revenue: 7760, plays: 84300 },
    { title: "Chrome Waves", artist: "Phasma", sales: 341, revenue: 6820, plays: 73100 },
    { title: "Neon Veil", artist: "Luma Sol", sales: 299, revenue: 5980, plays: 68400 },
    { title: "Static Rain", artist: "KXNG Nova", sales: 274, revenue: 5480, plays: 59700 },
  ],
  topArtists: [
    { name: "KXNG Nova", sales: 662, revenue: 13240, tracks: 18 },
    { name: "Aura Keys", sales: 589, revenue: 11780, tracks: 14 },
    { name: "Phasma", sales: 512, revenue: 10240, tracks: 22 },
    { name: "Luma Sol", sales: 431, revenue: 8620, tracks: 11 },
    { name: "Drift Echo", sales: 378, revenue: 7560, tracks: 9 },
  ],
  recentActivity: [
    { type: "PURCHASE", message: "alex.carter purchased 'Midnight Bloom' (Pro License)", timestamp: new Date(Date.now() - 2 * 60000).toISOString() },
    { type: "USER", message: "New user registered: maya.osei@gmail.com", timestamp: new Date(Date.now() - 7 * 60000).toISOString() },
    { type: "UPLOAD", message: "KXNG Nova uploaded a new track: 'Glass Horizon'", timestamp: new Date(Date.now() - 18 * 60000).toISOString() },
    { type: "MEMBERSHIP", message: "daniel.wu upgraded to Pro membership", timestamp: new Date(Date.now() - 34 * 60000).toISOString() },
    { type: "OFFER", message: "Offer #4821 accepted — $340 exclusive deal", timestamp: new Date(Date.now() - 51 * 60000).toISOString() },
    { type: "PURCHASE", message: "sara.m purchased Sound Kit 'LoFi Vault v2'", timestamp: new Date(Date.now() - 72 * 60000).toISOString() },
    { type: "OFFER", message: "Offer #4819 rejected by Phasma", timestamp: new Date(Date.now() - 98 * 60000).toISOString() },
    { type: "UPLOAD", message: "Luma Sol uploaded a new track: 'Neon Veil (Extended)'", timestamp: new Date(Date.now() - 130 * 60000).toISOString() },
  ],
  systemStats: {
    storageUsed: "1.84 TB",
    totalTracks: 1247,
    activeSubscriptions: 2391,
    digitalProducts: 184,
  },
};
