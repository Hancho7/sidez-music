// components/artists/ArtistsHeader.tsx
import { Plus, Download } from "lucide-react";

interface Props {
  onCreateArtist: () => void;
  onImport: () => void;
}

export default function ArtistsHeader({ onCreateArtist, onImport }: Props) {
  return (
    <div className="flex items-end justify-between flex-wrap gap-4">
      <div>
        <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[color:var(--text-muted)] mb-1.5">
          Music
        </div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight leading-none">
          Artists
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          Manage creators, producers, bands, and collaborators.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          onClick={onImport}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] border border-[color:var(--border-default)] bg-transparent text-muted text-sm font-semibold cursor-pointer transition-colors hover:bg-elevated hover:text-foreground"
        >
          <Download size={14} />
          Import Artists
        </button>
        <button
          onClick={onCreateArtist}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-accent text-black text-sm font-semibold cursor-pointer border-0 transition-all hover:bg-[color:var(--accent-purple-hover)] hover:shadow-[var(--shadow-glow-purple)]"
        >
          <Plus size={15} />
          Create Artist
        </button>
      </div>
    </div>
  );
}
