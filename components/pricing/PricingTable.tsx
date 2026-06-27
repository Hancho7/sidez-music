// components/pricing/PricingTable.tsx
"use client";

import { Eye, Pencil, Copy, Archive, DollarSign } from "lucide-react";
import DataTable, { useHoveredRow } from "@/components/ui/DataTable";
import type { TrackPricing, PricingStatus, PricingRow } from "@/services/pricing/types";

interface Props {
  rows: PricingRow[];
  loading?: boolean;
  onSelect: (item: PricingRow) => void;
  onEdit: (item: PricingRow) => void;
  onDuplicate: (item: PricingRow) => void;
  onArchive: (item: PricingRow) => void;
}

const STATUS_META: Record<PricingStatus, {
  label: string;
  variant: "success" | "warning" | "muted" | "danger";
}> = {
  COMPLETE: { label: "Complete", variant: "success" },
  PARTIAL: { label: "Partial", variant: "warning" },
  MISSING: { label: "Missing", variant: "danger" },
};

function fmt(price: number | null | undefined): React.ReactNode {
  if (price == null) return <span className="text-[color:var(--text-muted)]">—</span>;
  return <span className="font-semibold text-foreground">${price.toFixed(0)}</span>;
}

function SkeletonRow() {
  return (
    <DataTable.Row>
      {[36, 160, 110, 70, 50, 60, 70, 70, 80, 80].map((w, i) => (
        <DataTable.Cell key={i}>
          <div className="h-3.5 bg-elevated rounded animate-pulse" style={{ width: w }} />
        </DataTable.Cell>
      ))}
      <DataTable.Cell />
    </DataTable.Row>
  );
}

export default function PricingTable({ rows, loading, onSelect, onEdit, onDuplicate, onArchive }: Props) {
  const { hoveredId, setHoveredId } = useHoveredRow();

  return (
    <DataTable
      minWidth={860}
      isEmpty={!loading && rows.length === 0}
      emptyState={
        <DataTable.EmptyState
          icon={<DollarSign size={22} className="text-accent" />}
          title="No pricing configured"
          message="Assign a license plan to a track to start managing pricing."
        />
      }
    >
      <DataTable.Header>
        <DataTable.Col width={36} />
        <DataTable.Col>Track</DataTable.Col>
        <DataTable.Col>Artist</DataTable.Col>
        <DataTable.Col>Genre</DataTable.Col>
        <DataTable.Col align="right">Basic</DataTable.Col>
        <DataTable.Col align="right">Premium</DataTable.Col>
        <DataTable.Col align="right">Unlimited</DataTable.Col>
        <DataTable.Col align="right">Exclusive</DataTable.Col>
        <DataTable.Col>Status</DataTable.Col>
        <DataTable.Col>Updated</DataTable.Col>
        <DataTable.ActionsCol />
      </DataTable.Header>

      <DataTable.Body>
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
          : rows.map(row => {
            const isHovered = hoveredId === row.id;

            // Safely access licenses with fallback to empty array

            const status = STATUS_META[row.status] ?? STATUS_META.MISSING;

            return (
              <DataTable.Row
                key={row.id}
                onClick={() => onSelect(row)}
                isHovered={isHovered}
                onHoverChange={h => setHoveredId(h ? row.id : null)}
              >
                {/* Cover */}
                <DataTable.Cell>
                  <div className="w-9 h-9 rounded-lg overflow-hidden bg-elevated flex items-center justify-center border border-[color:var(--border-subtle)] flex-shrink-0">
                    {row.coverImage
                      ? <img src={row.coverImage} alt={row.trackTitle} className="w-full h-full object-cover" />
                      : <DollarSign size={14} className="text-[color:var(--text-muted)]" />
                    }
                  </div>
                </DataTable.Cell>

                {/* Track name */}
                <DataTable.Cell className="font-semibold text-foreground max-w-[180px] truncate">
                  {row.trackTitle}
                </DataTable.Cell>

                {/* Artist */}
                <DataTable.Cell className="text-[color:var(--text-secondary)]">
                  {row.artistName}
                </DataTable.Cell>

                {/* Genre */}
                <DataTable.Cell>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-elevated text-[color:var(--text-secondary)] border border-[color:var(--border-subtle)]">
                    {row.genre}
                  </span>
                </DataTable.Cell>

                {/* Price columns */}
                <DataTable.Cell align="right" className="tabular-nums">
                  {fmt(row.basicPrice)}
                </DataTable.Cell>

                <DataTable.Cell align="right" className="tabular-nums">
                  {fmt(row.premiumPrice)}
                </DataTable.Cell>

                <DataTable.Cell align="right" className="tabular-nums">
                  {fmt(row.unlimitedPrice)}
                </DataTable.Cell>

                <DataTable.Cell align="right" className="tabular-nums">
                  {fmt(row.exclusivePrice)}
                </DataTable.Cell>

                {/* Status */}
                <DataTable.Cell>
                  <DataTable.StatusBadge
                    label={status.label}
                    variant={status.variant}
                  />
                </DataTable.Cell>

                {/* Updated */}
                <DataTable.Cell className="whitespace-nowrap text-xs text-[color:var(--text-secondary)]">
                  {new Date(row.updatedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </DataTable.Cell>

                {/* Actions */}
                <DataTable.ActionsCell visible={isHovered}>
                  <DataTable.ActionBtn
                    onClick={() => onSelect(row)}
                    icon={<Eye size={13} />}
                    title="View pricing"
                  />
                  <DataTable.ActionBtn
                    onClick={() => onEdit(row)}
                    icon={<Pencil size={13} />}
                    title="Edit pricing"
                  />
                  <DataTable.ActionBtn
                    onClick={() => onDuplicate(row)}
                    icon={<Copy size={13} />}
                    title="Duplicate to another track"
                  />
                  <DataTable.ActionBtn
                    onClick={() => onArchive(row)}
                    icon={<Archive size={13} />}
                    title="Archive pricing"
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
