// services/pricing/mock-data.ts

import type { TrackPricing, PricingRow } from "./types";

export const MOCK_PRICING_ROWS: PricingRow[] = [
  {
    id: "pr1", trackId: "t1", trackTitle: "Midnight Vibes", artistName: "DJ Karma",
    genre: "Trap", coverImage: "https://picsum.photos/seed/t1/80/80",
    status: "COMPLETE", basicPrice: 29, premiumPrice: 79, unlimitedPrice: 199, exclusivePrice: 1500,
    updatedAt: "2025-06-10T14:00:00Z",
  },
  {
    id: "pr2", trackId: "t2", trackTitle: "Golden Hour", artistName: "Solaris",
    genre: "Lo-Fi", coverImage: "https://picsum.photos/seed/t2/80/80",
    status: "COMPLETE", basicPrice: 24, premiumPrice: 69, unlimitedPrice: 149, exclusivePrice: 999,
    updatedAt: "2025-06-08T10:00:00Z",
  },
  {
    id: "pr3", trackId: "t3", trackTitle: "Summer Bounce", artistName: "Wavez",
    genre: "Afrobeat", coverImage: "https://picsum.photos/seed/t3/80/80",
    status: "PARTIAL", basicPrice: 34, premiumPrice: 89, unlimitedPrice: null, exclusivePrice: null,
    updatedAt: "2025-06-05T09:00:00Z",
  },
  {
    id: "pr4", trackId: "t4", trackTitle: "Dark Energy", artistName: "KXNG Cole",
    genre: "Drill", coverImage: "https://picsum.photos/seed/t4/80/80",
    status: "COMPLETE", basicPrice: 29, premiumPrice: 79, unlimitedPrice: 199, exclusivePrice: 2000,
    updatedAt: "2025-06-12T16:00:00Z",
  },
  {
    id: "pr5", trackId: "t5", trackTitle: "Cloud Nine", artistName: "Nuance",
    genre: "R&B", coverImage: "https://picsum.photos/seed/t5/80/80",
    status: "MISSING", basicPrice: null, premiumPrice: null, unlimitedPrice: null, exclusivePrice: null,
    updatedAt: "2025-06-01T08:00:00Z",
  },
  {
    id: "pr6", trackId: "t6", trackTitle: "Neon Jungle", artistName: "DJ Karma",
    genre: "Trap", coverImage: "https://picsum.photos/seed/t6/80/80",
    status: "COMPLETE", basicPrice: 29, premiumPrice: 79, unlimitedPrice: 199, exclusivePrice: 1500,
    updatedAt: "2025-06-11T12:00:00Z",
  },
  {
    id: "pr7", trackId: "t7", trackTitle: "Soul Frequency", artistName: "Lyric Beats",
    genre: "Soul", coverImage: "https://picsum.photos/seed/t7/80/80",
    status: "PARTIAL", basicPrice: 19, premiumPrice: 59, unlimitedPrice: null, exclusivePrice: null,
    updatedAt: "2025-05-28T14:00:00Z",
  },
  {
    id: "pr8", trackId: "t8", trackTitle: "Astral Plane", artistName: "Solaris",
    genre: "Ambient", coverImage: "https://picsum.photos/seed/t8/80/80",
    status: "COMPLETE", basicPrice: 24, premiumPrice: 69, unlimitedPrice: 149, exclusivePrice: 750,
    updatedAt: "2025-06-09T11:00:00Z",
  },
  {
    id: "pr9", trackId: "t9", trackTitle: "City Lights", artistName: "Metro P",
    genre: "Hip-Hop", coverImage: "https://picsum.photos/seed/t9/80/80",
    status: "MISSING", basicPrice: null, premiumPrice: null, unlimitedPrice: null, exclusivePrice: null,
    updatedAt: "2025-05-20T09:00:00Z",
  },
  {
    id: "pr10", trackId: "t10", trackTitle: "Bass Cannon", artistName: "KXNG Cole",
    genre: "Drill", coverImage: "https://picsum.photos/seed/t10/80/80",
    status: "COMPLETE", basicPrice: 34, premiumPrice: 89, unlimitedPrice: 249, exclusivePrice: 2500,
    updatedAt: "2025-06-13T08:00:00Z",
  },
];

