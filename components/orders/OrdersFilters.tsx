// components/orders/OrdersFilters.tsx
"use client";

import Toolbar from "@/components/ui/Toolbar";
import type { OrderFilters, PaymentStatus, LicenseType, SortOption } from "@/services/orders/types";

interface Props {
  filters: OrderFilters;
  onChange: (patch: Partial<OrderFilters>) => void;
  total: number;
}

const STATUS_OPTIONS: { value: PaymentStatus | "all"; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "PAID", label: "Paid" },
  { value: "PENDING", label: "Pending" },
  { value: "FAILED", label: "Failed" },
  { value: "REFUNDED", label: "Refunded" },
];

const LICENSE_OPTIONS: { value: LicenseType | "all"; label: string }[] = [
  { value: "all", label: "All Licenses" },
  { value: "Basic", label: "Basic" },
  { value: "Premium", label: "Premium" },
  { value: "Unlimited", label: "Unlimited" },
  { value: "Exclusive", label: "Exclusive" },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "highest", label: "Highest value" },
  { value: "lowest", label: "Lowest value" },
];

export default function OrdersFilters({ filters, onChange, total }: Props) {
  return (
    <Toolbar>
      <Toolbar.Search
        value={filters.search}
        onChange={v => onChange({ search: v })}
        placeholder="Order ID, customer name, email..."
      />
      <Toolbar.Select
        value={filters.status}
        onChange={v => onChange({ status: v as OrderFilters["status"] })}
        options={STATUS_OPTIONS}
      />
      <Toolbar.Select
        value={filters.licenseType}
        onChange={v => onChange({ licenseType: v as OrderFilters["licenseType"] })}
        options={LICENSE_OPTIONS}
      />
      <Toolbar.Divider />
      <Toolbar.DateInput
        value={filters.dateFrom}
        onChange={v => onChange({ dateFrom: v })}
      />
      <span className="text-xs text-[color:var(--text-muted)]">to</span>
      <Toolbar.DateInput
        value={filters.dateTo}
        onChange={v => onChange({ dateTo: v })}
      />
      <Toolbar.Divider />
      <Toolbar.Select
        value={filters.sort}
        onChange={v => onChange({ sort: v as SortOption })}
        options={SORT_OPTIONS}
      />
      <Toolbar.Spacer />
      <Toolbar.Count n={total} label="order" />
    </Toolbar>
  );
}
