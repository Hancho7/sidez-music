// services/coupons/types.ts

export type DiscountType = "percentage" | "fixed";
export type CouponStatus = "active" | "scheduled" | "expired" | "disabled" | "draft";
export type CouponSort = "recent" | "expiration" | "most_redeemed" | "highest_revenue";
export type CouponView = "table" | "cards";
export type EligibilityTarget = "all" | "tracks" | "collections" | "genres" | "license_plans" | "products" | "services";
export type CustomerTarget = "all" | "specific" | "vip" | "first_time" | "returning";

export interface CouponRedemption {
  id: string;
  couponId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  orderId: string;
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  redeemedAt: string;
  status: "completed" | "refunded";
}

export interface CouponEligibility {
  entityTarget: EligibilityTarget;
  entityIds: string[];       // track/collection/genre IDs if targeted
  customerTarget: CustomerTarget;
  customerIds: string[];
  countries: string[];       // empty = all
  currencies: string[];      // empty = all
}

export interface CouponAnalytics {
  redemptionCount: number;
  revenueGenerated: number;
  averageDiscount: number;
  conversionRate: number;
  redemptionsOverTime: { date: string; count: number }[];
  revenueOverTime: { date: string; amount: number }[];
  topCustomers: { name: string; redemptions: number; spent: number }[];
}

export interface Coupon {
  id: string;
  campaignName: string;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;        // % or $ amount
  maximumDiscount: number | null;
  minimumPurchase: number | null;
  status: CouponStatus;
  startsAt: string | null;
  expiresAt: string | null;
  usageLimit: number | null;    // null = unlimited
  usagePerCustomer: number | null;
  usageCount: number;
  stackable: boolean;
  eligibility: CouponEligibility;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  redemptions?: CouponRedemption[];
  analytics?: CouponAnalytics;
}

export interface CouponFilters {
  search: string;
  status: CouponStatus | "all";
  sort: CouponSort;
  view: CouponView;
}

export interface CouponFormValues {
  campaignName: string;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: string;
  maximumDiscount: string;
  minimumPurchase: string;
  status: CouponStatus;
  startsAt: string;
  expiresAt: string;
  usageLimit: string;
  usagePerCustomer: string;
  unlimited: boolean;
  stackable: boolean;
  entityTarget: EligibilityTarget;
  customerTarget: CustomerTarget;
  countries: string[];
}
