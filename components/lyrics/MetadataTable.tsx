// components/lyrics/MetadataTable.tsx
"use client";

import { Eye, Pencil, Archive, Music2, FileText, CheckCircle, AlertCircle, Clock } from "lucide-react";
import DataTable, { useHoveredRow } from "@/components/ui/DataTable";
import type { TrackMetadata, LyricsStatus } from "@/services/lyrics/types";
import { LANGUAGES } from "@/services/lyrics/mock-data";

interface Props {
  metadata: TrackMetadata[];
  onRowClick: (item: TrackMetadata) => void;
  onEdit: (item: TrackMetadata) => void;
  onArchive: (item: TrackMetadata) => void;
  isLoading?: boolean;
}

const STATUS_STYLES: Record<LyricsStatus, {
  variant: "success" | "warning" | "cyan" | "muted";
  label: string;
  icon: React.ReactNode;
}> = {
  COMPLETE: { variant: "success", label: "Complete", icon: <CheckCircle size={11} /> },
  PARTIAL: { variant: "warning", label: "Partial", icon: <AlertCircle size={11} /> },
  PENDING: { variant: "cyan", label: "Pending", icon: <Clock size={11} /> },
  NONE: { variant: "muted", label: "None", icon: <FileText size={11} /> },
};

function SkeletonRow() {
  return (
    <DataTable.Row>
      {[36, 140, 110, 70, 80, 60, 120, 90].map((w, i) => (
        <DataTable.Cell key={i}>
          <div className="h-3.5 bg-elevated rounded animate-pulse" style={{ width: w }} />
        </DataTable.Cell>
      ))}
      <DataTable.Cell />
    </DataTable.Row>
  );
}

export default function MetadataTable({ metadata, onRowClick, onEdit, onArchive, isLoading = false }: Props) {
  const { hoveredId, setHoveredId } = useHoveredRow();

  return (
    <DataTable
      minWidth={900}
      isEmpty={!isLoading && metadata.length === 0}
      emptyState={
        <DataTable.EmptyState
          icon={<FileText size={22} className="text-accent" />}
          title="No metadata found"
          message="Create metadata for your tracks to manage lyrics, credits, and publishing information."
        />
      }
    >
      <DataTable.Header>
        <DataTable.Col width={36} />
        <DataTable.Col>Track</DataTable.Col>
        <DataTable.Col>Artist</DataTable.Col>
        <DataTable.Col>Language</DataTable.Col>
        <DataTable.Col>Lyrics</DataTable.Col>
        <DataTable.Col>Explicit</DataTable.Col>
        <DataTable.Col>Writers</DataTable.Col>
        <DataTable.Col>Updated</DataTable.Col>
        <DataTable.ActionsCol />
      </DataTable.Header>

      <DataTable.Body>
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
          : metadata.map(item => {
            const isHovered = hoveredId === item.id;
            const status = STATUS_STYLES[item.status];
            const writerNames = item.credits
              .filter(c => c.role === "WRITER")
              .map(c => c.personName)
              .slice(0, 2);
            const extraWriters = item.credits.filter(c => c.role === "WRITER").length - 2;

            return (
              <DataTable.Row
                key={item.id}
                onClick={() => onRowClick(item)}
                isHovered={isHovered}
                onHoverChange={h => setHoveredId(h ? item.id : null)}
              >
                {/* Cover */}
                <DataTable.Cell>
                  <div className="w-9 h-9 rounded-lg overflow-hidden bg-elevated flex items-center justify-center border border-[color:var(--border-subtle)] flex-shrink-0">
                    {item.coverImage
                      ? <img src={item.coverImage} alt={item.trackName} className="w-full h-full object-cover" />
                      : <Music2 size={14} className="text-[color:var(--text-muted)]" />
                    }
                  </div>
                </DataTable.Cell>

                {/* Track */}
                <DataTable.Cell className="font-semibold text-foreground">
                  {item.trackName}
                </DataTable.Cell>

                {/* Artist */}
                <DataTable.Cell>{item.artistName}</DataTable.Cell>

                {/* Language */}
                <DataTable.Cell>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-elevated text-[color:var(--text-secondary)] border border-[color:var(--border-subtle)]">
                    {LANGUAGES.find(l => l.value === item.lyrics.language)?.label ?? item.lyrics.language}
                  </span>
                </DataTable.Cell>

                {/* Lyrics status */}
                <DataTable.Cell>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold
                      ${{
                      success: "bg-success/10 text-success",
                      warning: "bg-[color:var(--color-warning)]/10 text-[color:var(--color-warning)]",
                      cyan: "bg-info/10 text-info",
                      muted: "bg-[color:var(--text-muted)]/10 text-[color:var(--text-muted)]",
                    }[status.variant]}`}
                  >
                    {status.icon}
                    {status.label}
                  </span>
                </DataTable.Cell>

                {/* Explicit */}
                <DataTable.Cell>
                  <DataTable.StatusBadge
                    label={item.publishing.isExplicit ? "Explicit" : "Clean"}
                    variant={item.publishing.isExplicit ? "danger" : "success"}
                    dot={false}
                  />
                </DataTable.Cell>

                {/* Writers */}
                <DataTable.Cell>
                  <div className="flex items-center gap-1 flex-wrap">
                    {writerNames.map((name, i) => (
                      <span key={i} className="text-xs text-[color:var(--text-secondary)]">
                        {name}{i < writerNames.length - 1 ? "," : ""}
                      </span>
                    ))}
                    {extraWriters > 0 && (
                      <span className="text-[10px] text-[color:var(--text-muted)]">+{extraWriters}</span>
                    )}
                    {writerNames.length === 0 && (
                      <span className="text-[color:var(--text-muted)]">—</span>
                    )}
                  </div>
                </DataTable.Cell>

                {/* Updated */}
                <DataTable.Cell>
                  <div className="text-xs text-[color:var(--text-secondary)]">
                    {new Date(item.lastUpdated).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                    })}
                  </div>
                  <div className="text-[10px] text-[color:var(--text-muted)] mt-0.5">
                    by {item.updatedBy}
                  </div>
                </DataTable.Cell>

                {/* Actions */}
                <DataTable.ActionsCell visible={isHovered}>
                  <DataTable.ActionBtn
                    onClick={() => onRowClick(item)}
                    icon={<Eye size={13} />}
                    title="View details"
                  />
                  <DataTable.ActionBtn
                    onClick={() => onEdit(item)}
                    icon={<Pencil size={13} />}
                    title="Edit metadata"
                  />
                  <DataTable.ActionBtn
                    onClick={() => onArchive(item)}
                    icon={<Archive size={13} />}
                    title={item.archivedAt ? "Unarchive" : "Archive"}
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
