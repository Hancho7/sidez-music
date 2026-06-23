// components/collections/CollectionsHeader.tsx
"use client";

import { Plus, PackageOpen } from "lucide-react";
import Button from "@/components/ui/Button";

interface Props {
  total: number;
  onCreateClick: () => void;
}

export default function CollectionsHeader({ total, onCreateClick }: Props) {
  return (
    <div className="flex items-end justify-between flex-wrap gap-4">
      <div>
        <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[color:var(--text-muted)] mb-1.5">
          Catalog
        </div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight leading-none flex items-center gap-2.5">
          Collections
        </h1>
        <p className="mt-1.5 text-sm text-[color:var(--text-muted)]">
          Organize your music into albums, packs, and playlists.
          {total > 0 && (
            <span className="ml-2 text-[color:var(--text-secondary)]">{total} collection{total !== 1 ? "s" : ""}</span>
          )}
        </p>
      </div>

      <Button
        variant="primary"
        icon={<Plus size={15} />}
        onClick={onCreateClick}
      >
        Create Collection
      </Button>
    </div>
  );
}
