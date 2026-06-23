// components/pricing/PricingToolbar.tsx
"use client";

import Toolbar from "@/components/ui/Toolbar";
import type { PricingFilters, PricingSort, PricingView } from "@/services/pricing/types";

interface Props {
  filters: PricingFilters;
  onChange: (f: Partial<PricingFilters>) => void;
}

const GENRE_OPTIONS = [
  "All Genres", "Trap", "Lo-Fi", "Afrobeat", "Drill", "R&B", "Soul", "Ambient", "Hip-Hop",
].map(g => ({ value: g === "All Genres" ? "" : g, label: g }));

const SORT_OPTIONS: { value: PricingSort; label: string }[] = [
  { value: "highest", label: "Highest Price" },
  { value: "lowest", label: "Lowest Price" },
  { value: "updated", label: "Recently Updated" },
  { value: "alpha", label: "Alphabetical" },
];

export default function PricingToolbar({ filters, onChange }: Props) {
  return (
    <Toolbar>
      <Toolbar.Search
        value={filters.search}
        onChange={v => onChange({ search: v })}
        placeholder="Search tracks, artists, genres..."
      />
      <Toolbar.Select
        value={filters.genre}
        onChange={v => onChange({ genre: v })}
        options={GENRE_OPTIONS}
      />
      <Toolbar.Checkbox
        checked={filters.missingOnly}
        onChange={v => onChange({ missingOnly: v })}
        label="Missing pricing"
      />
      <Toolbar.Select
        value={filters.sort}
        onChange={v => onChange({ sort: v as PricingSort })}
        options={SORT_OPTIONS}
      />
      <Toolbar.Spacer />
      <Toolbar.ViewToggle<PricingView>
        value={filters.view}
        onChange={v => onChange({ view: v })}
        options={["table", "cards"]}
      />
    </Toolbar>
  );
}
