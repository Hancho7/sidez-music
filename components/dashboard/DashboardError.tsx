// components/dashboard/DashboardError.tsx
"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  message?: string;
  onRetry?: () => void;
}

export default function DashboardError({ message = "Something went wrong loading this section.", onRetry }: Props) {
  return (
    <div className="bg-surface border border-danger/25 rounded-[18px] py-12 px-6 flex flex-col items-center gap-4 text-center">
      <div className="w-12 h-12 rounded-[14px] bg-danger/12 flex items-center justify-center">
        <AlertTriangle size={22} className="text-danger" />
      </div>
      <div>
        <div className="text-[15px] font-semibold text-foreground mb-1.5">Failed to load data</div>
        <div className="text-sm text-[color:var(--text-muted)] max-w-[300px]">{message}</div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4.5 py-2 bg-danger/12 border border-danger/30 rounded-lg cursor-pointer text-sm font-semibold text-danger transition-colors hover:bg-danger/20"
        >
          <RefreshCw size={13} />
          Try again
        </button>
      )}
    </div>
  );
}
