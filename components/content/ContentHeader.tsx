// components/content/ContentHeader.tsx
import { Plus, ExternalLink } from "lucide-react";
import Button from "@/components/ui/Button";

interface Props {
  onCreateContent: () => void;
}

export default function ContentHeader({ onCreateContent }: Props) {
  return (
    <div className="flex items-end justify-between flex-wrap gap-4">
      <div>
        <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[color:var(--text-muted)] mb-1.5">
          CMS
        </div>
        <h1 className="text-2xl font-bold text-foreground m-0 tracking-tight leading-tight">Content</h1>
        <p className="mt-1.5 text-sm text-muted">Manage all website content from a single workspace.</p>
      </div>
      <div className="flex items-center gap-2.5">
        <Button variant="secondary" size="md" icon={<ExternalLink size={14} />} onClick={() => window.open("/", "_blank")}>
          Preview Website
        </Button>
        <Button variant="primary" size="md" icon={<Plus size={15} />} onClick={onCreateContent}>
          Create Content
        </Button>
      </div>
    </div>
  );
}
