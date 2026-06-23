// components/lyrics/RichTextEditor.tsx

"use client";

import { useRef, useEffect } from "react";
import { Bold, Italic, Underline, Save } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSave?: () => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({ value, onChange, onSave, placeholder, className }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Derived synchronously — no state needed, so no setState-in-effect lint hit.
  const text = value || "";
  const wordCount = text.trim() ? text.split(/\s+/).length : 0;
  const readingTime = Math.ceil(wordCount / 180);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        onSave?.();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onSave]);

  const insertText = (prefix: string, suffix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + prefix + selectedText + suffix + value.substring(end);
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      const newStart = start + prefix.length;
      const newEnd = newStart + selectedText.length;
      textarea.setSelectionRange(newStart, newEnd);
    }, 0);
  };

  return (
    <div className={`border border-[color:var(--border-subtle)] rounded-xl overflow-hidden bg-[color:var(--bg-input)] ${className || ""}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-[color:var(--border-subtle)] bg-elevated/30 flex-wrap">
        <button
          onClick={() => insertText("**", "**")}
          className="p-1.5 rounded hover:bg-elevated text-[color:var(--text-muted)] hover:text-foreground transition-colors"
          title="Bold (Ctrl+B)"
        >
          <Bold size={14} />
        </button>
        <button
          onClick={() => insertText("*", "*")}
          className="p-1.5 rounded hover:bg-elevated text-[color:var(--text-muted)] hover:text-foreground transition-colors"
          title="Italic (Ctrl+I)"
        >
          <Italic size={14} />
        </button>
        <button
          onClick={() => insertText("__", "__")}
          className="p-1.5 rounded hover:bg-elevated text-[color:var(--text-muted)] hover:text-foreground transition-colors"
          title="Underline (Ctrl+U)"
        >
          <Underline size={14} />
        </button>

        <div className="w-px h-6 bg-[color:var(--border-subtle)] mx-1" />

        <button
          onClick={() => insertText("[Verse 1]\n", "\n")}
          className="px-2 py-0.5 text-[10px] font-semibold text-[color:var(--text-muted)] hover:text-foreground rounded hover:bg-elevated transition-colors"
        >
          Verse
        </button>
        <button
          onClick={() => insertText("[Chorus]\n", "\n")}
          className="px-2 py-0.5 text-[10px] font-semibold text-[color:var(--text-muted)] hover:text-foreground rounded hover:bg-elevated transition-colors"
        >
          Chorus
        </button>
        <button
          onClick={() => insertText("[Bridge]\n", "\n")}
          className="px-2 py-0.5 text-[10px] font-semibold text-[color:var(--text-muted)] hover:text-foreground rounded hover:bg-elevated transition-colors"
        >
          Bridge
        </button>

        <div className="w-px h-6 bg-[color:var(--border-subtle)] mx-1" />

        {onSave && (
          <button
            onClick={onSave}
            className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-lg bg-accent/10 text-accent text-xs font-semibold hover:bg-accent/20 transition-colors"
          >
            <Save size={12} />
            Save
          </button>
        )}
      </div>

      {/* Editor */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || "Write lyrics here..."}
        className="w-full min-h-[300px] p-4 bg-transparent text-foreground text-sm leading-relaxed outline-none resize-y font-inherit placeholder:text-[color:var(--text-muted)]"
        style={{ fontFamily: "monospace" }}
      />

      {/* Footer stats */}
      <div className="flex items-center gap-4 px-4 py-2 border-t border-[color:var(--border-subtle)] text-[10px] text-[color:var(--text-muted)]">
        <span>{wordCount} words</span>
        <span>•</span>
        <span>{readingTime} min read</span>
        <span className="ml-auto">
          {value ? `${value.split('\n').length} lines` : "Empty"}
        </span>
      </div>
    </div>
  );
}
