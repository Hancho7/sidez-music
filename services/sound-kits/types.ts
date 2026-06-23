// services/sound-kits/types.ts

export type ProductCategory =
  | "drum_kit"
  | "sample_pack"
  | "loop_pack"
  | "midi_pack"
  | "one_shots"
  | "fx_pack"
  | "vocal_pack"
  | "construction_kit"
  | "preset_pack"
  | "project_files";

export type ProductStatus = "published" | "draft" | "archived" | "scheduled";
export type FileType = "zip" | "audio" | "pdf" | "project" | "image" | "midi";
export type ProductSort = "newest" | "revenue" | "downloads" | "alpha";
export type ProductView = "cards" | "table";

export interface ProductFile {
  id: string;
  productId: string;
  filename: string;
  fileType: FileType;
  version: string;
  checksum: string;
  size: number; // bytes
  downloadUrl: string;
  downloadCount: number;
  uploadedAt: string;
  isPrimary: boolean; // the main download ZIP
}

export interface ProductVersion {
  id: string;
  productId: string;
  version: string;
  releaseNotes: string;
  updatedFiles: string[];
  downloadCount: number;
  createdAt: string;
}

export interface ProductDownload {
  id: string;
  productId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  orderId: string;
  downloadedAt: string;
  version: string;
  device: string;
  ipAddress: string;
  remainingDownloads: number;
}

export interface ProductAnalytics {
  totalDownloads: number;
  totalRevenue: number;
  totalOrders: number;
  totalRefunds: number;
  conversionRate: number;
  downloadsOverTime: { date: string; count: number }[];
  revenueOverTime: { date: string; amount: number }[];
  topCountries: { country: string; downloads: number }[];
  repeatBuyers: number;
}

export interface DigitalProduct {
  id: string;
  name: string;
  sku: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: ProductCategory;
  tags: string[];
  price: number;
  salePrice: number | null;
  currency: string;
  status: ProductStatus;
  featured: boolean;
  thumbnail: string | null;
  gallery: string[];
  previewAudio: string | null;
  previewVideo: string | null;
  currentVersion: string;
  downloadLimit: number | null; // null = unlimited
  couponsEnabled: boolean;
  licenseRequired: boolean;
  seoTitle: string;
  seoDescription: string;
  files: ProductFile[];
  versions: ProductVersion[];
  analytics?: ProductAnalytics;
  scheduledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  search: string;
  category: ProductCategory | "all";
  status: ProductStatus | "all";
  priceType: "all" | "free" | "paid";
  featured: boolean;
  sort: ProductSort;
  view: ProductView;
}

export interface ProductFormValues {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: ProductCategory;
  tags: string;
  price: string;
  salePrice: string;
  currency: string;
  downloadLimit: string;
  unlimited: boolean;
  currentVersion: string;
  couponsEnabled: boolean;
  licenseRequired: boolean;
  featured: boolean;
  status: ProductStatus;
  scheduledAt: string;
  seoTitle: string;
  seoDescription: string;
}
