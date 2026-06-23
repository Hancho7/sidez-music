// services/sound-kits/mock-data.ts
import type { DigitalProduct, ProductFile, ProductVersion, ProductDownload, ProductAnalytics } from "./types";

function daysAgo(n: number) {
  const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString();
}
function daysFromNow(n: number) {
  const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString();
}
function randomBetween(a: number, b: number) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

function fmtBytes(mb: number) { return mb * 1024 * 1024; }
function fakeChecksum() { return Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join(""); }

const DEVICES = ["macOS Safari", "Windows Chrome", "iOS Safari", "Android Chrome", "macOS Chrome"];
const COUNTRIES = ["United States", "United Kingdom", "Germany", "Canada", "Australia", "Nigeria", "Ghana", "Brazil", "Japan", "France"];
const CUSTOMERS = [
  { name: "alex.carter", email: "alex.carter@gmail.com" },
  { name: "maya.osei", email: "maya.osei@gmail.com" },
  { name: "daniel.wu", email: "daniel.wu@gmail.com" },
  { name: "kevin.j", email: "kevin.j@gmail.com" },
  { name: "lena.r", email: "lena.r@gmail.com" },
];

function makeFiles(productId: string, count: number): ProductFile[] {
  const types: Array<ProductFile["fileType"]> = ["zip", "audio", "pdf", "midi"];
  return Array.from({ length: count }, (_, i) => ({
    id: `file-${productId}-${i}`,
    productId,
    filename: i === 0 ? `${productId}_main_v1.2.zip` : i === 1 ? `preview_demo.mp3` : i === 2 ? `readme_manual.pdf` : `bonus_midis.zip`,
    fileType: i === 0 ? "zip" : types[i % types.length],
    version: "1.2",
    checksum: fakeChecksum(),
    size: fmtBytes(randomBetween(20, 800)),
    downloadUrl: `/api/downloads/${productId}/${i}`,
    downloadCount: randomBetween(10, 2000),
    uploadedAt: daysAgo(randomBetween(1, 60)),
    isPrimary: i === 0,
  }));
}

function makeVersions(productId: string): ProductVersion[] {
  return [
    { id: `ver-${productId}-2`, productId, version: "1.2", releaseNotes: "Added 20 new one-shots, fixed tempo metadata on loop files, improved folder structure.", updatedFiles: ["main.zip", "loops_pack.zip"], downloadCount: randomBetween(100, 500), createdAt: daysAgo(14) },
    { id: `ver-${productId}-1`, productId, version: "1.1", releaseNotes: "Bug fix: corrected BPM tags on all 808 samples. Added bonus PDF cheat sheet.", updatedFiles: ["main.zip", "readme.pdf"], downloadCount: randomBetween(50, 300), createdAt: daysAgo(45) },
    { id: `ver-${productId}-0`, productId, version: "1.0", releaseNotes: "Initial release.", updatedFiles: ["main.zip"], downloadCount: randomBetween(200, 1000), createdAt: daysAgo(120) },
  ];
}

function makeDownloads(productId: string): ProductDownload[] {
  return Array.from({ length: 8 }, (_, i) => {
    const c = CUSTOMERS[i % CUSTOMERS.length];
    return {
      id: `dl-${productId}-${i}`,
      productId,
      customerId: `cus-${i}`,
      customerName: c.name,
      customerEmail: c.email,
      orderId: `ORD-${9000 + i}`,
      downloadedAt: daysAgo(randomBetween(0, 30)),
      version: i < 5 ? "1.2" : "1.1",
      device: DEVICES[i % DEVICES.length],
      ipAddress: `${randomBetween(1, 255)}.${randomBetween(1, 255)}.${randomBetween(1, 255)}.1`,
      remainingDownloads: randomBetween(0, 5),
    };
  });
}

