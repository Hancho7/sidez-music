// components/genres/GenreGrid.tsx
"use client";

import { Music2 } from "lucide-react";
import type { Genre } from "@/services/genres/types";
import GenreCard from "./GenreCard";

interface Props {
  genres: Genre[];
  onCardClick: (genre: Genre) => void;
  onEdit: (genre: Genre) => void;
  onArchive: (genre: Genre) => void;
}

export default function GenreGrid({ genres, onCardClick, onEdit, onArchive }: Props) {
  if (genres.length === 0) {
    return (
      <div className="bg-surface border border-[color:var(--border-subtle)] rounded-[18px] py-[72px] px-8 text-center">
        <div className="w-14 h-14 rounded-[16px] bg-accent/10 mx-auto mb-4.5 flex items-center justify-center">
          <Music2 size={24} className="text-accent" />
        </div>
        <div className="text-[16px] font-bold text-foreground mb-2">
          No genres found
        </div>
        <div className="text-sm text-[color:var(--text-muted)]">
          Create your first genre to start organizing your music library.
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4.5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
      {genres.map(genre => (
        <GenreCard
          key={genre.id}
          genre={genre}
          onClick={onCardClick}
          onEdit={onEdit}
          onArchive={onArchive}
        />
      ))}
    </div>
  );
}
