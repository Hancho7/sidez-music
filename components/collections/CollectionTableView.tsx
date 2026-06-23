// components/collections/CollectionTableView.tsx
"use client";

import { Eye, Pencil, Archive, Star, Music2, PackageOpen } from "lucide-react";
import DataTable, { useHoveredRow } from "@/components/ui/DataTable";
import type { Collection } from "@/services/collections/types";

interface Props {
  collections: Collection[];
  onRowClick: (id: string) => void;
  onEdit: (id: string) => void;
  onArchive: (collection: Collection) => void;
  isLoading?: boolean;
}

function fmtRevenue(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}k`;
  return `$${n}`;
}
function fmtPlays(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return `${n}`;
}

function SkeletonRow() {
  return (
    <DataTable.Row>
      {[44, 180, 50, 50, 70, 70, 70, 80].map((w, i) => (
        <DataTable.Cell key={i}>
          <div className="h-3.5 bg-elevated rounded animate-pulse" style={{ width: w }} />
        </DataTable.Cell>
      ))}
      <DataTable.Cell />
    </DataTable.Row>
  );
}

export default function CollectionTableView({ collections, onRowClick, onEdit, onArchive, isLoading }: Props) {
  const { hoveredId, setHoveredId } = useHoveredRow();

  return (
    <DataTable
      minWidth={860}
      isEmpty={!isLoading && collections.length === 0}
      emptyState={
        <DataTable.EmptyState
          icon={<PackageOpen size={22} className="text-accent" />}
          title="No collections yet"
          message="Create your first collection to bundle tracks into albums, packs, or playlists."
        />
      }
    >
      <DataTable.Header>
        <DataTable.Col width={36} />
        <DataTable.Col>Collection</DataTable.Col>
        <DataTable.Col>Status</DataTable.Col>
        <DataTable.Col align="center">Tracks</DataTable.Col>
        <DataTable.Col align="right">Sales</DataTable.Col>
        <DataTable.Col align="right">Revenue</DataTable.Col>
        <DataTable.Col align="right">Plays</DataTable.Col>
        <DataTable.Col>Created</DataTable.Col>
        <DataTable.ActionsCol />
      </DataTable.Header>

      <DataTable.Body>
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
          : collections.map(col => {
            const isHovered = hoveredId === col.id;
            const isPublished = col.status === "PUBLISHED";

            return (
              <DataTable.Row
                key={col.id}
                onClick={() => onRowClick(col.id)}
                isHovered={isHovered}
                onHoverChange={h => setHoveredId(h ? col.id : null)}
              >
                {/* Cover */}
                <DataTable.Cell>
                  <div className="w-9 h-9 rounded-lg overflow-hidden bg-elevated flex items-center justify-center border border-[color:var(--border-subtle)] flex-shrink-0">
                    {col.coverImage
                      ? <img src={col.coverImage} alt={col.title} className="w-full h-full object-cover" />
                      : <Music2 size={14} className="text-[color:var(--text-muted)]" />
                    }
                  </div>
                </DataTable.Cell>

                {/* Title + description */}
                <DataTable.Cell className="font-semibold text-foreground max-w-[240px]">
                  <div className="flex items-center gap-1.5">
                    {col.title}
                    {col.isFeatured && (
                      <Star size={11} fill="#a855f7" className="text-accent flex-shrink-0" />
                    )}
                  </div>
                  {col.description && (
                    <p className="text-[11px] text-[color:var(--text-muted)] font-normal mt-0.5 truncate max-w-[220px]">
                      {col.description}
                    </p>
                  )}
                </DataTable.Cell>

                {/* Status */}
                <DataTable.Cell>
                  <DataTable.StatusBadge
                    label={isPublished ? "Published" : "Draft"}
                    variant={isPublished ? "success" : "warning"}
                  />
                </DataTable.Cell>

                {/* Tracks */}
                <DataTable.Cell align="center" className="font-semibold text-foreground tabular-nums">
                  {col.totalTracks}
                </DataTable.Cell>

                {/* Sales */}
                <DataTable.Cell align="right" className="font-semibold text-foreground tabular-nums">
                  {col.totalSales.toLocaleString()}
                </DataTable.Cell>

                {/* Revenue */}
                <DataTable.Cell align="right" className="font-semibold text-success tabular-nums">
                  {fmtRevenue(col.totalRevenue)}
                </DataTable.Cell>

                {/* Plays */}
                <DataTable.Cell align="right" className="tabular-nums">
                  {fmtPlays(col.totalPlays)}
                </DataTable.Cell>

                {/* Created */}
                <DataTable.Cell className="whitespace-nowrap text-xs text-[color:var(--text-muted)]">
                  {new Date(col.createdAt).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric",
                  })}
                </DataTable.Cell>

                {/* Actions */}
                <DataTable.ActionsCell visible={isHovered}>
                  <DataTable.ActionBtn
                    onClick={() => onRowClick(col.id)}
                    icon={<Eye size={13} />}
                    title="View collection"
                  />
                  <DataTable.ActionBtn
                    onClick={() => onEdit(col.id)}
                    icon={<Pencil size={13} />}
                    title="Edit collection"
                  />
                  <DataTable.ActionBtn
                    onClick={() => onArchive(col)}
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