function makeAnalytics(downloads: number, revenue: number): ProductAnalytics {
  return {
    totalDownloads: downloads,
    totalRevenue: revenue,
    totalOrders: Math.round(downloads * 0.9),
    totalRefunds: randomBetween(0, Math.round(downloads * 0.03)),
    conversionRate: parseFloat((randomBetween(3, 12) + Math.random()).toFixed(1)),
    downloadsOverTime: Array.from({ length: 8 }, (_, i) => ({
      date: new Date(Date.now() - (7 - i) * 7 * 86400000).toISOString().split("T")[0],
      count: randomBetween(0, Math.round(downloads / 8)),
    })),
    revenueOverTime: Array.from({ length: 8 }, (_, i) => ({
      date: new Date(Date.now() - (7 - i) * 7 * 86400000).toISOString().split("T")[0],
      amount: randomBetween(0, Math.round(revenue / 8)),
    })),
    topCountries: COUNTRIES.slice(0, 5).map(country => ({
      country, downloads: randomBetween(10, Math.round(downloads / 5)),
    })),
    repeatBuyers: randomBetween(20, 80),
  };
}

export const MOCK_PRODUCTS: DigitalProduct[] = [
  {
    id: "prod-001",
    name: "KXNG Trap Essentials",
    sku: "TRAP-ESS-001",
    slug: "kxng-trap-essentials",
    description: "The definitive trap production kit. 808s, hi-hats, snares, kicks, leads, and loop stems — all crafted for modern trap and hip-hop. 500+ sounds, fully key-labeled and BPM-tagged.",
    shortDescription: "500+ trap sounds. 808s, hi-hats, leads, and more.",
    category: "drum_kit",
    tags: ["trap", "808", "hip-hop", "drums", "bestseller"],
    price: 39.99,
    salePrice: 29.99,
    currency: "USD",
    status: "published",
    featured: true,
    thumbnail: null,
    gallery: [],
    previewAudio: null,
    previewVideo: null,
    currentVersion: "1.2",
    downloadLimit: 3,
    couponsEnabled: true,
    licenseRequired: false,
    seoTitle: "KXNG Trap Essentials — Drum Kit",
    seoDescription: "500+ professional trap samples.",
    files: makeFiles("prod-001", 3),
    versions: makeVersions("prod-001"),
    analytics: makeAnalytics(2840, 78340),
    scheduledAt: null,
    createdAt: daysAgo(120),
    updatedAt: daysAgo(14),
  },
  {
    id: "prod-002",
    name: "Aura Melodic Sample Pack Vol. 2",
    sku: "AUR-MEL-002",
    slug: "aura-melodic-sample-pack-v2",
    description: "Lush, cinematic melodies for R&B, soul, and lo-fi. 80 royalty-free loops, key-labeled and stem-separated. Perfect for bedroom producers and professional sessions alike.",
    shortDescription: "80 cinematic R&B and lo-fi melody loops.",
    category: "loop_pack",
    tags: ["r&b", "lo-fi", "soul", "melodic", "loops"],
    price: 24.99,
    salePrice: null,
    currency: "USD",
    status: "published",
    featured: false,
    thumbnail: null,
    gallery: [],
    previewAudio: null,
    previewVideo: null,
    currentVersion: "1.0",
    downloadLimit: null,
    couponsEnabled: true,
    licenseRequired: false,
    seoTitle: "Aura Melodic Sample Pack Vol. 2",
    seoDescription: "R&B and lo-fi melody loops.",
    files: makeFiles("prod-002", 2),
    versions: [{ id: "ver-002-0", productId: "prod-002", version: "1.0", releaseNotes: "Initial release.", updatedFiles: ["main.zip"], downloadCount: 1240, createdAt: daysAgo(60) }],
    analytics: makeAnalytics(1240, 24730),
    scheduledAt: null,
    createdAt: daysAgo(60),
    updatedAt: daysAgo(60),
  },
  {
    id: "prod-003",
    name: "Phasma Future Bass Serum Presets",
    sku: "PHS-SER-003",
    slug: "phasma-future-bass-serum-presets",
    description: "100 professionally designed Serum presets. Supersaws, plucks, basses, arps, and FX. Includes macro assignments for live performance. Optimized for future bass, pop, and EDM.",
    shortDescription: "100 Serum presets for future bass and EDM.",
    category: "preset_pack",
    tags: ["serum", "presets", "edm", "future-bass", "synth"],
    price: 19.99,
    salePrice: null,
    currency: "USD",
    status: "published",
    featured: true,
    thumbnail: null,
    gallery: [],
    previewAudio: null,
    previewVideo: null,
    currentVersion: "2.0",
    downloadLimit: 5,
    couponsEnabled: false,
    licenseRequired: true,
    seoTitle: "Phasma Future Bass Serum Presets",
    seoDescription: "100 Serum presets.",
    files: makeFiles("prod-003", 2),
    versions: [
      { id: "ver-003-1", productId: "prod-003", version: "2.0", releaseNotes: "Rebuilt 30 presets from scratch, added new FX category, improved macro labeling.", updatedFiles: ["serum_presets.zip"], downloadCount: 880, createdAt: daysAgo(20) },
      { id: "ver-003-0", productId: "prod-003", version: "1.0", releaseNotes: "Initial release.", updatedFiles: ["serum_presets_v1.zip"], downloadCount: 640, createdAt: daysAgo(90) },
    ],
    analytics: makeAnalytics(1520, 25200),
    scheduledAt: null,
    createdAt: daysAgo(90),
    updatedAt: daysAgo(20),
  },
  {
    id: "prod-004",
    name: "Afrobeats Construction Kit Bundle",
    sku: "AFR-CK-004",
    slug: "afrobeats-construction-kit-bundle",
    description: "5 full construction kits inspired by Afrobeats, Afropop, and Amapiano. Stems, loops, MIDI, and one-shots included. Tempo-synced and key-labeled for instant workflow.",
    shortDescription: "5 Afrobeats construction kits with full stems.",
    category: "construction_kit",
    tags: ["afrobeats", "amapiano", "afropop", "stems", "construction"],
    price: 49.99,
    salePrice: 39.99,
    currency: "USD",
    status: "published",
    featured: false,
    thumbnail: null,
    gallery: [],
    previewAudio: null,
    previewVideo: null,
    currentVersion: "1.0",
    downloadLimit: 2,
    couponsEnabled: true,
    licenseRequired: false,
    seoTitle: "Afrobeats Construction Kit Bundle",
    seoDescription: "5 full Afrobeats construction kits.",
    files: makeFiles("prod-004", 4),
    versions: [{ id: "ver-004-0", productId: "prod-004", version: "1.0", releaseNotes: "Initial release.", updatedFiles: ["kit_bundle.zip"], downloadCount: 420, createdAt: daysAgo(30) }],
    analytics: makeAnalytics(420, 18360),
    scheduledAt: null,
    createdAt: daysAgo(30),
    updatedAt: daysAgo(30),
  },
  {
    id: "prod-005",
    name: "Dark Drill MIDI Kit",
    sku: "MIDI-DRL-005",
    slug: "dark-drill-midi-kit",
    description: "100 MIDI patterns for UK Drill and dark hip-hop. Melodies, chords, bass lines, and arps. Import directly into any DAW. Pairs perfectly with any piano VST.",
    shortDescription: "100 UK Drill MIDI patterns for any DAW.",
    category: "midi_pack",
    tags: ["midi", "drill", "uk-drill", "patterns", "dark"],
    price: 0,
    salePrice: null,
    currency: "USD",
    status: "published",
    featured: false,
    thumbnail: null,
    gallery: [],
    previewAudio: null,
    previewVideo: null,
    currentVersion: "1.1",
    downloadLimit: null,
    couponsEnabled: false,
    licenseRequired: false,
    seoTitle: "Dark Drill MIDI Kit",
    seoDescription: "100 UK Drill MIDI patterns.",
    files: makeFiles("prod-005", 2),
    versions: [
      { id: "ver-005-1", productId: "prod-005", version: "1.1", releaseNotes: "Added 20 extra bass MIDI patterns.", updatedFiles: ["midi_kit.zip"], downloadCount: 3200, createdAt: daysAgo(10) },
      { id: "ver-005-0", productId: "prod-005", version: "1.0", releaseNotes: "Initial release.", updatedFiles: ["midi_kit_v1.zip"], downloadCount: 2100, createdAt: daysAgo(45) },
    ],
    analytics: makeAnalytics(5300, 0),
    scheduledAt: null,
    createdAt: daysAgo(45),
    updatedAt: daysAgo(10),
  },
  {
    id: "prod-006",
    name: "Vocal Chop FX Pack",
    sku: "VOC-FX-006",
    slug: "vocal-chop-fx-pack",
    description: "200 processed vocal chops, adlibs, stutters, and risers. All samples are royalty-free and pitch-neutral. Essential for modern pop, dance, and electronic production.",
    shortDescription: "200 royalty-free vocal chops and FX.",
    category: "vocal_pack",
    tags: ["vocals", "chops", "fx", "adlibs", "pop"],
    price: 14.99,
    salePrice: null,
    currency: "USD",
    status: "draft",
    featured: false,
    thumbnail: null,
    gallery: [],
    previewAudio: null,
    previewVideo: null,
    currentVersion: "1.0",
    downloadLimit: null,
    couponsEnabled: true,
    licenseRequired: false,
    seoTitle: "Vocal Chop FX Pack",
    seoDescription: "200 vocal chops and FX samples.",
    files: makeFiles("prod-006", 2),
    versions: [{ id: "ver-006-0", productId: "prod-006", version: "1.0", releaseNotes: "Initial draft.", updatedFiles: ["vocals.zip"], downloadCount: 0, createdAt: daysAgo(3) }],
    analytics: makeAnalytics(0, 0),
    scheduledAt: null,
    createdAt: daysAgo(3),
    updatedAt: daysAgo(1),
  },
  {
    id: "prod-007",
    name: "Lo-Fi Bedroom Beats Kit",
    sku: "LOFI-BED-007",
    slug: "lo-fi-bedroom-beats-kit",
    description: "The complete lo-fi toolkit. Vinyl crackle layers, dusty drum loops, warm chord progressions, and tape-saturated one-shots. Nostalgic aesthetics for modern producers.",
    shortDescription: "Complete lo-fi toolkit — drums, loops, chords.",
    category: "sample_pack",
    tags: ["lo-fi", "chill", "vinyl", "tape", "bedroom"],
    price: 29.99,
    salePrice: 19.99,
    currency: "USD",
    status: "scheduled",
    featured: true,
    thumbnail: null,
    gallery: [],
    previewAudio: null,
    previewVideo: null,
    currentVersion: "1.0",
    downloadLimit: 3,
    couponsEnabled: true,
    licenseRequired: false,
    seoTitle: "Lo-Fi Bedroom Beats Kit",
    seoDescription: "Complete lo-fi production toolkit.",
    files: makeFiles("prod-007", 3),
    versions: [{ id: "ver-007-0", productId: "prod-007", version: "1.0", releaseNotes: "Initial release.", updatedFiles: ["lofi_kit.zip"], downloadCount: 0, createdAt: daysAgo(1) }],
    analytics: makeAnalytics(0, 0),
    scheduledAt: daysFromNow(5),
    createdAt: daysAgo(7),
    updatedAt: daysAgo(1),
  },
];

export function getMockDownloads(productId: string): ProductDownload[] {
  return makeDownloads(productId);
}

export const CATEGORY_LABELS: Record<string, string> = {
  drum_kit: "Drum Kit",
  sample_pack: "Sample Pack",
  loop_pack: "Loop Pack",
  midi_pack: "MIDI Pack",
  one_shots: "One Shots",
  fx_pack: "FX Pack",
  vocal_pack: "Vocal Pack",
  construction_kit: "Construction Kit",
  preset_pack: "Preset Pack",
  project_files: "Project Files",
};
