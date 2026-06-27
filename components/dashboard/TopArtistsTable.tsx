// components/dashboard/TopArtistsTable.tsx
import type { TopArtist } from "@/services/dashboard/types";
import { Mic2 } from "lucide-react";

interface Props {
  artists: TopArtist[];
}

const ARTIST_COLORS = ["#7c3aed", "#06b6d4", "#a855f7", "#ec4899", "#f59e0b"];

function fmt(n: number) {
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}k`;
  return `$${n}`;
}

function initials(name: string) {
  return name.split(" ").map(p => p[0]).join("").toUpperCase().slice(0, 2);
}

export default function TopArtistsTable({ artists }: Props) {
  return (
    <div className="bg-surface border border-[color:var(--border-subtle)] rounded-[10px] p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[color:var(--text-muted)] mb-1">
            Top Artists
          </div>
          <div className="text-lg font-bold text-foreground">By Revenue</div>
        </div>
        <div className="w-9 h-9 rounded-[10px] bg-accent-cyan/12 flex items-center justify-center">
          <Mic2 size={16} className="text-accent-cyan" />
        </div>
      </div>

      <div className="flex flex-col gap-0.5">
        {/* Header */}
        <div className="grid grid-cols-4 px-2 pb-2.5 border-b border-[color:var(--border-subtle)]">
          {["Artist", "Sales", "Revenue", "Tracks"].map(h => (
            <span key={h} className="text-[11px] font-semibold tracking-[0.06em] uppercase text-[color:var(--text-muted)]">
              {h}
            </span>
          ))}
        </div>

        {artists.map((artist, i) => (
          <div
            key={artist.name}
            className="grid grid-cols-4 items-center px-2 py-2.5 rounded-[10px] border-b border-[#1a2038] transition-colors duration-150 cursor-default hover:bg-elevated"
          >
            {/* Artist name + avatar */}
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-[10px] flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                style={{ background: ARTIST_COLORS[i % ARTIST_COLORS.length] }}
              >
                {initials(artist.name)}
              </div>
              <span className="text-sm font-semibold text-foreground">{artist.name}</span>
            </div>

            <span className="text-sm text-[color:var(--text-secondary)]">{artist.sales.toLocaleString()}</span>

            <span className="text-sm font-semibold text-success">{fmt(artist.revenue)}</span>

            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-[10px] bg-accent/15 text-accent text-xs font-semibold">
                {artist.tracks}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
