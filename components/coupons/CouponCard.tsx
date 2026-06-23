// components/coupons/CouponCard.tsx
"use client";

import { useState } from "react";
import { Copy, Check, Eye, Pencil, Archive, Power } from "lucide-react";
import type { Coupon } from "@/services/coupons/types";
import Card from "@/components/ui/Card";

interface Props {
  coupon: Coupon;
  onClick: (c: Coupon) => void;
  onEdit: (c: Coupon) => void;
  onDuplicate: (c: Coupon) => void;
  onToggleStatus: (c: Coupon) => void;
  onArchive: (c: Coupon) => void;
}

function fmtDiscount(c: Coupon) {
  return c.discountType === "percentage" ? `${c.discountValue}% OFF` : `$${c.discountValue} OFF`;
}

function fmtExpiry(c: Coupon) {
  if (!c.expiresAt) return "No expiry";
  const diff = Math.ceil((new Date(c.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return "Expired";
  if (diff === 0) return "Expires today";
  if (diff <= 7) return `Expires in ${diff}d`;
  return `Expires ${new Date(c.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}

export default function CouponCard({ coupon, onClick, onEdit, onDuplicate, onToggleStatus, onArchive }: Props) {
  const [copied, setCopied] = useState(false);

  const copyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(coupon.code).catch(() => { });
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const pct = coupon.usageLimit ? (coupon.usageCount / coupon.usageLimit) * 100 : null;

  return (
    <Card onClick={() => onClick(coupon)}>
      {/* Accent stripe — gradient when active */}
      <Card.AccentBand
        status={coupon.status}
        gradient={coupon.status === "active"}
      />

      <Card.Body>
        {/* Status + type label */}
        <div className="flex items-center justify-between">
          <Card.StatusBadge status={coupon.status} position="inline" />
          <span className="text-[10px] font-semibold text-[color:var(--text-muted)] uppercase tracking-wide">
            {coupon.discountType === "percentage" ? "% OFF" : "$ OFF"}
          </span>
        </div>

        {/* Hero discount */}
        <div>
          <div className="text-3xl font-black text-foreground tracking-tight leading-none">
            {fmtDiscount(coupon)}
          </div>
          <Card.Meta className="mt-1 line-clamp-1">{coupon.campaignName}</Card.Meta>
        </div>

        {/* Code copy button */}
        <button
          onClick={copyCode}
          className="self-start inline-flex items-center gap-1.5 font-mono text-xs font-bold text-accent bg-accent/10 px-2.5 py-1 rounded-lg border border-accent/20 hover:bg-accent/20 transition-colors"
        >
          {coupon.code}
          {copied ? <Check size={11} className="text-success" /> : <Copy size={11} className="opacity-60" />}
        </button>

        {/* Usage bar */}
        <div>
          <div className="flex justify-between text-[11px] text-[color:var(--text-muted)] mb-1">
            <span>{coupon.usageCount.toLocaleString()} redeemed</span>
            <span>{coupon.usageLimit === null ? "Unlimited" : `${coupon.usageLimit.toLocaleString()} max`}</span>
          </div>
          <div className="h-1.5 rounded-full bg-elevated overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${pct !== null && pct >= 100 ? "bg-danger" : pct !== null && pct >= 80 ? "bg-[color:var(--color-warning)]" : "bg-success"}`}
              style={{ width: pct !== null ? `${Math.min(pct, 100)}%` : "0%" }}
            />
          </div>
        </div>

        {/* Expiry + revenue */}
        <div className="flex items-center justify-between pt-1 border-t border-[color:var(--border-subtle)]">
          <span className={`text-[11px] font-medium ${coupon.status === "expired" ? "text-danger" : "text-[color:var(--text-muted)]"}`}>
            {fmtExpiry(coupon)}
          </span>
          <span className="text-xs font-semibold text-success">
            ${(coupon.analytics?.revenueGenerated ?? 0).toLocaleString()}
          </span>
        </div>

        <Card.Actions
          buttons={[
            { icon: <Eye size={11} />, label: "View", onClick: e => { e.stopPropagation(); onClick(coupon); } },
            { icon: <Pencil size={11} />, label: "Edit", onClick: e => { e.stopPropagation(); onEdit(coupon); } },
            { icon: <Copy size={11} />, label: "Duplicate", onClick: e => { e.stopPropagation(); onDuplicate(coupon); } },
            { icon: <Archive size={11} />, label: "Archive", onClick: e => { e.stopPropagation(); onArchive(coupon); }, variant: "danger", iconOnly: true },
          ]}
        />
      </Card.Body>
    </Card>
  );
}
