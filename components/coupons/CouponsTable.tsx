// components/coupons/CouponsTable.tsx
"use client";

import { Eye, Pencil, Copy, Power, Archive, Ticket, Check } from "lucide-react";
import { useState } from "react";
import DataTable, { useHoveredRow } from "@/components/ui/DataTable";
import type { Coupon, CouponStatus } from "@/services/coupons/types";

interface Props {
  coupons: Coupon[];
  onRowClick: (c: Coupon) => void;
  onEdit: (c: Coupon) => void;
  onDuplicate: (c: Coupon) => void;
  onToggleStatus: (c: Coupon) => void;
  onArchive: (c: Coupon) => void;
}

const STATUS_VARIANT: Record<CouponStatus, "success" | "warning" | "muted" | "danger" | "cyan" | "purple"> = {
  active: "success",
  scheduled: "cyan",
  expired: "muted",
  disabled: "danger",
  draft: "warning",
};

const STATUS_LABEL: Record<CouponStatus, string> = {
  active: "Active",
  scheduled: "Scheduled",
  expired: "Expired",
  disabled: "Disabled",
  draft: "Draft",
};

function fmtDiscount(c: Coupon) {
  return c.discountType === "percentage" ? `${c.discountValue}%` : `$${c.discountValue}`;
}

function fmtUsage(c: Coupon) {
  if (c.usageLimit === null) return `${c.usageCount} / ∞`;
  return `${c.usageCount} / ${c.usageLimit}`;
}

function usagePct(c: Coupon) {
  if (c.usageLimit === null) return null;
  return Math.min((c.usageCount / c.usageLimit) * 100, 100);
}

function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code).catch(() => { });
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={copy}
      title="Copy code"
      className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-md border border-accent/20 cursor-pointer hover:bg-accent/20 transition-colors"
    >
      {code}
      {copied
        ? <Check size={10} className="text-success" />
        : <Copy size={10} className="opacity-60" />
      }
    </button>
  );
}

function SkeletonRow() {
  return (
    <DataTable.Row>
      {[90, 140, 60, 80, 100, 90, 80, 80].map((w, i) => (
        <DataTable.Cell key={i}>
          <div className="h-3.5 bg-elevated rounded animate-pulse" style={{ width: w }} />
        </DataTable.Cell>
      ))}
      <DataTable.Cell />
    </DataTable.Row>
  );
}

export default function CouponsTable({ coupons, onRowClick, onEdit, onDuplicate, onToggleStatus, onArchive }: Props) {
  const { hoveredId, setHoveredId } = useHoveredRow();

  return (
    <DataTable
      isEmpty={coupons.length === 0}
      emptyState={
        <DataTable.EmptyState
          icon={<Ticket size={22} className="text-accent" />}
          title="No coupons found"
          message="Create your first coupon to start running promotions."
        />
      }
    >
      <DataTable.Header>
        <DataTable.Col>Code</DataTable.Col>
        <DataTable.Col>Campaign</DataTable.Col>
        <DataTable.Col align="center">Discount</DataTable.Col>
        <DataTable.Col>Applies To</DataTable.Col>
        <DataTable.Col>Usage</DataTable.Col>
        <DataTable.Col>Expires</DataTable.Col>
        <DataTable.Col>Status</DataTable.Col>
        <DataTable.Col align="right">Revenue</DataTable.Col>
        <DataTable.ActionsCol />
      </DataTable.Header>

      <DataTable.Body>
        {coupons.map(c => {
          const isHovered = hoveredId === c.id;
          const pct = usagePct(c);

          return (
            <DataTable.Row
              key={c.id}
              onClick={() => onRowClick(c)}
              isHovered={isHovered}
              onHoverChange={h => setHoveredId(h ? c.id : null)}
            >
              {/* Code */}
              <DataTable.Cell>
                <CopyCode code={c.code} />
              </DataTable.Cell>

              {/* Campaign */}
              <DataTable.Cell className="font-semibold text-foreground">
                <div className="truncate max-w-[180px]">{c.campaignName}</div>
                <p className="text-[11px] text-[color:var(--text-muted)] truncate max-w-[180px]">
                  {c.description}
                </p>
              </DataTable.Cell>

              {/* Discount */}
              <DataTable.Cell align="center">
                <span className="text-sm font-bold text-[color:var(--accent-magenta)]">
                  {fmtDiscount(c)}
                </span>
                {c.maximumDiscount && (
                  <p className="text-[10px] text-[color:var(--text-muted)]">max ${c.maximumDiscount}</p>
                )}
              </DataTable.Cell>

              {/* Applies To */}
              <DataTable.Cell>
                <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-elevated text-[color:var(--text-secondary)] border border-[color:var(--border-subtle)] capitalize">
                  {c.eligibility.entityTarget === "all" ? "Entire Store" : c.eligibility.entityTarget.replace("_", " ")}
                </span>
              </DataTable.Cell>

              {/* Usage */}
              <DataTable.Cell>
                <div className="text-xs text-[color:var(--text-secondary)] mb-1">{fmtUsage(c)}</div>
                {pct !== null && (
                  <div className="w-20 h-1 rounded-full bg-elevated overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${pct >= 100 ? "bg-danger" : pct >= 80 ? "bg-[color:var(--color-warning)]" : "bg-success"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                )}
              </DataTable.Cell>

              {/* Expires */}
              <DataTable.Cell className="text-xs text-[color:var(--text-muted)] whitespace-nowrap">
                {fmtDate(c.expiresAt)}
              </DataTable.Cell>

              {/* Status */}
              <DataTable.Cell>
                <DataTable.StatusBadge
                  label={STATUS_LABEL[c.status]}
                  variant={STATUS_VARIANT[c.status]}
                />
              </DataTable.Cell>

              {/* Revenue */}
              <DataTable.Cell align="right" className="text-sm font-semibold text-success">
                ${(c.analytics?.revenueGenerated ?? 0).toLocaleString()}
              </DataTable.Cell>

              {/* Actions */}
              <DataTable.ActionsCell visible={isHovered}>
                <DataTable.ActionBtn onClick={() => onRowClick(c)} icon={<Eye size={13} />} title="View" />
                <DataTable.ActionBtn onClick={() => onEdit(c)} icon={<Pencil size={13} />} title="Edit" />
                <DataTable.ActionBtn onClick={() => onDuplicate(c)} icon={<Copy size={13} />} title="Duplicate" />
                <DataTable.ActionBtn onClick={() => onToggleStatus(c)} icon={<Power size={13} />} title={c.status === "active" ? "Disable" : "Enable"} />
                <DataTable.ActionBtn onClick={() => onArchive(c)} icon={<Archive size={13} />} title="Archive" danger />
              </DataTable.ActionsCell>
            </DataTable.Row>
          );
        })}
      </DataTable.Body>
    </DataTable>
  );
}
