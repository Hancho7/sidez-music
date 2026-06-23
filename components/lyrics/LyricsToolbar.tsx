// components/lyrics/LyricsToolbar.tsx
"use client";

import Toolbar from "@/components/ui/Toolbar";
import type { MetadataFilters, Language } from "@/services/lyrics/types";
import { LANGUAGES } from "@/services/lyrics/mock-data";

interface Props {
  filters: MetadataFilters;
  onChange: (patch: Partial<MetadataFilters>) => void;
}

const HAS_LYRICS_OPTIONS: { value: MetadataFilters["hasLyrics"]; label: string }[] = [
  { value: "all", label: "All" },
  { value: "yes", label: "Has Lyrics" },
  { value: "no", label: "No Lyrics" },
];

const EXPLICIT_OPTIONS: { value: MetadataFilters["explicit"]; label: string }[] = [
  { value: "all", label: "All" },
  { value: "yes", label: "Explicit" },
  { value: "no", label: "Clean" },
];

const STATUS_OPTIONS: { value: MetadataFilters["status"]; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
];

const SORT_OPTIONS: { value: MetadataFilters["sort"]; label: string }[] = [
  { value: "recent", label: "Recently Updated" },
  { value: "alpha", label: "Alphabetically" },
  { value: "popular", label: "Most Popular Track" },
];

export default function LyricsToolbar({ filters, onChange }: Props) {
  const languageOptions: { value: Language | "all"; label: string }[] = [
    { value: "all", label: "All Languages" },
    ...LANGUAGES,
  ];

  return (
    <Toolbar>
      <Toolbar.Search
        value={filters.search}
        onChange={v => onChange({ search: v })}
        placeholder="Search by track, artist, or lyric text..."
      />
      <Toolbar.Select
        value={filters.hasLyrics}
        onChange={v => onChange({ hasLyrics: v as MetadataFilters["hasLyrics"] })}
        options={HAS_LYRICS_OPTIONS}
      />
      <Toolbar.Select
        value={filters.explicit}
        onChange={v => onChange({ explicit: v as MetadataFilters["explicit"] })}
        options={EXPLICIT_OPTIONS}
      />
      <Toolbar.Select
        value={filters.status}
        onChange={v => onChange({ status: v as MetadataFilters["status"] })}
        options={STATUS_OPTIONS}
      />
      <Toolbar.Select
        value={filters.language}
        onChange={v => onChange({ language: v as Language | "all" })}
        options={languageOptions}
      />
      <Toolbar.Select
        value={filters.sort}
        onChange={v => onChange({ sort: v as MetadataFilters["sort"] })}
        options={SORT_OPTIONS}
      />
    </Toolbar>
  );
}
