// services/lyrics/types.ts

export type CreditRole =
  | "WRITER"
  | "PRODUCER"
  | "COMPOSER"
  | "MIX_ENGINEER"
  | "MASTERING_ENGINEER"
  | "PUBLISHER"
  | "LABEL"
  | "PERFORMER";

export type LyricsStatus = "COMPLETE" | "PARTIAL" | "PENDING" | "NONE";
export type Language = "en" | "es" | "fr" | "de" | "pt" | "ja" | "ko" | "zh" | "ar" | "hi" | "it" | "nl" | "ru";

export interface TrackCredit {
  id: string;
  trackId: string;
  role: CreditRole;
  personName: string;
  email?: string;
  royaltyShare?: number;
  isPrimary?: boolean;
}

export interface TrackCopyright {
  id: string;
  trackId: string;
  copyrightOwner: string;
  copyrightNotice: string;
  publishingRights: string;
  mechanicalRights: string;
  territory: string[];
  publishingOrganization: string;
  isrc: string;
  upc: string;
}

export interface TrackPublishing {
  id: string;
  trackId: string;
  releaseDate: string;
  originalReleaseDate: string;
  isVisible: boolean;
  isExplicit: boolean;
  isFeatured: boolean;
  editorialNotes: string;
  previewStartTime: number;
  previewDuration: number;
}

export interface TrackLyrics {
  id: string;
  trackId: string;
  language: Language;
  lyrics: string;
  // Partial so callers only need to supply the languages they have translations for.
  translatedLyrics: Partial<Record<Language, string>>;
  wordCount: number;
  readingTime: number;
  isSynchronized: boolean;
  synchronizedData?: string;
}

export interface TrackMetadata {
  id: string;
  trackId: string;
  trackName: string;
  artistName: string;
  artistId: string;
  coverImage: string | null;

  lyrics: TrackLyrics;
  credits: TrackCredit[];
  copyright: TrackCopyright;
  publishing: TrackPublishing;

  status: LyricsStatus;
  lastUpdated: string;
  updatedBy: string;

  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  archivedAt: string | null;
}

export interface MetadataVersion {
  id: string;
  metadataId: string;
  version: number;
  changes: string;
  snapshot: Partial<TrackMetadata>;
  createdBy: string;
  createdAt: string;
}

export interface MetadataFilters {
  search: string;
  hasLyrics: "all" | "yes" | "no";
  explicit: "all" | "yes" | "no";
  status: "all" | "published" | "draft" | "archived";
  language: Language | "all";
  sort: "recent" | "alpha" | "popular";
}

export interface MetadataFormData {
  trackId: string;
  language: Language;
  lyrics: string;
  translatedLyrics: Partial<Record<Language, string>>;
  explicit: boolean;
  releaseDate: string;
  releaseNotes: string;
  credits: CreditFormData[];
  copyright: CopyrightFormData;
  publishing: PublishingFormData;
}

export interface CreditFormData {
  role: CreditRole;
  personName: string;
  email?: string;
  royaltyShare?: number;
  isPrimary?: boolean;
}

export interface CopyrightFormData {
  copyrightOwner: string;
  copyrightNotice: string;
  publishingRights: string;
  mechanicalRights: string;
  territory: string[];
  publishingOrganization: string;
  isrc: string;
  upc: string;
}

export interface PublishingFormData {
  releaseDate: string;
  originalReleaseDate: string;
  isVisible: boolean;
  isExplicit: boolean;
  isFeatured: boolean;
  editorialNotes: string;
  previewStartTime: number;
  previewDuration: number;
}
