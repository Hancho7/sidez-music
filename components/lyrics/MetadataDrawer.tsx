// components/lyrics/MetadataDrawer.tsx

"use client";

import { useState, useEffect } from "react";
import {
  X, Pencil, FileText, Users, Copyright, BookOpen, History,
  Clock, Globe, Music2, User, Mail, Calendar, Hash, Tag,
  CheckCircle, AlertCircle, Link as LinkIcon, Archive
} from "lucide-react";
import type { TrackMetadata, CreditRole } from "@/services/lyrics/types";
import { LANGUAGES, CREDIT_ROLES } from "@/services/lyrics/mock-data";
import RichTextEditor from "./RichTextEditor";

interface DrawerSaveData {
  lyrics?: string;
}

interface Props {
  metadata: TrackMetadata | null;
  onClose: () => void;
  onEdit: (metadata: TrackMetadata) => void;
  onSave: (data: DrawerSaveData) => void;
}

type Tab = "lyrics" | "credits" | "copyright" | "publishing" | "history";

const TAB_LIST: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "lyrics", label: "Lyrics", icon: <FileText size={13} /> },
  { key: "credits", label: "Credits", icon: <Users size={13} /> },
  { key: "copyright", label: "Copyright", icon: <Copyright size={13} /> },
  { key: "publishing", label: "Publishing", icon: <BookOpen size={13} /> },
  { key: "history", label: "History", icon: <History size={13} /> },
];

const ROLE_LABELS: Record<CreditRole, string> = {
  WRITER: "Writer",
  PRODUCER: "Producer",
  COMPOSER: "Composer",
  MIX_ENGINEER: "Mix Engineer",
  MASTERING_ENGINEER: "Mastering Engineer",
  PUBLISHER: "Publisher",
  LABEL: "Label",
  PERFORMER: "Performer",
};

function InfoRow({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-[color:var(--border-subtle)]/30">
      {icon && <span className="text-[color:var(--text-muted)] mt-0.5">{icon}</span>}
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-semibold tracking-widest uppercase text-[color:var(--text-muted)]">
          {label}
        </div>
        <div className="text-sm text-foreground mt-0.5 break-words">
          {value || "—"}
        </div>
      </div>
    </div>
  );
}

