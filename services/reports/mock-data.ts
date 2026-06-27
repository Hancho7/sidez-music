// services/reports/mock-data.ts
import type {
  KPIItem, SalesData, CustomerData, MusicData,
  LicensingData, MarketingData, FinanceData,
  ScheduledReport, ExportHistoryItem,
} from "./types";

function weeksAgo(n: number) {
  const d = new Date(); d.setDate(d.getDate() - n * 7); return d.toISOString().split("T")[0];
}
function daysAgo(n: number) {
  const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString();
}
function daysFromNow(n: number) {
  const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString();
}
function rand(a: number, b: number) { return Math.floor(Math.random() * (b - a + 1)) + a; }

// ── KPIs ──────────────────────────────────────────────────────────

export const MOCK_KPIS: KPIItem[] = [
  { id: "revenue", title: "Revenue", value: "$284,920", rawValue: 284920, change: +12.4, trend: "up", comparison: "vs last 30 days", format: "currency", color: "text-success" },
  { id: "orders", title: "Orders", value: "4,840", rawValue: 4840, change: +8.1, trend: "up", comparison: "vs last 30 days", format: "number", color: "text-accent" },
  { id: "customers", title: "New Customers", value: "1,240", rawValue: 1240, change: +5.3, trend: "up", comparison: "vs last 30 days", format: "number", color: "text-accent-cyan" },
  { id: "aov", title: "Avg Order Value", value: "$58.87", rawValue: 58.87, change: +3.8, trend: "up", comparison: "vs last 30 days", format: "currency", color: "text-[color:var(--accent-magenta)]" },
  { id: "conversion", title: "Conversion Rate", value: "4.2%", rawValue: 4.2, change: -0.4, trend: "down", comparison: "vs last 30 days", format: "percent", color: "text-[color:var(--color-warning)]" },
  { id: "refund", title: "Refund Rate", value: "1.8%", rawValue: 1.8, change: -0.2, trend: "up", comparison: "vs last 30 days", format: "percent", color: "text-success" },
  { id: "downloads", title: "Downloads", value: "18,420", rawValue: 18420, change: +21.6, trend: "up", comparison: "vs last 30 days", format: "number", color: "text-accent" },
  { id: "tracks", title: "Active Tracks", value: "2,840", rawValue: 2840, change: +47, trend: "up", comparison: "new this period", format: "number", color: "text-accent-cyan" },
];

const makeSeries = (weeks: number, min: number, max: number) =>
  Array.from({ length: weeks }, (_, i) => ({ date: weeksAgo(weeks - 1 - i), value: rand(min, max) }));

// ── Sales ─────────────────────────────────────────────────────────

export const MOCK_SALES: SalesData = {
  revenueOverTime: makeSeries(8, 18000, 48000),
  ordersOverTime: makeSeries(8, 280, 820),
  topProducts: [
    { rank: 1, label: "KXNG Trap Essentials", sublabel: "Sound Kit", value: 78340, valueLabel: "$78,340", change: +14 },
    { rank: 2, label: "Nova Essentials Vol. 1", sublabel: "Collection", value: 41200, valueLabel: "$41,200", change: +8 },
    { rank: 3, label: "Midnight Bloom", sublabel: "Track", value: 31800, valueLabel: "$31,800", change: +22 },
    { rank: 4, label: "Solar Drift (Exclusive)", sublabel: "Track", value: 28400, valueLabel: "$28,400", change: -5 },
    { rank: 5, label: "Afrobeats Construction Kit", sublabel: "Sound Kit", value: 18360, valueLabel: "$18,360", change: +31 },
  ],
  topCategories: [
    { rank: 1, label: "Trap", value: 94200, valueLabel: "$94,200", change: +11 },
    { rank: 2, label: "R&B / Soul", value: 62400, valueLabel: "$62,400", change: +6 },
    { rank: 3, label: "Afrobeats", value: 48100, valueLabel: "$48,100", change: +28 },
    { rank: 4, label: "Drill", value: 29800, valueLabel: "$29,800", change: +15 },
    { rank: 5, label: "Lo-Fi", value: 18200, valueLabel: "$18,200", change: +4 },
  ],
  totalRevenue: 284920, totalOrders: 4840, totalRefunds: 1840, avgOrderValue: 58.87, refundRate: 1.8,
};

