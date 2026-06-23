// components/artists/ArtistTableView.tsx
"use client";

import { BadgeCheck, Users } from "lucide-react";
import { Eye, Pencil, Archive } from "lucide-react";
import DataTable, { useHoveredRow } from "@/components/ui/DataTable";
import type { Artist } from "@/services/artists/types";

interface Props {
  artists: Artist[];
  onRowClick: (artist: Artist) => void;
  onEdit: (artist: Artist) => void;
  onArchive: (artist: Artist) => void;
  isLoading?: boolean;
}

function fmtRevenue(n: number) {
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}k`;
  return `$${n}`;
}

function initials(name: string) {
  return name.split(" ").map(p => p[0]).join("").toUpperCase().slice(0, 2);
}

const STATUS_VARIANT: Record<string, "success" | "warning" | "muted"> = {
  active: "success",
  archived: "muted",
  hidden: "warning",
};

function SkeletonRow() {
  return (
    <DataTable.Row>
      {[44, 140, 80, 50, 60, 60, 60, 80, 60].map((w, i) => (
        <DataTable.Cell key={i}>
          <div className={`h-3.5 bg-elevated rounded animate-pulse`} style={{ width: w }} />
        </DataTable.Cell>
      ))}
      <DataTable.Cell />
    </DataTable.Row>
  );
}

export default function ArtistTableView({ artists, onRowClick, onEdit, onArchive, isLoading }: Props) {
  const { hoveredId, setHoveredId } = useHoveredRow();

  return (
    <DataTable
      minWidth={860}
      isEmpty={!isLoading && artists.length === 0}
      emptyState={
        <DataTable.EmptyState
          icon={<Users size={22} className="text-accent" />}
          title="No artists found"
          message="Adjust your search or filters to find what you're looking for."
        />
      }
    >
      <DataTable.Header>
        <DataTable.Col width={36} />
        <DataTable.Col>Artist</DataTable.Col>
        <DataTable.Col>Type</DataTable.Col>
        <DataTable.Col>Genres</DataTable.Col>
        <DataTable.Col align="center">Tracks</DataTable.Col>
        <DataTable.Col align="center">Collections</DataTable.Col>
        <DataTable.Col align="right">Revenue</DataTable.Col>
        <DataTable.Col>Status</DataTable.Col>
        <DataTable.Col>Joined</DataTable.Col>
        <DataTable.ActionsCol />
      </DataTable.Header>

      <DataTable.Body>
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
          : artists.map(artist => {
            const isHovered = hoveredId === artist.id;
            return (
              <DataTable.Row
                key={artist.id}
                onClick={() => onRowClick(artist)}
                isHovered={isHovered}
                onHoverChange={h => setHoveredId(h ? artist.id : null)}
              >
                {/* Avatar */}
                <DataTable.Cell>
                  <div className="w-9 h-9 rounded-xl overflow-hidden bg-elevated flex items-center justify-center flex-shrink-0">
                    {artist.profileImage
                      ? <img src={artist.profileImage} alt={artist.stageName} className="w-full h-full object-cover" />
                      : <span className="text-xs font-bold text-[color:var(--text-muted)]">{initials(artist.stageName)}</span>
                    }
                  </div>
                </DataTable.Cell>

                {/* Name */}
                <DataTable.Cell className="font-semibold text-foreground whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    {artist.stageName}
                    {artist.isVerified && <BadgeCheck size={13} className="text-accent flex-shrink-0" />}
                  </div>
                  {artist.realName && (
                    <p className="text-[11px] text-[color:var(--text-muted)] font-normal mt-0.5">{artist.realName}</p>
                  )}
                </DataTable.Cell>

                {/* Type */}
                <DataTable.Cell>
                  <DataTable.StatusBadge
                    label={artist.artistType}
                    variant="purple"
                    dot={false}
                  />
                </DataTable.Cell>

                {/* Genres */}
                <DataTable.Cell>
                  <div className="flex gap-1 flex-wrap">
                    {artist.genres.slice(0, 2).map(g => (
                      <span
                        key={g}
                        className="text-[10px] px-1.5 py-0.5 rounded-full bg-elevated text-[color:var(--text-secondary)] border border-[color:var(--border-subtle)]"
                      >
                        {g}
                      </span>
                    ))}
                    {artist.genres.length > 2 && (
                      <span className="text-[10px] text-[color:var(--text-muted)]">+{artist.genres.length - 2}</span>
                    )}
                  </div>
                </DataTable.Cell>

                {/* Tracks */}
                <DataTable.Cell align="center" className="font-semibold text-foreground">
                  {artist.totalTracks}
                </DataTable.Cell>

                {/* Collections */}
                <DataTable.Cell align="center">
                  {artist.totalCollections}
                </DataTable.Cell>

                {/* Revenue */}
                <DataTable.Cell align="right" className="font-semibold text-success">
                  {fmtRevenue(artist.totalRevenue)}
                </DataTable.Cell>

                {/* Status */}
                <DataTable.Cell>
                  <DataTable.StatusBadge
                    label={artist.status.charAt(0).toUpperCase() + artist.status.slice(1)}
                    variant={STATUS_VARIANT[artist.status] ?? "muted"}
                  />
                </DataTable.Cell>

                {/* Joined */}
                <DataTable.Cell className="whitespace-nowrap text-xs text-[color:var(--text-muted)]">
                  {new Date(artist.createdAt).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric",
                  })}
                </DataTable.Cell>

                {/* Actions */}
                <DataTable.ActionsCell visible={isHovered}>
                  <DataTable.ActionBtn
                    onClick={() => onRowClick(artist)}
                    icon={<Eye size={13} />}
                    title="View"
                  />
                  <DataTable.ActionBtn
                    onClick={() => onEdit(artist)}
                    icon={<Pencil size={13} />}
                    title="Edit"
                  />
                  <DataTable.ActionBtn
                    onClick={() => onArchive(artist)}
                    icon={<Archive size={13} />}
                    title="Archive"
                    danger
                  />
                </DataTable.ActionsCell>
              </DataTable.Row>
            );
          })
        }
      </DataTable.Body>
    </DataTable>
  );
}
