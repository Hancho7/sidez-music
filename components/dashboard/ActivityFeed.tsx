// components/dashboard/ActivityFeed.tsx
"use client";

import type { ActivityItem, ActivityType } from "@/services/dashboard/types";
import { ShoppingCart, UserPlus, Upload, Handshake, Crown, Activity } from "lucide-react";

interface Props {
  items: ActivityItem[];
}

const TYPE_CONFIG: Record<ActivityType, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
  PURCHASE: {
    icon: <ShoppingCart size={13} />,
    color: "#34d399",
    bg: "rgba(16,185,129,0.12)",
    label: "Purchase",
  },
  USER: {
    icon: <UserPlus size={13} />,
    color: "#06b6d4",
    bg: "rgba(6,182,212,0.12)",
    label: "New User",
  },
  UPLOAD: {
    icon: <Upload size={13} />,
    color: "#a855f7",
    bg: "rgba(168,85,247,0.12)",
    label: "Upload",
  },
  OFFER: {
    icon: <Handshake size={13} />,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
    label: "Offer",
  },
  MEMBERSHIP: {
    icon: <Crown size={13} />,
    color: "#ec4899",
    bg: "rgba(236,72,153,0.12)",
    label: "Membership",
  },
};

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "Just now";
}

function ActivityRow({ item }: { item: ActivityItem }) {
  const cfg = TYPE_CONFIG[item.type];
  return (
    <div className="flex items-start gap-3 py-3 border-b border-[#1a2038] transition-colors duration-150 hover:bg-elevated/30 px-2 -mx-2 rounded-[10px]">
      {/* Icon */}
      <div
        className="w-8 h-8 rounded-[10px] flex-shrink-0 flex items-center justify-center"
        style={{ background: cfg.bg, color: cfg.color }}
      >
        {cfg.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span
            className="text-[10px] font-semibold tracking-[0.06em] uppercase px-1.5 py-0.5 rounded"
            style={{ color: cfg.color, background: cfg.bg }}
          >
            {cfg.label}
          </span>
        </div>
        <p className="text-sm text-[color:var(--text-secondary)] m-0 leading-relaxed truncate">
          {item.message}
        </p>
      </div>

      {/* Time */}
      <span className="text-[11px] text-[color:var(--text-muted)] flex-shrink-0 pt-0.5">
        {timeAgo(item.timestamp)}
      </span>
    </div>
  );
}

export default function ActivityFeed({ items }: Props) {
  return (
    <div className="bg-surface border border-[color:var(--border-subtle)] rounded-[10px] p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[color:var(--text-muted)] mb-1">
            Activity Feed
          </div>
          <div className="text-lg font-bold text-foreground">Live Updates</div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-[10px] bg-success shadow-[0_0_6px_#34d399]" />
          <span className="text-xs text-success font-semibold">Live</span>
          <Activity size={14} className="text-[color:var(--text-muted)] ml-1" />
        </div>
      </div>

      <div className="flex flex-col">
        {items.length === 0 ? (
          <div className="text-center py-10 text-[color:var(--text-muted)]">
            <p className="m-0 text-sm">No recent activity yet.</p>
            <p className="m-0 mt-1.5 text-sm">Activity will appear here as users interact with the platform.</p>
          </div>
        ) : (
          items.map((item, i) => <ActivityRow key={i} item={item} />)
        )}
      </div>
    </div>
  );
}
