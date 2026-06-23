// services/offers/mock-data.ts
import type { Offer, OfferRevision, OfferHistoryEvent, OfferCustomerSummary, OfferProductSummary, OfferAnalytics } from "./types";

function daysAgo(n: number) {
  const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString();
}
function daysFromNow(n: number) {
  const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString();
}
function hoursAgo(n: number) {
  const d = new Date(); d.setHours(d.getHours() - n); return d.toISOString();
}

const ADMIN = "John Carter";

function makeRevisions(offerId: string, events: Array<{ by: string; type: Offer["revisions"][0]["revisionType"]; senderType: "customer" | "admin" | "system"; amount: number | null; msg: string; hoursBack: number }>): OfferRevision[] {
  return events.map((e, i) => ({
    id: `rev-${offerId}-${i}`,
    offerId,
    submittedBy: e.by,
    senderType: e.senderType,
    revisionType: e.type,
    amount: e.amount,
    message: e.msg,
    createdAt: hoursAgo(e.hoursBack),
  }));
}

function makeHistory(offerId: string, events: Array<{ action: string; actorName: string; actorType: "customer" | "admin" | "system"; notes: string; hoursBack: number }>): OfferHistoryEvent[] {
  return events.map((e, i) => ({
    id: `hist-${offerId}-${i}`,
    offerId,
    action: e.action,
    actorId: `usr-${i}`,
    actorName: e.actorName,
    actorType: e.actorType,
    notes: e.notes,
    createdAt: hoursAgo(e.hoursBack),
  }));
}

const CUSTOMER_SUMMARIES: Record<string, OfferCustomerSummary> = {
  "cus-001": { id: "cus-001", name: "alex.carter", email: "alex.carter@gmail.com", avatar: "https://i.pravatar.cc/150?img=1", isVip: true, lifetimeValue: 4280, totalOrders: 18, ownedLicenses: 12, previousOffers: 6, acceptedOffers: 4, averageSpend: 237 },
  "cus-002": { id: "cus-002", name: "maya.osei", email: "maya.osei@gmail.com", avatar: "https://i.pravatar.cc/150?img=5", isVip: false, lifetimeValue: 840, totalOrders: 4, ownedLicenses: 3, previousOffers: 2, acceptedOffers: 1, averageSpend: 210 },
  "cus-003": { id: "cus-003", name: "daniel.wu", email: "daniel.wu@gmail.com", avatar: "https://i.pravatar.cc/150?img=8", isVip: true, lifetimeValue: 7120, totalOrders: 31, ownedLicenses: 24, previousOffers: 11, acceptedOffers: 8, averageSpend: 229 },
  "cus-004": { id: "cus-004", name: "sara.m", email: "sara.m@outlook.com", avatar: null, isVip: false, lifetimeValue: 390, totalOrders: 2, ownedLicenses: 1, previousOffers: 1, acceptedOffers: 0, averageSpend: 195 },
  "cus-005": { id: "cus-005", name: "kevin.j", email: "kevin.j@gmail.com", avatar: "https://i.pravatar.cc/150?img=12", isVip: false, lifetimeValue: 1640, totalOrders: 8, ownedLicenses: 6, previousOffers: 3, acceptedOffers: 2, averageSpend: 205 },
};

const PRODUCT_SUMMARIES: Record<string, OfferProductSummary> = {
  "trk-001": { id: "trk-001", title: "Midnight Bloom", artist: "Aura Keys", productType: "track", coverImage: null, currentPrice: 79.99, licensePlan: "Premium License", isExclusive: false, availableLicenses: 999, activeCoupons: 1 },
  "trk-002": { id: "trk-002", title: "Solar Drift", artist: "KXNG Nova", productType: "track", coverImage: null, currentPrice: 299.99, licensePlan: "Exclusive License", isExclusive: true, availableLicenses: 1, activeCoupons: 0 },
  "trk-003": { id: "trk-003", title: "Chrome Waves", artist: "Phasma", productType: "track", coverImage: null, currentPrice: 49.99, licensePlan: "Basic License", isExclusive: false, availableLicenses: 999, activeCoupons: 2 },
  "col-001": { id: "col-001", title: "Nova Essentials Vol. 1", artist: "KXNG Nova", productType: "collection", coverImage: null, currentPrice: 149.99, licensePlan: "Bundle License", isExclusive: false, availableLicenses: 999, activeCoupons: 0 },
  "svc-001": { id: "svc-001", title: "Custom Beat Production", artist: "KXNG Nova", productType: "service", coverImage: null, currentPrice: 499.99, licensePlan: "Service Package", isExclusive: false, availableLicenses: 999, activeCoupons: 0 },
};

