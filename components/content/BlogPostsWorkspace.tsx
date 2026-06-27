// components/content/BlogPostsWorkspace.tsx
"use client";

import { Eye, Pencil, Copy, Archive, FileText, Star } from "lucide-react";
import DataTable, { useHoveredRow } from "@/components/ui/DataTable";
import Card from "@/components/ui/Card";
import type { ContentItem, ContentStatus } from "@/services/content/types";

interface Props {
  posts: ContentItem[];
  view: "table" | "cards";
  onRowClick: (p: ContentItem) => void;
  onEdit: (p: ContentItem) => void;
  onDuplicate: (p: ContentItem) => void;
  onArchive: (p: ContentItem) => void;
}

const STATUS_VARIANT: Record<ContentStatus, "success" | "warning" | "cyan" | "muted"> = {
  published: "success",
  draft: "warning",
  scheduled: "cyan",
  archived: "muted",
};

const STATUS_LABEL: Record<ContentStatus, string> = {
  published: "Published", draft: "Draft", scheduled: "Scheduled", archived: "Archived",
};

function seoColor(score: number) {
  if (score >= 80) return "text-success";
  if (score >= 50) return "text-[color:var(--color-warning)]";
  return "text-danger";
}

function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getInitials(name: string) {
  return name.split(" ").map(p => p[0]).join("").toUpperCase().slice(0, 2);
}

// ── Table view ───────────────────────────────────────────────────

function BlogTable({ posts, onRowClick, onEdit, onDuplicate, onArchive }: Props) {
  const { hoveredId, setHoveredId } = useHoveredRow();

  return (
    <DataTable
      isEmpty={posts.length === 0}
      emptyState={
        <DataTable.EmptyState
          icon={<FileText size={22} className="text-accent" />}
          title="No blog posts yet"
          message="Create your first article to start building your content library."
        />
      }
    >
      <DataTable.Header>
        <DataTable.Col>Post</DataTable.Col>
        <DataTable.Col>Category</DataTable.Col>
        <DataTable.Col>Author</DataTable.Col>
        <DataTable.Col>Status</DataTable.Col>
        <DataTable.Col>Published</DataTable.Col>
        <DataTable.Col align="right">Views</DataTable.Col>
        <DataTable.Col align="center">SEO</DataTable.Col>
        <DataTable.ActionsCol />
      </DataTable.Header>

      <DataTable.Body>
        {posts.map(p => {
          const isHovered = hoveredId === p.id;
          return (
            <DataTable.Row key={p.id} onClick={() => onRowClick(p)} isHovered={isHovered} onHoverChange={h => setHoveredId(h ? p.id : null)}>
              <DataTable.Cell>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-elevated flex items-center justify-center shrink-0 border border-[color:var(--border-subtle)] overflow-hidden">
                    {p.featuredImage
                      ? <img src={p.featuredImage} alt={p.title} className="w-full h-full object-cover" />
                      : <FileText size={14} className="text-[color:var(--text-muted)]" />
                    }
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate max-w-[220px]">{p.title}</p>
                    <p className="text-[11px] font-mono text-[color:var(--text-muted)] truncate max-w-[220px]">/{p.slug}</p>
                  </div>
                </div>
              </DataTable.Cell>
              <DataTable.Cell><span className="text-xs text-[color:var(--text-secondary)]">{p.category}</span></DataTable.Cell>
              <DataTable.Cell>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-[9px] font-bold text-accent shrink-0">
                    {getInitials(p.author)}
                  </div>
                  <span className="text-xs text-[color:var(--text-secondary)]">{p.author}</span>
                </div>
              </DataTable.Cell>
              <DataTable.Cell>
                <DataTable.StatusBadge label={STATUS_LABEL[p.status]} variant={STATUS_VARIANT[p.status]} />
              </DataTable.Cell>
              <DataTable.Cell className="text-xs text-[color:var(--text-muted)] whitespace-nowrap">
                {p.status === "scheduled" ? `Scheduled ${fmtDate(p.scheduledAt)}` : fmtDate(p.publishedAt)}
              </DataTable.Cell>
              <DataTable.Cell align="right" className="text-sm font-semibold text-foreground tabular-nums">
                {p.views > 0 ? p.views.toLocaleString() : "—"}
              </DataTable.Cell>
              <DataTable.Cell align="center">
                {p.seoScore > 0
                  ? <span className={`text-xs font-bold ${seoColor(p.seoScore)}`}>{p.seoScore}</span>
                  : <span className="text-[color:var(--text-muted)] text-xs">—</span>
                }
              </DataTable.Cell>
              <DataTable.ActionsCell visible={isHovered}>
                <DataTable.ActionBtn onClick={() => onRowClick(p)} icon={<Eye size={13} />} title="View" />
                <DataTable.ActionBtn onClick={() => onEdit(p)} icon={<Pencil size={13} />} title="Edit" />
                <DataTable.ActionBtn onClick={() => onDuplicate(p)} icon={<Copy size={13} />} title="Duplicate" />
                <DataTable.ActionBtn onClick={() => onArchive(p)} icon={<Archive size={13} />} title="Archive" danger />
              </DataTable.ActionsCell>
            </DataTable.Row>
          );
        })}
      </DataTable.Body>
    </DataTable>
  );
}

// ── Card view ────────────────────────────────────────────────────

function BlogCard({ post, onRowClick, onEdit, onDuplicate, onArchive }: { post: ContentItem } & Pick<Props, "onRowClick" | "onEdit" | "onDuplicate" | "onArchive">) {
  return (
    <Card onClick={() => onRowClick(post)}>
      <Card.MediaBanner src={post.featuredImage} alt={post.title} aspectRatio="video"
        fallback={
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/10 to-accent-cyan/5">
            <FileText size={28} className="text-[color:var(--text-muted)]" />
          </div>
        }
      >
        <Card.StatusBadge status={post.status} position="absolute-tr" />
      </Card.MediaBanner>
      <Card.Body>
        <Card.CategoryPill label={post.category} color="purple" />
        <Card.Title>{post.title}</Card.Title>
        <Card.Meta className="line-clamp-2">{post.excerpt}</Card.Meta>
        <Card.Divider />
        <div className="flex items-center justify-between text-[11px] text-[color:var(--text-muted)]">
          <span>{post.author}</span>
          <span className={post.seoScore > 0 ? seoColor(post.seoScore) : ""}>{post.seoScore > 0 ? `SEO ${post.seoScore}` : "No SEO"}</span>
          <span>{post.views > 0 ? `${post.views.toLocaleString()} views` : "No views"}</span>
        </div>
        <Card.StandardActions
          onView={() => onRowClick(post)}
          onEdit={() => onEdit(post)}
          onDuplicate={() => onDuplicate(post)}
          onArchive={() => onArchive(post)}
        />
      </Card.Body>
    </Card>
  );
}

// ── Main export ──────────────────────────────────────────────────

export default function BlogPostsWorkspace(props: Props) {
  if (props.view === "table") return <BlogTable {...props} />;

  if (props.posts.length === 0) {
    return (
      <div className="bg-surface border border-[color:var(--border-subtle)] rounded-2xl py-20 text-center">
        <FileText size={32} className="mx-auto mb-3 text-[color:var(--text-muted)]" />
        <p className="text-base font-bold text-foreground mb-1">No blog posts yet</p>
        <p className="text-sm text-[color:var(--text-muted)]">Create your first article to start building your content library.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
      {props.posts.map(p => <BlogCard key={p.id} post={p} onRowClick={props.onRowClick} onEdit={props.onEdit} onDuplicate={props.onDuplicate} onArchive={props.onArchive} />)}
    </div>
  );
}
