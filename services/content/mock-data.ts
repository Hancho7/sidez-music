// services/content/mock-data.ts
import type {
  ContentItem, ContentBlock, ContentRevision,
  HomepageSection, FAQ, Announcement,
} from "./types";

function daysAgo(n: number) {
  const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString();
}
function daysFromNow(n: number) {
  const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString();
}

const makeBlocks = (slug: string): ContentBlock[] => [
  { id: `${slug}-h1`, type: "heading", content: "Introduction", attrs: { level: 2 } },
  { id: `${slug}-p1`, type: "paragraph", content: "This is the opening paragraph of the article. It provides context and hooks the reader into continuing." },
  { id: `${slug}-p2`, type: "paragraph", content: "A second paragraph expands on the topic with more detail and supporting information." },
  { id: `${slug}-q1`, type: "quote", content: "Great music is the foundation of any culture worth building.", attrs: { author: "Platform Founder" } },
  { id: `${slug}-h2`, type: "heading", content: "Key Takeaways", attrs: { level: 2 } },
  { id: `${slug}-p3`, type: "paragraph", content: "Wrapping up the main points and encouraging readers to take action or explore further." },
  { id: `${slug}-cta`, type: "button", content: "Explore the Marketplace", attrs: { url: "/marketplace", variant: "primary" } },
];

const makeRevisions = (contentId: string): ContentRevision[] => [
  { id: `rev-${contentId}-3`, contentId, revisionNumber: 3, changedBy: "John Carter", summary: "Updated SEO metadata and fixed typo in intro", createdAt: daysAgo(1) },
  { id: `rev-${contentId}-2`, contentId, revisionNumber: 2, changedBy: "Sarah Support", summary: "Added quote block and CTA button", createdAt: daysAgo(5) },
  { id: `rev-${contentId}-1`, contentId, revisionNumber: 1, changedBy: "John Carter", summary: "Initial draft", createdAt: daysAgo(14) },
];

export const MOCK_BLOG_POSTS: ContentItem[] = [
  {
    id: "post-001", type: "blog_post",
    title: "How to License Music for Your Next Commercial Project",
    slug: "license-music-commercial-project",
    excerpt: "A step-by-step guide to understanding music licensing, rights, and what plan fits your needs.",
    blocks: makeBlocks("post-001"),
    category: "Licensing", tags: ["licensing", "commercial", "guide"],
    author: "John Carter", authorAvatar: null,
    featuredImage: null, status: "published", visibility: "public",
    seoTitle: "Music Licensing Guide for Commercial Projects",
    seoDescription: "Learn how to license music for commercials, films, and YouTube. Step-by-step guide.",
    seoKeywords: ["music licensing", "commercial use", "royalty free"],
    canonicalUrl: "", seoScore: 87, views: 4820,
    publishedAt: daysAgo(12), scheduledAt: null,
    revisions: makeRevisions("post-001"),
    createdAt: daysAgo(20), updatedAt: daysAgo(3),
  },
  {
    id: "post-002", type: "blog_post",
    title: "Top 10 Trap Producers to Watch in 2025",
    slug: "top-trap-producers-2025",
    excerpt: "The hottest names shaping the future of trap music, all available on our marketplace.",
    blocks: makeBlocks("post-002"),
    category: "Artists", tags: ["trap", "producers", "2025", "trending"],
    author: "Sarah Support", authorAvatar: null,
    featuredImage: null, status: "published", visibility: "public",
    seoTitle: "Top 10 Trap Producers 2025 | Sidez",
    seoDescription: "Discover the top trap producers of 2025 and license their beats exclusively on Sidez.",
    seoKeywords: ["trap producers", "2025", "beats"],
    canonicalUrl: "", seoScore: 92, views: 11240,
    publishedAt: daysAgo(7), scheduledAt: null,
    revisions: makeRevisions("post-002"),
    createdAt: daysAgo(14), updatedAt: daysAgo(2),
  },
  {
    id: "post-003", type: "blog_post",
    title: "Understanding Exclusive vs. Non-Exclusive Licenses",
    slug: "exclusive-vs-non-exclusive-licenses",
    excerpt: "What's the real difference, and which is right for your project budget?",
    blocks: makeBlocks("post-003"),
    category: "Licensing", tags: ["licensing", "exclusive", "education"],
    author: "John Carter", authorAvatar: null,
    featuredImage: null, status: "draft", visibility: "public",
    seoTitle: "", seoDescription: "", seoKeywords: [],
    canonicalUrl: "", seoScore: 0, views: 0,
    publishedAt: null, scheduledAt: null,
    revisions: makeRevisions("post-003"),
    createdAt: daysAgo(3), updatedAt: daysAgo(1),
  },
  {
    id: "post-004", type: "blog_post",
    title: "Afrobeats Rising: The Global Movement",
    slug: "afrobeats-rising-global-movement",
    excerpt: "Exploring how Afrobeats conquered global charts and what it means for producers.",
    blocks: makeBlocks("post-004"),
    category: "Culture", tags: ["afrobeats", "global", "culture"],
    author: "Sarah Support", authorAvatar: null,
    featuredImage: null, status: "scheduled", visibility: "public",
    seoTitle: "Afrobeats Rising: The Global Movement | Sidez Blog",
    seoDescription: "How Afrobeats became a global phenomenon — and what it means for music producers.",
    seoKeywords: ["afrobeats", "global music", "culture"],
    canonicalUrl: "", seoScore: 78, views: 0,
    publishedAt: null, scheduledAt: daysFromNow(3),
    revisions: makeRevisions("post-004"),
    createdAt: daysAgo(5), updatedAt: daysAgo(1),
  },
  {
    id: "post-005", type: "blog_post",
    title: "How to Build a Beat from Scratch",
    slug: "build-beat-from-scratch",
    excerpt: "A beginner's walkthrough of building a complete beat using only samples from our marketplace.",
    blocks: makeBlocks("post-005"),
    category: "Tutorial", tags: ["tutorial", "beginner", "beat making"],
    author: "John Carter", authorAvatar: null,
    featuredImage: null, status: "archived", visibility: "public",
    seoTitle: "How to Build a Beat from Scratch",
    seoDescription: "Step-by-step tutorial for building a beat using Sidez samples.",
    seoKeywords: ["beat making", "tutorial", "samples"],
    canonicalUrl: "", seoScore: 64, views: 2340,
    publishedAt: daysAgo(60), scheduledAt: null,
    revisions: makeRevisions("post-005"),
    createdAt: daysAgo(70), updatedAt: daysAgo(60),
  },
];

