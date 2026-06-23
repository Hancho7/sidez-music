// services/offers/types.ts

export type OfferStatus = "pending" | "countered" | "accepted" | "rejected" | "expired" | "withdrawn";
export type ProductType = "track" | "collection" | "digital_product" | "service";
export type RevisionType = "offer" | "counter" | "accept" | "reject" | "expire" | "withdraw" | "note";
export type SenderType = "customer" | "admin" | "system";
export type OfferSort = "newest" | "highest" | "lowest" | "closing_soon";
export type OfferView = "table" | "cards";

export interface OfferRevision {
  id: string;
  offerId: string;
  submittedBy: string;
  senderType: SenderType;
  revisionType: RevisionType;
  amount: number | null;
  message: string;
  createdAt: string;
}

export interface OfferHistoryEvent {
  id: string;
  offerId: string;
  action: string;
  actorId: string;
  actorName: string;
  actorType: SenderType;
  notes: string;
  createdAt: string;
}

export interface OfferCustomerSummary {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  isVip: boolean;
  lifetimeValue: number;
  totalOrders: number;
  ownedLicenses: number;
  previousOffers: number;
  acceptedOffers: number;
  averageSpend: number;
}

export interface OfferProductSummary {
  id: string;
  title: string;
  artist: string;
  productType: ProductType;
  coverImage: string | null;
  currentPrice: number;
  licensePlan: string;
  isExclusive: boolean;
  availableLicenses: number;
  activeCoupons: number;
}

export interface OfferAnalytics {
  acceptanceRate: number;
  rejectionRate: number;
  counterRate: number;
  averageDiscount: number;
  averageNegotiationLength: number; // days
  recoveredRevenue: number;
  offersOverTime: { date: string; count: number }[];
  topProducts: { title: string; offers: number }[];
  topCustomers: { name: string; offers: number; accepted: number }[];
}

export interface Offer {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerAvatar: string | null;
  productType: ProductType;
  productId: string;
  productTitle: string;
  productArtist: string;
  productCover: string | null;
  licensePlan: string;
  originalPrice: number;
  currentOfferAmount: number;
  status: OfferStatus;
  expiresAt: string | null;
  assignedAdmin: string;
  revisions: OfferRevision[];
  history: OfferHistoryEvent[];
  customer?: OfferCustomerSummary;
  product?: OfferProductSummary;
  analytics?: OfferAnalytics;
  createdAt: string;
  updatedAt: string;
}

export interface OfferFilters {
  search: string;
  status: OfferStatus | "all";
  productType: ProductType | "all";
  sort: OfferSort;
  view: OfferView;
}

export interface CounterOfferFormValues {
  amount: string;
  message: string;
  expiresAt: string;
}

export interface OfferFormValues {
  customerId: string;
  customerName: string;
  productType: ProductType;
  productTitle: string;
  licensePlan: string;
  originalPrice: string;
  offerAmount: string;
  expiresAt: string;
  message: string;
  internalNotes: string;
  status: "draft" | "pending";
}
