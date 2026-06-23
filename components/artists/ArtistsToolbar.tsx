// components/artists/ArtistsToolbar.tsx
"use client";

import Toolbar from "@/components/ui/Toolbar";
import type { ArtistFilters, ArtistSort, ArtistView } from "@/services/artists/types";

interface Props {
  filters: ArtistFilters;
  onChange: (patch: Partial<ArtistFilters>) => void;
  total: number;
}

const STATUS_OPTIONS = [
  { value: "all", label: "All Artists" },
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
  { value: "verified", label: "Verified" },
];

const SORT_OPTIONS: { value: ArtistSort; label: string }[] = [
  { value: "tracks", label: "Most Tracks" },
  { value: "revenue", label: "Highest Revenue" },
  { value: "alpha", label: "Alphabetical" },
  { value: "recent", label: "Recently Added" },
];

export default function ArtistsToolbar({ filters, onChange, total }: Props) {
  return (
    <Toolbar>
      <Toolbar.Search
        value={filters.search}
        onChange={v => onChange({ search: v })}
        placeholder="Search artists, email, stage name..."
      />
      <Toolbar.Select
        value={filters.status}
        onChange={v => onChange({ status: v as ArtistFilters["status"] })}
        options={STATUS_OPTIONS}
      />
      <Toolbar.Select
        value={filters.sort}
        onChange={v => onChange({ sort: v as ArtistSort })}
        options={SORT_OPTIONS}
      />
      <Toolbar.Spacer />
      <Toolbar.Count n={total} label="artist" />
      <Toolbar.ViewToggle<ArtistView>
        value={filters.view}
        onChange={v => onChange({ view: v })}
        options={["card", "table"]}
      />
    </Toolbar>
  );
}