export const MOCK_PAGES: ContentItem[] = [
  {
    id: "page-001", type: "page",
    title: "About Us", slug: "about",
    excerpt: "Our story, mission, and the team behind Sidez.",
    blocks: makeBlocks("page-001"),
    category: "Core", tags: [],
    author: "John Carter", authorAvatar: null, featuredImage: null,
    status: "published", visibility: "public",
    seoTitle: "About Sidez | Music Marketplace", seoDescription: "Learn about Sidez and our mission to empower music producers.",
    seoKeywords: ["about", "mission"], canonicalUrl: "", seoScore: 82, views: 3210,
    publishedAt: daysAgo(90), scheduledAt: null, revisions: makeRevisions("page-001"),
    createdAt: daysAgo(120), updatedAt: daysAgo(10),
  },
  {
    id: "page-002", type: "page",
    title: "Terms of Service", slug: "terms",
    excerpt: "Legal terms governing use of the Sidez platform.",
    blocks: makeBlocks("page-002"),
    category: "Legal", tags: [],
    author: "John Carter", authorAvatar: null, featuredImage: null,
    status: "published", visibility: "public",
    seoTitle: "Terms of Service | Sidez", seoDescription: "Read the Sidez Terms of Service.",
    seoKeywords: ["terms"], canonicalUrl: "", seoScore: 60, views: 890,
    publishedAt: daysAgo(90), scheduledAt: null, revisions: makeRevisions("page-002"),
    createdAt: daysAgo(120), updatedAt: daysAgo(30),
  },
  {
    id: "page-003", type: "page",
    title: "Privacy Policy", slug: "privacy",
    excerpt: "How we collect, use, and protect your data.",
    blocks: makeBlocks("page-003"),
    category: "Legal", tags: [],
    author: "John Carter", authorAvatar: null, featuredImage: null,
    status: "published", visibility: "public",
    seoTitle: "Privacy Policy | Sidez", seoDescription: "Sidez privacy policy and data practices.",
    seoKeywords: ["privacy"], canonicalUrl: "", seoScore: 55, views: 720,
    publishedAt: daysAgo(90), scheduledAt: null, revisions: makeRevisions("page-003"),
    createdAt: daysAgo(120), updatedAt: daysAgo(30),
  },
  {
    id: "page-004", type: "page",
    title: "Contact Us", slug: "contact",
    excerpt: "Get in touch with the Sidez team.",
    blocks: makeBlocks("page-004"),
    category: "Core", tags: [],
    author: "Sarah Support", authorAvatar: null, featuredImage: null,
    status: "published", visibility: "public",
    seoTitle: "Contact Sidez", seoDescription: "Reach out to the Sidez team.",
    seoKeywords: ["contact"], canonicalUrl: "", seoScore: 70, views: 1890,
    publishedAt: daysAgo(90), scheduledAt: null, revisions: makeRevisions("page-004"),
    createdAt: daysAgo(120), updatedAt: daysAgo(15),
  },
  {
    id: "page-005", type: "page",
    title: "Refund Policy", slug: "refunds",
    excerpt: "Our refund and return policy for digital purchases.",
    blocks: makeBlocks("page-005"),
    category: "Legal", tags: [],
    author: "John Carter", authorAvatar: null, featuredImage: null,
    status: "draft", visibility: "public",
    seoTitle: "", seoDescription: "", seoKeywords: [], canonicalUrl: "", seoScore: 0, views: 0,
    publishedAt: null, scheduledAt: null, revisions: makeRevisions("page-005"),
    createdAt: daysAgo(5), updatedAt: daysAgo(1),
  },
];

