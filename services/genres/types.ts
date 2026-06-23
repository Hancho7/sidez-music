// services/genres/types.ts

export type GenreStatus = "ACTIVE" | "ARCHIVED";
export type GenreView = "grid" | "table";
export type GenreSort = "name" | "tracks" | "createdAt";

export interface Subgenre {
  id: string;
  genreId: string;
  name: string;
  slug: string;
  description: string;
  orderIndex: number;
  isActive: boolean;
  trackCount: number;
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  accentColor: string;       // hex, e.g. "#a855f7"
  icon: string;              // lucide icon name as string
  isActive: boolean;
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
  updatedAt: string;
  // derived stats
  trackCount: number;
  artistCount: number;
  collectionCount: number;
  totalSales: number;
  totalRevenue: number;
  totalDownloads: number;
}

export interface GenreDetail extends Genre {
  subgenres: Subgenre[];
}

export interface GenreFormValues {
  name: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  accentColor: string;
  icon: string;
  isActive: boolean;
  seoTitle: string;
  seoDescription: string;
  subgenres: Array<{ name: string; slug: string; description: string }>;
}

export interface GenreFilters {
  search: string;
  status: "ALL" | "ACTIVE" | "ARCHIVED";
  sort: GenreSort;
  view: GenreView;
}
