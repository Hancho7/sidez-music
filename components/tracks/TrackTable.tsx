// components/tracks/TrackTable.tsx
"use client";

import { Eye, Pencil, Scroll, Copy, Archive, Trash2, Star, Music2 } from "lucide-react";
import DataTable, { useHoveredRow } from "@/components/ui/DataTable";
import type { Track } from "@/services/tracks/types";

interface Props {
  tracks: Track[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onRowClick: (track: Track) => void;
  onEdit: (track: Track) => void;
  onManageLicenses: (track: Track) => void;
  onDuplicate: (track: Track) => void;
  onArchive: (track: Track) => void;
  onDelete: (track: Track) => void;
  onStatusToggle: (track: Track) => void;
  isLoading?: boolean;
}

const STATUS_VARIANT: Record<string, "success" | "warning" | "muted"> = {
  published: "success",
  draft: "warning",
  archived: "muted",
};

function fmtDuration(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
function fmtNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return `${n}`;
}
function fmtPrice(licenses: Track["licenses"]) {
  if (!licenses.length) return "—";
  const prices = licenses.map(l => l.price).sort((a, b) => a - b);
  if (prices.length === 1) return `$${prices[0].toFixed(2)}`;
  return `$${prices[0].toFixed(0)}–$${prices[prices.length - 1].toFixed(0)}`;
}

function SkeletonRow() {
  return (
    <DataTable.Row>
      <DataTable.CheckboxCell checked={false} onChange={() => { }} />
      {[44, 160, 100, 70, 40, 40, 80, 50, 60, 60, 80].map((w, i) => (
        <DataTable.Cell key={i}>
          <div className="h-3.5 bg-elevated rounded animate-pulse" style={{ width: w }} />
        </DataTable.Cell>
      ))}
      <DataTable.Cell />
    </DataTable.Row>
  );
}

export default function TrackTable({
  tracks, selectedIds, onToggleSelect, onToggleSelectAll,
  onRowClick, onEdit, onManageLicenses, onDuplicate, onArchive, onDelete, onStatusToggle,
  isLoading,
}: Props) {
  const { hoveredId, setHoveredId } = useHoveredRow();
  const allSelected = tracks.length > 0 && selectedIds.size === tracks.length;

  return (
    <DataTable
      minWidth={960}
      isEmpty={!isLoading && tracks.length === 0}
      emptyState={
        <DataTable.EmptyState
          icon={<Music2 size={22} className="text-accent" />}
          title="No tracks found"
          message="Try adjusting your filters, or upload your first track."
        />
      }
    >
      <DataTable.Header>
        <DataTable.CheckboxCol checked={allSelected} onChange={onToggleSelectAll} />
        <DataTable.Col width={44} />
        <DataTable.Col>Title</DataTable.Col>
        <DataTable.Col>Artist</DataTable.Col>
        <DataTable.Col>Genre</DataTable.Col>
        <DataTable.Col align="center">BPM</DataTable.Col>
        <DataTable.Col align="center">Key</DataTable.Col>
        <DataTable.Col>Price Range</DataTable.Col>
        <DataTable.Col align="right">Sales</DataTable.Col>
        <DataTable.Col align="right">Plays</DataTable.Col>
        <DataTable.Col>Status</DataTable.Col>
        <DataTable.Col>Created</DataTable.Col>
        <DataTable.ActionsCol />
      </DataTable.Header>

      <DataTable.Body>
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
          : tracks.map(track => {
            const isSelected = selectedIds.has(track.id);
            const isHovered = hoveredId === track.id;

            return (
              <DataTable.Row
                key={track.id}
                onClick={() => onRowClick(track)}
                selected={isSelected}
                isHovered={isHovered}
                onHoverChange={h => setHoveredId(h ? track.id : null)}
              >
                <DataTable.CheckboxCell
                  checked={isSelected}
                  onChange={() => onToggleSelect(track.id)}
                />

                {/* Cover */}
                <DataTable.Cell>
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-elevated to-input flex items-center justify-center border border-[color:var(--border-subtle)]">
                    {track.coverImage
                      ? <img src={track.coverImage} alt={track.title} className="w-full h-full object-cover" />
                      : <Music2 size={16} className="text-[color:var(--text-muted)]" />
                    }
                  </div>
                </DataTable.Cell>

                {/* Title */}
                <DataTable.Cell className="font-semibold text-foreground">
                  <div className="flex items-center gap-1.5">
                    {track.title}
                    {track.isFeatured && <Star size={11} fill="#f59e0b" className="text-[#f59e0b] flex-shrink-0" />}
                  </div>
                  <div className="text-[11px] text-[color:var(--text-muted)] font-normal mt-0.5">
                    {fmtDuration(track.duration)}
                  </div>
                </DataTable.Cell>

                {/* Artist */}
                <DataTable.Cell>{track.artistName}</DataTable.Cell>

                {/* Genre */}
                <DataTable.Cell>
                  <DataTable.StatusBadge label={track.genre} variant="purple" dot={false} />
                </DataTable.Cell>

                {/* BPM */}
                <DataTable.Cell align="center" className="font-semibold text-foreground tabular-nums">
                  {track.bpm}
                </DataTable.Cell>

                {/* Key */}
                <DataTable.Cell align="center">
                  <span className="inline-block px-2 py-0.5 rounded-[10px] bg-accent-cyan/10 text-accent-cyan text-[11px] font-bold tracking-[0.03em]">
                    {track.key}
                  </span>
                </DataTable.Cell>

                {/* Price range */}
                <DataTable.Cell className="font-semibold text-success tabular-nums">
                  {fmtPrice(track.licenses)}
                </DataTable.Cell>

                {/* Sales */}
                <DataTable.Cell align="right" className="font-semibold text-foreground tabular-nums">
                  {fmtNum(track.analytics.salesCount)}
                </DataTable.Cell>

                {/* Plays */}
                <DataTable.Cell align="right" className="tabular-nums">
                  {fmtNum(track.analytics.plays)}
                </DataTable.Cell>

                {/* Status — clickable toggle */}
                <DataTable.Cell>
                  <DataTable.StatusBadge
                    label={track.status.charAt(0).toUpperCase() + track.status.slice(1)}
                    variant={STATUS_VARIANT[track.status] ?? "muted"}
                    onClick={e => { e.stopPropagation(); onStatusToggle(track); }}
                  />
                </DataTable.Cell>

                {/* Created */}
                <DataTable.Cell className="whitespace-nowrap text-xs text-[color:var(--text-muted)]">
                  {new Date(track.createdAt).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric",
                  })}
                </DataTable.Cell>

                {/* Actions */}
                <DataTable.ActionsCell visible={isHovered || isSelected}>
                  <DataTable.ActionBtn onClick={() => onRowClick(track)} icon={<Eye size={13} />} title="View" />
                  <DataTable.ActionBtn onClick={() => onEdit(track)} icon={<Pencil size={13} />} title="Edit" />
                  <DataTable.ActionBtn onClick={() => onManageLicenses(track)} icon={<Scroll size={13} />} title="Licenses" />
                  <DataTable.ActionBtn onClick={() => onDuplicate(track)} icon={<Copy size={13} />} title="Duplicate" />
                  <DataTable.ActionBtn onClick={() => onArchive(track)} icon={<Archive size={13} />} title="Archive" />
                  <DataTable.ActionBtn onClick={() => onDelete(track)} icon={<Trash2 size={13} />} title="Delete" danger />
                </DataTable.ActionsCell>
              </DataTable.Row>
            );
          })
        }
      </DataTable.Body>
    </DataTable>
  );
}
