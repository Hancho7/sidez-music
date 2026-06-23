// components/genres/GenreTableView.tsx
"use client";

import { Eye, Pencil, Archive, Music2 } from "lucide-react";
import DataTable, { useHoveredRow } from "@/components/ui/DataTable";
import type { Genre } from "@/services/genres/types";
import IconResolver from "./IconResolver";

interface Props {
  genres: Genre[];
  onRowClick: (genre: Genre) => void;
  onEdit: (genre: Genre) => void;
  onArchive: (genre: Genre) => void;
  isLoading?: boolean;
}

function fmtRevenue(n: number) {
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}k`;
  return `$${n}`;
}

function SkeletonRow() {
  return (
    <DataTable.Row>
      {[44, 120, 50, 60, 60, 70, 70, 80, 60].map((w, i) => (
        <DataTable.Cell key={i}>
          <div className="h-3.5 bg-elevated rounded animate-pulse" style={{ width: w }} />
        </DataTable.Cell>
      ))}
      <DataTable.Cell />
    </DataTable.Row>
  );
}

export default function GenreTableView({ genres, onRowClick, onEdit, onArchive, isLoading }: Props) {
  const { hoveredId, setHoveredId } = useHoveredRow();

  return (
    <DataTable
      minWidth={820}
      isEmpty={!isLoading && genres.length === 0}
      emptyState={
        <DataTable.EmptyState
          icon={<Music2 size={22} className="text-accent" />}
          title="No genres found"
          message="Adjust your filters or create a new genre."
        />
      }
    >
      <DataTable.Header>
        <DataTable.Col>Genre</DataTable.Col>
        <DataTable.Col align="center">Tracks</DataTable.Col>
        <DataTable.Col align="center">Artists</DataTable.Col>
        <DataTable.Col align="center">Collections</DataTable.Col>
        <DataTable.Col align="right">Revenue</DataTable.Col>
        <DataTable.Col align="right">Sales</DataTable.Col>
        <DataTable.Col>Status</DataTable.Col>
        <DataTable.Col>Created</DataTable.Col>
        <DataTable.ActionsCol />
      </DataTable.Header>

      <DataTable.Body>
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
          : genres.map(genre => {
            const isHovered = hoveredId === genre.id;
            return (
              <DataTable.Row
                key={genre.id}
                onClick={() => onRowClick(genre)}
                isHovered={isHovered}
                onHoverChange={h => setHoveredId(h ? genre.id : null)}
              >
                {/* Name + icon */}
                <DataTable.Cell>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center"
                      style={genre.imageUrl ? undefined : { background: `${genre.accentColor}18` }}
                    >
                      {genre.imageUrl
                        ? <img src={genre.imageUrl} alt={genre.name} className="w-full h-full object-cover" />
                        : <IconResolver name={genre.icon} size={15} color={genre.accentColor} />
                      }
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">{genre.name}</div>
                      <div className="text-[11px] text-[color:var(--text-muted)]">/{genre.slug}</div>
                    </div>
                  </div>
                </DataTable.Cell>

                <DataTable.Cell align="center" className="font-semibold text-foreground">
                  {genre.trackCount.toLocaleString()}
                </DataTable.Cell>

                <DataTable.Cell align="center">
                  {genre.artistCount}
                </DataTable.Cell>

                <DataTable.Cell align="center">
                  {genre.collectionCount}
                </DataTable.Cell>

                <DataTable.Cell align="right" className="font-semibold text-success">
                  {fmtRevenue(genre.totalRevenue)}
                </DataTable.Cell>

                <DataTable.Cell align="right">
                  {genre.totalSales.toLocaleString()}
                </DataTable.Cell>

                <DataTable.Cell>
                  <DataTable.StatusBadge
                    label={genre.isActive ? "Active" : "Archived"}
                    variant={genre.isActive ? "success" : "muted"}
                  />
                </DataTable.Cell>

                <DataTable.Cell className="whitespace-nowrap text-xs text-[color:var(--text-muted)]">
                  {new Date(genre.createdAt).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric",
                  })}
                </DataTable.Cell>

                <DataTable.ActionsCell visible={isHovered}>
                  <DataTable.ActionBtn
                    onClick={() => onRowClick(genre)}
                    icon={<Eye size={13} />}
                    title="View"
                  />
                  <DataTable.ActionBtn
                    onClick={() => onEdit(genre)}
                    icon={<Pencil size={13} />}
                    title="Edit"
                  />
                  <DataTable.ActionBtn
                    onClick={() => onArchive(genre)}
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
