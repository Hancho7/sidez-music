// components/collections/CollectionsToolbar.tsx
"use client";

import Toolbar from "@/components/ui/Toolbar";

export type CollectionStatus = "all" | "published" | "draft";
export type CollectionSort = "recent" | "alpha" | "popular" | "revenue";
export type CollectionView = "grid" | "table";

export interface CollectionFilters {
  search: string;
  status: CollectionStatus;
  sort: CollectionSort;
  view: CollectionView;
}

interface Props {
  filters: CollectionFilters;
  onChange: (patch: Partial<CollectionFilters>) => void;
  total?: number;
}

const STATUS_OPTIONS: { value: CollectionStatus; label: string }[] = [
  { value: "all", label: "All Status" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
];

const SORT_OPTIONS: { value: CollectionSort; label: string }[] = [
  { value: "recent", label: "Recently Updated" },
  { value: "alpha", label: "Alphabetical" },
  { value: "popular", label: "Most Tracks" },
  { value: "revenue", label: "Highest Revenue" },
];

export default function CollectionsToolbar({
  filters,
  onChange,
  total = 0,
}: Props) {
  return (
    <Toolbar>
      {/* Search */}
      <Toolbar.Search
        value={filters.search}
        onChange={v => onChange({ search: v })}
        placeholder="Search collections..."
        className="min-w-52"
      />

      {/* Status */}
      <Toolbar.Select
        value={filters.status}
        onChange={v => onChange({ status: v })}
        options={STATUS_OPTIONS}
      />

      {/* Sort */}
      <Toolbar.Select
        value={filters.sort}
        onChange={v => onChange({ sort: v as CollectionSort })}
        options={SORT_OPTIONS}
        className="min-w-[170px]"
      />

      {/* Collection count */}
      <Toolbar.Count
        n={total}
        label="collection"
      />

      {/* Push the view toggle to the right */}
      <Toolbar.Spacer />

      {/* View Toggle */}
      <Toolbar.ViewToggle
        value={filters.view}
        onChange={v => onChange({ view: v as CollectionView })}
        options={["grid", "table"]}
        labels={{
          grid: "Cards",
          table: "Table",
        }}
      />
    </Toolbar>
  );
}
