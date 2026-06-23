// components/genres/GenresHeader.tsx
import { Plus, Download } from "lucide-react";
import Button from "../ui/Button";

interface Props {
  onCreateGenre: () => void;
  onImport: () => void;
}

export default function GenresHeader({ onCreateGenre, onImport }: Props) {
  return (
    <div className="flex items-end justify-between flex-wrap gap-4">
      <div>
        <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[color:var(--text-muted)] mb-1.5">
          Music
        </div>
        <h1 className="text-2xl font-bold text-foreground m-0 tracking-[-0.03em] leading-tight">
          Genres
        </h1>
        <p className="mt-1.5 text-sm text-[color:var(--text-secondary)]">
          Organize and categorize your music library.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <Button
          variant="secondary"
          icon={<Download size={15} />}
          onClick={onImport}
        >
          Import Genres
        </Button>
        <Button
          variant="primary"
          icon={<Plus size={15} />}
          onClick={onCreateGenre}
        >
          Create Genre
        </Button>
      </div>
    </div>
  );
}
