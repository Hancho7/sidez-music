// components/collections/CollectionsGrid.tsx
"use client";

import { PackageOpen } from "lucide-react";
import CollectionCard from "./CollectionCard";
import type { Collection } from "@/services/collections/types";
import Button from "../ui/Button";

interface CollectionsGridProps {
  collections: Collection[];
  loading: boolean;
  onSelect: (id: string) => void;
  onCreateClick: () => void;
}

export default function CollectionsGrid({ collections, loading, onSelect, onCreateClick }: CollectionsGridProps) {
  if (loading) return <SkeletonGrid />;

  if (collections.length === 0) return <EmptyState onCreateClick={onCreateClick} />;

  return (
    <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
      {collections.map(c => (
        <CollectionCard key={c.id} collection={c} onClick={() => onSelect(c.id)} />
      ))}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-surface border border-[color:var(--border-subtle)] rounded-[14px] overflow-hidden">
          <div className="aspect-[16/9] bg-elevated animate-pulse" />
          <div className="px-4 py-3.5 pb-4">
            <div className="h-4 w-[60%] bg-elevated rounded-md mb-2 animate-pulse" />
            <div className="h-3 w-[90%] bg-elevated rounded-md mb-1 animate-pulse" />
            <div className="h-3 w-[70%] bg-elevated rounded-md animate-pulse" />
            <div className="h-px bg-[color:var(--border-subtle)] my-3.5" />
            <div className="flex gap-2">
              {[1, 2, 3].map(j => (
                <div key={j} className="flex-1 h-8 bg-elevated rounded-md animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-5 text-center">
      <div className="w-[72px] h-[72px] rounded-[20px] mb-5 bg-gradient-to-br from-accent/15 to-accent-cyan/10 border border-[color:var(--border-subtle)] flex items-center justify-center">
        <PackageOpen size={32} className="text-[#31386d]" />
      </div>
      <h3 className="text-lg font-bold text-foreground m-0">
        No collections yet
      </h3>
      <p className="text-sm text-[color:var(--text-muted)] mt-2 max-w-[320px]">
        Create your first collection to bundle tracks into albums, packs, or playlists.
      </p>
      <Button
        onClick={onCreateClick}
        variant="primary"
      >
        Create first collection
      </Button>
    </div>
  );
}
