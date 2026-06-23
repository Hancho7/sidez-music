// services/customers/types.ts
export type CustomerStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "ARCHIVED";
export type CustomerView = "table" | "cards";
export type CustomerSort = "spending" | "orders" | "joined" | "alpha";

export interface Customer {
  id: string;
  avatar: string | null;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string | null;
  country: string;
  timezone: string;
  language: string;
  currency: string;
  status: CustomerStatus;
  isVip: boolean;
  isVerified: boolean;
  marketingConsent: boolean;
  createdAt: string;
  updatedAt: string;
  // Derived fields
  totalOrders: number;
  totalSpent: number;
  lifetimeValue: number;
  averageOrderValue: number;
  ownedLicenses: number;
  totalDownloads: number;
  lastPurchase: string | null;
}

export interface CustomerOrder {
  id: string;
  orderId: string;
  date: string;
  items: number;
  amount: number;
  status: "PAID" | "PENDING" | "REFUNDED";
}

export interface CustomerLicense {
  id: string;
  trackName: string;
  artistName: string;
  licenseType: string;
  purchaseDate: string;
  downloadCount: number;
  status: "ACTIVE" | "EXPIRED" | "REVOKED";
  expiresAt: string | null;
}

export interface CustomerDownload {
  id: string;
  trackName: string;
  downloadDate: string;
  device: string;
  ipAddress: string;
  downloadCount: number;
  remainingDownloads: number | null;
}

export interface CustomerCoupon {
  id: string;
  code: string;
  discount: number;
  type: "PERCENTAGE" | "FIXED";
  redeemedAt: string;
  orderId: string;
}

export interface CustomerOffer {
  id: string;
  type: "SUBMITTED" | "ACCEPTED" | "REJECTED";
  trackName: string;
  amount: number;
  date: string;
}

export interface CustomerActivity {
  id: string;
  type: "REGISTRATION" | "PURCHASE" | "DOWNLOAD" | "COUPON" | "OFFER" | "REFUND" | "PROFILE_UPDATE" | "NOTE";
  description: string;
  createdAt: string;
}

export interface CustomerNote {
  id: string;
  note: string;
  createdBy: string;
  createdAt: string;
}

export interface CustomerAnalytics {
  lifetimeSpending: number;
  ordersOverTime: { date: string; count: number }[];
  revenueContribution: { date: string; amount: number }[];
  favoriteGenres: { genre: string; count: number }[];
  favoriteArtists: { artist: string; count: number }[];
  averageOrderValue: number;
  purchaseFrequency: number;
  customerLifetimeValue: number;
}

export interface CustomerDetail extends Customer {
  orders: CustomerOrder[];
  licenses: CustomerLicense[];
  downloads: CustomerDownload[];
  coupons: CustomerCoupon[];
  offers: CustomerOffer[];
  activities: CustomerActivity[];
  notes: CustomerNote[];
  analytics: CustomerAnalytics;
}

export interface CustomerFilters {
  search: string;
  status: CustomerStatus | "all";
  isVip: boolean;
  isVerified: boolean;
  highValue: boolean;
  newCustomers: boolean;
  sort: CustomerSort;
  view: CustomerView;
}

export interface CustomerFormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  country: string;
  language: string;
  currency: string;
  status: CustomerStatus;
  isVip: boolean;
  isVerified: boolean;
  marketingConsent: boolean;
}
