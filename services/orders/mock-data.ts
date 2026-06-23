// services/orders/mock-data.ts

import type { Order, LicenseRightsSnapshot } from "./types";

const BASIC_RIGHTS: LicenseRightsSnapshot = {
  commercialUse: false,
  streamingAllowed: true,
  radioAllowed: false,
  tvAllowed: false,
  monetizationAllowed: false,
  maxStreams: 5_000,
  maxDistribution: 2_500,
  territory: "Worldwide",
};

const PREMIUM_RIGHTS: LicenseRightsSnapshot = {
  commercialUse: true,
  streamingAllowed: true,
  radioAllowed: false,
  tvAllowed: false,
  monetizationAllowed: true,
  maxStreams: 100_000,
  maxDistribution: 50_000,
  territory: "Worldwide",
};

const UNLIMITED_RIGHTS: LicenseRightsSnapshot = {
  commercialUse: true,
  streamingAllowed: true,
  radioAllowed: true,
  tvAllowed: false,
  monetizationAllowed: true,
  maxStreams: null,
  maxDistribution: null,
  territory: "Worldwide",
};

const EXCLUSIVE_RIGHTS: LicenseRightsSnapshot = {
  commercialUse: true,
  streamingAllowed: true,
  radioAllowed: true,
  tvAllowed: true,
  monetizationAllowed: true,
  maxStreams: null,
  maxDistribution: null,
  territory: "Worldwide",
};

const RIGHTS_BY_TYPE = {
  Basic: BASIC_RIGHTS,
  Premium: PREMIUM_RIGHTS,
  Unlimited: UNLIMITED_RIGHTS,
  Exclusive: EXCLUSIVE_RIGHTS,
} as const;

let seq = 1;
function item(
  orderId: string,
  trackName: string,
  artistName: string,
  licenseType: keyof typeof RIGHTS_BY_TYPE,
  price: number
) {
  const id = `oi_${String(seq++).padStart(4, "0")}`;
  return {
    id,
    orderId,
    trackId: `trk_${id}`,
    trackName,
    artistName,
    licenseType,
    price,
    downloadUrl: `https://cdn.sidez.app/downloads/${id}.zip`,
    rights: RIGHTS_BY_TYPE[licenseType],
  };
}

