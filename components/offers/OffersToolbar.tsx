// components/offers/OffersToolbar.tsx
"use client";

import Toolbar from "@/components/ui/Toolbar";
import type { OfferFilters, OfferStatus, ProductType, OfferSort, OfferView } from "@/services/offers/types";

interface Props {
  filters: OfferFilters;
  onChange: (patch: Partial<OfferFilters>) => void;
  total: number;
  pendingCount?: number;
  counteredCount?: number;
}

const PRODUCT_TYPE_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "track", label: "Track" },
  { value: "collection", label: "Collection" },
  { value: "digital_product", label: "Digital Product" },
  { value: "service", label: "Service" },
];

const SORT_OPTIONS: { value: OfferSort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "highest", label: "Highest Offer" },
  { value: "lowest", label: "Lowest Offer" },
  { value: "closing_soon", label: "Closing Soon" },
];

export default function OffersToolbar({
  filters, onChange, total,
  pendingCount = 0, counteredCount = 0,
}: Props) {
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "pending", label: pendingCount > 0 ? `Pending (${pendingCount})` : "Pending" },
    { value: "countered", label: counteredCount > 0 ? `Countered (${counteredCount})` : "Countered" },
    { value: "accepted", label: "Accepted" },
    { value: "rejected", label: "Rejected" },
    { value: "expired", label: "Expired" },
    { value: "withdrawn", label: "Withdrawn" },
  ];

  return (
    <Toolbar>
      <Toolbar.Search
        value={filters.search}
        onChange={v => onChange({ search: v })}
        placeholder="Search by offer ID, customer, track..."
      />
      <Toolbar.Select
        value={filters.status}
        onChange={v => onChange({ status: v as OfferStatus | "all" })}
        options={statusOptions}
      />
      <Toolbar.Select
        value={filters.productType}
        onChange={v => onChange({ productType: v as ProductType | "all" })}
        options={PRODUCT_TYPE_OPTIONS}
      />
      <Toolbar.Select
        value={filters.sort}
        onChange={v => onChange({ sort: v as OfferSort })}
        options={SORT_OPTIONS}
      />
      <Toolbar.Spacer />
      <Toolbar.Count n={total} label="offer" />
      <Toolbar.ViewToggle<OfferView>
        value={filters.view}
        onChange={v => onChange({ view: v })}
        options={["table", "cards"]}
      />
    </Toolbar>
  );
}