// ── Customers ────────────────────────────────────────────────────

export const MOCK_CUSTOMERS: CustomerData = {
  newCustomers: 1240, returningCustomers: 3600,
  avgLifetimeValue: 284, avgSpend: 58.87, retentionRate: 68.4, churnRate: 31.6,
  newOverTime: makeSeries(8, 80, 280),
  topCustomers: [
    { rank: 1, label: "alex.carter", sublabel: "VIP · 18 orders", value: 4280, valueLabel: "$4,280" },
    { rank: 2, label: "daniel.wu", sublabel: "VIP · 31 orders", value: 7120, valueLabel: "$7,120" },
    { rank: 3, label: "kevin.j", sublabel: "8 orders", value: 1640, valueLabel: "$1,640" },
    { rank: 4, label: "maya.osei", sublabel: "4 orders", value: 840, valueLabel: "$840" },
    { rank: 5, label: "lena.r", sublabel: "6 orders", value: 1200, valueLabel: "$1,200" },
  ],
  byCountry: [
    { rank: 1, label: "United States", value: 42, valueLabel: "42%", change: +2 },
    { rank: 2, label: "United Kingdom", value: 14, valueLabel: "14%", change: +1 },
    { rank: 3, label: "Nigeria", value: 12, valueLabel: "12%", change: +4 },
    { rank: 4, label: "Canada", value: 8, valueLabel: "8%", change: 0 },
    { rank: 5, label: "Germany", value: 7, valueLabel: "7%", change: -1 },
  ],
};

// ── Music ─────────────────────────────────────────────────────────

export const MOCK_MUSIC: MusicData = {
  downloadsOverTime: makeSeries(8, 800, 3200),
  topTracks: [
    { rank: 1, label: "Midnight Bloom", sublabel: "Aura Keys", value: 11240, valueLabel: "11,240 plays", change: +22 },
    { rank: 2, label: "Solar Drift", sublabel: "KXNG Nova", value: 8420, valueLabel: "8,420 plays", change: +11 },
    { rank: 3, label: "Chrome Waves", sublabel: "Phasma", value: 6180, valueLabel: "6,180 plays", change: +8 },
    { rank: 4, label: "Dark Drill #4", sublabel: "Cipher", value: 4920, valueLabel: "4,920 plays", change: +16 },
    { rank: 5, label: "Afrobeats Groove", sublabel: "Ayé", value: 3840, valueLabel: "3,840 plays", change: +34 },
  ],
  topArtists: [
    { rank: 1, label: "KXNG Nova", value: 42400, valueLabel: "$42,400", change: +9 },
    { rank: 2, label: "Aura Keys", value: 31800, valueLabel: "$31,800", change: +22 },
    { rank: 3, label: "Phasma", value: 24200, valueLabel: "$24,200", change: +7 },
    { rank: 4, label: "Cipher", value: 18100, valueLabel: "$18,100", change: +14 },
    { rank: 5, label: "Ayé", value: 12400, valueLabel: "$12,400", change: +38 },
  ],
  topGenres: [
    { rank: 1, label: "Trap", value: 94200, valueLabel: "$94,200" },
    { rank: 2, label: "R&B", value: 62400, valueLabel: "$62,400" },
    { rank: 3, label: "Afrobeats", value: 48100, valueLabel: "$48,100" },
    { rank: 4, label: "Drill", value: 29800, valueLabel: "$29,800" },
    { rank: 5, label: "Lo-Fi", value: 18200, valueLabel: "$18,200" },
  ],
  totalDownloads: 18420, totalPurchases: 4840, musicRevenue: 284920, inactiveTracks: 312,
};

// ── Licensing ────────────────────────────────────────────────────

