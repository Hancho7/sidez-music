// services/tracks/types.ts

export type TrackStatus = "published" | "draft" | "archived";

export type TrackGenre =
  | "Hip-Hop" | "Trap" | "R&B" | "Pop" | "Drill"
  | "Afrobeats" | "Electronic" | "Soul" | "Gospel" | "Jazz" | "Reggae" | "Other";

export type MusicalKey =
  | "C" | "C#" | "Db" | "D" | "D#" | "Eb" | "E"
  | "F" | "F#" | "Gb" | "G" | "G#" | "Ab" | "A" | "A#" | "Bb" | "B";

export type SortOption = "newest" | "oldest" | "most_sold" | "most_played";

// ── Domain entities ──────────────────────────────────────────────────

export interface License {
  id: string;
  trackId: string;
  name: string;
  price: number;
  streamLimit: number | null;       // null = unlimited
  distributionLimit: number | null; // null = unlimited
  commercialUse: boolean;
}

export interface TrackAnalytics {
  salesCount: number;
  revenue: number;
  plays: number;
  downloads: number;
}

export interface Track {
  id: string;
  title: string;
  description: string;
  artistId: string;
  artistName: string;
  genre: TrackGenre;
  mood: string[];
  bpm: number;
  key: MusicalKey;
  duration: number;        // seconds
  coverImage: string | null;
  audioUrl: string | null;
  previewUrl: string | null;
  status: TrackStatus;
  isFeatured: boolean;
  createdAt: string;       // ISO date string
  licenses: License[];
  analytics: TrackAnalytics;
}

// ── Form / UI helpers ────────────────────────────────────────────────

/** A license tier as held in the form (prices/limits are strings for <input> binding) */
export interface LicenseDraft {
  id: string;
  name: string;
  price: string;
  streamLimit: string;
  distributionLimit: string;
  commercialUse: boolean;
}

export interface TrackFormData {
  title: string;
  description: string;
  artistName: string;
  genre: TrackGenre | "";
  mood: string[];
  bpm: string;
  key: MusicalKey | "";
  duration: string;
  status: TrackStatus;
  isFeatured: boolean;
  licenses: LicenseDraft[];
}

// ── Filter / query shape ─────────────────────────────────────────────

export interface TrackFilters {
  search: string;
  genre: TrackGenre | "all";
  status: TrackStatus | "all";
  sort: SortOption;
}

// ── API response wrappers ────────────────────────────────────────────

export interface TracksResponse {
  tracks: Track[];
  total: number;
  page: number;
  pageSize: number;
}
