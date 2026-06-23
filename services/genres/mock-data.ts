// services/genres/mock-data.ts

import type { Genre, GenreDetail } from "./types";

export const MOCK_GENRES: Genre[] = [
  {
    id: "g1", name: "Hip Hop", slug: "hip-hop",
    description: "The definitive urban genre — boom bap, trap, drill, and everything in between.",
    imageUrl: "https://picsum.photos/seed/hiphop/400/300",
    accentColor: "#a855f7", icon: "Mic2",
    isActive: true,
    seoTitle: "Hip Hop Beats | Buy Rap Instrumentals",
    seoDescription: "Browse premium Hip Hop beats and instrumentals from top producers.",
    createdAt: "2024-09-01T10:00:00Z", updatedAt: "2025-05-20T08:00:00Z",
    trackCount: 342, artistCount: 87, collectionCount: 24,
    totalSales: 1840, totalRevenue: 55200, totalDownloads: 4120,
  },
  {
    id: "g2", name: "Afrobeats", slug: "afrobeats",
    description: "High-energy West African rhythms blending percussion, melody, and modern production.",
    imageUrl: "https://picsum.photos/seed/afrobeats/400/300",
    accentColor: "#f59e0b", icon: "Music2",
    isActive: true,
    seoTitle: "Afrobeats Instrumentals | Buy Afropop Beats",
    seoDescription: "Discover authentic Afrobeats and Afropop productions from leading producers.",
    createdAt: "2024-09-05T10:00:00Z", updatedAt: "2025-06-01T09:00:00Z",
    trackCount: 198, artistCount: 54, collectionCount: 14,
    totalSales: 1102, totalRevenue: 33060, totalDownloads: 2210,
  },
  {
    id: "g3", name: "R&B / Soul", slug: "rnb-soul",
    description: "Smooth, soulful, and sensual productions for contemporary R&B artists.",
    imageUrl: "https://picsum.photos/seed/rnb/400/300",
    accentColor: "#ec4899", icon: "Heart",
    isActive: true,
    seoTitle: "R&B Beats | Soul Instrumentals",
    seoDescription: "Premium R&B and Soul beats for vocalists and recording artists.",
    createdAt: "2024-09-10T10:00:00Z", updatedAt: "2025-05-28T12:00:00Z",
    trackCount: 215, artistCount: 63, collectionCount: 17,
    totalSales: 978, totalRevenue: 29340, totalDownloads: 1890,
  },
  {
    id: "g4", name: "Lo-Fi", slug: "lo-fi",
    description: "Relaxed, nostalgic beats with vinyl warmth and laid-back grooves.",
    imageUrl: "https://picsum.photos/seed/lofi/400/300",
    accentColor: "#06b6d4", icon: "Headphones",
    isActive: true,
    seoTitle: "Lo-Fi Beats | Chill Instrumentals",
    seoDescription: "Study, relax, and create with our curated Lo-Fi beat collections.",
    createdAt: "2024-10-02T10:00:00Z", updatedAt: "2025-06-10T07:00:00Z",
    trackCount: 164, artistCount: 41, collectionCount: 11,
    totalSales: 733, totalRevenue: 21990, totalDownloads: 3440,
  },
  {
    id: "g5", name: "Drill", slug: "drill",
    description: "Dark, menacing beats with sliding 808s and aggressive hi-hat patterns.",
    imageUrl: "https://picsum.photos/seed/drill/400/300",
    accentColor: "#ef4444", icon: "Zap",
    isActive: true,
    seoTitle: "Drill Beats | UK & Chicago Drill Instrumentals",
    seoDescription: "Hard-hitting Drill beats for artists across the globe.",
    createdAt: "2024-10-15T10:00:00Z", updatedAt: "2025-06-08T11:00:00Z",
    trackCount: 128, artistCount: 39, collectionCount: 8,
    totalSales: 614, totalRevenue: 18420, totalDownloads: 1780,
  },
  {
    id: "g6", name: "Reggaeton", slug: "reggaeton",
    description: "Dembow-driven Latin urban beats with infectious rhythms and modern flair.",
    imageUrl: "https://picsum.photos/seed/reggaeton/400/300",
    accentColor: "#10b981", icon: "Radio",
    isActive: true,
    seoTitle: "Reggaeton Beats | Latin Urban Instrumentals",
    seoDescription: "Buy premium Reggaeton and Latin Urban beats for your next release.",
    createdAt: "2024-11-01T10:00:00Z", updatedAt: "2025-05-30T14:00:00Z",
    trackCount: 94, artistCount: 28, collectionCount: 6,
    totalSales: 441, totalRevenue: 13230, totalDownloads: 980,
  },
  {
    id: "g7", name: "Ambient", slug: "ambient",
    description: "Atmospheric soundscapes designed for film, meditation, podcasts, and content.",
    imageUrl: null,
    accentColor: "#3b82f6", icon: "Cloud",
    isActive: true,
    seoTitle: "Ambient Music | Atmospheric Soundscapes",
    seoDescription: "Explore cinematic ambient music and soundscapes for content creators.",
    createdAt: "2024-11-20T10:00:00Z", updatedAt: "2025-05-15T08:00:00Z",
    trackCount: 76, artistCount: 22, collectionCount: 5,
    totalSales: 289, totalRevenue: 8670, totalDownloads: 1220,
  },
  {
    id: "g8", name: "Gospel / Worship", slug: "gospel-worship",
    description: "Uplifting, spirit-filled productions for gospel and worship artists.",
    imageUrl: "https://picsum.photos/seed/gospel/400/300",
    accentColor: "#f97316", icon: "Star",
    isActive: false,
    seoTitle: "Gospel Beats | Worship Instrumentals",
    seoDescription: "Anointed Gospel and Worship instrumentals for artists and musicians.",
    createdAt: "2024-12-01T10:00:00Z", updatedAt: "2025-04-10T10:00:00Z",
    trackCount: 52, artistCount: 18, collectionCount: 3,
    totalSales: 201, totalRevenue: 6030, totalDownloads: 640,
  },
];

