// components/pricing/PricingHeader.tsx
"use client";

import { Plus, RefreshCw } from "lucide-react";
import Button from "../ui/Button";

interface PricingHeaderProps {
  total: number;
  onAssignClick: () => void;
  onBulkClick: () => void;
}

export default function PricingHeader({ total, onAssignClick, onBulkClick }: PricingHeaderProps) {
  return (
    <div className="flex items-end justify-between flex-wrap gap-4">
      <div>
        <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[color:var(--text-muted)] mb-1.5">
          Licensing
        </div>

        <h1 className="text-2xl font-bold text-foreground tracking-[-0.02em] m-0 leading-tight">
          Track Pricing
        </h1>
        <p className="text-sm text-[color:var(--text-muted)] mt-1">
          Manage licensing prices for every track
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <Button
          variant="secondary"
          icon={<RefreshCw size={15} />}
          onClick={onBulkClick}
        >
          Bulk Update
        </Button>
        <Button
          variant="primary"
          icon={<Plus size={15} />}
          onClick={onBulkClick}
        >
          Assign Pricing
        </Button>
      </div>
    </div>
  );
}
