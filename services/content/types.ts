// services/content/types.ts

export type ContentType = "blog_post" | "page";
export type ContentStatus = "draft" | "published" | "scheduled" | "archived";
export type ContentVisibility = "public" | "private" | "password";
export type ContentView = "table" | "cards";
export type ContentSort = "updated" | "published" | "alpha";
export type WorkspaceTab = "blog" | "pages" | "homepage" | "faqs" | "announcements";

export type HomepageSectionType =
  | "hero_banner" | "featured_tracks" | "featured_artists"
  | "trending_collections" | "testimonials" | "newsletter"
  | "call_to_action" | "sponsors" | "footer_highlights";

export type AnnouncementPriority = "low" | "medium" | "high";
export type AnnouncementAudience = "all" | "logged_in" | "guests" | "vip";

// ── Content ────────────────────────────────────────────────

export interface ContentBlock {
  id: string;
  type: "heading" | "paragraph" | "image" | "quote" | "gallery" | "video"
  | "code" | "divider" | "button" | "embed" | "callout";
  content: string;
  attrs?: Record<string, unknown>;
}

export interface ContentRevision {
  id: string;
  contentId: string;
  revisionNumber: number;
  changedBy: string;
  summary: string;
  createdAt: string;
}

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  slug: string;
  excerpt: string;
  blocks: ContentBlock[];
  category: string;
  tags: string[];
  author: string;
  authorAvatar: string | null;
  featuredImage: string | null;
  status: ContentStatus;
  visibility: ContentVisibility;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  canonicalUrl: string;
  seoScore: number; // 0–100
  views: number;
  publishedAt: string | null;
  scheduledAt: string | null;
  revisions: ContentRevision[];
  createdAt: string;
  updatedAt: string;
}

// ── Homepage ───────────────────────────────────────────────

export interface HomepageSection {
  id: string;
  sectionType: HomepageSectionType;
  title: string;
  enabled: boolean;
  displayOrder: number;
  subtitle?: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

// ── FAQ ────────────────────────────────────────────────────

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
  published: boolean;
  createdAt: string;
}

// ── Announcement ──────────────────────────────────────────

export interface Announcement {
  id: string;
  title: string;
  message: string;
  audience: AnnouncementAudience;
  priority: AnnouncementPriority;
  bannerColor: string;
  ctaLabel: string;
  ctaUrl: string;
  published: boolean;
  startsAt: string | null;
  endsAt: string | null;
  createdAt: string;
}

// ── Filters ───────────────────────────────────────────────

export interface ContentFilters {
  search: string;
  status: ContentStatus | "all";
  sort: ContentSort;
  view: ContentView;
}