export default function MetadataDrawer({ metadata, onClose, onEdit, onSave }: Props) {
  // Initialise tab & lyrics directly from props to avoid setState-in-effect.
  const [tab, setTab] = useState<Tab>("lyrics");
  const [editedLyrics, setEditedLyrics] = useState(metadata?.lyrics.lyrics ?? "");

  // When the selected item changes, reset the tab and edited lyrics.
  // We drive the initial values from the prop rather than calling setState
  // inside the effect body by using a key-based reset pattern (see JSX below),
  // but we still need the effect to sync when metadata changes mid-session.
  useEffect(() => {
    if (metadata) {
      setTab("lyrics");
      setEditedLyrics(metadata.lyrics.lyrics);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metadata?.id]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!metadata) return null;

  const handleLyricsSave = () => {
    onSave({ lyrics: editedLyrics });
  };

  type HistoryEvent = {
    label: string;
    date: string;
    by: string;
    icon: React.ReactNode;
  };

  const historyEvents: HistoryEvent[] = [
    {
      label: "Created",
      date: metadata.createdAt,
      by: metadata.updatedBy,
      icon: <Clock size={13} className="text-[color:var(--text-muted)]" />,
    },
    {
      label: "Last Updated",
      date: metadata.updatedAt,
      by: metadata.updatedBy,
      icon: <FileText size={13} className="text-accent-cyan" />,
    },
    ...(metadata.publishedAt
      ? [{
        label: "Published",
        date: metadata.publishedAt,
        by: metadata.updatedBy,
        icon: <CheckCircle size={13} className="text-success" />,
      }]
      : []),
    ...(metadata.archivedAt
      ? [{
        label: "Archived",
        date: metadata.archivedAt,
        by: metadata.updatedBy,
        icon: <Archive size={13} className="text-[color:var(--text-muted)]" />,
      }]
      : []),
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[350]"
      />

      {/* Drawer */}
      <aside className="fixed top-0 right-0 bottom-0 w-[520px] max-w-[95vw] bg-surface border-l border-[color:var(--border-subtle)] z-[360] flex flex-col overflow-hidden">

        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[color:var(--border-subtle)] flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-elevated flex items-center justify-center flex-shrink-0 border border-[color:var(--border-subtle)]">
              {metadata.coverImage ? (
                <img src={metadata.coverImage} alt={metadata.trackName} className="w-full h-full object-cover" />
              ) : (
                <Music2 size={14} className="text-[color:var(--text-muted)]" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground truncate">{metadata.trackName}</span>
                <span className="text-[10px] font-medium text-[color:var(--text-muted)]">{metadata.status}</span>
              </div>
              <p className="text-xs text-[color:var(--text-muted)] truncate">{metadata.artistName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => onEdit(metadata)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[color:var(--border-default)] bg-transparent text-[color:var(--text-secondary)] text-xs font-semibold cursor-pointer transition-colors hover:bg-elevated hover:text-foreground"
            >
              <Pencil size={12} /> Edit
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-transparent border-0 cursor-pointer text-[color:var(--text-muted)] transition-colors hover:bg-elevated hover:text-foreground"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[color:var(--border-subtle)] px-5 flex-shrink-0 overflow-x-auto gap-0.5">
          {TAB_LIST.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-3 py-3 text-xs font-semibold whitespace-nowrap border-0 bg-transparent cursor-pointer transition-colors border-b-2 -mb-px
                ${tab === t.key
                  ? "text-accent border-accent"
                  : "text-[color:var(--text-muted)] border-transparent hover:text-foreground"
                }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">

          {/* LYRICS TAB */}
          {tab === "lyrics" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-[color:var(--text-muted)]">
                  <span>Language: {LANGUAGES.find(l => l.value === metadata.lyrics.language)?.label}</span>
                  <span>•</span>
                  <span>{metadata.lyrics.wordCount} words</span>
                  <span>•</span>
                  <span>{metadata.lyrics.readingTime} min read</span>
                </div>
                {metadata.lyrics.isSynchronized && (
                  <span className="text-[10px] font-semibold text-accent-cyan bg-accent-cyan/10 px-2 py-0.5 rounded-full">
                    Synced
                  </span>
                )}
              </div>

              <RichTextEditor
                value={editedLyrics}
                onChange={setEditedLyrics}
                onSave={handleLyricsSave}
                placeholder="No lyrics available for this track."
              />

              {/* Translated Lyrics */}
              {Object.keys(metadata.lyrics.translatedLyrics).length > 0 && (
                <div className="mt-4">
                  <div className="text-[10px] font-semibold tracking-widest uppercase text-[color:var(--text-muted)] mb-2">
                    Translations
                  </div>
                  {(Object.entries(metadata.lyrics.translatedLyrics) as [string, string][]).map(([lang, text]) => (
                    <div key={lang} className="p-3 bg-[color:var(--bg-input)] rounded-lg border border-[color:var(--border-subtle)] mb-2">
                      <div className="text-[10px] font-semibold text-accent-cyan mb-1">
                        {LANGUAGES.find(l => l.value === lang)?.label}
                      </div>
                      <div className="text-sm text-[color:var(--text-secondary)] whitespace-pre-wrap">
                        {text || "No translation available."}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CREDITS TAB */}
          {tab === "credits" && (
            <div className="flex flex-col gap-3">
              {metadata.credits.map(credit => {
                const roleLabel = ROLE_LABELS[credit.role] ?? credit.role;
                return (
                  <div
                    key={credit.id}
                    className="p-4 bg-[color:var(--bg-input)] rounded-xl border border-[color:var(--border-subtle)]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-sm font-semibold text-foreground">{credit.personName}</div>
                        <div className="text-xs text-[color:var(--text-muted)] mt-0.5">{roleLabel}</div>
                        {credit.email && (
                          <div className="flex items-center gap-1 mt-1 text-xs text-[color:var(--text-secondary)]">
                            <Mail size={11} />
                            {credit.email}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {credit.isPrimary && (
                          <span className="text-[10px] font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                            Primary
                          </span>
                        )}
                        {credit.royaltyShare !== undefined && (
                          <span className="text-[10px] text-[color:var(--text-muted)]">
                            {credit.royaltyShare}% royalty
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {metadata.credits.length === 0 && (
                <div className="text-center py-8 text-[color:var(--text-muted)]">
                  <Users size={24} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No credits assigned yet.</p>
                </div>
              )}
            </div>
          )}

          {/* COPYRIGHT TAB */}
          {tab === "copyright" && (
            <div className="flex flex-col gap-4">
              <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
                <div className="grid grid-cols-1 gap-2">
                  <InfoRow
                    label="Copyright Owner"
                    value={metadata.copyright.copyrightOwner}
                    icon={<User size={13} />}
                  />
                  <InfoRow
                    label="Copyright Notice"
                    value={metadata.copyright.copyrightNotice}
                    icon={<Copyright size={13} />}
                  />
                  <InfoRow
                    label="Publishing Rights"
                    value={metadata.copyright.publishingRights}
                    icon={<BookOpen size={13} />}
                  />
                  <InfoRow
                    label="Mechanical Rights"
                    value={metadata.copyright.mechanicalRights}
                    icon={<Music2 size={13} />}
                  />
                  <InfoRow
                    label="Publishing Organization"
                    value={metadata.copyright.publishingOrganization}
                    icon={<LinkIcon size={13} />}
                  />
                  <InfoRow
                    label="ISRC"
                    value={metadata.copyright.isrc}
                    icon={<Hash size={13} />}
                  />
                  {metadata.copyright.upc && (
                    <InfoRow
                      label="UPC"
                      value={metadata.copyright.upc}
                      icon={<Tag size={13} />}
                    />
                  )}
                  <InfoRow
                    label="Territory"
                    value={metadata.copyright.territory.join(", ")}
                    icon={<Globe size={13} />}
                  />
                </div>
              </div>
            </div>
          )}

          {/* PUBLISHING TAB */}
          {tab === "publishing" && (
            <div className="flex flex-col gap-4">
              <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
                <div className="grid grid-cols-1 gap-2">
                  <InfoRow
                    label="Release Date"
                    value={new Date(metadata.publishing.releaseDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                    icon={<Calendar size={13} />}
                  />
                  <InfoRow
                    label="Original Release"
                    value={new Date(metadata.publishing.originalReleaseDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                    icon={<Clock size={13} />}
                  />
                  <InfoRow
                    label="Status"
                    value={
                      <div className="flex items-center gap-2">
                        {metadata.publishing.isVisible ? (
                          <span className="text-success flex items-center gap-1">
                            <CheckCircle size={13} /> Published
                          </span>
                        ) : (
                          <span className="text-[color:var(--text-muted)] flex items-center gap-1">
                            <AlertCircle size={13} /> Unpublished
                          </span>
                        )}
                        {metadata.publishing.isFeatured && (
                          <span className="text-[color:var(--color-warning)] text-xs font-semibold bg-[color:var(--color-warning)]/10 px-2 py-0.5 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                    }
                  />
                  <InfoRow
                    label="Content Rating"
                    value={metadata.publishing.isExplicit ? (
                      <span className="text-danger font-semibold">Explicit</span>
                    ) : (
                      <span className="text-success font-semibold">Clean</span>
                    )}
                  />
                  <InfoRow
                    label="Editorial Notes"
                    value={metadata.publishing.editorialNotes}
                    icon={<FileText size={13} />}
                  />
                  <InfoRow
                    label="Preview"
                    value={`${metadata.publishing.previewStartTime}s - ${metadata.publishing.previewStartTime + metadata.publishing.previewDuration}s`}
                    icon={<Music2 size={13} />}
                  />
                </div>
              </div>
            </div>
          )}

          {/* HISTORY TAB */}
          {tab === "history" && (
            <div className="flex flex-col gap-3">
              {historyEvents.map((event, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 bg-[color:var(--bg-input)] rounded-xl border border-[color:var(--border-subtle)]"
                >
                  <div className="mt-0.5">{event.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground">{event.label}</span>
                      <span className="text-xs text-[color:var(--text-muted)]">
                        {new Date(event.date).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="text-xs text-[color:var(--text-muted)] mt-0.5">by {event.by}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
