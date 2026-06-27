// services/marketing/mock-data.ts
import type {
  Campaign, HomeSection, FeaturedItem, Banner,
  Popup, NewsletterCampaign, NewsletterSubscriber, MarketingAnalytics,
} from "./types";

function daysAgo(n: number) {
  const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString();
}
function daysFromNow(n: number) {
  const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString();
}
function rand(a: number, b: number) { return Math.floor(Math.random() * (b - a + 1)) + a; }

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: "cmp-1", name: "Black Friday 2025", description: "Our biggest annual sale event with sitewide discounts and exclusive drops.",
    status: "scheduled", priority: "critical", audience: "all", tags: ["seasonal", "sale"],
    revenue: 0, conversions: 0, clicks: 0, impressions: 0,
    assets: [{ id: "a1", type: "image", name: "Hero Banner Desktop", url: "" }, { id: "a2", type: "copy", name: "Email Copy", url: "" }],
    startsAt: daysFromNow(12), endsAt: daysFromNow(15), createdBy: "John Carter",
    createdAt: daysAgo(5), updatedAt: daysAgo(1),
  },
  {
    id: "cmp-2", name: "Afrobeats Festival Promo", description: "Promote the Afrobeats collection drop with targeted social and homepage placement.",
    status: "active", priority: "high", audience: "all", tags: ["afrobeats", "genre"],
    revenue: 19280, conversions: 482, clicks: 8240, impressions: 91000,
    assets: [{ id: "a3", type: "image", name: "Hero Image", url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400" }],
    startsAt: daysAgo(5), endsAt: daysFromNow(2), createdBy: "Sarah Support",
    createdAt: daysAgo(10), updatedAt: daysAgo(3),
  },
  {
    id: "cmp-3", name: "New User Onboarding", description: "Welcome email sequence and homepage callout for first-time visitors.",
    status: "active", priority: "medium", audience: "new_users", tags: ["onboarding", "evergreen"],
    revenue: 31260, conversions: 1042, clicks: 14800, impressions: 224000,
    assets: [],
    startsAt: daysAgo(60), endsAt: null, createdBy: "John Carter",
    createdAt: daysAgo(62), updatedAt: daysAgo(1),
  },
  {
    id: "cmp-4", name: "VIP Member Spotlight", description: "Exclusive VIP-only banner and early access notification.",
    status: "active", priority: "medium", audience: "vip", tags: ["vip", "exclusive"],
    revenue: 11400, conversions: 88, clicks: 2100, impressions: 18400,
    assets: [{ id: "a4", type: "image", name: "VIP Banner", url: "" }],
    startsAt: daysAgo(30), endsAt: daysFromNow(60), createdBy: "John Carter",
    createdAt: daysAgo(32), updatedAt: daysAgo(5),
  },
  {
    id: "cmp-5", name: "Summer Drop 2025", description: "Summer season campaign featuring trap and R&B producers.",
    status: "paused", priority: "high", audience: "all", tags: ["summer", "seasonal"],
    revenue: 78340, conversions: 2840, clicks: 31200, impressions: 380000,
    assets: [],
    startsAt: daysAgo(20), endsAt: daysFromNow(10), createdBy: "Sarah Support",
    createdAt: daysAgo(25), updatedAt: daysAgo(2),
  },
  {
    id: "cmp-6", name: "Trap Genre Deep Dive", description: "Educational content campaign highlighting trap producers and techniques.",
    status: "draft", priority: "low", audience: "returning", tags: ["trap", "content"],
    revenue: 0, conversions: 0, clicks: 0, impressions: 0,
    assets: [],
    startsAt: null, endsAt: null, createdBy: "John Carter",
    createdAt: daysAgo(2), updatedAt: daysAgo(1),
  },
];

export const MOCK_HOME_SECTIONS: HomeSection[] = [
  { id: "hs-1", sectionType: "hero_banner", label: "Hero Banner", enabled: true, displayOrder: 1, entityIds: [], startsAt: null, endsAt: null },
  { id: "hs-2", sectionType: "featured_tracks", label: "Featured Tracks", enabled: true, displayOrder: 2, entityIds: ["t1", "t2", "t3"], startsAt: null, endsAt: null },
  { id: "hs-3", sectionType: "featured_artists", label: "Featured Artists", enabled: true, displayOrder: 3, entityIds: ["a1", "a2"], startsAt: null, endsAt: null },
  { id: "hs-4", sectionType: "trending_collections", label: "Trending Collections", enabled: false, displayOrder: 4, entityIds: [], startsAt: daysFromNow(3), endsAt: daysFromNow(17) },
  { id: "hs-5", sectionType: "new_releases", label: "New Releases", enabled: true, displayOrder: 5, entityIds: [], startsAt: null, endsAt: null },
  { id: "hs-6", sectionType: "editors_picks", label: "Editor's Picks", enabled: true, displayOrder: 6, entityIds: [], startsAt: null, endsAt: null },
];

export const MOCK_FEATURED: FeaturedItem[] = [
  { id: "fi-1", entityType: "track", entityId: "trk-2", entityTitle: "Solar Drift", entityArtist: "KXNG Nova", thumbnailUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=120", position: 1, priority: 1, startsAt: daysAgo(3), endsAt: daysFromNow(4) },
  { id: "fi-2", entityType: "track", entityId: "trk-1", entityTitle: "Midnight Bloom", entityArtist: "Aura Keys", thumbnailUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=120", position: 2, priority: 2, startsAt: daysAgo(5), endsAt: daysFromNow(2) },
  { id: "fi-3", entityType: "artist", entityId: "art-1", entityTitle: "KXNG Nova", entityArtist: undefined, thumbnailUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=120", position: 1, priority: 1, startsAt: daysAgo(10), endsAt: daysFromNow(10) },
  { id: "fi-4", entityType: "collection", entityId: "col-1", entityTitle: "Nova Essentials Vol. 1", entityArtist: "KXNG Nova", thumbnailUrl: null, position: 1, priority: 1, startsAt: daysAgo(7), endsAt: daysFromNow(7) },
  { id: "fi-5", entityType: "blog_post", entityId: "pst-1", entityTitle: "Top 10 Trap Producers", entityArtist: undefined, thumbnailUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=120", position: 1, priority: 2, startsAt: daysAgo(2), endsAt: daysFromNow(5) },
];

export const MOCK_BANNERS: Banner[] = [
  {
    id: "ban-1", title: "Summer Drop 2025 — License the Heat",
    ctaText: "Browse Beats", targetUrl: "/tracks",
    desktopImageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400",
    tabletImageUrl: null, mobileImageUrl: null,
    status: "active", clicks: 4820, impressions: 82400,
    startsAt: daysAgo(10), endsAt: daysFromNow(5), createdAt: daysAgo(12),
  },
  {
    id: "ban-2", title: "Afrobeats Festival — Exclusive Drops",
    ctaText: "Explore Now", targetUrl: "/music/collections",
    desktopImageUrl: null, tabletImageUrl: null, mobileImageUrl: null,
    status: "active", clicks: 2140, impressions: 44200,
    startsAt: daysAgo(5), endsAt: daysFromNow(2), createdAt: daysAgo(8),
  },
  {
    id: "ban-3", title: "Black Friday — 40% Off Everything",
    ctaText: "Shop Now", targetUrl: "/tracks",
    desktopImageUrl: null, tabletImageUrl: null, mobileImageUrl: null,
    status: "scheduled", clicks: 0, impressions: 0,
    startsAt: daysFromNow(12), endsAt: daysFromNow(15), createdAt: daysAgo(3),
  },
];

export const MOCK_POPUPS: Popup[] = [
  {
    id: "pop-1", title: "Get 15% Off Your First Beat",
    body: "Join 50,000+ producers already licensing on Sidez. Sign up and get 15% off your first purchase.",
    ctaText: "Get My Discount", ctaUrl: "/register",
    type: "newsletter", audience: "guests", frequency: "once",
    dismissible: true, active: true,
    startsAt: daysAgo(30), endsAt: null,
    views: 14820, conversions: 2223, createdAt: daysAgo(32),
  },
  {
    id: "pop-2", title: "🔥 Black Friday Starts in...",
    body: "The biggest sale of the year drops in just 12 days. Don't miss 40% off all licenses.",
    ctaText: "Remind Me", ctaUrl: "/black-friday",
    type: "countdown", audience: "all", frequency: "session",
    dismissible: true, active: false,
    startsAt: daysFromNow(5), endsAt: daysFromNow(15),
    views: 0, conversions: 0, createdAt: daysAgo(2),
  },
  {
    id: "pop-3", title: "Scheduled Maintenance",
    body: "Sidez will be down for 30 minutes on Dec 28 at 2AM UTC for system upgrades.",
    ctaText: "Got It", ctaUrl: "",
    type: "maintenance", audience: "all", frequency: "once",
    dismissible: true, active: false,
    startsAt: daysFromNow(4), endsAt: daysFromNow(4),
    views: 0, conversions: 0, createdAt: daysAgo(1),
  },
];

export const MOCK_NEWSLETTER_SUBSCRIBERS: NewsletterSubscriber = {
  total: 52840, active: 48920, unsubscribed: 3100, bounced: 820,
};

export const MOCK_NEWSLETTER_CAMPAIGNS: NewsletterCampaign[] = [
  { id: "nl-1", subject: "🔥 New Trap Drops This Week", previewText: "KXNG Nova just released...", status: "sent", segment: "All Subscribers", recipientCount: 48920, openRate: 38.4, clickRate: 12.1, bounceRate: 0.8, scheduledAt: daysAgo(3), sentAt: daysAgo(3), createdAt: daysAgo(5) },
  { id: "nl-2", subject: "Afrobeats Festival — Early Access", previewText: "Exclusive access for you...", status: "sent", segment: "Active Producers", recipientCount: 22400, openRate: 44.2, clickRate: 18.3, bounceRate: 0.6, scheduledAt: daysAgo(7), sentAt: daysAgo(7), createdAt: daysAgo(9) },
  { id: "nl-3", subject: "Black Friday Preview 🛍️", previewText: "Your exclusive early look...", status: "scheduled", segment: "All Subscribers", recipientCount: 48920, openRate: 0, clickRate: 0, bounceRate: 0, scheduledAt: daysFromNow(3), sentAt: null, createdAt: daysAgo(1) },
  { id: "nl-4", subject: "VIP Member — Early Access Drops", previewText: "As a VIP member you get...", status: "draft", segment: "VIP Members", recipientCount: 4280, openRate: 0, clickRate: 0, bounceRate: 0, scheduledAt: null, sentAt: null, createdAt: daysAgo(1) },
];

export const MOCK_ANALYTICS: MarketingAnalytics = {
  totalRevenue: 140280,
  totalConversions: 4452,
  averageCtr: 5.8,
  emailOpenRate: 41.3,
  activeCampaigns: 3,
  topCampaign: "New User Onboarding",
  revenueOverTime: Array.from({ length: 8 }, (_, i) => ({
    date: new Date(Date.now() - (7 - i) * 7 * 86400000).toISOString().split("T")[0],
    amount: rand(8000, 28000),
  })),
  clicksOverTime: Array.from({ length: 8 }, (_, i) => ({
    date: new Date(Date.now() - (7 - i) * 7 * 86400000).toISOString().split("T")[0],
    count: rand(2000, 12000),
  })),
  conversionsOverTime: Array.from({ length: 8 }, (_, i) => ({
    date: new Date(Date.now() - (7 - i) * 7 * 86400000).toISOString().split("T")[0],
    count: rand(100, 600),
  })),
  topBanner: "Summer Drop 2025 — License the Heat",
  topPromotion: "Afrobeats Festival Promo",
};
