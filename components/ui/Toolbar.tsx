// components/ui/Toolbar.tsx
"use client";

import { Search, ChevronDown, LayoutGrid, List, Table2, Calendar } from "lucide-react";

// ── Root ─────────────────────────────────────────────────────────────────────

function ToolbarRoot({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 flex-wrap bg-surface border border-[color:var(--border-subtle)] rounded-[10px] px-4 py-3.5">
      {children}
    </div>
  );
}

// ── Search ────────────────────────────────────────────────────────────────────

interface SearchProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}

function ToolbarSearch({ value, onChange, placeholder = "Search...", className = "" }: SearchProps) {
  return (
    <div className={`relative flex-1 min-w-44 ${className}`}>
      <Search
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)] pointer-events-none"
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-[10px] text-foreground text-sm pl-9 pr-3 py-2.5 outline-none transition-colors focus:border-accent placeholder:text-[color:var(--text-muted)]"
      />
    </div>
  );
}

// ── Select / filter dropdown ──────────────────────────────────────────────────

interface SelectProps<T extends string = string> {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  className?: string;
}

function ToolbarSelect<T extends string = string>({
  value,
  onChange,
  options,
  className = "",
}: SelectProps<T>) {
  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <select
        value={value}
        onChange={e => onChange(e.target.value as T)}
        className="appearance-none bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-[10px] text-foreground text-sm pl-3 pr-8 py-2.5 cursor-pointer outline-none transition-colors focus:border-accent [&>option]:bg-surface font-medium"
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown
        size={13}
        className="absolute right-2.5 text-[color:var(--text-muted)] pointer-events-none"
      />
    </div>
  );
}

// ── Date input ────────────────────────────────────────────────────────────────

interface DateInputProps {
  value: string;
  onChange: (v: string) => void;
  className?: string;
}

function ToolbarDateInput({ value, onChange, className = "" }: DateInputProps) {
  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <Calendar
        size={13}
        className="absolute left-2.5 text-[color:var(--text-muted)] pointer-events-none"
      />
      <input
        type="date"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-[10px] text-foreground text-sm pl-8 pr-2.5 py-2.5 outline-none transition-colors focus:border-accent w-36 [color-scheme:dark]"
      />
    </div>
  );
}

// ── Checkbox filter ───────────────────────────────────────────────────────────

interface CheckboxProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}

function ToolbarCheckbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="w-3.5 h-3.5 rounded-[10px] cursor-pointer accent-[color:var(--accent-purple)]"
      />
      <span className="text-sm text-[color:var(--text-muted)]">{label}</span>
    </label>
  );
}

// ── Count label ───────────────────────────────────────────────────────────────

interface CountProps {
  n: number;
  label: string; // singular — "track", "artist", "genre"
}

function ToolbarCount({ n, label }: CountProps) {
  return (
    <span className="text-xs text-[color:var(--text-muted)] whitespace-nowrap">
      {n.toLocaleString()} {label}{n !== 1 ? "s" : ""}
    </span>
  );
}

// ── Spacer ────────────────────────────────────────────────────────────────────

function ToolbarSpacer() {
  return <div className="ml-auto" />;
}

// ── Divider ───────────────────────────────────────────────────────────────────

function ToolbarDivider() {
  return <div className="w-px h-5 bg-[color:var(--border-subtle)] flex-shrink-0" />;
}

// ── View toggle ───────────────────────────────────────────────────────────────

const VIEW_ICONS: Record<string, React.ReactNode> = {
  grid: <LayoutGrid size={14} />,
  card: <LayoutGrid size={14} />,
  table: <List size={14} />,
  list: <List size={14} />,
  rows: <Table2 size={14} />,
};

interface ViewToggleProps<T extends string> {
  value: T;
  onChange: (v: T) => void;
  // Pass the view keys in order, e.g. ["grid","table"] or ["card","table"]
  options: T[];
  labels?: Partial<Record<string, string>>;
}

function ToolbarViewToggle<T extends string>({
  value,
  onChange,
  options,
  labels = {},
}: ViewToggleProps<T>) {
  return (
    <div className="flex bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-[10px] p-[3px] gap-0.5">
      {options.map(v => (
        <button
          key={v}
          onClick={() => onChange(v)}
          title={labels[v] ?? v}
          className={`w-8 h-8 rounded-[10px] flex items-center justify-center border-0 cursor-pointer transition-colors
            ${value === v
              ? "bg-elevated text-foreground"
              : "bg-transparent text-[color:var(--text-muted)] hover:text-foreground"
            }`}
        >
          {VIEW_ICONS[v] ?? <LayoutGrid size={14} />}
        </button>
      ))}
    </div>
  );
}

// ── Compound export ───────────────────────────────────────────────────────────

const Toolbar = Object.assign(ToolbarRoot, {
  Search: ToolbarSearch,
  Select: ToolbarSelect,
  DateInput: ToolbarDateInput,
  Checkbox: ToolbarCheckbox,
  Count: ToolbarCount,
  Spacer: ToolbarSpacer,
  Divider: ToolbarDivider,
  ViewToggle: ToolbarViewToggle,
});

export default Toolbar;