export const MOCK_GENRE_DETAILS: Record<string, GenreDetail> = {
  g1: {
    ...MOCK_GENRES[0],
    subgenres: [
      { id: "s1", genreId: "g1", name: "Trap", slug: "trap", description: "Hard 808s, rapid hi-hats.", orderIndex: 0, isActive: true, trackCount: 124 },
      { id: "s2", genreId: "g1", name: "Boom Bap", slug: "boom-bap", description: "Classic SP-1200 drum patterns.", orderIndex: 1, isActive: true, trackCount: 78 },
      { id: "s3", genreId: "g1", name: "Drill", slug: "drill-hh", description: "Dark, sliding 808s.", orderIndex: 2, isActive: true, trackCount: 66 },
      { id: "s4", genreId: "g1", name: "Lo-Fi Hip Hop", slug: "lo-fi-hh", description: "Chilled, dusty, nostalgic.", orderIndex: 3, isActive: true, trackCount: 44 },
      { id: "s5", genreId: "g1", name: "Conscious", slug: "conscious", description: "Lyric-forward, introspective beats.", orderIndex: 4, isActive: false, trackCount: 30 },
    ],
  },
  g2: {
    ...MOCK_GENRES[1],
    subgenres: [
      { id: "s6", genreId: "g2", name: "Afropop", slug: "afropop", description: "Melodic pop-leaning Afrobeats.", orderIndex: 0, isActive: true, trackCount: 88 },
      { id: "s7", genreId: "g2", name: "Amapiano", slug: "amapiano", description: "Deep, piano-driven South African.", orderIndex: 1, isActive: true, trackCount: 62 },
      { id: "s8", genreId: "g2", name: "Afro Drill", slug: "afro-drill", description: "Afrobeats energy meets drill.", orderIndex: 2, isActive: true, trackCount: 48 },
    ],
  },
  g3: {
    ...MOCK_GENRES[2],
    subgenres: [
      { id: "s9", genreId: "g3", name: "Neo Soul", slug: "neo-soul", description: "Contemporary soul with jazz influence.", orderIndex: 0, isActive: true, trackCount: 72 },
      { id: "s10", genreId: "g3", name: "Contemporary R&B", slug: "contemporary-rnb", description: "Modern R&B production.", orderIndex: 1, isActive: true, trackCount: 98 },
      { id: "s11", genreId: "g3", name: "Quiet Storm", slug: "quiet-storm", description: "Slow jams and romantic vibes.", orderIndex: 2, isActive: true, trackCount: 45 },
    ],
  },
  g4: {
    ...MOCK_GENRES[3], subgenres: [
      { id: "s12", genreId: "g4", name: "Chillhop", slug: "chillhop", description: "Hip hop infused lo-fi.", orderIndex: 0, isActive: true, trackCount: 68 },
      { id: "s13", genreId: "g4", name: "Jazz Hop", slug: "jazz-hop", description: "Jazz samples and lo-fi.", orderIndex: 1, isActive: true, trackCount: 52 },
      { id: "s14", genreId: "g4", name: "Study Beats", slug: "study-beats", description: "Focus-oriented beats.", orderIndex: 2, isActive: true, trackCount: 44 },
    ]
  },
  g5: {
    ...MOCK_GENRES[4], subgenres: [
      { id: "s15", genreId: "g5", name: "UK Drill", slug: "uk-drill", description: "London-originated sound.", orderIndex: 0, isActive: true, trackCount: 74 },
      { id: "s16", genreId: "g5", name: "Chicago Drill", slug: "chicago-drill", description: "The originator drill sound.", orderIndex: 1, isActive: true, trackCount: 54 },
    ]
  },
  g6: {
    ...MOCK_GENRES[5], subgenres: [
      { id: "s17", genreId: "g6", name: "Dembow", slug: "dembow", description: "Pure dembow rhythm.", orderIndex: 0, isActive: true, trackCount: 44 },
      { id: "s18", genreId: "g6", name: "Latin Pop", slug: "latin-pop", description: "Pop-crossover Latin.", orderIndex: 1, isActive: true, trackCount: 50 },
    ]
  },
  g7: {
    ...MOCK_GENRES[6], subgenres: [
      { id: "s19", genreId: "g7", name: "Cinematic", slug: "cinematic", description: "Film-scoring atmospheres.", orderIndex: 0, isActive: true, trackCount: 38 },
      { id: "s20", genreId: "g7", name: "Dark Ambient", slug: "dark-ambient", description: "Tension and unease.", orderIndex: 1, isActive: true, trackCount: 22 },
    ]
  },
  g8: {
    ...MOCK_GENRES[7], subgenres: [
      { id: "s21", genreId: "g8", name: "Contemporary Gospel", slug: "contemporary-gospel", description: "Modern gospel sound.", orderIndex: 0, isActive: true, trackCount: 30 },
      { id: "s22", genreId: "g8", name: "Worship", slug: "worship", description: "Congregational worship.", orderIndex: 1, isActive: true, trackCount: 22 },
    ]
  },
};

export const ACCENT_COLORS = [
  "#a855f7", "#7c3aed", "#06b6d4", "#10b981",
  "#f59e0b", "#ef4444", "#ec4899", "#3b82f6",
  "#f97316", "#84cc16", "#14b8a6", "#8b5cf6",
];

export const ICON_OPTIONS = [
  "Mic2", "Music2", "Headphones", "Radio", "Zap",
  "Heart", "Star", "Cloud", "Flame", "Waves",
  "Drum", "Guitar", "Volume2", "AudioLines",
];
