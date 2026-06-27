// components/media/MediaToolbar.tsx
"use client";

import Toolbar from "@/components/ui/Toolbar";
import type { MediaFilters, AssetType, MediaSort, MediaView } from "@/services/media/types";

interface Props {
  filters: MediaFilters;
  onChange: (patch: Partial<MediaFilters>) => void;
  total: number;
  selected: number;
  onBulkArchive: () => void;
  onBulkDelete: () => void;
  typeCounts?: Partial<Record<AssetType | "all", number>>;
}

const SORT_OPTIONS: { value: MediaSort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "largest", label: "Largest" },
  { value: "smallest", label: "Smallest" },
  { value: "most_used", label: "Most Used" },
  { value: "alpha", label: "Alphabetical" },
];

const TYPE_KEYS: { value: AssetType | "all"; label: string }[] = [
  { value: "all", label: "All Types" },
  { value: "image", label: "Images" },
  { value: "audio", label: "Audio" },
  { value: "video", label: "Video" },
  { value: "document", label: "Documents" },
  { value: "zip", label: "ZIP Files" },
];

export default function MediaToolbar({
  filters, onChange, total, selected,
  onBulkArchive, onBulkDelete, typeCounts = {},
}: Props) {
  const typeOptions = TYPE_KEYS.map(t => {
    const count = typeCounts[t.value];
    return {
      value: t.value,
      label: count !== undefined && count > 0 ? `${t.label} (${count})` : t.label,
    };
  });

  return (
    <Toolbar>
      <Toolbar.Search
        value={filters.search}
        onChange={v => onChange({ search: v })}
        placeholder="Search by filename or tag..."
      />
      <Toolbar.Select
        value={filters.type}
        onChange={v => onChange({ type: v as AssetType | "all" })}
        options={typeOptions}
      />
      <Toolbar.Select
        value={filters.sort}
        onChange={v => onChange({ sort: v as MediaSort })}
        options={SORT_OPTIONS}
      />
      <Toolbar.Spacer />

      {selected > 0 && (
        <div className="flex items-center gap-2 pl-2 border-l border-[color:var(--border-subtle)]">
          <span className="text-xs font-semibold text-accent">{selected} selected</span>
          <button
            onClick={onBulkArchive}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-elevated border border-[color:var(--border-subtle)] text-[color:var(--text-secondary)] cursor-pointer hover:bg-[color:var(--bg-overlay)] hover:text-foreground transition-colors"
          >
            Archive
          </button>
          <button
            onClick={onBulkDelete}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-danger/10 border border-danger/30 text-danger cursor-pointer hover:bg-danger/20 transition-colors"
          >
            Delete
          </button>
        </div>
      )}

      <Toolbar.Count n={total} label="asset" />
      <Toolbar.ViewToggle<MediaView>
        value={filters.view}
        onChange={v => onChange({ view: v })}
        options={["grid", "list"]}
      />
    </Toolbar>
  );
}