function iso(daysAgo: number, hour = 12, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

export const MOCK_ORDERS: Order[] = [
  {
    id: "ord_8841",
    customerId: "cus_001",
    customerName: "Jordan Mensah",
    customerEmail: "jordan.mensah@gmail.com",
    items: [item("ord_8841", "Midnight Echoes", "Kwame Beats", "Premium", 79.99)],
    totalAmount: 79.99,
    paymentStatus: "PAID",
    paymentMethod: "stripe",
    transactionId: "pi_3Pq8841a2c",
    payment: {
      id: "pay_8841", orderId: "ord_8841", provider: "stripe",
      transactionId: "pi_3Pq8841a2c", status: "PAID", paidAt: iso(1, 14, 22),
      timeline: [
        { status: "PENDING", timestamp: iso(1, 14, 20) },
        { status: "PAID", timestamp: iso(1, 14, 22), note: "Captured via Stripe Checkout" },
      ],
    },
    refunds: [],
    createdAt: iso(1, 14, 20),
    deletedAt: null,
  },
  {
    id: "ord_8840",
    customerId: "cus_002",
    customerName: "Ama Owusu",
    customerEmail: "ama.owusu@outlook.com",
    items: [
      item("ord_8840", "Golden Hour", "Selasi", "Basic", 24.99),
      item("ord_8840", "Lagos Nights", "DJ Tunde", "Basic", 24.99),
    ],
    totalAmount: 49.98,
    paymentStatus: "PAID",
    paymentMethod: "paypal",
    transactionId: "PAY-9KL3829XYZ",
    payment: {
      id: "pay_8840", orderId: "ord_8840", provider: "paypal",
      transactionId: "PAY-9KL3829XYZ", status: "PAID", paidAt: iso(2, 9, 5),
      timeline: [
        { status: "PENDING", timestamp: iso(2, 9, 3) },
        { status: "PAID", timestamp: iso(2, 9, 5) },
      ],
    },
    refunds: [],
    createdAt: iso(2, 9, 3),
    deletedAt: null,
  },
  {
    id: "ord_8839",
    customerId: "cus_003",
    customerName: "Kojo Mensah",
    customerEmail: "k.mensah@yahoo.com",
    items: [item("ord_8839", "Wave Theory", "Selasi", "Unlimited", 199.0)],
    totalAmount: 199.0,
    paymentStatus: "PENDING",
    paymentMethod: "stripe",
    transactionId: "pi_3Pq8839b1d",
    payment: {
      id: "pay_8839", orderId: "ord_8839", provider: "stripe",
      transactionId: "pi_3Pq8839b1d", status: "PENDING", paidAt: null,
      timeline: [{ status: "PENDING", timestamp: iso(0, 8, 41) }],
    },
    refunds: [],
    createdAt: iso(0, 8, 41),
    deletedAt: null,
  },
  {
    id: "ord_8838",
    customerId: "cus_004",
    customerName: "Naa Adjeley",
    customerEmail: "naa.adjeley@gmail.com",
    items: [item("ord_8838", "Spirit of Accra", "Kwame Beats", "Exclusive", 999.0)],
    totalAmount: 999.0,
    paymentStatus: "PAID",
    paymentMethod: "manual",
    transactionId: "MANUAL-WIRE-0044",
    payment: {
      id: "pay_8838", orderId: "ord_8838", provider: "manual",
      transactionId: "MANUAL-WIRE-0044", status: "PAID", paidAt: iso(4, 11, 0),
      timeline: [
        { status: "PENDING", timestamp: iso(5, 16, 10) },
        { status: "PAID", timestamp: iso(4, 11, 0), note: "Wire transfer confirmed by finance" },
      ],
    },
    refunds: [],
    createdAt: iso(5, 16, 10),
    deletedAt: null,
  },
  {
    id: "ord_8837",
    customerId: "cus_005",
    customerName: "Yaw Boateng",
    customerEmail: "yaw.boateng@proton.me",
    items: [item("ord_8837", "Drift", "DJ Tunde", "Premium", 79.99)],
    totalAmount: 79.99,
    paymentStatus: "FAILED",
    paymentMethod: "stripe",
    transactionId: "pi_3Pq8837fz9",
    payment: {
      id: "pay_8837", orderId: "ord_8837", provider: "stripe",
      transactionId: "pi_3Pq8837fz9", status: "FAILED", paidAt: null,
      timeline: [
        { status: "PENDING", timestamp: iso(3, 19, 12) },
        { status: "FAILED", timestamp: iso(3, 19, 13), note: "Card declined — insufficient funds" },
      ],
    },
    refunds: [],
    createdAt: iso(3, 19, 12),
    deletedAt: null,
  },
  {
    id: "ord_8836",
    customerId: "cus_006",
    customerName: "Efua Asante",
    customerEmail: "efua.asante@gmail.com",
    items: [item("ord_8836", "Lonely Roads", "Selasi", "Basic", 24.99)],
    totalAmount: 24.99,
    paymentStatus: "REFUNDED",
    paymentMethod: "stripe",
    transactionId: "pi_3Pq8836c7e",
    payment: {
      id: "pay_8836", orderId: "ord_8836", provider: "stripe",
      transactionId: "pi_3Pq8836c7e", status: "REFUNDED", paidAt: iso(9, 10, 0),
      timeline: [
        { status: "PENDING", timestamp: iso(9, 9, 58) },
        { status: "PAID", timestamp: iso(9, 10, 0) },
        { status: "REFUNDED", timestamp: iso(7, 13, 30), note: "Refunded in full — duplicate purchase" },
      ],
    },
    refunds: [
      { id: "ref_0001", orderId: "ord_8836", amount: 24.99, reason: "Duplicate purchase", status: "COMPLETED", createdAt: iso(7, 13, 30) },
    ],
    createdAt: iso(9, 9, 58),
    deletedAt: null,
  },
  {
    id: "ord_8835",
    customerId: "cus_007",
    customerName: "Kwabena Owusu",
    customerEmail: "kwabena.o@hotmail.com",
    items: [
      item("ord_8835", "Night Drive", "Kwame Beats", "Premium", 79.99),
      item("ord_8835", "Golden Hour", "Selasi", "Basic", 24.99),
      item("ord_8835", "Wave Theory", "Selasi", "Basic", 24.99),
    ],
    totalAmount: 129.97,
    paymentStatus: "PAID",
    paymentMethod: "stripe",
    transactionId: "pi_3Pq8835a4f",
    payment: {
      id: "pay_8835", orderId: "ord_8835", provider: "stripe",
      transactionId: "pi_3Pq8835a4f", status: "PAID", paidAt: iso(6, 17, 45),
      timeline: [
        { status: "PENDING", timestamp: iso(6, 17, 43) },
        { status: "PAID", timestamp: iso(6, 17, 45) },
      ],
    },
    refunds: [],
    createdAt: iso(6, 17, 43),
    deletedAt: null,
  },
  {
    id: "ord_8834",
    customerId: "cus_008",
    customerName: "Abena Darko",
    customerEmail: "abena.darko@gmail.com",
    items: [item("ord_8834", "Lagos Nights", "DJ Tunde", "Unlimited", 199.0)],
    totalAmount: 199.0,
    paymentStatus: "PAID",
    paymentMethod: "paypal",
    transactionId: "PAY-7QW1122ABC",
    payment: {
      id: "pay_8834", orderId: "ord_8834", provider: "paypal",
      transactionId: "PAY-7QW1122ABC", status: "PAID", paidAt: iso(11, 8, 15),
      timeline: [
        { status: "PENDING", timestamp: iso(11, 8, 13) },
        { status: "PAID", timestamp: iso(11, 8, 15) },
      ],
    },
    refunds: [],
    createdAt: iso(11, 8, 13),
    deletedAt: null,
  },
  {
    id: "ord_8833",
    customerId: "cus_009",
    customerName: "Yaa Asantewaa",
    customerEmail: "yaa.asantewaa@gmail.com",
    items: [item("ord_8833", "Spirit of Accra", "Kwame Beats", "Basic", 24.99)],
    totalAmount: 24.99,
    paymentStatus: "PENDING",
    paymentMethod: "manual",
    transactionId: "MANUAL-PENDING-0091",
    payment: {
      id: "pay_8833", orderId: "ord_8833", provider: "manual",
      transactionId: "MANUAL-PENDING-0091", status: "PENDING", paidAt: null,
      timeline: [{ status: "PENDING", timestamp: iso(0, 6, 5) }],
    },
    refunds: [],
    createdAt: iso(0, 6, 5),
    deletedAt: null,
  },
  {
    id: "ord_8832",
    customerId: "cus_010",
    customerName: "Kofi Annan Jr.",
    customerEmail: "kofi.annanjr@gmail.com",
    items: [item("ord_8832", "Drift", "DJ Tunde", "Premium", 79.99)],
    totalAmount: 79.99,
    paymentStatus: "PAID",
    paymentMethod: "stripe",
    transactionId: "pi_3Pq8832d8h",
    payment: {
      id: "pay_8832", orderId: "ord_8832", provider: "stripe",
      transactionId: "pi_3Pq8832d8h", status: "PAID", paidAt: iso(14, 20, 30),
      timeline: [
        { status: "PENDING", timestamp: iso(14, 20, 28) },
        { status: "PAID", timestamp: iso(14, 20, 30) },
      ],
    },
    refunds: [
      { id: "ref_0002", orderId: "ord_8832", amount: 20.0, reason: "Partial refund — promo price honored", status: "COMPLETED", createdAt: iso(12, 9, 0) },
    ],
    createdAt: iso(14, 20, 28),
    deletedAt: null,
  },
];
