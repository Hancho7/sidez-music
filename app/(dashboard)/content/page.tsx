// app/(dashboard)/content/page.tsx
"use client";

import { useState, useMemo } from "react";
import ContentHeader from "@/components/content/ContentHeader";
import WorkspaceTabs from "@/components/content/WorkspaceTabs";
import ContentToolbar from "@/components/content/ContentToolbar";
import BlogPostsWorkspace from "@/components/content/BlogPostsWorkspace";
import PagesWorkspace from "@/components/content/PagesWorkspace";
import HomepageWorkspace from "@/components/content/HomepageWorkspace";
import FAQWorkspace from "@/components/content/FAQWorkspace";
import AnnouncementsWorkspace from "@/components/content/AnnouncementsWorkspace";
import ContentDrawer from "@/components/content/ContentDrawer";
import {
  MOCK_BLOG_POSTS, MOCK_PAGES,
  MOCK_HOMEPAGE_SECTIONS, MOCK_FAQS, MOCK_ANNOUNCEMENTS,
} from "@/services/content/mock-data";
import type {
  ContentItem, ContentFilters, WorkspaceTab,
  HomepageSection, FAQ, Announcement,
} from "@/services/content/types";

const DEFAULT_FILTERS: ContentFilters = {
  search: "", status: "all", sort: "updated", view: "table",
};

function applyFilters(items: ContentItem[], f: ContentFilters): ContentItem[] {
  let list = [...items];

  if (f.search.trim()) {
    const q = f.search.toLowerCase();
    list = list.filter(i =>
      i.title.toLowerCase().includes(q) ||
      i.slug.toLowerCase().includes(q) ||
      i.author.toLowerCase().includes(q)
    );
  }

  if (f.status !== "all") list = list.filter(i => i.status === f.status);

  switch (f.sort) {
    case "published": list.sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "")); break;
    case "alpha": list.sort((a, b) => a.title.localeCompare(b.title)); break;
    default: list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  return list;
}

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("blog");
  const [filters, setFilters] = useState<ContentFilters>(DEFAULT_FILTERS);

  const [blogPosts, setBlogPosts] = useState<ContentItem[]>(MOCK_BLOG_POSTS);
  const [pages, setPages] = useState<ContentItem[]>(MOCK_PAGES);
  const [sections, setSections] = useState<HomepageSection[]>(MOCK_HOMEPAGE_SECTIONS);
  const [faqs, setFaqs] = useState<FAQ[]>(MOCK_FAQS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);

  const [drawerItem, setDrawerItem] = useState<ContentItem | null>(null);

  const filteredPosts = useMemo(() => applyFilters(blogPosts, filters), [blogPosts, filters]);
  const filteredPages = useMemo(() => applyFilters(pages, filters), [pages, filters]);

  const handleDuplicate = (item: ContentItem) => {
    const now = new Date().toISOString();
    const dupe: ContentItem = { ...item, id: `${item.id}-dupe-${Date.now()}`, title: `${item.title} (Copy)`, slug: `${item.slug}-copy`, status: "draft", publishedAt: null, views: 0, revisions: [], createdAt: now, updatedAt: now };
    if (item.type === "blog_post") setBlogPosts(p => [dupe, ...p]);
    else setPages(p => [dupe, ...p]);
  };

  const handleArchive = (item: ContentItem) => {
    const archive = (prev: ContentItem[]) => prev.map(i => i.id === item.id ? { ...i, status: "archived" as const, updatedAt: new Date().toISOString() } : i);
    if (item.type === "blog_post") setBlogPosts(archive);
    else setPages(archive);
    if (drawerItem?.id === item.id) setDrawerItem(prev => prev ? { ...prev, status: "archived" } : prev);
  };

  const showToolbar = activeTab === "blog" || activeTab === "pages";
  const currentTotal = activeTab === "blog" ? filteredPosts.length : filteredPages.length;

  const tabCounts: Record<WorkspaceTab, number> = {
    blog: blogPosts.filter(p => p.status === "draft" || p.status === "scheduled").length,
    pages: pages.filter(p => p.status === "draft").length,
    homepage: sections.filter(s => !s.enabled).length,
    faqs: faqs.filter(f => !f.published).length,
    announcements: announcements.filter(a => a.published).length,
  };

  return (
    <div className="flex flex-col gap-6">
      <ContentHeader onCreateContent={() => { }} />

      <div className="bg-surface border border-[color:var(--border-subtle)] rounded-2xl overflow-hidden">
        {/* Workspace tabs */}
        <div className="px-5 pt-4">
          <WorkspaceTabs active={activeTab} onChange={t => { setActiveTab(t); setFilters(DEFAULT_FILTERS); }} counts={tabCounts} />
        </div>

        {/* Toolbar — only for table-based tabs */}
        {showToolbar && (
          <div className="px-5 pt-4">
            <ContentToolbar
              filters={filters}
              onChange={patch => setFilters(prev => ({ ...prev, ...patch }))}
              total={currentTotal}
              label={activeTab === "blog" ? "post" : "page"}
            />
          </div>
        )}

        {/* Workspace body */}
        <div className="p-5">
          {activeTab === "blog" && (
            <BlogPostsWorkspace
              posts={filteredPosts}
              view={filters.view}
              onRowClick={setDrawerItem}
              onEdit={setDrawerItem}
              onDuplicate={handleDuplicate}
              onArchive={handleArchive}
            />
          )}

          {activeTab === "pages" && (
            <PagesWorkspace
              pages={filteredPages}
              onRowClick={setDrawerItem}
              onEdit={setDrawerItem}
              onArchive={handleArchive}
            />
          )}

          {activeTab === "homepage" && (
            <HomepageWorkspace sections={sections} onChange={setSections} />
          )}

          {activeTab === "faqs" && (
            <FAQWorkspace faqs={faqs} onChange={setFaqs} />
          )}

          {activeTab === "announcements" && (
            <AnnouncementsWorkspace announcements={announcements} onChange={setAnnouncements} />
          )}
        </div>
      </div>

      <ContentDrawer
        item={drawerItem}
        onClose={() => setDrawerItem(null)}
        onEdit={item => { setDrawerItem(null); console.log("Open editor for", item.id); }}
      />
    </div>
  );
}
