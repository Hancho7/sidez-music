// components/media/MediaHeader.tsx
import { Upload, FolderPlus } from "lucide-react";
import Button from "@/components/ui/Button";

interface Props {
  onUpload: () => void;
  onCreateFolder: () => void;
}

export default function MediaHeader({ onUpload, onCreateFolder }: Props) {
  return (
    <div className="flex items-end justify-between flex-wrap gap-4">
      <div>
        <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[color:var(--text-muted)] mb-1.5">
          DAM
        </div>
        <h1 className="text-2xl font-bold text-foreground m-0 tracking-tight leading-tight">Media Library</h1>
        <p className="mt-1.5 text-sm text-muted">Manage and organize all uploaded assets.</p>
      </div>
      <div className="flex items-center gap-2.5">
        <Button variant="secondary" size="md" icon={<FolderPlus size={14} />} onClick={onCreateFolder}>Create Folder</Button>
        <Button variant="primary" size="md" icon={<Upload size={14} />} onClick={onUpload}>Upload Files</Button>
      </div>
    </div>
  );
}
