// services/customers/mock-data.ts
import type { Customer, CustomerDetail, CustomerAnalytics } from "./types";

const NOW = new Date();
const TODAY = new Date(NOW);
TODAY.setHours(0, 0, 0, 0);

const FIRST_NAMES = ["Sarah", "Michael", "Emily", "James", "Aisha", "Robert", "Maria", "David", "Lisa", "John", "Emma", "Chris", "Jessica", "Daniel", "Michelle"];
const LAST_NAMES = ["Johnson", "Chen", "Rodriguez", "Wilson", "Patel", "Kim", "Garcia", "Smith", "Brown", "Davis", "Miller", "Martinez", "Hernandez", "Lopez", "Williams"];
const COUNTRIES = ["United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Nigeria", "Ghana", "South Africa", "Brazil", "Japan", "South Korea"];
const LANGUAGES = ["English", "Spanish", "French", "German", "Portuguese", "Japanese", "Korean"];
const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "NGN", "BRL"];
const TIMEZONES = ["America/New_York", "America/Los_Angeles", "Europe/London", "Europe/Berlin", "Asia/Tokyo", "Australia/Sydney", "Africa/Lagos"];

function randomDate(daysBack: number): string {
  const d = new Date(TODAY);
  d.setDate(d.getDate() - Math.floor(Math.random() * daysBack));
  return d.toISOString();
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateCustomer(index: number): Customer {
  const firstName = randomItem(FIRST_NAMES);
  const lastName = randomItem(LAST_NAMES);
  const statuses: CustomerStatus[] = ["ACTIVE", "ACTIVE", "ACTIVE", "INACTIVE", "SUSPENDED", "ACTIVE", "ACTIVE"];
  const joinedDays = 30 + Math.floor(Math.random() * 365);

  return {
    id: `cus_${String(1000 + index).padStart(4, "0")}`,
    avatar: index % 7 === 0 ? null : `https://i.pravatar.cc/150?img=${index % 70}`,
    firstName,
    lastName,
    username: `${firstName.toLowerCase()}_${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    phone: index % 3 === 0 ? null : `+1 ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
    country: randomItem(COUNTRIES),
    timezone: randomItem(TIMEZONES),
    language: randomItem(LANGUAGES),
    currency: randomItem(CURRENCIES),
    status: randomItem(statuses),
    isVip: index % 5 === 0,
    isVerified: index % 3 !== 0,
    marketingConsent: index % 4 !== 0,
    createdAt: randomDate(joinedDays),
    updatedAt: randomDate(10),
    totalOrders: 1 + Math.floor(Math.random() * 12),
    totalSpent: 50 + Math.random() * 950,
    lifetimeValue: 100 + Math.random() * 1900,
    averageOrderValue: 50 + Math.random() * 150,
    ownedLicenses: Math.floor(Math.random() * 8),
    totalDownloads: Math.floor(Math.random() * 15),
    lastPurchase: Math.random() > 0.3 ? randomDate(30) : null,
  };
}

export const MOCK_CUSTOMERS: Customer[] = Array.from({ length: 25 }, (_, i) => generateCustomer(i));

const GENRES = ["Hip-Hop", "Trap", "R&B", "Afrobeats", "Drill", "Electronic", "Lo-Fi", "Soul", "Jazz"];
const ARTISTS = ["KXNG Nova", "Aura Keys", "Luma Sol", "Phasma", "Solaris", "Wavez", "DJ Karma", "Lyric Beats"];
const LICENSE_TYPES = ["Basic", "Premium", "Unlimited", "Exclusive"];

function generateOrders(customerId: string, count: number): CustomerDetail["orders"] {
  return Array.from({ length: count }, (_, i) => ({
    id: `ord_${customerId}_${i}`,
    orderId: `ORD-${String(1000 + Math.floor(Math.random() * 9000))}`,
    date: randomDate(60),
    items: 1 + Math.floor(Math.random() * 3),
    amount: 20 + Math.random() * 280,
    status: ["PAID", "PAID", "PAID", "PENDING", "PAID", "REFUNDED"][i % 6] as any,
  }));
}

function generateLicenses(customerId: string, count: number): CustomerDetail["licenses"] {
  return Array.from({ length: count }, (_, i) => ({
    id: `lic_${customerId}_${i}`,
    trackName: `${randomItem(["Midnight", "Solar", "Neon", "Static", "Velvet", "Chrome", "Glass", "Fuego"])} ${randomItem(["Bloom", "Drift", "Veil", "Rain", "Keys", "Waves", "Horizon", "Nights"])}`,
    artistName: randomItem(ARTISTS),
    licenseType: randomItem(LICENSE_TYPES),
    purchaseDate: randomDate(90),
    downloadCount: Math.floor(Math.random() * 5),
    status: ["ACTIVE", "ACTIVE", "ACTIVE", "EXPIRED", "ACTIVE", "REVOKED"][i % 6] as any,
    expiresAt: Math.random() > 0.5 ? new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString() : null,
  }));
}

function generateDownloads(customerId: string, count: number): CustomerDetail["downloads"] {
  const devices = ["Chrome - MacOS", "Safari - iOS", "Firefox - Windows", "Chrome - Android", "Edge - Windows", "Safari - MacOS"];
  return Array.from({ length: count }, (_, i) => ({
    id: `dl_${customerId}_${i}`,
    trackName: `${randomItem(["Midnight", "Solar", "Neon", "Static", "Velvet", "Chrome", "Glass", "Fuego"])} ${randomItem(["Bloom", "Drift", "Veil", "Rain", "Keys", "Waves", "Horizon", "Nights"])}`,
    downloadDate: randomDate(30),
    device: randomItem(devices),
    ipAddress: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    downloadCount: 1 + Math.floor(Math.random() * 3),
    remainingDownloads: Math.random() > 0.5 ? Math.floor(Math.random() * 10) : null,
  }));
}

function generateCoupons(customerId: string): CustomerDetail["coupons"] {
  const count = Math.floor(Math.random() * 3);
  return Array.from({ length: count }, (_, i) => ({
    id: `cpn_${customerId}_${i}`,
    code: `SAVE${Math.floor(Math.random() * 90 + 10)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
    discount: Math.random() > 0.5 ? Math.floor(Math.random() * 30 + 5) : Math.floor(Math.random() * 50 + 10),
    type: Math.random() > 0.5 ? "PERCENTAGE" : "FIXED",
    redeemedAt: randomDate(60),
    orderId: `ORD-${String(1000 + Math.floor(Math.random() * 9000))}`,
  }));
}

function generateOffers(customerId: string): CustomerDetail["offers"] {
  const types: Array<"SUBMITTED" | "ACCEPTED" | "REJECTED"> = ["SUBMITTED", "ACCEPTED", "REJECTED"];
  const count = Math.floor(Math.random() * 2);
  return Array.from({ length: count }, (_, i) => ({
    id: `off_${customerId}_${i}`,
    type: randomItem(types),
    trackName: `${randomItem(["Midnight", "Solar", "Neon", "Static", "Velvet", "Chrome", "Glass", "Fuego"])} ${randomItem(["Bloom", "Drift", "Veil", "Rain", "Keys", "Waves", "Horizon", "Nights"])}`,
    amount: 100 + Math.random() * 900,
    date: randomDate(45),
  }));
}

function generateActivities(customerId: string): CustomerDetail["activities"] {
  const types: Array<CustomerDetail["activities"][0]["type"]> =
    ["REGISTRATION", "PURCHASE", "DOWNLOAD", "COUPON", "OFFER", "REFUND", "PROFILE_UPDATE"];
  const count = 3 + Math.floor(Math.random() * 5);
  return Array.from({ length: count }, (_, i) => ({
    id: `act_${customerId}_${i}`,
    type: i === 0 ? "REGISTRATION" : randomItem(types.filter(t => t !== "REGISTRATION")),
    description: `User ${i === 0 ? "registered" : `${randomItem(["made a purchase", "downloaded a track", "redeemed a coupon", "submitted an offer", "requested a refund", "updated profile"])}`}`,
    createdAt: i === 0 ? randomDate(365) : randomDate(30),
  }));
}

function generateNotes(customerId: string): CustomerDetail["notes"] {
  const count = Math.floor(Math.random() * 3);
  return Array.from({ length: count }, (_, i) => ({
    id: `note_${customerId}_${i}`,
    note: `Internal note ${i + 1}: ${randomItem(["VIP customer, priority support.", "Interested in exclusive rights.", "Asked about bulk discounts.", "Reported issue with download.", "Positive feedback on recent purchase."])}`,
    createdBy: randomItem(["John Admin", "Sarah Support", "Mike Manager", "Emma Sales"]),
    createdAt: randomDate(30),
  }));
}

function generateAnalytics(customerId: string): CustomerAnalytics {
  return {
    lifetimeSpending: 100 + Math.random() * 1900,
    ordersOverTime: Array.from({ length: 6 }, (_, i) => ({
      date: new Date(Date.now() - (5 - i) * 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      count: Math.floor(Math.random() * 3),
    })),
    revenueContribution: Array.from({ length: 6 }, (_, i) => ({
      date: new Date(Date.now() - (5 - i) * 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      amount: 20 + Math.random() * 180,
    })),
    favoriteGenres: GENRES.slice(0, 3 + Math.floor(Math.random() * 3)).map(g => ({
      genre: g,
      count: Math.floor(Math.random() * 10 + 1),
    })),
    favoriteArtists: ARTISTS.slice(0, 2 + Math.floor(Math.random() * 2)).map(a => ({
      artist: a,
      count: Math.floor(Math.random() * 8 + 1),
    })),
    averageOrderValue: 40 + Math.random() * 160,
    purchaseFrequency: 15 + Math.random() * 45,
    customerLifetimeValue: 150 + Math.random() * 1850,
  };
}

export const MOCK_CUSTOMER_DETAILS: Record<string, CustomerDetail> = {};

MOCK_CUSTOMERS.forEach(c => {
  const orderCount = c.totalOrders;
  const licenseCount = c.ownedLicenses;
  const downloadCount = c.downloads;

  MOCK_CUSTOMER_DETAILS[c.id] = {
    ...c,
    orders: generateOrders(c.id, orderCount),
    licenses: generateLicenses(c.id, licenseCount),
    downloads: generateDownloads(c.id, Math.min(downloadCount, 10)),
    coupons: generateCoupons(c.id),
    offers: generateOffers(c.id),
    activities: generateActivities(c.id),
    notes: generateNotes(c.id),
    analytics: generateAnalytics(c.id),
  };
});

export function getMockCustomers(filters: {
  search?: string;
  status?: CustomerStatus | "all";
  isVip?: boolean;
  isVerified?: boolean;
  highValue?: boolean;
  newCustomers?: boolean;
  sort?: CustomerSort;
}): Customer[] {
  let result = [...MOCK_CUSTOMERS];

  if (filters.search?.trim()) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      c =>
        c.firstName.toLowerCase().includes(q) ||
        c.lastName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.username.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
    );
  }

  if (filters.status && filters.status !== "all") {
    result = result.filter(c => c.status === filters.status);
  }

  if (filters.isVip) {
    result = result.filter(c => c.isVip);
  }

  if (filters.isVerified) {
    result = result.filter(c => c.isVerified);
  }

  if (filters.highValue) {
    result = result.filter(c => c.totalSpent > 500);
  }

  if (filters.newCustomers) {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    result = result.filter(c => new Date(c.createdAt) > thirtyDaysAgo);
  }

  switch (filters.sort) {
    case "spending":
      result.sort((a, b) => b.totalSpent - a.totalSpent);
      break;
    case "orders":
      result.sort((a, b) => b.totalOrders - a.totalOrders);
      break;
    case "joined":
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case "alpha":
      result.sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));
      break;
    default:
      break;
  }

  return result;
}
