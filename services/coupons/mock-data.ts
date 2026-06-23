// services/coupons/mock-data.ts
import type { Coupon, CouponRedemption, CouponAnalytics } from "./types";

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}
function daysFromNow(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
}
function randomBetween(a: number, b: number) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

const CUSTOMER_NAMES = [
  ["alex.carter", "alex.carter@gmail.com"],
  ["maya.osei", "maya.osei@gmail.com"],
  ["daniel.wu", "daniel.wu@gmail.com"],
  ["sara.m", "sara.m@outlook.com"],
  ["james.park", "james.park@icloud.com"],
  ["lena.r", "lena.r@gmail.com"],
  ["kevin.j", "kevin.j@gmail.com"],
];

function makeRedemptions(couponId: string, count: number): CouponRedemption[] {
  return Array.from({ length: count }, (_, i) => {
    const [name, email] = CUSTOMER_NAMES[i % CUSTOMER_NAMES.length];
    const original = randomBetween(40, 300);
    const discount = randomBetween(5, 80);
    return {
      id: `rdm-${couponId}-${i}`,
      couponId,
      customerId: `cus-${i}`,
      customerName: name,
      customerEmail: email,
      orderId: `ORD-${9000 + i}`,
      originalAmount: original,
      discountAmount: discount,
      finalAmount: original - discount,
      redeemedAt: daysAgo(randomBetween(1, 60)),
      status: i % 7 === 0 ? "refunded" : "completed",
    };
  });
}

