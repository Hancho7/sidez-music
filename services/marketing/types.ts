// services/marketing/types.ts

export type MarketingTab =
  | "campaigns" | "homepage" | "featured" | "banners" | "popups" | "newsletter" | "analytics";

export type CampaignStatus = "active" | "scheduled" | "paused" | "ended" | "draft";
export type CampaignPriority = "critical" | "high" | "medium" | "low";
export type CampaignAudience = "all" | "logged_in" | "guests" | "vip" | "new_users" | "returning";
export type BannerStatus = "active" | "scheduled" | "inactive";
export type PopupType = "newsletter" | "announcement" | "sale" | "countdown" | "maintenance";
export type PopupAudience = "all" | "guests" | "logged_in" | "new_users";
export type FeaturedEntityType = "track" | "collection" | "artist" | "blog_post";
export type NewsletterStatus = "draft" | "scheduled" | "sent" | "cancelled";

// ── Campaign ──────────────────────────────────────────────────────

export interface CampaignAsset {
  id: string;
  type: "image" | "video" | "audio" | "copy";
  name: string;
  url: string;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  status: CampaignStatus;
  priority: CampaignPriority;
  audience: CampaignAudience;
  tags: string[];
  revenue: number;
  conversions: number;
  clicks: number;
  impressions: number;
  assets: CampaignAsset[];
  startsAt: string | null;
  endsAt: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ── Homepage section ──────────────────────────────────────────────

export type HomeSectionType =
  | "hero_banner" | "featured_artists" | "featured_tracks"
  | "trending_collections" | "new_releases" | "editors_picks";

export interface HomeSection {
  id: string;
  sectionType: HomeSectionType;
  label: string;
  enabled: boolean;
  displayOrder: number;
  entityIds: string[];
  startsAt: string | null;
  endsAt: string | null;
}

// ── Featured content ──────────────────────────────────────────────

export interface FeaturedItem {
  id: string;
  entityType: FeaturedEntityType;
  entityId: string;
  entityTitle: string;
  entityArtist?: string;
  thumbnailUrl: string | null;
  position: number;
  priority: number;
  startsAt: string | null;
  endsAt: string | null;
}

// ── Banner ────────────────────────────────────────────────────────

export interface Banner {
  id: string;
  title: string;
  ctaText: string;
  targetUrl: string;
  desktopImageUrl: string | null;
  tabletImageUrl: string | null;
  mobileImageUrl: string | null;
  status: BannerStatus;
  clicks: number;
  impressions: number;
  startsAt: string | null;
  endsAt: string | null;
  createdAt: string;
}

// ── Popup ─────────────────────────────────────────────────────────

export interface Popup {
  id: string;
  title: string;
  body: string;
  ctaText: string;
  ctaUrl: string;
  type: PopupType;
  audience: PopupAudience;
  frequency: "once" | "session" | "daily" | "always";
  dismissible: boolean;
  active: boolean;
  startsAt: string | null;
  endsAt: string | null;
  views: number;
  conversions: number;
  createdAt: string;
}

// ── Newsletter ────────────────────────────────────────────────────

export interface NewsletterSubscriber {
  total: number;
  active: number;
  unsubscribed: number;
  bounced: number;
}

export interface NewsletterCampaign {
  id: string;
  subject: string;
  previewText: string;
  status: NewsletterStatus;
  segment: string;
  recipientCount: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  scheduledAt: string | null;
  sentAt: string | null;
  createdAt: string;
}

// ── Analytics ────────────────────────────────────────────────────

export interface MarketingAnalytics {
  totalRevenue: number;
  totalConversions: number;
  averageCtr: number;
  emailOpenRate: number;
  activeCampaigns: number;
  topCampaign: string;
  revenueOverTime: { date: string; amount: number }[];
  clicksOverTime: { date: string; count: number }[];
  conversionsOverTime: { date: string; count: number }[];
  topBanner: string;
  topPromotion: string;
}
