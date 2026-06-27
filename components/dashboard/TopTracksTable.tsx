// components/dashboard/TopTracksTable.tsx
import type { TopTrack } from "@/services/dashboard/types";
import { Music2, TrendingUp } from "lucide-react";

interface Props {
  tracks: TopTrack[];
}

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}k`;
  return `$${n}`;
}

function fmtPlays(n: number) {
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return `${n}`;
}

export default function TopTracksTable({ tracks }: Props) {
  return (
    <div className="bg-surface border border-[color:var(--border-subtle)] rounded-[10px] p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[color:var(--text-muted)] mb-1">
            Top Tracks
          </div>
          <div className="text-lg font-bold text-foreground">By Revenue</div>
        </div>
        <div className="w-9 h-9 rounded-[10px] bg-accent/15 flex items-center justify-center">
          <Music2 size={16} className="text-accent" />
        </div>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            {["#", "Track", "Artist", "Sales", "Revenue", "Plays"].map(h => (
              <th key={h} className={`px-2 pb-2.5 text-[11px] font-semibold tracking-[0.06em] uppercase text-[color:var(--text-muted)] border-b border-[color:var(--border-subtle)]
                ${h === "#" ? "text-center" : "text-left"}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tracks.map((track, i) => (
            <tr key={track.title} className="transition-colors duration-150 hover:bg-elevated">
              <td className="px-2 py-3 text-center text-xs font-bold text-[color:var(--text-muted)] border-b border-[#1a2038]">
                {i + 1}
              </td>
              <td className="px-2 py-3 border-b border-[#1a2038]">
                <span className="text-sm font-semibold text-foreground">{track.title}</span>
              </td>
              <td className="px-2 py-3 border-b border-[#1a2038]">
                <span className="text-sm text-[color:var(--text-secondary)]">{track.artist}</span>
              </td>
              <td className="px-2 py-3 border-b border-[#1a2038]">
                <span className="text-sm text-[color:var(--text-secondary)]">{track.sales.toLocaleString()}</span>
              </td>
              <td className="px-2 py-3 border-b border-[#1a2038]">
                <span className="text-sm font-semibold text-success">{fmt(track.revenue)}</span>
              </td>
              <td className="px-2 py-3 border-b border-[#1a2038]">
                <div className="flex items-center gap-1">
                  <TrendingUp size={11} className="text-[color:var(--text-muted)]" />
                  <span className="text-sm text-[color:var(--text-secondary)]">{fmtPlays(track.plays)}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
