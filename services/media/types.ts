// services/media/types.ts

export type AssetType = "image" | "audio" | "video" | "document" | "zip" | "other";
export type AssetStatus = "active" | "archived";
export type MediaSort = "newest" | "largest" | "smallest" | "most_used" | "alpha";
export type MediaView = "grid" | "list";

export interface MediaVersion {
  id: string;
  assetId: string;
  version: number;
  storageKey: string;
  size: number;
  changeNotes: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface MediaReference {
  id: string;
  assetId: string;
  entityType: "track" | "artist" | "collection" | "homepage" | "blog" | "marketing" | "settings" | "product";
  entityId: string;
  entityTitle: string;
  fieldName: string;
  url: string;
}

export interface MediaMetadata {
  altText: string;
  caption: string;
  description: string;
  tags: string[];
  copyright: string;
  creator: string;
  dominantColor: string | null;
  colorPalette: string[];
}

export interface MediaActivity {
  id: string;
  assetId: string;
  action: "uploaded" | "renamed" | "replaced" | "downloaded" | "archived" | "restored" | "deleted" | "metadata_updated";
  performedBy: string;
  notes: string;
  createdAt: string;
}

export interface MediaAsset {
  id: string;
  filename: string;
  originalFilename: string;
  mimeType: string;
  extension: string;
  assetType: AssetType;
  size: number;           // bytes
  width: number | null;
  height: number | null;
  duration: number | null; // seconds
  checksum: string;
  url: string;
  thumbnailUrl: string | null;
  status: AssetStatus;
  uploadedBy: string;
  usageCount: number;
  metadata: MediaMetadata;
  versions: MediaVersion[];
  references: MediaReference[];
  activity: MediaActivity[];
  createdAt: string;
  updatedAt: string;
}

export interface MediaFilters {
  search: string;
  type: AssetType | "all";
  sort: MediaSort;
  view: MediaView;
}