export const MOCK_TRACK_PRICING: Record<string, TrackPricing> = {
  pr1: {
    id: "pr1", trackId: "t1", trackTitle: "Midnight Vibes", artistName: "DJ Karma",
    genre: "Trap", coverImage: "https://picsum.photos/seed/t1/80/80",
    status: "COMPLETE", updatedAt: "2025-06-10T14:00:00Z", createdAt: "2024-11-01T10:00:00Z",
    licenses: [
      { id: "lp1", trackPricingId: "pr1", licensePlanId: "lp-basic", licenseName: "Basic", defaultPrice: 29, overridePrice: null, currency: "USD", isEnabled: true, availableForSale: true, allowDiscounts: true },
      { id: "lp2", trackPricingId: "pr1", licensePlanId: "lp-premium", licenseName: "Premium", defaultPrice: 79, overridePrice: 89, currency: "USD", isEnabled: true, availableForSale: true, allowDiscounts: true },
      { id: "lp3", trackPricingId: "pr1", licensePlanId: "lp-unlimited", licenseName: "Unlimited", defaultPrice: 199, overridePrice: null, currency: "USD", isEnabled: true, availableForSale: true, allowDiscounts: false },
      { id: "lp4", trackPricingId: "pr1", licensePlanId: "lp-exclusive", licenseName: "Exclusive", defaultPrice: 1500, overridePrice: null, currency: "USD", isEnabled: true, availableForSale: true, allowDiscounts: false },
    ],
    exclusive: {
      id: "ex1", trackId: "t1", price: 1500, available: 1, reserved: 0, sold: 0,
      allowOffers: true, minimumOfferPrice: 1200, instantBuyPrice: 1500,
      autoDisableOthers: true, notes: "Original stems included. Full ownership transfer.",
    },
    discounts: [
      { id: "d1", trackPricingId: "pr1", type: "PERCENTAGE", value: 20, startDate: "2025-07-01T00:00:00Z", endDate: "2025-07-07T23:59:59Z", isActive: false },
    ],
    history: [
      { id: "h1", trackPricingId: "pr1", licenseName: "Premium", oldPrice: 79, newPrice: 89, changedBy: "Admin", changedAt: "2025-06-10T14:00:00Z", reason: "Increased demand" },
      { id: "h2", trackPricingId: "pr1", licenseName: "Basic", oldPrice: 24, newPrice: 29, changedBy: "Admin", changedAt: "2025-03-15T09:00:00Z" },
      { id: "h3", trackPricingId: "pr1", licenseName: "Unlimited", oldPrice: 179, newPrice: 199, changedBy: "DJ Karma", changedAt: "2025-01-20T11:00:00Z" },
    ],
  },
  pr2: {
    id: "pr2", trackId: "t2", trackTitle: "Golden Hour", artistName: "Solaris",
    genre: "Lo-Fi", coverImage: "https://picsum.photos/seed/t2/80/80",
    status: "COMPLETE", updatedAt: "2025-06-08T10:00:00Z", createdAt: "2024-10-15T10:00:00Z",
    licenses: [
      { id: "lp5", trackPricingId: "pr2", licensePlanId: "lp-basic", licenseName: "Basic", defaultPrice: 29, overridePrice: 24, currency: "USD", isEnabled: true, availableForSale: true, allowDiscounts: true },
      { id: "lp6", trackPricingId: "pr2", licensePlanId: "lp-premium", licenseName: "Premium", defaultPrice: 79, overridePrice: 69, currency: "USD", isEnabled: true, availableForSale: true, allowDiscounts: true },
      { id: "lp7", trackPricingId: "pr2", licensePlanId: "lp-unlimited", licenseName: "Unlimited", defaultPrice: 199, overridePrice: 149, currency: "USD", isEnabled: true, availableForSale: true, allowDiscounts: false },
      { id: "lp8", trackPricingId: "pr2", licensePlanId: "lp-exclusive", licenseName: "Exclusive", defaultPrice: 1500, overridePrice: 999, currency: "USD", isEnabled: true, availableForSale: true, allowDiscounts: false },
    ],
    exclusive: { id: "ex2", trackId: "t2", price: 999, available: 1, reserved: 0, sold: 0, allowOffers: false, minimumOfferPrice: null, instantBuyPrice: 999, autoDisableOthers: true, notes: "" },
    discounts: [],
    history: [
      { id: "h4", trackPricingId: "pr2", licenseName: "Basic", oldPrice: 29, newPrice: 24, changedBy: "Admin", changedAt: "2025-06-08T10:00:00Z", reason: "Promotional pricing" },
    ],
  },
  pr3: {
    id: "pr3", trackId: "t3", trackTitle: "Summer Bounce", artistName: "Wavez",
    genre: "Afrobeat", coverImage: "https://picsum.photos/seed/t3/80/80",
    status: "PARTIAL", updatedAt: "2025-06-05T09:00:00Z", createdAt: "2025-01-10T10:00:00Z",
    licenses: [
      { id: "lp9", trackPricingId: "pr3", licensePlanId: "lp-basic", licenseName: "Basic", defaultPrice: 29, overridePrice: 34, currency: "USD", isEnabled: true, availableForSale: true, allowDiscounts: true },
      { id: "lp10", trackPricingId: "pr3", licensePlanId: "lp-premium", licenseName: "Premium", defaultPrice: 79, overridePrice: 89, currency: "USD", isEnabled: true, availableForSale: true, allowDiscounts: true },
      { id: "lp11", trackPricingId: "pr3", licensePlanId: "lp-unlimited", licenseName: "Unlimited", defaultPrice: 199, overridePrice: null, currency: "USD", isEnabled: false, availableForSale: false, allowDiscounts: false },
      { id: "lp12", trackPricingId: "pr3", licensePlanId: "lp-exclusive", licenseName: "Exclusive", defaultPrice: 1500, overridePrice: null, currency: "USD", isEnabled: false, availableForSale: false, allowDiscounts: false },
    ],
    exclusive: null,
    discounts: [],
    history: [],
  },
};

