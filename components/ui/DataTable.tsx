// components/ui/DataTable.tsx
"use client";

import { useState } from "react";

// ── Root ─────────────────────────────────────────────────────────────────────

interface TableRootProps {
  children: React.ReactNode;
  minWidth?: number;
  emptyState?: React.ReactNode;
  isEmpty?: boolean;
}

function TableRoot({ children, minWidth = 800, emptyState, isEmpty }: TableRootProps) {
  if (isEmpty && emptyState) return <>{emptyState}</>;
  return (
    <div className="bg-surface border border-[color:var(--border-subtle)] rounded-[10px] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" style={{ minWidth }}>
          {children}
        </table>
      </div>
    </div>
  );
}

// ── Header ────────────────────────────────────────────────────────────────────

function TableHeader({ children }: { children: React.ReactNode }) {
  return <thead><tr>{children}</tr></thead>;
}

// ── Col (header cell) ─────────────────────────────────────────────────────────

type Align = "left" | "center" | "right";

interface ColProps {
  children?: React.ReactNode;
  align?: Align;
  width?: number | string;
  className?: string;
}

const ALIGN_TH: Record<Align, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

function TableCol({ children, align = "left", width, className = "" }: ColProps) {
  return (
    <th
      className={`px-3.5 py-2.5 text-[10px] font-semibold tracking-widest uppercase text-[color:var(--text-muted)] border-b border-[color:var(--border-subtle)] whitespace-nowrap ${ALIGN_TH[align]} ${className}`}
      style={width !== undefined ? { width } : undefined}
    >
      {children}
    </th>
  );
}

function TableCheckboxCol({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <th className="w-10 pl-3.5 pr-0 py-2.5 border-b border-[color:var(--border-subtle)]">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-3.5 h-3.5 cursor-pointer accent-accent"
      />
    </th>
  );
}

function TableActionsCol() {
  return (
    <th className="px-3.5 py-2.5 text-[10px] font-semibold tracking-widest uppercase text-[color:var(--text-muted)] border-b border-[color:var(--border-subtle)] text-center whitespace-nowrap">
      Actions
    </th>
  );
}

// ── Body ──────────────────────────────────────────────────────────────────────

function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

// ── Row ───────────────────────────────────────────────────────────────────────

interface RowProps {
  children: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
  onHoverChange?: (hovered: boolean) => void;
  isHovered?: boolean;
}

function TableRow({ children, onClick, selected, onHoverChange, isHovered }: RowProps) {
  return (
    <tr
      onClick={onClick}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
      className={`transition-colors duration-100 ${onClick ? "cursor-pointer" : ""}
        ${selected ? "bg-accent/[0.06]" : isHovered ? "bg-elevated" : "bg-transparent"}`}
    >
      {children}
    </tr>
  );
}

// ── Cell ──────────────────────────────────────────────────────────────────────

interface CellProps {
  children?: React.ReactNode;
  align?: Align;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  colSpan?: number;
}

const ALIGN_TD: Record<Align, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

function TableCell({ children, align = "left", className = "", onClick, colSpan }: CellProps) {
  return (
    <td
      onClick={onClick}
      colSpan={colSpan}
      className={`px-3.5 py-3 border-b border-[color:var(--border-subtle)]/50 text-sm text-[color:var(--text-secondary)] ${ALIGN_TD[align]} ${className}`}
    >
      {children}
    </td>
  );
}

function TableCheckboxCell({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <td
      className="pl-3.5 pr-0 py-3 w-10 border-b border-[color:var(--border-subtle)]/50"
      onClick={e => { e.stopPropagation(); onChange(); }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-3.5 h-3.5 cursor-pointer accent-accent"
      />
    </td>
  );
}

// ── Actions cell + button ─────────────────────────────────────────────────────

function TableActionsCell({ children, visible }: { children: React.ReactNode; visible: boolean }) {
  return (
    <td
      className="px-3.5 py-3 border-b border-[color:var(--border-subtle)]/50 text-center"
      onClick={e => e.stopPropagation()}
    >
      <div className={`flex items-center justify-center gap-0.5 transition-opacity duration-150 ${visible ? "opacity-100" : "opacity-0"}`}>
        {children}
      </div>
    </td>
  );
}

interface ActionBtnProps {
  onClick: (e: React.MouseEvent) => void;
  icon: React.ReactNode;
  danger?: boolean;
  title?: string;
  disabled?: boolean;
}

function TableActionBtn({ onClick, icon, danger = false, title, disabled }: ActionBtnProps) {
  return (
    <button
      onClick={e => { e.stopPropagation(); onClick(e); }}
      title={title}
      disabled={disabled}
      className={`w-7 h-7 rounded-[10px] flex items-center justify-center border-0 bg-transparent cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed
        ${danger
          ? "text-[color:var(--text-muted)] hover:bg-danger/10 hover:text-danger"
          : "text-[color:var(--text-muted)] hover:bg-elevated hover:text-foreground"
        }`}
    >
      {icon}
    </button>
  );
}

// ── Shared chips / badges used across tables ──────────────────────────────────

interface StatusBadgeProps {
  label: string;
  variant: "success" | "warning" | "danger" | "muted" | "purple" | "cyan";
  dot?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

const BADGE_CLASSES: Record<StatusBadgeProps["variant"], string> = {
  success: "bg-success/10 text-success",
  warning: "bg-[color:var(--color-warning)]/10 text-[color:var(--color-warning)]",
  danger: "bg-danger/10 text-danger",
  muted: "bg-white/10 text-white/50",
  purple: "bg-accent/10 text-[color:var(--accent-magenta)]",
  cyan: "bg-accent-cyan/10 text-accent-cyan",
};

function StatusBadge({ label, variant, dot = true, onClick }: StatusBadgeProps) {
  const Tag = onClick ? "button" : "span";
  return (
    <Tag
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[10px] text-[10px] font-semibold border-0 ${BADGE_CLASSES[variant]} ${onClick ? "cursor-pointer" : ""}`}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-[10px] bg-current" />}
      {label}
    </Tag>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  message?: string;
}

function TableEmptyState({ icon, title, message }: EmptyStateProps) {
  return (
    <div className="bg-surface border border-[color:var(--border-subtle)] rounded-[10px] py-20 flex flex-col items-center gap-4 text-center px-8">
      <div className="w-14 h-14 rounded-[10px] bg-accent/10 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-base font-bold text-foreground mb-1">{title}</p>
        {message && <p className="text-sm text-[color:var(--text-muted)]">{message}</p>}
      </div>
    </div>
  );
}

// ── Row-level hover hook convenience ─────────────────────────────────────────
// Export so pages can use it directly when they manage hover themselves.
export function useHoveredRow() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  return { hoveredId, setHoveredId };
}

// ── Compound export ───────────────────────────────────────────────────────────

const DataTable = Object.assign(TableRoot, {
  Header: TableHeader,
  Col: TableCol,
  CheckboxCol: TableCheckboxCol,
  ActionsCol: TableActionsCol,
  Body: TableBody,
  Row: TableRow,
  Cell: TableCell,
  CheckboxCell: TableCheckboxCell,
  ActionsCell: TableActionsCell,
  ActionBtn: TableActionBtn,
  StatusBadge,
  EmptyState: TableEmptyState,
});

export default DataTable;
