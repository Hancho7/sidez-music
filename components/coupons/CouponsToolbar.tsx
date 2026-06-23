// components/coupons/CouponsToolbar.tsx
"use client";

import Toolbar from "@/components/ui/Toolbar";
import type { CouponFilters, CouponSort, CouponStatus, CouponView } from "@/services/coupons/types";

interface Props {
  filters: CouponFilters;
  onChange: (patch: Partial<CouponFilters>) => void;
  total: number;
}

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "scheduled", label: "Scheduled" },
  { value: "expired", label: "Expired" },
  { value: "disabled", label: "Disabled" },
  { value: "draft", label: "Draft" },
];

const SORT_OPTIONS: { value: CouponSort; label: string }[] = [
  { value: "recent", label: "Recently Created" },
  { value: "expiration", label: "Expiration Date" },
  { value: "most_redeemed", label: "Most Redeemed" },
  { value: "highest_revenue", label: "Highest Revenue" },
];

export default function CouponsToolbar({ filters, onChange, total }: Props) {
  return (
    <Toolbar>
      <Toolbar.Search
        value={filters.search}
        onChange={v => onChange({ search: v })}
        placeholder="Search by code or campaign name..."
      />
      <Toolbar.Select
        value={filters.status}
        onChange={v => onChange({ status: v as CouponStatus | "all" })}
        options={STATUS_OPTIONS}
      />
      <Toolbar.Select
        value={filters.sort}
        onChange={v => onChange({ sort: v as CouponSort })}
        options={SORT_OPTIONS}
      />
      <Toolbar.Spacer />
      <Toolbar.Count n={total} label="coupon" />
      <Toolbar.ViewToggle<CouponView>
        value={filters.view}
        onChange={v => onChange({ view: v })}
        options={["table", "cards"]}
      />
    </Toolbar>
  );
}
