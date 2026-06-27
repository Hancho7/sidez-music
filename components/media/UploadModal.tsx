// components/media/UploadModal.tsx
"use client";

import { useState, useRef, useCallback } from "react";
import { X, Upload, CheckCircle2, AlertCircle, FileImage, Music2, FileText, Archive } from "lucide-react";
import Button from "@/components/ui/Button";

interface Props {
  open: boolean;
  onClose: () => void;
  onUploaded: (files: File[]) => void;
}

interface FileEntry {
  file: File;
  id: string;
  progress: number;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
}

function getFileIcon(mime: string) {
  if (mime.startsWith("image/")) return <FileImage size={16} className="text-accent" />;
  if (mime.startsWith("audio/")) return <Music2 size={16} className="text-[color:var(--accent-magenta)]" />;
  if (mime.includes("pdf") || mime.includes("document")) return <FileText size={16} className="text-[color:var(--color-warning)]" />;
  if (mime.includes("zip")) return <Archive size={16} className="text-success" />;
  return <FileText size={16} className="text-[color:var(--text-muted)]" />;
}

function fmtSize(bytes: number) {
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)} MB`;
  return `${(bytes / 1e3).toFixed(0)} KB`;
}

export default function UploadModal({ open, onClose, onUploaded }: Props) {
  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (files: File[]) => {
    const newEntries: FileEntry[] = files.map(f => ({
      file: f, id: `${f.name}-${Date.now()}-${Math.random()}`, progress: 0, status: "pending",
    }));
    setEntries(prev => [...prev, ...newEntries]);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  }, []);

  const handleUpload = async () => {
    if (entries.length === 0) return;
    setUploading(true);

    // Simulate progressive upload per file
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      if (entry.status !== "pending") continue;

      setEntries(prev => prev.map(e => e.id === entry.id ? { ...e, status: "uploading" } : e));

      // Simulate progress in 20% increments
      for (let p = 20; p <= 100; p += 20) {
        await new Promise(r => setTimeout(r, 120));
        setEntries(prev => prev.map(e => e.id === entry.id ? { ...e, progress: p } : e));
      }

      setEntries(prev => prev.map(e => e.id === entry.id ? { ...e, status: "done", progress: 100 } : e));
    }

    setUploading(false);
    onUploaded(entries.map(e => e.file));
    setTimeout(() => { setEntries([]); onClose(); }, 800);
  };

  const removeEntry = (id: string) => setEntries(prev => prev.filter(e => e.id !== id));

  if (!open) return null;

  const pendingCount = entries.filter(e => e.status === "pending").length;
  const doneCount = entries.filter(e => e.status === "done").length;

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/65 z-[390] backdrop-blur-sm" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(580px,95vw)] max-h-[85vh] bg-surface border border-[#31386d] rounded-[20px] z-[400] flex flex-col shadow-[0_24px_80px_rgba(0,0,0,0.6)]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[color:var(--border-subtle)] shrink-0">
          <div>
            <p className="text-[17px] font-bold text-foreground">Upload Files</p>
            <p className="text-xs text-[color:var(--text-muted)] mt-0.5">Drag and drop or click to browse</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg border-0 bg-transparent cursor-pointer flex items-center justify-center text-[color:var(--text-muted)] hover:bg-elevated hover:text-foreground transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={[
            "mx-6 my-4 border-2 border-dashed rounded-2xl py-10 flex flex-col items-center gap-3 cursor-pointer transition-all",
            dragging ? "border-accent bg-accent/5" : "border-[color:var(--border-default)] hover:border-accent hover:bg-accent/5",
          ].join(" ")}
        >
          <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center">
            <Upload size={24} className="text-accent" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">Drop files here or click to browse</p>
            <p className="text-xs text-[color:var(--text-muted)] mt-1">Images, audio, video, ZIP, PDF — max 2 GB per file</p>
          </div>
          <input ref={inputRef} type="file" multiple className="hidden" onChange={e => addFiles(Array.from(e.target.files ?? []))} />
        </div>

        {/* File list */}
        {entries.length > 0 && (
          <div className="flex-1 overflow-y-auto px-6 pb-2 flex flex-col gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[color:var(--text-muted)] mb-1">
              {entries.length} file{entries.length > 1 ? "s" : ""} queued · {doneCount} uploaded
            </p>
            {entries.map(entry => (
              <div key={entry.id} className="flex items-center gap-3 bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-3">
                <div className="w-8 h-8 rounded-lg bg-elevated flex items-center justify-center shrink-0">
                  {getFileIcon(entry.file.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{entry.file.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-[color:var(--text-muted)]">{fmtSize(entry.file.size)}</span>
                    {entry.status === "uploading" && (
                      <div className="flex-1 h-1 rounded-full bg-elevated overflow-hidden max-w-[120px]">
                        <div className="h-full rounded-full bg-accent transition-all duration-200" style={{ width: `${entry.progress}%` }} />
                      </div>
                    )}
                    {entry.status === "uploading" && <span className="text-[11px] text-accent">{entry.progress}%</span>}
                    {entry.status === "done" && <span className="text-[11px] text-success flex items-center gap-0.5"><CheckCircle2 size={10} /> Done</span>}
                    {entry.status === "error" && <span className="text-[11px] text-danger flex items-center gap-0.5"><AlertCircle size={10} /> {entry.error ?? "Error"}</span>}
                  </div>
                </div>
                {entry.status === "pending" && (
                  <button onClick={() => removeEntry(entry.id)} className="w-6 h-6 rounded-md flex items-center justify-center bg-transparent border-0 cursor-pointer text-[color:var(--text-muted)] hover:text-danger transition-colors shrink-0">
                    <X size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-[color:var(--border-subtle)] shrink-0">
          <Button onClick={onClose} variant="secondary" size="md">Cancel</Button>
          <Button onClick={handleUpload} variant="primary" size="md" loading={uploading} disabled={pendingCount === 0 || uploading} icon={<Upload size={14} />}>
            {uploading ? `Uploading ${doneCount + 1}/${entries.length}...` : `Upload ${pendingCount} file${pendingCount !== 1 ? "s" : ""}`}
          </Button>
        </div>
      </div>
    </>
  );
}
