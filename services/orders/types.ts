// services/orders/types.ts

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";
export type LicenseType = "Basic" | "Premium" | "Unlimited" | "Exclusive";
export type PaymentMethod = "stripe" | "paypal" | "manual";
export type SortOption = "newest" | "oldest" | "highest" | "lowest";
export type RefundStatus = "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";

// Snapshot of the license rights at the moment of purchase.
// This must NOT change even if the underlying license plan is edited later —
// it's the legal record of what the customer actually bought.
export interface LicenseRightsSnapshot {
  commercialUse: boolean;
  streamingAllowed: boolean;
  radioAllowed: boolean;
  tvAllowed: boolean;
  monetizationAllowed: boolean;
  maxStreams: number | null;
  maxDistribution: number | null;
  territory: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  trackId: string;
  trackName: string;
  artistName: string;
  licenseType: LicenseType;
  price: number;
  downloadUrl: string | null;
  rights: LicenseRightsSnapshot;
}

export interface PaymentStatusEvent {
  status: PaymentStatus;
  timestamp: string;
  note?: string;
}

export interface Payment {
  id: string;
  orderId: string;
  provider: PaymentMethod;
  transactionId: string;
  status: PaymentStatus;
  paidAt: string | null;
  timeline: PaymentStatusEvent[];
}

export interface Refund {
  id: string;
  orderId: string;
  amount: number;
  reason: string;
  status: RefundStatus;
  createdAt: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  transactionId: string;
  payment: Payment;
  refunds: Refund[];
  createdAt: string;
  deletedAt: string | null; // soft delete — never hard-removed
}

export interface OrderFilters {
  search: string;
  status: PaymentStatus | "all";
  licenseType: LicenseType | "all";
  dateFrom: string;
  dateTo: string;
  sort: SortOption;
}

// Form data for issuing a refund
export interface RefundFormData {
  type: "full" | "partial";
  amount: string; // kept as string for controlled input, parsed on submit
  reason: string;
}
