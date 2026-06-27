// services/reports/types.ts

export type ReportsTab = "sales" | "customers" | "music" | "licensing" | "marketing" | "finance" | "exports";
export type DateRangePreset = "7d" | "30d" | "90d" | "12m" | "ytd" | "all";
export type ExportFormat = "csv" | "xlsx" | "pdf";
export type ReportFrequency = "daily" | "weekly" | "monthly";
export type TrendDirection = "up" | "down" | "flat";

export interface ReportFilter {
  dateRange: DateRangePreset;
  currency: string;
  artistId: string;
  genreId: string;
  country: string;
}

export interface KPIItem {
  id: string;
  title: string;
  value: string;
  rawValue: number;
  change: number;       // percentage vs previous period
  trend: TrendDirection;
  comparison: string;   // e.g. "vs last 30 days"
  format: "currency" | "number" | "percent";
  color: string;
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
}

export interface RankItem {
  rank: number;
  label: string;
  sublabel?: string;
  value: number;
  valueLabel: string;
  change?: number;
  thumbnailUrl?: string | null;
}

// ── Sales ─────────────────────────────────────────────────────────

export interface SalesData {
  revenueOverTime: TimeSeriesPoint[];
  ordersOverTime: TimeSeriesPoint[];
  topProducts: RankItem[];
  topCategories: RankItem[];
  totalRevenue: number;
  totalOrders: number;
  totalRefunds: number;
  avgOrderValue: number;
  refundRate: number;
}

// ── Customers ─────────────────────────────────────────────────────

export interface CustomerData {
  newCustomers: number;
  returningCustomers: number;
  avgLifetimeValue: number;
  avgSpend: number;
  topCustomers: RankItem[];
  byCountry: RankItem[];
  retentionRate: number;
  churnRate: number;
  newOverTime: TimeSeriesPoint[];
}

// ── Music ─────────────────────────────────────────────────────────

export interface MusicData {
  topTracks: RankItem[];
  topArtists: RankItem[];
  topGenres: RankItem[];
  totalDownloads: number;
  totalPurchases: number;
  musicRevenue: number;
  inactiveTracks: number;
  downloadsOverTime: TimeSeriesPoint[];
}

// ── Licensing ─────────────────────────────────────────────────────

export interface LicensingData {
  revenueByLicense: RankItem[];
  exclusiveSales: number;
  premiumSales: number;
  basicSales: number;
  licenseConversionRate: number;
  mostPopularLicense: string;
  licenseRevenueOverTime: TimeSeriesPoint[];
}

// ── Marketing ─────────────────────────────────────────────────────

export interface MarketingData {
  campaignRevenue: number;
  bannerClicks: number;
  emailOpenRate: number;
  avgCtr: number;
  topCampaigns: RankItem[];
  topFeaturedTracks: RankItem[];
  campaignRevenueOverTime: TimeSeriesPoint[];
}

// ── Finance ───────────────────────────────────────────────────────

export interface FinanceData {
  grossRevenue: number;
  netRevenue: number;
  taxes: number;
  refunds: number;
  outstandingPayments: number;
  monthlyGrowth: number;
  annualGrowth: number;
  revenueBreakdown: { label: string; value: number; color: string }[];
  monthlyRevenue: TimeSeriesPoint[];
}

// ── Exports ───────────────────────────────────────────────────────

export interface ScheduledReport {
  id: string;
  name: string;
  frequency: ReportFrequency;
  format: ExportFormat;
  recipients: string[];
  lastRun: string | null;
  nextRun: string;
  createdBy: string;
}

export interface ExportHistoryItem {
  id: string;
  name: string;
  format: ExportFormat;
  size: string;
  generatedBy: string;
  generatedAt: string;
  url: string;
}
