// services/artists/types.ts

export type ArtistStatus = "active" | "archived" | "hidden";
export type ArtistType = "producer" | "singer" | "band" | "dj" | "composer" | "songwriter" | "engineer" | "other";
export type ArtistSort = "tracks" | "revenue" | "alpha" | "recent";
export type ArtistView = "card" | "table";
export type SocialPlatform =
  | "instagram" | "tiktok" | "spotify" | "apple_music"
  | "youtube" | "facebook" | "soundcloud" | "twitter" | "website";

export interface ArtistSocial {
  platform: SocialPlatform;
  url: string;
}

export interface ArtistTrack {
  id: string;
  title: string;
  genre: string;
  coverImage: string | null;
  licenseCount: number;
  sales: number;
  revenue: number;
  status: "published" | "draft" | "archived";
}

export interface ArtistCollection {
  id: string;
  name: string;
  coverImage: string | null;
  trackCount: number;
  revenue: number;
}

export interface Artist {
  id: string;
  stageName: string;
  realName: string | null;
  biography: string;
  profileImage: string | null;
  bannerImage: string | null;
  country: string;
  primaryGenre: string;
  genres: string[];
  artistType: ArtistType;
  isVerified: boolean;
  isFeatured: boolean;
  status: ArtistStatus;
  email: string;
  phone: string | null;
  website: string | null;
  managementCompany: string | null;
  bookingEmail: string | null;
  socials: ArtistSocial[];
  totalTracks: number;
  totalCollections: number;
  totalSales: number;
  totalRevenue: number;
  totalDownloads: number;
  totalStreams: number;
  createdAt: string;
  updatedAt: string;
  tracks?: ArtistTrack[];
  collections?: ArtistCollection[];
}

export interface ArtistFilters {
  search: string;
  status: "all" | "active" | "archived" | "verified";
  sort: ArtistSort;
  view: ArtistView;
}

export interface ArtistFormValues {
  stageName: string;
  realName: string;
  biography: string;
  country: string;
  primaryGenre: string;
  genres: string[];
  artistType: ArtistType;
  isVerified: boolean;
  isFeatured: boolean;
  status: ArtistStatus;
  email: string;
  phone: string;
  website: string;
  managementCompany: string;
  bookingEmail: string;
  socials: ArtistSocial[];
}
