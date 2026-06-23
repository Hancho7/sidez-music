// components/tracks/TrackToolbar.tsx
"use client";

import Toolbar from "@/components/ui/Toolbar";
import type { TrackFilters, TrackGenre, TrackStatus, SortOption } from "@/services/tracks/types";

interface Props {
  filters: TrackFilters;
  onChange: (next: Partial<TrackFilters>) => void;
  total: number;
}

const GENRE_OPTIONS: { value: TrackGenre | "all"; label: string }[] = [
  { value: "all", label: "All Genres" },
  ...["Hip-Hop", "Trap", "R&B", "Pop", "Drill", "Afrobeats", "Electronic", "Soul", "Gospel", "Jazz", "Reggae", "Other"].map(
    g => ({ value: g as TrackGenre, label: g })
  ),
];

const STATUS_OPTIONS: { value: TrackStatus | "all"; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "most_sold", label: "Most Sold" },
  { value: "most_played", label: "Most Played" },
];

export default function TrackToolbar({ filters, onChange, total }: Props) {
  return (
    <Toolbar>
      <Toolbar.Search
        value={filters.search}
        onChange={v => onChange({ search: v })}
        placeholder="Search tracks, artists..."
      />
      <Toolbar.Select
        value={filters.genre}
        onChange={v => onChange({ genre: v as TrackFilters["genre"] })}
        options={GENRE_OPTIONS}
      />
      <Toolbar.Select
        value={filters.status}
        onChange={v => onChange({ status: v as TrackFilters["status"] })}
        options={STATUS_OPTIONS}
      />
      <Toolbar.Select
        value={filters.sort}
        onChange={v => onChange({ sort: v as SortOption })}
        options={SORT_OPTIONS}
      />
      <Toolbar.Spacer />
      <Toolbar.Count n={total} label="track" />
    </Toolbar>
  );
}
