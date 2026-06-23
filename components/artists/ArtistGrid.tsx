// components/artists/ArtistGrid.tsx
"use client";

import { Users } from "lucide-react";
import type { Artist } from "@/services/artists/types";
import ArtistCard from "./ArtistCard";

interface Props {
  artists: Artist[];
  onCardClick: (artist: Artist) => void;
  onEdit: (artist: Artist) => void;
  onArchive: (artist: Artist) => void;
}

export default function ArtistGrid({ artists, onCardClick, onEdit, onArchive }: Props) {
  if (artists.length === 0) {
    return (
      <div className="bg-surface border border-[color:var(--border-subtle)] rounded-2xl py-20 flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center">
          <Users size={24} className="text-[color:var(--accent-magenta)]" />
        </div>
        <div className="text-center">
          <p className="text-base font-bold text-foreground mb-1">No artists found</p>
          <p className="text-sm text-[color:var(--text-muted)]">
            Adjust your filters or create your first artist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
      {artists.map(artist => (
        <ArtistCard
          key={artist.id}
          artist={artist}
          onClick={onCardClick}
          onEdit={onEdit}
          onArchive={onArchive}
        />
      ))}
    </div>
  );
}
