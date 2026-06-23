// components/sound-kits/ProductsToolbar.tsx
"use client";

import Toolbar from "@/components/ui/Toolbar";
import type { ProductFilters, ProductCategory, ProductStatus, ProductSort, ProductView } from "@/services/sound-kits/types";

interface Props {
  filters: ProductFilters;
  onChange: (patch: Partial<ProductFilters>) => void;
  total: number;
}

const CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories" },
  { value: "drum_kit", label: "Drum Kits" },
  { value: "sample_pack", label: "Sample Packs" },
  { value: "loop_pack", label: "Loop Packs" },
  { value: "midi_pack", label: "MIDI Packs" },
  { value: "one_shots", label: "One Shots" },
  { value: "fx_pack", label: "FX Packs" },
  { value: "vocal_pack", label: "Vocal Packs" },
  { value: "construction_kit", label: "Construction Kits" },
  { value: "preset_pack", label: "Preset Packs" },
  { value: "project_files", label: "Project Files" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
  { value: "scheduled", label: "Scheduled" },
];

const PRICE_OPTIONS = [
  { value: "all", label: "All Prices" },
  { value: "free", label: "Free" },
  { value: "paid", label: "Paid" },
];

const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "revenue", label: "Highest Revenue" },
  { value: "downloads", label: "Most Downloads" },
  { value: "alpha", label: "Alphabetical" },
];

export default function ProductsToolbar({ filters, onChange, total }: Props) {
  return (
    <Toolbar>
      <Toolbar.Search
        value={filters.search}
        onChange={v => onChange({ search: v })}
        placeholder="Search by name, SKU, tag..."
      />
      <Toolbar.Select
        value={filters.category}
        onChange={v => onChange({ category: v as ProductCategory | "all" })}
        options={CATEGORY_OPTIONS}
      />
      <Toolbar.Select
        value={filters.status}
        onChange={v => onChange({ status: v as ProductStatus | "all" })}
        options={STATUS_OPTIONS}
      />
      <Toolbar.Select
        value={filters.priceType}
        onChange={v => onChange({ priceType: v as ProductFilters["priceType"] })}
        options={PRICE_OPTIONS}
      />
      <Toolbar.Checkbox
        checked={filters.featured}
        onChange={v => onChange({ featured: v })}
        label="Featured"
      />
      <Toolbar.Select
        value={filters.sort}
        onChange={v => onChange({ sort: v as ProductSort })}
        options={SORT_OPTIONS}
      />
      <Toolbar.Spacer />
      <Toolbar.Count n={total} label="product" />
      <Toolbar.ViewToggle<ProductView>
        value={filters.view}
        onChange={v => onChange({ view: v })}
        options={["cards", "table"]}
      />
    </Toolbar>
  );
}
