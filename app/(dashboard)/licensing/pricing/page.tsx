// app/(dashboard)/licensing/pricing/page.tsx
"use client";

import { useState, useMemo } from "react";
import PricingHeader from "@/components/pricing/PricingHeader";
import PricingToolbar from "@/components/pricing/PricingToolbar";
import PricingTable from "@/components/pricing/PricingTable";
import PricingDrawer from "@/components/pricing/PricingDrawer";
import BulkPricingModal from "@/components/pricing/BulkPricingModal";
import { MOCK_PRICING_ROWS } from "@/services/pricing/mock-data";
import type { PricingRow, PricingFilters } from "@/services/pricing/types";

const DEFAULT_FILTERS: PricingFilters = {
  search: "", licensePlan: "ALL", genre: "",
  missingOnly: false, sort: "updated", view: "table",
};

export default function PricingPage() {
  const [rows, setRows] = useState<PricingRow[]>(MOCK_PRICING_ROWS);
  const [filters, setFilters] = useState<PricingFilters>(DEFAULT_FILTERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);

  const patchFilters = (patch: Partial<PricingFilters>) =>
    setFilters(prev => ({ ...prev, ...patch }));

  const filtered = useMemo(() => {
    let result = [...rows];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(r =>
        r.trackTitle.toLowerCase().includes(q) ||
        r.artistName.toLowerCase().includes(q) ||
        r.genre.toLowerCase().includes(q)
      );
    }

    if (filters.genre) result = result.filter(r => r.genre === filters.genre);
    if (filters.missingOnly) result = result.filter(r => r.status === "MISSING");

    result.sort((a, b) => {
      switch (filters.sort) {
        case "highest": return (b.basicPrice ?? 0) - (a.basicPrice ?? 0);
        case "lowest": return (a.basicPrice ?? 0) - (b.basicPrice ?? 0);
        case "updated": return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case "alpha": return a.trackTitle.localeCompare(b.trackTitle);
        default: return 0;
      }
    });

    return result;
  }, [rows, filters]);

  const handleBulkApply = (ids: string[], mode: string, value: number, license: string) => {
    // Optimistic update — in production, call PUT /api/admin/licensing/pricing/bulk
    setRows(prev => prev.map(r => {
      if (!ids.includes(r.id)) return r;
      const calc = (price: number | null) => {
        if (price === null) return null;
        if (mode === "increase") return Math.round(price * (1 + value / 100));
        if (mode === "decrease") return Math.round(price * (1 - value / 100));
        if (mode === "fixed") return value;
        return price; // restore — would need default from plan
      };
      return {
        ...r,
        basicPrice: (license === "All Licenses" || license === "Basic") ? calc(r.basicPrice) : r.basicPrice,
        premiumPrice: (license === "All Licenses" || license === "Premium") ? calc(r.premiumPrice) : r.premiumPrice,
        unlimitedPrice: (license === "All Licenses" || license === "Unlimited") ? calc(r.unlimitedPrice) : r.unlimitedPrice,
        exclusivePrice: (license === "All Licenses" || license === "Exclusive") ? calc(r.exclusivePrice) : r.exclusivePrice,
        updatedAt: new Date().toISOString(),
      };
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      <PricingHeader
        total={rows.length}
        onAssignClick={() => { }}
        onBulkClick={() => setBulkOpen(true)}
      />

      <PricingToolbar filters={filters} onChange={patchFilters} />

      <PricingTable
        rows={filtered}
        loading={false}
        onSelect={id => setSelectedId(id)}
      />

      <PricingDrawer
        pricingId={selectedId}
        onClose={() => setSelectedId(null)}
        onEdit={id => console.log("edit", id)}
      />

      <BulkPricingModal
        open={bulkOpen}
        rows={rows}
        onClose={() => setBulkOpen(false)}
        onApply={handleBulkApply}
      />
    </div>
  );
}