function makeAnalytics(count: number, revenue: number): CouponAnalytics {
  return {
    redemptionCount: count,
    revenueGenerated: revenue,
    averageDiscount: Math.round(revenue / Math.max(count, 1) * 0.18),
    conversionRate: parseFloat((count / (count * 3.2) * 100).toFixed(1)),
    redemptionsOverTime: Array.from({ length: 8 }, (_, i) => ({
      date: new Date(Date.now() - (7 - i) * 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      count: randomBetween(0, Math.max(1, Math.round(count / 8))),
    })),
    revenueOverTime: Array.from({ length: 8 }, (_, i) => ({
      date: new Date(Date.now() - (7 - i) * 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      amount: randomBetween(0, Math.max(10, Math.round(revenue / 8))),
    })),
    topCustomers: CUSTOMER_NAMES.slice(0, 4).map(([name]) => ({
      name,
      redemptions: randomBetween(1, 5),
      spent: randomBetween(50, 400),
    })),
  };
}

export const MOCK_COUPONS: Coupon[] = [
  {
    id: "cpn-001",
    campaignName: "Summer Drop 2025",
    code: "SUMMER25",
    description: "25% off all tracks for the summer season.",
    discountType: "percentage",
    discountValue: 25,
    maximumDiscount: 50,
    minimumPurchase: 20,
    status: "active",
    startsAt: daysAgo(10),
    expiresAt: daysFromNow(20),
    usageLimit: 500,
    usagePerCustomer: 1,
    usageCount: 312,
    stackable: false,
    eligibility: { entityTarget: "all", entityIds: [], customerTarget: "all", customerIds: [], countries: [], currencies: [] },
    createdBy: "John Carter",
    createdAt: daysAgo(14),
    updatedAt: daysAgo(2),
    redemptions: makeRedemptions("cpn-001", 8),
    analytics: makeAnalytics(312, 18240),
  },
  {
    id: "cpn-002",
    campaignName: "VIP Exclusive",
    code: "VIP50",
    description: "$50 off for VIP customers only. No minimum purchase.",
    discountType: "fixed",
    discountValue: 50,
    maximumDiscount: null,
    minimumPurchase: null,
    status: "active",
    startsAt: daysAgo(30),
    expiresAt: daysFromNow(60),
    usageLimit: null,
    usagePerCustomer: 2,
    usageCount: 88,
    stackable: true,
    eligibility: { entityTarget: "all", entityIds: [], customerTarget: "vip", customerIds: [], countries: [], currencies: ["USD"] },
    createdBy: "John Carter",
    createdAt: daysAgo(35),
    updatedAt: daysAgo(5),
    redemptions: makeRedemptions("cpn-002", 6),
    analytics: makeAnalytics(88, 11400),
  },
  {
    id: "cpn-003",
    campaignName: "New User Welcome",
    code: "WELCOME15",
    description: "15% off first purchase for new customers.",
    discountType: "percentage",
    discountValue: 15,
    maximumDiscount: 30,
    minimumPurchase: 10,
    status: "active",
    startsAt: daysAgo(60),
    expiresAt: null,
    usageLimit: null,
    usagePerCustomer: 1,
    usageCount: 1042,
    stackable: false,
    eligibility: { entityTarget: "all", entityIds: [], customerTarget: "first_time", customerIds: [], countries: [], currencies: [] },
    createdBy: "Sarah Support",
    createdAt: daysAgo(62),
    updatedAt: daysAgo(1),
    redemptions: makeRedemptions("cpn-003", 7),
    analytics: makeAnalytics(1042, 31260),
  },
  {
    id: "cpn-004",
    campaignName: "Trap Pack Launch",
    code: "TRAPPACK20",
    description: "20% off Trap & Drill genre tracks only.",
    discountType: "percentage",
    discountValue: 20,
    maximumDiscount: 40,
    minimumPurchase: 15,
    status: "scheduled",
    startsAt: daysFromNow(3),
    expiresAt: daysFromNow(17),
    usageLimit: 200,
    usagePerCustomer: 1,
    usageCount: 0,
    stackable: false,
    eligibility: { entityTarget: "genres", entityIds: ["g5", "g1"], customerTarget: "all", customerIds: [], countries: [], currencies: [] },
    createdBy: "John Carter",
    createdAt: daysAgo(2),
    updatedAt: daysAgo(1),
    redemptions: [],
    analytics: makeAnalytics(0, 0),
  },
  {
    id: "cpn-005",
    campaignName: "Black Friday 2024",
    code: "BF40",
    description: "40% off everything, Black Friday only.",
    discountType: "percentage",
    discountValue: 40,
    maximumDiscount: 80,
    minimumPurchase: 25,
    status: "expired",
    startsAt: daysAgo(210),
    expiresAt: daysAgo(209),
    usageLimit: 1000,
    usagePerCustomer: null,
    usageCount: 1000,
    stackable: false,
    eligibility: { entityTarget: "all", entityIds: [], customerTarget: "all", customerIds: [], countries: [], currencies: [] },
    createdBy: "Sarah Support",
    createdAt: daysAgo(220),
    updatedAt: daysAgo(208),
    redemptions: makeRedemptions("cpn-005", 5),
    analytics: makeAnalytics(1000, 64000),
  },
  {
    id: "cpn-006",
    campaignName: "R&B Collection Deal",
    code: "RNBCOLL",
    description: "$15 off R&B collections — limited to 100 uses.",
    discountType: "fixed",
    discountValue: 15,
    maximumDiscount: null,
    minimumPurchase: 30,
    status: "disabled",
    startsAt: daysAgo(45),
    expiresAt: daysFromNow(10),
    usageLimit: 100,
    usagePerCustomer: 1,
    usageCount: 62,
    stackable: false,
    eligibility: { entityTarget: "collections", entityIds: ["c3", "c4"], customerTarget: "all", customerIds: [], countries: [], currencies: [] },
    createdBy: "John Carter",
    createdAt: daysAgo(50),
    updatedAt: daysAgo(3),
    redemptions: makeRedemptions("cpn-006", 4),
    analytics: makeAnalytics(62, 4650),
  },
  {
    id: "cpn-007",
    campaignName: "Afrobeats Festival",
    code: "AFROFEST",
    description: "30% off during the Afrobeats Festival weekend.",
    discountType: "percentage",
    discountValue: 30,
    maximumDiscount: 60,
    minimumPurchase: null,
    status: "active",
    startsAt: daysAgo(5),
    expiresAt: daysFromNow(2),
    usageLimit: 300,
    usagePerCustomer: 2,
    usageCount: 241,
    stackable: true,
    eligibility: { entityTarget: "genres", entityIds: ["g2"], customerTarget: "all", customerIds: [], countries: ["GH", "NG", "ZA"], currencies: [] },
    createdBy: "Sarah Support",
    createdAt: daysAgo(10),
    updatedAt: daysAgo(4),
    redemptions: makeRedemptions("cpn-007", 5),
    analytics: makeAnalytics(241, 19280),
  },
];
