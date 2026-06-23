// components/dashboard/SystemStatsPanel.tsx
import type { SystemStats } from "@/services/dashboard/types";
import { HardDrive, Music2, Users, Package } from "lucide-react";

interface Props {
  stats: SystemStats;
}

const STAT_ITEMS = [
  {
    key: "storageUsed" as const,
    label: "Storage Used",
    icon: <HardDrive size={16} />,
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.12)",
    isString: true,
  },
  {
    key: "totalTracks" as const,
    label: "Tracks Uploaded",
    icon: <Music2 size={16} />,
    color: "#a855f7",
    bg: "rgba(168,85,247,0.12)",
    isString: false,
  },
  {
    key: "activeSubscriptions" as const,
    label: "Active Subscribers",
    icon: <Users size={16} />,
    color: "#06b6d4",
    bg: "rgba(6,182,212,0.12)",
    isString: false,
  },
  {
    key: "digitalProducts" as const,
    label: "Digital Products",
    icon: <Package size={16} />,
    color: "#ec4899",
    bg: "rgba(236,72,153,0.12)",
    isString: false,
  },
];

export default function SystemStatsPanel({ stats }: Props) {
  return (
    <div className="bg-surface border border-[color:var(--border-subtle)] rounded-[18px] p-6">
      <div className="mb-5">
        <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[color:var(--text-muted)] mb-1">
          System Overview
        </div>
        <div className="text-lg font-bold text-foreground">Platform Health</div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {STAT_ITEMS.map(item => {
          const rawVal = stats[item.key];
          const displayVal = typeof rawVal === "number" ? rawVal.toLocaleString() : rawVal;

          return (
            <div
              key={item.key}
              className="bg-input border border-[color:var(--border-subtle)] rounded-xl p-4 flex flex-col gap-2.5 transition-colors duration-150 hover:border-[color:var(--border-default)]"
            >
              <div
                className="w-[34px] h-[34px] rounded-lg flex items-center justify-center"
                style={{ background: item.bg, color: item.color }}
              >
                {item.icon}
              </div>
              <div>
                <div className="text-xl font-bold text-foreground tracking-[-0.02em] leading-none">
                  {displayVal}
                </div>
                <div className="text-xs text-[color:var(--text-muted)] mt-1">{item.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
