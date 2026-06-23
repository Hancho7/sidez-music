// components/artists/ArtistCard.tsx
"use client";

import { BadgeCheck, Star, Music2, Library, DollarSign } from "lucide-react";
import type { Artist } from "@/services/artists/types";
import Card from "@/components/ui/Card";

interface Props {
  artist: Artist;
  onClick: (artist: Artist) => void;
  onEdit: (artist: Artist) => void;
  onArchive: (artist: Artist) => void;
}

const TYPE_LABELS: Record<string, string> = {
  producer: "Producer", singer: "Singer", band: "Band",
  dj: "DJ", composer: "Composer", songwriter: "Songwriter",
  engineer: "Engineer", other: "Other",
};

function fmtRevenue(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}k`;
  return `$${n}`;
}

function initials(name: string) {
  return name.split(" ").map(p => p[0]).join("").toUpperCase().slice(0, 2);
}

export default function ArtistCard({ artist, onClick, onEdit, onArchive }: Props) {
  return (
    <Card onClick={() => onClick(artist)}>
      <Card.BannerWithAvatar
        bannerSrc={artist.bannerImage}
        avatarSrc={artist.profileImage}
        avatarFallback={initials(artist.stageName)}
        badge={
          artist.isVerified
            ? <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
              <BadgeCheck size={12} className="text-white" />
            </div>
            : undefined
        }
      >
        {/* Status badge overlaid on banner */}
        <Card.StatusBadge status={artist.status} position="absolute-tr" />
      </Card.BannerWithAvatar>

      <Card.Body>
        {/* Name + featured star + type */}
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-foreground tracking-tight">{artist.stageName}</span>
            {artist.isFeatured && <Star size={11} className="text-[color:var(--color-warning)] fill-[color:var(--color-warning)]" />}
          </div>
          {artist.realName && <Card.Meta className="mt-0.5">{artist.realName}</Card.Meta>}
          <Card.CategoryPill label={TYPE_LABELS[artist.artistType]} color="magenta" className="mt-1" />
        </div>

        {/* Genre tags */}
        <div className="flex flex-wrap gap-1">
          {artist.genres.slice(0, 3).map(g => (
            <span key={g} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-elevated text-[color:var(--text-secondary)] border border-[color:var(--border-subtle)]">
              {g}
            </span>
          ))}
          {artist.genres.length > 3 && (
            <span className="text-[10px] text-[color:var(--text-muted)] px-1 py-0.5">+{artist.genres.length - 3}</span>
          )}
        </div>

        <Card.StatGrid>
          <Card.StatGridItem icon={<Music2 size={11} />} value={artist.totalTracks} label="tracks" />
          <Card.StatGridItem icon={<Library size={11} />} value={artist.totalCollections} label="collections" />
          <Card.StatGridItem icon={<DollarSign size={11} />} value={fmtRevenue(artist.totalRevenue)} label="revenue" accent="success" />
        </Card.StatGrid>

        <Card.StandardActions
          onView={() => onClick(artist)}
          onEdit={() => onEdit(artist)}
          onArchive={() => onArchive(artist)}
        />
      </Card.Body>
    </Card>
  );
}
