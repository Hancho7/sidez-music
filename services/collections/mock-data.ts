import type { Collection, CollectionDetail, AvailableTrack } from "./types";

export const MOCK_AVAILABLE_TRACKS: AvailableTrack[] = [
  { id: "t1", title: "Midnight Vibes", artist: "DJ Karma", genre: "Trap", duration: "3:42", coverImage: "https://picsum.photos/seed/t1/80/80" },
  { id: "t2", title: "Golden Hour", artist: "Solaris", genre: "Lo-Fi", duration: "2:58", coverImage: "https://picsum.photos/seed/t2/80/80" },
  { id: "t3", title: "Summer Bounce", artist: "Wavez", genre: "Afrobeat", duration: "4:12", coverImage: "https://picsum.photos/seed/t3/80/80" },
  { id: "t4", title: "Dark Energy", artist: "KXNG Cole", genre: "Drill", duration: "3:28", coverImage: "https://picsum.photos/seed/t4/80/80" },
  { id: "t5", title: "Cloud Nine", artist: "Nuance", genre: "R&B", duration: "3:55", coverImage: "https://picsum.photos/seed/t5/80/80" },
  { id: "t6", title: "Neon Jungle", artist: "DJ Karma", genre: "Trap", duration: "2:47", coverImage: "https://picsum.photos/seed/t6/80/80" },
  { id: "t7", title: "Soul Frequency", artist: "Lyric Beats", genre: "Soul", duration: "4:33", coverImage: "https://picsum.photos/seed/t7/80/80" },
  { id: "t8", title: "Astral Plane", artist: "Solaris", genre: "Ambient", duration: "5:10", coverImage: "https://picsum.photos/seed/t8/80/80" },
  { id: "t9", title: "City Lights", artist: "Metro P", genre: "Hip-Hop", duration: "3:19", coverImage: "https://picsum.photos/seed/t9/80/80" },
  { id: "t10", title: "Bass Cannon", artist: "KXNG Cole", genre: "Drill", duration: "2:55", coverImage: "https://picsum.photos/seed/t10/80/80" },
  { id: "t11", title: "Rainy Season", artist: "Nuance", genre: "Lo-Fi", duration: "3:41", coverImage: "https://picsum.photos/seed/t11/80/80" },
  { id: "t12", title: "Lagos Nights", artist: "Wavez", genre: "Afrobeat", duration: "4:05", coverImage: "https://picsum.photos/seed/t12/80/80" },
];

export const MOCK_COLLECTIONS: Collection[] = [
  {
    id: "c1",
    title: "Summer Trap Pack",
    description: "15 fire trap beats perfect for summer releases. Hard-hitting 808s with melodic leads.",
    coverImage: "https://picsum.photos/seed/c1/400/400",
    status: "PUBLISHED",
    isFeatured: true,
    createdAt: "2025-06-01T10:00:00Z",
    updatedAt: "2025-06-10T14:30:00Z",
    totalTracks: 8,
    totalSales: 142,
    totalRevenue: 4260,
    totalPlays: 18400,
  },
  {
    id: "c2",
    title: "Lo-Fi Study Sessions",
    description: "Calm, chill beats for focus and concentration. Ideal for content creators and students.",
    coverImage: "https://picsum.photos/seed/c2/400/400",
    status: "PUBLISHED",
    isFeatured: false,
    createdAt: "2025-05-15T08:00:00Z",
    updatedAt: "2025-06-05T09:00:00Z",
    totalTracks: 12,
    totalSales: 98,
    totalRevenue: 2940,
    totalPlays: 32100,
  },
  {
    id: "c3",
    title: "Afrobeats Vol. 2",
    description: "High-energy Afrobeats and Afropop instrumentals with authentic percussion layers.",
    coverImage: "https://picsum.photos/seed/c3/400/400",
    status: "PUBLISHED",
    isFeatured: true,
    createdAt: "2025-04-20T12:00:00Z",
    updatedAt: "2025-06-12T16:00:00Z",
    totalTracks: 10,
    totalSales: 211,
    totalRevenue: 6330,
    totalPlays: 44200,
  },
  {
    id: "c4",
    title: "UK Drill Essentials",
    description: "Dark, gritty UK Drill instrumentals with haunting melodies and sub-heavy basslines.",
    coverImage: "https://picsum.photos/seed/c4/400/400",
    status: "DRAFT",
    isFeatured: false,
    createdAt: "2025-06-14T09:00:00Z",
    updatedAt: "2025-06-14T09:00:00Z",
    totalTracks: 5,
    totalSales: 0,
    totalRevenue: 0,
    totalPlays: 0,
  },
  {
    id: "c5",
    title: "R&B Smooth Pack",
    description: "Silky smooth R&B productions. Perfect for artists like Summer Walker or SZA.",
    coverImage: "https://picsum.photos/seed/c5/400/400",
    status: "PUBLISHED",
    isFeatured: false,
    createdAt: "2025-03-10T11:00:00Z",
    updatedAt: "2025-05-28T10:00:00Z",
    totalTracks: 7,
    totalSales: 76,
    totalRevenue: 2280,
    totalPlays: 15600,
  },
  {
    id: "c6",
    title: "Ambient Dreamscapes",
    description: "Ethereal ambient pads and soundscapes. Great for meditation, film, and podcasts.",
    coverImage: null,
    status: "DRAFT",
    isFeatured: false,
    createdAt: "2025-06-18T15:00:00Z",
    updatedAt: "2025-06-18T15:00:00Z",
    totalTracks: 3,
    totalSales: 0,
    totalRevenue: 0,
    totalPlays: 890,
  },
];