// Fill remaining with minimal data
["pr4", "pr5", "pr6", "pr7", "pr8", "pr9", "pr10"].forEach(id => {
  const row = MOCK_PRICING_ROWS.find(r => r.id === id)!;
  MOCK_TRACK_PRICING[id] = {
    id, trackId: row.trackId, trackTitle: row.trackTitle, artistName: row.artistName,
    genre: row.genre, coverImage: row.coverImage, status: row.status,
    updatedAt: row.updatedAt, createdAt: "2025-01-01T00:00:00Z",
    licenses: [
      { id: `${id}-l1`, trackPricingId: id, licensePlanId: "lp-basic", licenseName: "Basic", defaultPrice: 29, overridePrice: row.basicPrice !== 29 ? row.basicPrice : null, currency: "USD", isEnabled: !!row.basicPrice, availableForSale: !!row.basicPrice, allowDiscounts: true },
      { id: `${id}-l2`, trackPricingId: id, licensePlanId: "lp-premium", licenseName: "Premium", defaultPrice: 79, overridePrice: row.premiumPrice !== 79 ? row.premiumPrice : null, currency: "USD", isEnabled: !!row.premiumPrice, availableForSale: !!row.premiumPrice, allowDiscounts: true },
      { id: `${id}-l3`, trackPricingId: id, licensePlanId: "lp-unlimited", licenseName: "Unlimited", defaultPrice: 199, overridePrice: row.unlimitedPrice !== 199 ? row.unlimitedPrice : null, currency: "USD", isEnabled: !!row.unlimitedPrice, availableForSale: !!row.unlimitedPrice, allowDiscounts: false },
      { id: `${id}-l4`, trackPricingId: id, licensePlanId: "lp-exclusive", licenseName: "Exclusive", defaultPrice: 1500, overridePrice: row.exclusivePrice !== 1500 ? row.exclusivePrice : null, currency: "USD", isEnabled: !!row.exclusivePrice, availableForSale: !!row.exclusivePrice, allowDiscounts: false },
    ],
    exclusive: row.exclusivePrice ? { id: `ex-${id}`, trackId: row.trackId, price: row.exclusivePrice, available: 1, reserved: 0, sold: 0, allowOffers: true, minimumOfferPrice: Math.round(row.exclusivePrice * 0.8), instantBuyPrice: row.exclusivePrice, autoDisableOthers: true, notes: "" } : null,
    discounts: [],
    history: [],
  };
});
