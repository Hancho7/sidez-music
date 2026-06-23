// components/customers/CustomersToolbar.tsx

"use client";

import Toolbar from "@/components/ui/Toolbar";
import type { CustomerFilters, CustomerStatus, CustomerSort, CustomerView } from "@/services/customers/types";

interface Props {
  filters: CustomerFilters;
  onChange: (patch: Partial<CustomerFilters>) => void;
  total: number;
}

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "SUSPENDED", label: "Suspended" },
  { value: "ARCHIVED", label: "Archived" },
];

const SORT_OPTIONS: { value: CustomerSort; label: string }[] = [
  { value: "spending", label: "Highest Spending" },
  { value: "orders", label: "Most Orders" },
  { value: "joined", label: "Recently Joined" },
  { value: "alpha", label: "Alphabetical" },
];

export default function CustomersToolbar({ filters, onChange, total }: Props) {
  return (
    <Toolbar>
      {/* Search */}
      <Toolbar.Search
        value={filters.search}
        onChange={v => onChange({ search: v })}
        placeholder="Search by name, email, username, ID..."
        className="min-w-52"
      />

      {/* Status */}
      <Toolbar.Select
        value={filters.status}
        onChange={v => onChange({ status: v as CustomerStatus | "all" })}
        options={STATUS_OPTIONS}
      />

      {/* VIP checkbox */}
      <Toolbar.Checkbox
        checked={filters.isVip}
        onChange={v => onChange({ isVip: v })}
        label="VIP"
      />

      {/* Verified checkbox */}
      <Toolbar.Checkbox
        checked={filters.isVerified}
        onChange={v => onChange({ isVerified: v })}
        label="Verified"
      />

      {/* High Value checkbox */}
      <Toolbar.Checkbox
        checked={filters.highValue}
        onChange={v => onChange({ highValue: v })}
        label="High Value"
      />

      {/* New Customers checkbox */}
      <Toolbar.Checkbox
        checked={filters.newCustomers}
        onChange={v => onChange({ newCustomers: v })}
        label="New"
      />

      {/* Sort */}
      <Toolbar.Select
        value={filters.sort}
        onChange={v => onChange({ sort: v as CustomerSort })}
        options={SORT_OPTIONS}
        className="min-w-[140px]"
      />

      {/* Count */}
      <Toolbar.Count n={total} label="customer" />

      {/* View toggle */}
      <Toolbar.ViewToggle
        value={filters.view}
        onChange={v => onChange({ view: v as CustomerView })}
        options={["table", "cards"]}
        labels={{ table: "Table", cards: "Cards" }}
      />
    </Toolbar>
  );
}
