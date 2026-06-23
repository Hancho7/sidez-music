// services/dashboard/types.ts

export interface DashboardKPIs {
  revenue: number;
  orders: number;
  tracks: number;
  users: number;
  pendingOffers: number;
  membershipRevenue: number;
}

export interface RevenuePoint {
  date: string;
  value: number;
}

export interface TopTrack {
  title: string;
  artist: string;
  sales: number;
  revenue: number;
  plays: number;
}

export interface TopArtist {
  name: string;
  sales: number;
  revenue: number;
  tracks: number;
}

export type ActivityType = "PURCHASE" | "UPLOAD" | "OFFER" | "USER" | "MEMBERSHIP";

export interface ActivityItem {
  type: ActivityType;
  message: string;
  timestamp: string;
}

export interface SystemStats {
  storageUsed: string;
  totalTracks: number;
  activeSubscriptions: number;
  digitalProducts: number;
}

export interface DashboardData {
  kpis: DashboardKPIs;
  revenueChart: RevenuePoint[];
  topTracks: TopTrack[];
  topArtists: TopArtist[];
  recentActivity: ActivityItem[];
  systemStats: SystemStats;
}