const MOCK_ANALYTICS: OfferAnalytics = {
  acceptanceRate: 42,
  rejectionRate: 28,
  counterRate: 65,
  averageDiscount: 18.4,
  averageNegotiationLength: 2.3,
  recoveredRevenue: 12840,
  offersOverTime: Array.from({ length: 8 }, (_, i) => ({
    date: new Date(Date.now() - (7 - i) * 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    count: Math.floor(Math.random() * 15 + 3),
  })),
  topProducts: [
    { title: "Solar Drift", offers: 24 },
    { title: "Midnight Bloom", offers: 18 },
    { title: "Chrome Waves", offers: 14 },
    { title: "Nova Essentials Vol. 1", offers: 11 },
  ],
  topCustomers: [
    { name: "daniel.wu", offers: 11, accepted: 8 },
    { name: "alex.carter", offers: 6, accepted: 4 },
    { name: "kevin.j", offers: 3, accepted: 2 },
  ],
};

export const MOCK_OFFERS: Offer[] = [
  {
    id: "OFF-0041",
    customerId: "cus-001",
    customerName: "alex.carter",
    customerEmail: "alex.carter@gmail.com",
    customerAvatar: "https://i.pravatar.cc/150?img=1",
    productType: "track",
    productId: "trk-002",
    productTitle: "Solar Drift",
    productArtist: "KXNG Nova",
    productCover: null,
    licensePlan: "Exclusive License",
    originalPrice: 299.99,
    currentOfferAmount: 220,
    status: "countered",
    expiresAt: daysFromNow(2),
    assignedAdmin: ADMIN,
    createdAt: daysAgo(3),
    updatedAt: hoursAgo(6),
    customer: CUSTOMER_SUMMARIES["cus-001"],
    product: PRODUCT_SUMMARIES["trk-002"],
    analytics: MOCK_ANALYTICS,
    revisions: makeRevisions("OFF-0041", [
      { by: "alex.carter", type: "offer", senderType: "customer", amount: 200, msg: "I'd like to purchase Solar Drift for exclusive use on my album. $200 is my budget.", hoursBack: 72 },
      { by: ADMIN, type: "counter", senderType: "admin", amount: 260, msg: "Thanks for your interest! Given the track's popularity, we can offer $260 for exclusive rights.", hoursBack: 48 },
      { by: "alex.carter", type: "offer", senderType: "customer", amount: 220, msg: "I can stretch to $220 — that's my final budget for this project.", hoursBack: 24 },
      { by: ADMIN, type: "counter", senderType: "admin", amount: 240, msg: "We appreciate your dedication. How about $240 — that's the lowest we can go for exclusive rights.", hoursBack: 6 },
    ]),
    history: makeHistory("OFF-0041", [
      { action: "Offer submitted", actorName: "alex.carter", actorType: "customer", notes: "Initial offer at $200", hoursBack: 72 },
      { action: "Offer viewed", actorName: ADMIN, actorType: "admin", notes: "", hoursBack: 71 },
      { action: "Counter submitted", actorName: ADMIN, actorType: "admin", notes: "Counter at $260", hoursBack: 48 },
      { action: "Customer countered", actorName: "alex.carter", actorType: "customer", notes: "Revised to $220", hoursBack: 24 },
      { action: "Admin countered", actorName: ADMIN, actorType: "admin", notes: "Final counter at $240", hoursBack: 6 },
    ]),
  },
  {
    id: "OFF-0042",
    customerId: "cus-002",
    customerName: "maya.osei",
    customerEmail: "maya.osei@gmail.com",
    customerAvatar: "https://i.pravatar.cc/150?img=5",
    productType: "track",
    productId: "trk-001",
    productTitle: "Midnight Bloom",
    productArtist: "Aura Keys",
    productCover: null,
    licensePlan: "Premium License",
    originalPrice: 79.99,
    currentOfferAmount: 55,
    status: "pending",
    expiresAt: daysFromNow(5),
    assignedAdmin: ADMIN,
    createdAt: hoursAgo(8),
    updatedAt: hoursAgo(8),
    customer: CUSTOMER_SUMMARIES["cus-002"],
    product: PRODUCT_SUMMARIES["trk-001"],
    analytics: MOCK_ANALYTICS,
    revisions: makeRevisions("OFF-0042", [
      { by: "maya.osei", type: "offer", senderType: "customer", amount: 55, msg: "Love this track! Is $55 acceptable for a premium license?", hoursBack: 8 },
    ]),
    history: makeHistory("OFF-0042", [
      { action: "Offer submitted", actorName: "maya.osei", actorType: "customer", notes: "Initial offer at $55", hoursBack: 8 },
    ]),
  },
  {
    id: "OFF-0043",
    customerId: "cus-003",
    customerName: "daniel.wu",
    customerEmail: "daniel.wu@gmail.com",
    customerAvatar: "https://i.pravatar.cc/150?img=8",
    productType: "collection",
    productId: "col-001",
    productTitle: "Nova Essentials Vol. 1",
    productArtist: "KXNG Nova",
    productCover: null,
    licensePlan: "Bundle License",
    originalPrice: 149.99,
    currentOfferAmount: 149.99,
    status: "accepted",
    expiresAt: daysFromNow(1),
    assignedAdmin: ADMIN,
    createdAt: daysAgo(5),
    updatedAt: daysAgo(1),
    customer: CUSTOMER_SUMMARIES["cus-003"],
    product: PRODUCT_SUMMARIES["col-001"],
    analytics: MOCK_ANALYTICS,
    revisions: makeRevisions("OFF-0043", [
      { by: "daniel.wu", type: "offer", senderType: "customer", amount: 110, msg: "Can I get the full bundle for $110?", hoursBack: 120 },
      { by: ADMIN, type: "counter", senderType: "admin", amount: 135, msg: "We can do $135 for the full bundle.", hoursBack: 96 },
      { by: "daniel.wu", type: "offer", senderType: "customer", amount: 135, msg: "Deal! $135 works.", hoursBack: 84 },
      { by: ADMIN, type: "accept", senderType: "admin", amount: 135, msg: "Offer accepted. Order will be created now.", hoursBack: 24 },
    ]),
    history: makeHistory("OFF-0043", [
      { action: "Offer submitted", actorName: "daniel.wu", actorType: "customer", notes: "", hoursBack: 120 },
      { action: "Counter submitted", actorName: ADMIN, actorType: "admin", notes: "Counter at $135", hoursBack: 96 },
      { action: "Customer accepted counter", actorName: "daniel.wu", actorType: "customer", notes: "", hoursBack: 84 },
      { action: "Offer accepted", actorName: ADMIN, actorType: "admin", notes: "Order #ORD-8821 created", hoursBack: 24 },
    ]),
  },
  {
    id: "OFF-0044",
    customerId: "cus-004",
    customerName: "sara.m",
    customerEmail: "sara.m@outlook.com",
    customerAvatar: null,
    productType: "track",
    productId: "trk-003",
    productTitle: "Chrome Waves",
    productArtist: "Phasma",
    productCover: null,
    licensePlan: "Basic License",
    originalPrice: 49.99,
    currentOfferAmount: 20,
    status: "rejected",
    expiresAt: null,
    assignedAdmin: ADMIN,
    createdAt: daysAgo(7),
    updatedAt: daysAgo(6),
    customer: CUSTOMER_SUMMARIES["cus-004"],
    product: PRODUCT_SUMMARIES["trk-003"],
    analytics: MOCK_ANALYTICS,
    revisions: makeRevisions("OFF-0044", [
      { by: "sara.m", type: "offer", senderType: "customer", amount: 20, msg: "Would you take $20 for this?", hoursBack: 168 },
      { by: ADMIN, type: "reject", senderType: "admin", amount: null, msg: "Unfortunately we cannot accept this offer as it's below our minimum threshold.", hoursBack: 144 },
    ]),
    history: makeHistory("OFF-0044", [
      { action: "Offer submitted", actorName: "sara.m", actorType: "customer", notes: "", hoursBack: 168 },
      { action: "Offer rejected", actorName: ADMIN, actorType: "admin", notes: "Below minimum threshold", hoursBack: 144 },
    ]),
  },
  {
    id: "OFF-0045",
    customerId: "cus-005",
    customerName: "kevin.j",
    customerEmail: "kevin.j@gmail.com",
    customerAvatar: "https://i.pravatar.cc/150?img=12",
    productType: "service",
    productId: "svc-001",
    productTitle: "Custom Beat Production",
    productArtist: "KXNG Nova",
    productCover: null,
    licensePlan: "Service Package",
    originalPrice: 499.99,
    currentOfferAmount: 380,
    status: "pending",
    expiresAt: daysFromNow(3),
    assignedAdmin: ADMIN,
    createdAt: hoursAgo(4),
    updatedAt: hoursAgo(4),
    customer: CUSTOMER_SUMMARIES["cus-005"],
    product: PRODUCT_SUMMARIES["svc-001"],
    analytics: MOCK_ANALYTICS,
    revisions: makeRevisions("OFF-0045", [
      { by: "kevin.j", type: "offer", senderType: "customer", amount: 380, msg: "I need a custom beat for a commercial project. $380 budget, any flexibility?", hoursBack: 4 },
    ]),
    history: makeHistory("OFF-0045", [
      { action: "Offer submitted", actorName: "kevin.j", actorType: "customer", notes: "Service offer", hoursBack: 4 },
    ]),
  },
  {
    id: "OFF-0038",
    customerId: "cus-003",
    customerName: "daniel.wu",
    customerEmail: "daniel.wu@gmail.com",
    customerAvatar: "https://i.pravatar.cc/150?img=8",
    productType: "track",
    productId: "trk-001",
    productTitle: "Midnight Bloom",
    productArtist: "Aura Keys",
    productCover: null,
    licensePlan: "Premium License",
    originalPrice: 79.99,
    currentOfferAmount: 79.99,
    status: "expired",
    expiresAt: daysAgo(2),
    assignedAdmin: ADMIN,
    createdAt: daysAgo(9),
    updatedAt: daysAgo(2),
    customer: CUSTOMER_SUMMARIES["cus-003"],
    product: PRODUCT_SUMMARIES["trk-001"],
    analytics: MOCK_ANALYTICS,
    revisions: makeRevisions("OFF-0038", [
      { by: "daniel.wu", type: "offer", senderType: "customer", amount: 60, msg: "Can I get Midnight Bloom for $60?", hoursBack: 216 },
      { by: ADMIN, type: "counter", senderType: "admin", amount: 72, msg: "We can offer $72 — a 10% discount.", hoursBack: 200 },
      { by: "system", type: "expire", senderType: "system", amount: null, msg: "Offer expired after no response from customer.", hoursBack: 48 },
    ]),
    history: makeHistory("OFF-0038", [
      { action: "Offer submitted", actorName: "daniel.wu", actorType: "customer", notes: "", hoursBack: 216 },
      { action: "Counter submitted", actorName: ADMIN, actorType: "admin", notes: "Counter at $72", hoursBack: 200 },
      { action: "Offer expired", actorName: "system", actorType: "system", notes: "No response within 7 days", hoursBack: 48 },
    ]),
  },
];

export { MOCK_ANALYTICS };
