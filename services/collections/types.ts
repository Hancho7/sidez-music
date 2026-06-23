export type CollectionStatus = "DRAFT" | "PUBLISHED";

export type CollectionSort =
  | "recent"
  | "alpha"
  | "popular"
  | "revenue";

export type CollectionView =
  | "grid"
  | "table";

export interface CollectionFilters {
  search: string;
  status: "all" | CollectionStatus;
  sort: CollectionSort;
  view: CollectionView;
}

export interface CollectionTrack {
  id: string;
  trackId: string;
  collectionId: string;
  orderIndex: number;
  track: {
    id: string;
    title: string;
    artist: string;
    genre: string;
    duration: string; // "3:42"
    coverImage: string;
    plays: number;
    sales: number;
  };
}

export interface Collection {
  id: string;
  title: string;
  description: string;
  coverImage: string | null;
  status: CollectionStatus;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  // derived
  totalTracks: number;
  totalSales: number;
  totalRevenue: number;
  totalPlays: number;
}

export interface CollectionDetail extends Collection {
  tracks: CollectionTrack[];
}

export interface CollectionFormValues {
  title: string;
  description: string;
  coverImage: string | null;
  status: CollectionStatus;
  isFeatured: boolean;
  trackIds: string[];
}

// Available tracks for the selector
export interface AvailableTrack {
  id: string;
  title: string;
  artist: string;
  genre: string;
  duration: string;
  coverImage: string;
}
