// components/pricing/PricingHeader.tsx
"use client";

import { Plus, RefreshCw } from "lucide-react";

interface PricingHeaderProps {
  total: number;
  onAssignClick: () => void;
  onBulkClick: () => void;
}

export default function PricingHeader({ total, onAssignClick, onBulkClick }: PricingHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-[-0.02em] m-0 leading-tight">
          Track Pricing
        </h1>
        <p className="text-sm text-[color:var(--text-muted)] mt-1">
          Manage licensing prices for every track
          {total > 0 && (
            <span className="ml-2.5 text-xs font-semibold bg-white/8 text-[color:var(--text-secondary)] border border-white/10 px-2 py-0.5 rounded-full">
              {total} tracks
            </span>
          )}
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          onClick={onBulkClick}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border border-white/10 rounded-lg cursor-pointer transition-all duration-150 hover:border-white/20 hover:bg-white/5"
          style={{ background: "transparent", color: "#a3a3a3" }}
        >
          <RefreshCw size={14} />
          Bulk Update
        </button>
        <button
          onClick={onAssignClick}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg cursor-pointer transition-all duration-150"
          style={{ background: "#ffffff", color: "#080808" }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#e5e5e5"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "#ffffff"}
        >
          <Plus size={15} />
          Assign Pricing
        </button>
      </div>
    </div>
  );
}
