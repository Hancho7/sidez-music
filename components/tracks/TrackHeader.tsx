// components/tracks/TrackHeader.tsx
import { Upload, ChevronDown } from "lucide-react";
import Button from "../ui/Button";

interface Props {
  onUpload: () => void;
  selectedCount: number;
  onBulkArchive: () => void;
  onBulkDelete: () => void;
}

export default function TrackHeader({ onUpload, selectedCount, onBulkArchive, onBulkDelete }: Props) {
  return (
    <div className="flex items-end justify-between flex-wrap gap-4">
      <div>
        <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[color:var(--text-muted)] mb-1.5">
          Music
        </div>
        <h1 className="text-2xl font-bold text-foreground m-0 tracking-[-0.03em] leading-tight">
          Tracks
        </h1>
        <p className="mt-1.5 text-sm text-[color:var(--text-secondary)]">
          Manage all music uploads and licensing
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        {selectedCount > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-accent font-semibold">
              {selectedCount} selected
            </span>
            <button
              onClick={onBulkArchive}
              className="px-3.5 py-2 rounded-[10px] border border-[#31386d] bg-transparent text-[color:var(--text-secondary)] text-sm font-semibold cursor-pointer transition-all hover:bg-elevated hover:text-foreground"
            >
              Archive
            </button>
            <button
              onClick={onBulkDelete}
              className="px-3.5 py-2 rounded-[10px] border border-danger/30 bg-danger/10 text-danger text-sm font-semibold cursor-pointer transition-all hover:bg-danger/20"
            >
              Delete
            </button>
          </div>
        )}

        <Button
          variant="primary"
          icon={<Upload size={15} />}
          onClick={onUpload}
        >
          Upload Track
        </Button>
      </div>
    </div>
  );
}
