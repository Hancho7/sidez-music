// components/ui/FieldStyles.ts
export const FIELD_CLASSES = [
  "w-full",
  "text-sm",
  "text-foreground",
  "bg-[color:var(--bg-input)]",
  "border border-[color:var(--border-subtle)]",
  "rounded-[10px]",
  "outline-none",
  "transition-colors",
  "focus:border-accent",
  "placeholder:text-[color:var(--text-muted)]",
].join(" ");

export const LABEL_CLASSES =
  "block mb-1.5 text-xs font-semibold text-[color:var(--text-secondary)]";

export const ERROR_CLASSES =
  "block mt-1 text-[11px] text-danger";
