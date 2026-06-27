// components/collections/CollectionDrawer.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Star, Music2, BarChart3, Info,
  GripVertical, Trash2, Plus, TrendingUp, DollarSign, Play, ShoppingCart,
} from "lucide-react";
import type { CollectionDetail, CollectionTrack } from "@/services/collections/types";
import { MOCK_COLLECTION_DETAILS } from "@/services/collections/mock-data";
import Button from "@/components/ui/Button";

type Tab = "overview" | "tracks" | "performance";

interface CollectionDrawerProps {
  collectionId: string | null;
  onClose: () => void;
  onEdit: (id: string) => void;
}

export default function CollectionDrawer({ collectionId, onClose, onEdit }: CollectionDrawerProps) {
  const [detail, setDetail] = useState<CollectionDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [tracks, setTracks] = useState<CollectionTrack[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);


  useEffect(() => {
    if (!collectionId) { setDetail(null); return; }
    setLoading(true);
    setActiveTab("overview");
    setTimeout(() => {
      const data = MOCK_COLLECTION_DETAILS[collectionId] ?? null;
      setDetail(data);
      setTracks(data?.tracks ?? []);
      setLoading(false);
    }, 300);
  }, [collectionId]);

  const isPublished = detail?.status === "PUBLISHED";

  const handleDragStart = (i: number) => setDragIndex(i);
  const handleDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === i) return;
    const next = [...tracks];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(i, 0, moved);
    setDragIndex(i);
    setTracks(next);
  };
  const handleDrop = () => setDragIndex(null);
  const removeTrack = (trackId: string) => setTracks(prev => prev.filter(t => t.trackId !== trackId));

  return (
    <AnimatePresence>
      {collectionId && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[400] backdrop-blur-sm"
          />

          <motion.aside
            key="drawer"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-0 right-0 bottom-0 w-[480px] bg-surface border-l border-[color:var(--border-subtle)] z-[401] flex flex-col overflow-hidden"
          >
            {loading || !detail ? (
              <DrawerSkeleton onClose={onClose} />
            ) : (
              <>
                {/* Header */}
                <div className="px-6 pt-5 pb-0 border-b border-[color:var(--border-subtle)] shrink-0">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-lg font-bold text-foreground m-0 tracking-[-0.02em] truncate">
                          {detail.title}
                        </h2>
                        {detail.isFeatured && <Star size={14} fill="#a855f7" className="text-accent shrink-0" />}
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className={`text-[11px] font-semibold rounded-[10px] px-2 py-0.5 ${isPublished ? "bg-success/20 text-success" : "bg-[color:var(--color-warning)]/20 text-[color:var(--color-warning)]"}`}>
                          {isPublished ? "Published" : "Draft"}
                        </span>
                        <span className="text-xs text-[color:var(--text-muted)]">{detail.totalTracks} tracks</span>
                      </div>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <Button variant="secondary" size="sm" onClick={() => onEdit(detail.id)}>Edit</Button>
                      <Button variant="ghost" size="sm" icon={<X size={14} />} onClick={onClose} className="!w-8 !h-8 !p-0" />
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex gap-0">
                    {(["overview", "tracks", "performance"] as Tab[]).map(tab => (
                      <TabBtn key={tab} tab={tab} active={activeTab === tab} onClick={() => setActiveTab(tab)} />
                    ))}
                  </div>
                </div>

                {/* Tab content */}
                <div className="flex-1 overflow-y-auto px-6 pt-5 pb-8">
                  {activeTab === "overview" && <OverviewTab detail={detail} />}
                  {activeTab === "tracks" && (
                    <TracksTab
                      tracks={tracks}
                      onDragStart={handleDragStart}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onRemove={removeTrack}
                    />
                  )}
                  {activeTab === "performance" && <PerformanceTab detail={detail} />}
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Tab button ────────────────────────────────────────────────────

function TabBtn({ tab, active, onClick }: { tab: string; active: boolean; onClick: () => void }) {
  const icons: Record<string, React.ReactNode> = {
    overview: <Info size={13} />, tracks: <Music2 size={13} />, performance: <BarChart3 size={13} />,
  };
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium bg-transparent border-0 cursor-pointer capitalize transition-colors border-b-2 ${active ? "text-accent border-accent" : "text-[color:var(--text-muted)] border-transparent hover:text-foreground"}`}
    >
      {icons[tab]} {tab}
    </button>
  );
}

// ── Overview Tab ──────────────────────────────────────────────────

function OverviewTab({ detail }: { detail: CollectionDetail }) {
  return (
    <div className="flex flex-col gap-5">
      {detail.coverImage && (
        <img src={detail.coverImage} alt={detail.title} className="w-full rounded-[10px] object-cover aspect-[16/9]" />
      )}
      <Field label="Title" value={detail.title} />
      <Field label="Description" value={detail.description} />
      <Field label="Status" value={detail.status} />
      <Field label="Featured" value={detail.isFeatured ? "Yes" : "No"} />
      <Field label="Created" value={new Date(detail.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} />
      <Field label="Last updated" value={new Date(detail.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} />
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] font-semibold text-[color:var(--text-muted)] uppercase tracking-[0.06em] mb-1">{label}</div>
      <div className="text-sm text-foreground">{value}</div>
    </div>
  );
}

// ── Tracks Tab ────────────────────────────────────────────────────

function TracksTab({ tracks, onDragStart, onDragOver, onDrop, onRemove }: {
  tracks: CollectionTrack[];
  onDragStart: (i: number) => void;
  onDragOver: (e: React.DragEvent, i: number) => void;
  onDrop: () => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-[color:var(--text-muted)]">{tracks.length} tracks · drag to reorder</span>
        <Button variant="secondary" size="sm" icon={<Plus size={13} />} onClick={() => { }}>Add Track</Button>
      </div>

      {tracks.length === 0 ? (
        <div className="text-center py-10 text-[color:var(--text-muted)] text-sm">No tracks in this collection yet.</div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {tracks.map((ct, i) => (
            <div
              key={ct.id}
              draggable
              onDragStart={() => onDragStart(i)}
              onDragOver={e => onDragOver(e, i)}
              onDrop={onDrop}
              className="flex items-center gap-2.5 px-3 py-2.5 bg-elevated border border-[color:var(--border-subtle)] rounded-[10px] cursor-grab transition-colors hover:border-[color:var(--border-default)]"
            >
              <GripVertical size={14} className="text-[#31386d] shrink-0" />
              <span className="text-xs text-[#31386d] w-[18px] text-center shrink-0">{i + 1}</span>
              <img src={ct.track.coverImage} alt={ct.track.title} className="w-9 h-9 rounded-[6px] object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-foreground truncate">{ct.track.title}</div>
                <div className="text-[11px] text-[color:var(--text-muted)]">{ct.track.artist} · {ct.track.genre}</div>
              </div>
              <span className="text-[11px] text-[color:var(--text-muted)] shrink-0">{ct.track.duration}</span>
              <button
                onClick={() => onRemove(ct.trackId)}
                className="w-7 h-7 flex items-center justify-center bg-danger/10 border border-danger/20 rounded-[8px] cursor-pointer text-danger hover:bg-danger/20 transition-colors shrink-0"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Performance Tab ───────────────────────────────────────────────

function PerformanceTab({ detail }: { detail: CollectionDetail }) {
  const conversionRate = detail.totalPlays > 0
    ? ((detail.totalSales / detail.totalPlays) * 100).toFixed(2)
    : "0.00";

  return (
    <div className="grid grid-cols-2 gap-3">
      <PerfCard icon={<Play size={18} />} label="Total Plays" value={detail.totalPlays.toLocaleString()} color="#06b6d4" />
      <PerfCard icon={<ShoppingCart size={18} />} label="Total Sales" value={detail.totalSales.toString()} color="#a855f7" />
      <PerfCard icon={<DollarSign size={18} />} label="Total Revenue" value={`$${detail.totalRevenue.toLocaleString()}`} color="#10b981" />
      <PerfCard icon={<TrendingUp size={18} />} label="Conversion" value={`${conversionRate}%`} color="#f59e0b" />
    </div>
  );
}

function PerfCard({ icon, label, value, color }: {
  icon: React.ReactNode; label: string; value: string; color: string;
}) {
  return (
    <div className="bg-elevated border border-[color:var(--border-subtle)] rounded-[10px] p-4 flex flex-col gap-2.5">
      <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ background: `${color}18`, color }}>
        {icon}
      </div>
      <div>
        <div className="text-xl font-bold text-foreground tracking-[-0.02em]">{value}</div>
        <div className="text-[11px] text-[color:var(--text-muted)] mt-0.5">{label}</div>
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────

function DrawerSkeleton({ onClose }: { onClose: () => void }) {
  return (
    <div className="p-6">
      <div className="flex justify-end mb-5">
        <Button variant="ghost" size="sm" icon={<X size={14} />} onClick={onClose} className="!w-8 !h-8 !p-0" />
      </div>
      {[180, 20, 12, 12, 12].map((h, i) => (
        <div
          key={i}
          className="animate-pulse bg-elevated rounded-[8px] mb-3.5"
          style={{ height: h, width: i === 0 ? "100%" : `${90 - i * 10}%` }}
        />
      ))}
    </div>
  );
}