export const MOCK_COLLECTION_DETAILS: Record<string, CollectionDetail> = {
  c1: {
    ...MOCK_COLLECTIONS[0],
    tracks: [
      { id: "ct1", collectionId: "c1", trackId: "t1", orderIndex: 0, track: { ...MOCK_AVAILABLE_TRACKS[0], plays: 5200, sales: 38 } },
      { id: "ct2", collectionId: "c1", trackId: "t6", orderIndex: 1, track: { ...MOCK_AVAILABLE_TRACKS[5], plays: 4100, sales: 29 } },
      { id: "ct3", collectionId: "c1", trackId: "t4", orderIndex: 2, track: { ...MOCK_AVAILABLE_TRACKS[3], plays: 3800, sales: 31 } },
      { id: "ct4", collectionId: "c1", trackId: "t9", orderIndex: 3, track: { ...MOCK_AVAILABLE_TRACKS[8], plays: 2900, sales: 22 } },
    ],
  },
  c2: {
    ...MOCK_COLLECTIONS[1],
    tracks: [
      { id: "ct5", collectionId: "c2", trackId: "t2", orderIndex: 0, track: { ...MOCK_AVAILABLE_TRACKS[1], plays: 9200, sales: 44 } },
      { id: "ct6", collectionId: "c2", trackId: "t11", orderIndex: 1, track: { ...MOCK_AVAILABLE_TRACKS[10], plays: 8700, sales: 31 } },
      { id: "ct7", collectionId: "c2", trackId: "t8", orderIndex: 2, track: { ...MOCK_AVAILABLE_TRACKS[7], plays: 7100, sales: 23 } },
    ],
  },
  c3: {
    ...MOCK_COLLECTIONS[2],
    tracks: [
      { id: "ct8", collectionId: "c3", trackId: "t3", orderIndex: 0, track: { ...MOCK_AVAILABLE_TRACKS[2], plays: 14200, sales: 88 } },
      { id: "ct9", collectionId: "c3", trackId: "t12", orderIndex: 1, track: { ...MOCK_AVAILABLE_TRACKS[11], plays: 12000, sales: 72 } },
      { id: "ct10", collectionId: "c3", trackId: "t5", orderIndex: 2, track: { ...MOCK_AVAILABLE_TRACKS[4], plays: 9800, sales: 51 } },
    ],
  },
  c4: {
    ...MOCK_COLLECTIONS[3], tracks: [
      { id: "ct11", collectionId: "c4", trackId: "t4", orderIndex: 0, track: { ...MOCK_AVAILABLE_TRACKS[3], plays: 0, sales: 0 } },
      { id: "ct12", collectionId: "c4", trackId: "t10", orderIndex: 1, track: { ...MOCK_AVAILABLE_TRACKS[9], plays: 0, sales: 0 } },
    ]
  },
  c5: {
    ...MOCK_COLLECTIONS[4], tracks: [
      { id: "ct13", collectionId: "c5", trackId: "t5", orderIndex: 0, track: { ...MOCK_AVAILABLE_TRACKS[4], plays: 7200, sales: 41 } },
      { id: "ct14", collectionId: "c5", trackId: "t7", orderIndex: 1, track: { ...MOCK_AVAILABLE_TRACKS[6], plays: 5400, sales: 35 } },
    ]
  },
  c6: {
    ...MOCK_COLLECTIONS[5], tracks: [
      { id: "ct15", collectionId: "c6", trackId: "t8", orderIndex: 0, track: { ...MOCK_AVAILABLE_TRACKS[7], plays: 890, sales: 0 } },
    ]
  },
};
