// components/content/PagesWorkspace.tsx
"use client";

import { Eye, Pencil, Archive, Layout, ExternalLink } from "lucide-react";
import DataTable, { useHoveredRow } from "@/components/ui/DataTable";
import type { ContentItem, ContentStatus } from "@/services/content/types";

interface Props {
  pages: ContentItem[];
  onRowClick: (p: ContentItem) => void;
  onEdit: (p: ContentItem) => void;
  onArchive: (p: ContentItem) => void;
}

const STATUS_VARIANT: Record<ContentStatus, "success" | "warning" | "cyan" | "muted"> = {
  published: "success", draft: "warning", scheduled: "cyan", archived: "muted",
};

function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const CATEGORY_CLASSES: Record<string, string> = {
  Core: "bg-accent/10 text-accent",
  Legal: "bg-[color:var(--text-muted)]/10 text-[color:var(--text-muted)]",
};

export default function PagesWorkspace({ pages, onRowClick, onEdit, onArchive }: Props) {
  const { hoveredId, setHoveredId } = useHoveredRow();

  return (
    <DataTable
      isEmpty={pages.length === 0}
      emptyState={
        <DataTable.EmptyState
          icon={<Layout size={22} className="text-accent" />}
          title="No pages yet"
          message="Create static pages for your About, Contact, Terms, and other content."
        />
      }
    >
      <DataTable.Header>
        <DataTable.Col>Page</DataTable.Col>
        <DataTable.Col>Category</DataTable.Col>
        <DataTable.Col>Status</DataTable.Col>
        <DataTable.Col>Published</DataTable.Col>
        <DataTable.Col align="right">Views</DataTable.Col>
        <DataTable.Col align="center">SEO</DataTable.Col>
        <DataTable.Col>Last Updated</DataTable.Col>
        <DataTable.ActionsCol />
      </DataTable.Header>

      <DataTable.Body>
        {pages.map(p => {
          const isHovered = hoveredId === p.id;
          const seoScore = p.seoScore;
          const seoColor = seoScore >= 80 ? "text-success" : seoScore >= 50 ? "text-[color:var(--color-warning)]" : "text-danger";

          return (
            <DataTable.Row key={p.id} onClick={() => onRowClick(p)} isHovered={isHovered} onHoverChange={h => setHoveredId(h ? p.id : null)}>
              <DataTable.Cell>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-elevated flex items-center justify-center shrink-0 border border-[color:var(--border-subtle)]">
                    <Layout size={13} className="text-[color:var(--text-muted)]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate max-w-[200px]">{p.title}</p>
                    <p className="text-[11px] font-mono text-[color:var(--text-muted)]">/{p.slug}</p>
                  </div>
                </div>
              </DataTable.Cell>
              <DataTable.Cell>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${CATEGORY_CLASSES[p.category] ?? "bg-elevated text-[color:var(--text-muted)]"}`}>
                  {p.category}
                </span>
              </DataTable.Cell>
              <DataTable.Cell>
                <DataTable.StatusBadge label={p.status.charAt(0).toUpperCase() + p.status.slice(1)} variant={STATUS_VARIANT[p.status]} />
              </DataTable.Cell>
              <DataTable.Cell className="text-xs text-[color:var(--text-muted)] whitespace-nowrap">{fmtDate(p.publishedAt)}</DataTable.Cell>
              <DataTable.Cell align="right" className="text-sm font-semibold text-foreground tabular-nums">
                {p.views > 0 ? p.views.toLocaleString() : "—"}
              </DataTable.Cell>
              <DataTable.Cell align="center">
                {seoScore > 0 ? <span className={`text-xs font-bold ${seoColor}`}>{seoScore}</span> : <span className="text-[color:var(--text-muted)] text-xs">—</span>}
              </DataTable.Cell>
              <DataTable.Cell className="text-xs text-[color:var(--text-muted)] whitespace-nowrap">{fmtDate(p.updatedAt)}</DataTable.Cell>
              <DataTable.ActionsCell visible={isHovered}>
                <DataTable.ActionBtn onClick={() => onRowClick(p)} icon={<Eye size={13} />} title="View" />
                <DataTable.ActionBtn onClick={() => onEdit(p)} icon={<Pencil size={13} />} title="Edit" />
                <DataTable.ActionBtn onClick={() => window.open(`/${p.slug}`, "_blank")} icon={<ExternalLink size={13} />} title="Preview" />
                <DataTable.ActionBtn onClick={() => onArchive(p)} icon={<Archive size={13} />} title="Archive" danger />
              </DataTable.ActionsCell>
            </DataTable.Row>
          );
        })}
      </DataTable.Body>
    </DataTable>
  );
}
