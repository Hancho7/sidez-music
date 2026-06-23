// services/pricing/types.ts

export type PricingStatus = "COMPLETE" | "PARTIAL" | "MISSING";
export type DiscountType = "PERCENTAGE" | "FIXED" | "CAMPAIGN";
export type PricingView = "table" | "cards";
export type PricingSort = "highest" | "lowest" | "updated" | "alpha";

export interface LicenseTier {
  id: string;
  name: string;           // "Basic" | "Premium" | "Unlimited" | "Exclusive"
  defaultPrice: number;
}

export interface TrackLicensePricing {
  id: string;
  trackPricingId: string; // parent
  licensePlanId: string;
  licenseName: string;
  defaultPrice: number;
  overridePrice: number | null;
  currency: string;
  isEnabled: boolean;
  availableForSale: boolean;
  allowDiscounts: boolean;
}

export interface ExclusiveLicense {
  id: string;
  trackId: string;
  price: number;
  available: number;
  reserved: number;
  sold: number;
  allowOffers: boolean;
  minimumOfferPrice: number | null;
  instantBuyPrice: number | null;
  autoDisableOthers: boolean;
  notes: string;
}

export interface DiscountRule {
  id: string;
  trackPricingId: string;
  type: DiscountType;
  value: number;           // % or fixed amount
  campaignPrice?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface PricingHistoryEntry {
  id: string;
  trackPricingId: string;
  licenseName: string;
  oldPrice: number;
  newPrice: number;
  changedBy: string;
  changedAt: string;
  reason?: string;
}

export interface TrackPricing {
  id: string;
  trackId: string;
  trackTitle: string;
  artistName: string;
  genre: string;
  coverImage: string;
  status: PricingStatus;
  licenses: TrackLicensePricing[];
  exclusive: ExclusiveLicense | null;
  discounts: DiscountRule[];
  history: PricingHistoryEntry[];
  updatedAt: string;
  createdAt: string;
}

// Flat row for the table view
export interface PricingRow {
  id: string;
  trackId: string;
  trackTitle: string;
  artistName: string;
  genre: string;
  coverImage: string;
  status: PricingStatus;
  basicPrice: number | null;
  premiumPrice: number | null;
  unlimitedPrice: number | null;
  exclusivePrice: number | null;
  updatedAt: string;
}

export interface PricingFilters {
  search: string;
  licensePlan: string;   // "ALL" | plan id
  genre: string;
  missingOnly: boolean;
  sort: PricingSort;
  view: PricingView;
}
