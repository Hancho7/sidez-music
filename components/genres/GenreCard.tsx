// components/genres/GenreCard.tsx
"use client";

import { Music2, Users, Library } from "lucide-react";
import type { Genre } from "@/services/genres/types";
import Card from "@/components/ui/Card";
import IconResolver from "./IconResolver";

interface Props {
  genre: Genre;
  onClick: (genre: Genre) => void;
  onEdit: (genre: Genre) => void;
  onArchive: (genre: Genre) => void;
}

function fmtRevenue(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}k`;
  return `$${n}`;
}

export default function GenreCard({ genre, onClick, onEdit, onArchive }: Props) {
  return (
    <Card onClick={() => onClick(genre)}>
      {/* Accent image / color banner */}
      <Card.MediaBanner src={genre.imageUrl} alt={genre.name} aspectRatio="banner">
        {/* Custom gradient fallback using the genre's accent color */}
        {!genre.imageUrl && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${genre.accentColor}28 0%, ${genre.accentColor}0a 100%)` }}
          >
            <div className="w-12 h-12 rounded-[14px] flex items-center justify-center" style={{ background: `${genre.accentColor}22` }}>
              <IconResolver name={genre.icon} size={22} color={genre.accentColor} />
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface/85 to-transparent/60" />

        <Card.StatusBadge
          status={genre.isActive ? "active" : "archived"}
          position="absolute-tr"
        />

        {/* Glowing accent dot */}
        <div
          className="absolute bottom-2.5 left-3.5 w-2.5 h-2.5 rounded-full"
          style={{ background: genre.accentColor, boxShadow: `0 0 10px ${genre.accentColor}` }}
        />
      </Card.MediaBanner>

      <Card.Body>
        <Card.Title>{genre.name}</Card.Title>
        <Card.Meta className="line-clamp-2">{genre.description}</Card.Meta>

        {/* Stats */}
        <div className="flex flex-col gap-1.5">
          <Card.StatRow>
            <Card.Stat icon={<Music2 size={11} />} value={`${genre.trackCount.toLocaleString()} tracks`} />
          </Card.StatRow>
          <Card.StatRow>
            <Card.Stat icon={<Users size={11} />} value={`${genre.artistCount} artists`} />
          </Card.StatRow>
          <Card.StatRow>
            <Card.Stat icon={<Library size={11} />} value={`${genre.collectionCount} collections`} />
          </Card.StatRow>
        </div>

        {/* Revenue + date */}
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-sm font-bold text-success">{fmtRevenue(genre.totalRevenue)}</span>
          <span className="text-[11px] text-[color:var(--text-muted)]">
            {new Date(genre.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
          </span>
        </div>

        <Card.StandardActions
          onView={() => onClick(genre)}
          onEdit={() => onEdit(genre)}
          onArchive={() => onArchive(genre)}
        />
      </Card.Body>
    </Card>
  );
}
