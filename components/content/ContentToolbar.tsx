// components/content/ContentToolbar.tsx
"use client";

import Toolbar from "@/components/ui/Toolbar";
import type { ContentFilters, ContentStatus, ContentSort, ContentView } from "@/services/content/types";

interface Props {
  filters: ContentFilters;
  onChange: (patch: Partial<ContentFilters>) => void;
  total: number;
  label?: string;
}

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "scheduled", label: "Scheduled" },
  { value: "archived", label: "Archived" },
];

const SORT_OPTIONS: { value: ContentSort; label: string }[] = [
  { value: "updated", label: "Recently Updated" },
  { value: "published", label: "Recently Published" },
  { value: "alpha", label: "Alphabetical" },
];

export default function ContentToolbar({ filters, onChange, total, label = "item" }: Props) {
  return (
    <Toolbar>
      <Toolbar.Search
        value={filters.search}
        onChange={v => onChange({ search: v })}
        placeholder="Search by title, slug, author..."
      />
      <Toolbar.Select
        value={filters.status}
        onChange={v => onChange({ status: v as ContentStatus | "all" })}
        options={STATUS_OPTIONS}
      />
      <Toolbar.Select
        value={filters.sort}
        onChange={v => onChange({ sort: v as ContentSort })}
        options={SORT_OPTIONS}
      />
      <Toolbar.Spacer />
      <Toolbar.Count n={total} label={label} />
      <Toolbar.ViewToggle<ContentView>
        value={filters.view}
        onChange={v => onChange({ view: v })}
        options={["table", "cards"]}
      />
    </Toolbar>
  );
}
