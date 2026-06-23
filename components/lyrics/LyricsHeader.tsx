// components/lyrics/LyricsHeader.tsx

import { Plus, FileText } from "lucide-react";
import Button from "../ui/Button";

interface Props {
  onCreate: () => void;
  totalCount: number;
}

export default function LyricsHeader({ onCreate, totalCount }: Props) {
  return (
    <div className="flex items-end justify-between flex-wrap gap-4">
      <div>
        <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[color:var(--text-muted)] mb-1.5">
          Music
        </div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight leading-none">
          Lyrics &amp; Metadata
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          Manage lyrics, credits, publishing information, and copyright.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <Button
          variant="primary"
          icon={<Plus size={15} />}
          onClick={onCreate}
        >
          Create Metadata
        </Button>
      </div>
    </div>
  );
}