export const MOCK_LICENSING: LicensingData = {
  revenueByLicense: [
    { rank: 1, label: "Premium License", value: 141200, valueLabel: "$141,200", change: +8 },
    { rank: 2, label: "Exclusive License", value: 84800, valueLabel: "$84,800", change: +15 },
    { rank: 3, label: "Basic License", value: 38200, valueLabel: "$38,200", change: +3 },
    { rank: 4, label: "Bundle License", value: 14800, valueLabel: "$14,800", change: +22 },
  ],
  exclusiveSales: 284, premiumSales: 2840, basicSales: 1420,
  licenseConversionRate: 68.4, mostPopularLicense: "Premium License",
  licenseRevenueOverTime: makeSeries(8, 14000, 42000),
};

// ── Marketing ────────────────────────────────────────────────────

export const MOCK_MARKETING_REPORT: MarketingData = {
  campaignRevenue: 140280, bannerClicks: 14820, emailOpenRate: 41.3, avgCtr: 5.8,
  topCampaigns: [
    { rank: 1, label: "New User Onboarding", value: 31260, valueLabel: "$31,260", change: +12 },
    { rank: 2, label: "Summer Drop 2025", value: 78340, valueLabel: "$78,340", change: +8 },
    { rank: 3, label: "VIP Member Spotlight", value: 11400, valueLabel: "$11,400", change: +18 },
    { rank: 4, label: "Afrobeats Festival", value: 19280, valueLabel: "$19,280", change: +31 },
  ],
  topFeaturedTracks: [
    { rank: 1, label: "Solar Drift", sublabel: "Hero banner", value: 4820, valueLabel: "4,820 clicks" },
    { rank: 2, label: "Midnight Bloom", sublabel: "Featured section", value: 3240, valueLabel: "3,240 clicks" },
    { rank: 3, label: "Afrobeats Groove", sublabel: "Trending", value: 2180, valueLabel: "2,180 clicks" },
  ],
  campaignRevenueOverTime: makeSeries(8, 8000, 28000),
};

// ── Finance ───────────────────────────────────────────────────────

export const MOCK_FINANCE: FinanceData = {
  grossRevenue: 284920, netRevenue: 241482, taxes: 22794,
  refunds: 1840, outstandingPayments: 12400,
  monthlyGrowth: 12.4, annualGrowth: 84.2,
  revenueBreakdown: [
    { label: "Track Sales", value: 168400, color: "#7c3aed" },
    { label: "Sound Kits", value: 62800, color: "#06b6d4" },
    { label: "Exclusive Licenses", value: 28400, color: "#10b981" },
    { label: "Collections", value: 14200, color: "#f59e0b" },
    { label: "Services", value: 11120, color: "#ec4899" },
  ],
  monthlyRevenue: makeSeries(12, 14000, 38000),
};

// ── Exports ───────────────────────────────────────────────────────

export const MOCK_SCHEDULED: ScheduledReport[] = [
  { id: "sch-1", name: "Weekly Revenue Summary", frequency: "weekly", format: "xlsx", recipients: ["john@sidez.io"], lastRun: daysAgo(7), nextRun: daysFromNow(0), createdBy: "John Carter" },
  { id: "sch-2", name: "Monthly Finance Report", frequency: "monthly", format: "pdf", recipients: ["john@sidez.io", "lena@sidez.io"], lastRun: daysAgo(30), nextRun: daysFromNow(2), createdBy: "John Carter" },
  { id: "sch-3", name: "Customer Acquisition CSV", frequency: "weekly", format: "csv", recipients: ["sarah@sidez.io"], lastRun: daysAgo(7), nextRun: daysFromNow(0), createdBy: "Sarah Support" },
];

export const MOCK_EXPORT_HISTORY: ExportHistoryItem[] = [
  { id: "exp-1", name: "Revenue Report Q4 2025", format: "xlsx", size: "2.4 MB", generatedBy: "John Carter", generatedAt: daysAgo(1), url: "" },
  { id: "exp-2", name: "Customer List — November", format: "csv", size: "840 KB", generatedBy: "Sarah Support", generatedAt: daysAgo(3), url: "" },
  { id: "exp-3", name: "Finance Summary October", format: "pdf", size: "1.2 MB", generatedBy: "Lena Richter", generatedAt: daysAgo(7), url: "" },
  { id: "exp-4", name: "Music Performance Sept", format: "xlsx", size: "3.1 MB", generatedBy: "John Carter", generatedAt: daysAgo(14), url: "" },
];