export const MOCK_HOMEPAGE_SECTIONS: HomepageSection[] = [
  { id: "hs-1", sectionType: "hero_banner", title: "Hero Banner", enabled: true, displayOrder: 1, subtitle: "License beats from the world's best producers", ctaLabel: "Browse Beats", ctaUrl: "/tracks" },
  { id: "hs-2", sectionType: "featured_tracks", title: "Featured Tracks", enabled: true, displayOrder: 2, subtitle: "Handpicked by our editorial team" },
  { id: "hs-3", sectionType: "featured_artists", title: "Featured Artists", enabled: true, displayOrder: 3, subtitle: "Spotlight on top producers" },
  { id: "hs-4", sectionType: "trending_collections", title: "Trending Collections", enabled: false, displayOrder: 4 },
  { id: "hs-5", sectionType: "testimonials", title: "Testimonials", enabled: true, displayOrder: 5 },
  { id: "hs-6", sectionType: "newsletter", title: "Newsletter Signup", enabled: true, displayOrder: 6, subtitle: "Get new beats in your inbox" },
  { id: "hs-7", sectionType: "call_to_action", title: "Call to Action", enabled: true, displayOrder: 7, ctaLabel: "Start Licensing", ctaUrl: "/tracks" },
  { id: "hs-8", sectionType: "sponsors", title: "Partners & Sponsors", enabled: false, displayOrder: 8 },
  { id: "hs-9", sectionType: "footer_highlights", title: "Footer Highlights", enabled: true, displayOrder: 9 },
];

export const MOCK_FAQS: FAQ[] = [
  { id: "faq-1", question: "What is a non-exclusive license?", answer: "A non-exclusive license allows multiple buyers to purchase and use the same beat. You do not own exclusive rights to the track.", category: "Licensing", displayOrder: 1, published: true, createdAt: daysAgo(30) },
  { id: "faq-2", question: "Can I use beats for commercial projects?", answer: "Yes, with a Premium or Exclusive license you may use beats for commercial projects, including YouTube monetization and radio.", category: "Licensing", displayOrder: 2, published: true, createdAt: daysAgo(28) },
  { id: "faq-3", question: "How do I download my purchased beats?", answer: "After purchase, your files are available in your dashboard under Downloads. You can download them up to your license's limit.", category: "Downloads", displayOrder: 3, published: true, createdAt: daysAgo(25) },
  { id: "faq-4", question: "What payment methods do you accept?", answer: "We accept all major credit cards, PayPal, and various regional payment methods depending on your country.", category: "Payments", displayOrder: 4, published: true, createdAt: daysAgo(20) },
  { id: "faq-5", question: "Can I get a refund?", answer: "Digital products are generally non-refundable once downloaded. Please review our Refund Policy for exceptions.", category: "Payments", displayOrder: 5, published: true, createdAt: daysAgo(15) },
  { id: "faq-6", question: "How long does an exclusive license last?", answer: "Exclusive licenses are permanent. Once purchased, you own full exclusive rights to the beat and no one else can purchase it.", category: "Licensing", displayOrder: 6, published: false, createdAt: daysAgo(5) },
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  { id: "ann-1", title: "Black Friday Sale — 40% Off Everything", message: "Our biggest sale of the year is live. Use code BF40 at checkout for 40% off all licenses.", audience: "all", priority: "high", bannerColor: "#7c3aed", ctaLabel: "Shop Now", ctaUrl: "/tracks", published: true, startsAt: daysAgo(2), endsAt: daysFromNow(2), createdAt: daysAgo(7) },
  { id: "ann-2", title: "New Afrobeats Collection Available", message: "25 new Afrobeats construction kits just dropped. Exclusive licenses available for a limited time.", audience: "all", priority: "medium", bannerColor: "#059669", ctaLabel: "Browse", ctaUrl: "/music/collections", published: true, startsAt: daysAgo(1), endsAt: daysFromNow(7), createdAt: daysAgo(3) },
  { id: "ann-3", title: "Scheduled Maintenance — Dec 28 2AM UTC", message: "The platform will be unavailable for approximately 30 minutes for scheduled maintenance.", audience: "all", priority: "high", bannerColor: "#dc2626", ctaLabel: "", ctaUrl: "", published: false, startsAt: daysFromNow(4), endsAt: daysFromNow(4), createdAt: daysAgo(1) },
  { id: "ann-4", title: "VIP Member Early Access", message: "VIP members get 48-hour early access to all new drops. Upgrade your account today.", audience: "logged_in", priority: "low", bannerColor: "#a855f7", ctaLabel: "Upgrade", ctaUrl: "/account", published: true, startsAt: daysAgo(10), endsAt: daysFromNow(20), createdAt: daysAgo(14) },
];
