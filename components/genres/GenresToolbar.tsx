// components/genres/GenresToolbar.tsx
"use client";

import Toolbar from "@/components/ui/Toolbar";
import type { GenreFilters, GenreSort, GenreView } from "@/services/genres/types";

interface Props {
  filters: GenreFilters;
  onChange: (patch: Partial<GenreFilters>) => void;
  total: number;
}

const STATUS_OPTIONS = [
  { value: "ALL", label: "All Statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "ARCHIVED", label: "Archived" },
];

const SORT_OPTIONS: { value: GenreSort; label: string }[] = [
  { value: "name", label: "Name" },
  { value: "tracks", label: "Most Tracks" },
  { value: "createdAt", label: "Recently Created" },
];

export default function GenresToolbar({ filters, onChange, total }: Props) {
  return (
    <Toolbar>
      <Toolbar.Search
        value={filters.search}
        onChange={v => onChange({ search: v })}
        placeholder="Search genres..."
      />
      <Toolbar.Select
        value={filters.status}
        onChange={v => onChange({ status: v as GenreFilters["status"] })}
        options={STATUS_OPTIONS}
      />
      <Toolbar.Select
        value={filters.sort}
        onChange={v => onChange({ sort: v as GenreSort })}
        options={SORT_OPTIONS}
      />
      <Toolbar.Spacer />
      <Toolbar.Count n={total} label="genre" />
      <Toolbar.ViewToggle<GenreView>
        value={filters.view}
        onChange={v => onChange({ view: v })}
        options={["grid", "table"]}
      />
    </Toolbar>
  );
}
