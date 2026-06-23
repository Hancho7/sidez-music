// components/artists/ArtistDrawer.tsx
"use client";

import { useState, useEffect } from "react";
import {
  X, Pencil, BadgeCheck, Star, Music2, Library, ShoppingCart,
  Download, TrendingUp, ExternalLink, Mail, Phone, Globe, Building2,
} from "lucide-react";
import type { Artist, SocialPlatform } from "@/services/artists/types";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

interface Props {
  artist: Artist | null;
  onClose: () => void;
  onEdit: (artist: Artist) => void;
}

type Tab = "profile" | "discography" | "collections" | "analytics" | "social";

const TAB_LIST: { key: Tab; label: string }[] = [
  { key: "profile", label: "Profile" },
  { key: "discography", label: "Discography" },
  { key: "collections", label: "Collections" },
  { key: "analytics", label: "Analytics" },
  { key: "social", label: "Social & Contact" },
];

const SOCIAL_META: Record<SocialPlatform, { label: string; icon: React.ReactNode; color: string }> = {
  instagram: { label: "Instagram", icon: <FaInstagram size={14} />, color: "#e1306c" },
  tiktok: { label: "TikTok", icon: <Music2 size={14} />, color: "#010101" },
  spotify: { label: "Spotify", icon: <Music2 size={14} />, color: "#1db954" },
  apple_music: { label: "Apple Music", icon: <Music2 size={14} />, color: "#fc3c44" },
  youtube: { label: "YouTube", icon: <FaYoutube size={14} />, color: "#ff0000" },
  facebook: {
    label: "Facebook",
    icon: <FaFacebook size={14} />,
    color: "#1877f2",
  },
  soundcloud: { label: "SoundCloud", icon: <Music2 size={14} />, color: "#ff5500" },
  twitter: { label: "X (Twitter)", icon: <TrendingUp size={14} />, color: "#000000" },
  website: { label: "Website", icon: <Globe size={14} />, color: "#6366f1" },
};

function fmtNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return `${n}`;
}
function fmtRevenue(n: number) {
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}k`;
  return `$${n}`;
}
function initials(name: string) {
  return name.split(" ").map(p => p[0]).join("").toUpperCase().slice(0, 2);
}

const STATUS_TRACK: Record<string, string> = {
  published: "bg-success/10 text-success",
  draft: "bg-[color:var(--color-warning)]/10 text-[color:var(--color-warning)]",
  archived: "bg-white/10 text-white/40",
};

export default function ArtistDrawer({ artist, onClose, onEdit }: Props) {
  const [tab, setTab] = useState<Tab>("profile");

  useEffect(() => {
    if (artist) setTab("profile");
  }, [artist?.id]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  if (!artist) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[350]"
      />

      {/* Drawer */}
      <aside className="fixed top-0 right-0 bottom-0 w-[480px] bg-surface border-l border-[color:var(--border-subtle)] z-[360] flex flex-col overflow-hidden">

        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[color:var(--border-subtle)] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-elevated flex items-center justify-center flex-shrink-0">
              {artist.profileImage
                ? <img src={artist.profileImage} alt={artist.stageName} className="w-full h-full object-cover" />
                : <span className="text-xs font-bold text-[color:var(--text-muted)]">{initials(artist.stageName)}</span>
              }
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-foreground">{artist.stageName}</span>
                {artist.isVerified && <BadgeCheck size={14} className="text-accent" />}
                {artist.isFeatured && <Star size={12} className="text-[color:var(--color-warning)] fill-[color:var(--color-warning)]" />}
              </div>
              <p className="text-xs text-[color:var(--text-muted)]">{artist.country} · {artist.primaryGenre}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(artist)}
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
        <div className="flex border-b border-[color:var(--border-subtle)] px-5 flex-shrink-0 overflow-x-auto">
          {TAB_LIST.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-3 text-xs font-semibold whitespace-nowrap border-0 bg-transparent cursor-pointer transition-colors border-b-2 -mb-px
                ${tab === t.key
                  ? "text-[color:var(--accent-magenta)] border-[color:var(--accent-magenta)]"
                  : "text-[color:var(--text-muted)] border-transparent hover:text-foreground"
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-5">

          {/* PROFILE */}
          {tab === "profile" && (
            <div className="flex flex-col gap-5">
              {/* Cover + avatar */}
              <div className="relative rounded-xl overflow-hidden h-28 bg-elevated">
                {artist.bannerImage
                  ? <img src={artist.bannerImage} alt="" className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-gradient-to-br from-accent/20 to-accent-cyan/10" />
                }
                <div className="absolute inset-0 bg-gradient-to-t from-surface/70 to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-surface bg-elevated flex items-center justify-center">
                    {artist.profileImage
                      ? <img src={artist.profileImage} alt={artist.stageName} className="w-full h-full object-cover" />
                      : <span className="text-base font-bold text-[color:var(--text-muted)]">{initials(artist.stageName)}</span>
                    }
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
                  ${artist.status === "active" ? "bg-success/10 text-success" : "bg-white/10 text-white/40"}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {artist.status.charAt(0).toUpperCase() + artist.status.slice(1)}
                </span>
                {artist.isVerified && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-accent/10 text-[color:var(--accent-magenta)]">
                    <BadgeCheck size={11} /> Verified
                  </span>
                )}
                {artist.isFeatured && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[color:var(--color-warning)]/10 text-[color:var(--color-warning)]">
                    <Star size={10} className="fill-current" /> Featured
                  </span>
                )}
              </div>

              {/* Bio */}
              {artist.biography && (
                <p className="text-sm text-[color:var(--text-secondary)] leading-relaxed">{artist.biography}</p>
              )}

              {/* Meta grid */}
              <div className="grid grid-cols-2 gap-3 p-4 bg-[color:var(--bg-input)] rounded-xl border border-[color:var(--border-subtle)]">
                {[
                  { label: "Country", value: artist.country },
                  { label: "Primary Genre", value: artist.primaryGenre },
                  { label: "Artist Type", value: artist.artistType.charAt(0).toUpperCase() + artist.artistType.slice(1) },
                  { label: "Joined", value: new Date(artist.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) },
                ].map(row => (
                  <div key={row.label} className="flex flex-col gap-1">
                    <span className="text-[10px] font-semibold tracking-widest uppercase text-[color:var(--text-muted)]">{row.label}</span>
                    <span className="text-sm text-[color:var(--text-secondary)]">{row.value}</span>
                  </div>
                ))}
              </div>

              {/* All genres */}
              <div>
                <p className="text-[10px] font-semibold tracking-widest uppercase text-[color:var(--text-muted)] mb-2">Genres</p>
                <div className="flex flex-wrap gap-1.5">
                  {artist.genres.map(g => (
                    <span key={g} className="px-2.5 py-1 rounded-full text-xs font-medium bg-elevated text-[color:var(--text-secondary)] border border-[color:var(--border-subtle)]">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* DISCOGRAPHY */}
          {tab === "discography" && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-foreground">Tracks</span>
                <span className="text-xs text-[color:var(--text-muted)]">{artist.totalTracks} total</span>
              </div>
              {!artist.tracks?.length ? (
                <div className="text-center py-10 text-[color:var(--text-muted)]">
                  <Music2 size={24} className="mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No tracks assigned yet.</p>
                </div>
              ) : (
                artist.tracks.map(track => (
                  <div key={track.id} className="flex items-center gap-3 p-3 bg-[color:var(--bg-input)] rounded-xl border border-[color:var(--border-subtle)] hover:border-[color:var(--border-default)] transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-elevated flex items-center justify-center flex-shrink-0">
                      <Music2 size={14} className="text-[color:var(--text-muted)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{track.title}</p>
                      <p className="text-xs text-[color:var(--text-muted)]">{track.genre} · {track.licenseCount} licenses</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-bold text-success">{fmtRevenue(track.revenue)}</p>
                      <p className="text-[10px] text-[color:var(--text-muted)]">{track.sales} sales</p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_TRACK[track.status]}`}>
                      {track.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* COLLECTIONS */}
          {tab === "collections" && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-foreground">Collections</span>
                <span className="text-xs text-[color:var(--text-muted)]">{artist.totalCollections} total</span>
              </div>
              {!artist.collections?.length ? (
                <div className="text-center py-10 text-[color:var(--text-muted)]">
                  <Library size={24} className="mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No collections yet.</p>
                </div>
              ) : (
                artist.collections.map(col => (
                  <div key={col.id} className="flex items-center gap-3 p-3 bg-[color:var(--bg-input)] rounded-xl border border-[color:var(--border-subtle)] hover:border-[color:var(--border-default)] transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-elevated flex items-center justify-center flex-shrink-0">
                      <Library size={16} className="text-[color:var(--text-muted)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{col.name}</p>
                      <p className="text-xs text-[color:var(--text-muted)]">{col.trackCount} tracks</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-success">{fmtRevenue(col.revenue)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ANALYTICS */}
          {tab === "analytics" && (
            <div className="flex flex-col gap-4">
              {/* KPI cards */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Total Sales", value: fmtNum(artist.totalSales), color: "text-success", icon: <ShoppingCart size={13} />, bg: "bg-success/10" },
                  { label: "Revenue", value: fmtRevenue(artist.totalRevenue), color: "text-accent", icon: <TrendingUp size={13} />, bg: "bg-accent/10" },
                  { label: "Downloads", value: fmtNum(artist.totalDownloads), color: "text-accent-cyan", icon: <Download size={13} />, bg: "bg-accent-cyan/10" },
                  { label: "Streams", value: fmtNum(artist.totalStreams), color: "text-[color:var(--accent-magenta)]", icon: <Music2 size={13} />, bg: "bg-[color:var(--accent-magenta)]/10" },
                ].map(card => (
                  <div key={card.label} className="p-4 bg-[color:var(--bg-input)] rounded-xl border border-[color:var(--border-subtle)] flex flex-col gap-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.bg} ${card.color}`}>
                      {card.icon}
                    </div>
                    <div>
                      <p className={`text-lg font-bold tracking-tight ${card.color}`}>{card.value}</p>
                      <p className="text-[10px] text-[color:var(--text-muted)] mt-0.5">{card.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Conversion rate */}
              <div className="p-4 bg-[color:var(--bg-input)] rounded-xl border border-[color:var(--border-subtle)]">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-sm font-semibold text-foreground">Conversion Rate</span>
                  <span className="text-base font-bold text-[color:var(--color-warning)]">
                    {artist.totalStreams > 0
                      ? ((artist.totalSales / artist.totalStreams) * 100).toFixed(2)
                      : "0.00"}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-elevated overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent to-[color:var(--accent-magenta)] transition-all duration-500"
                    style={{ width: `${Math.min((artist.totalSales / Math.max(artist.totalStreams, 1)) * 100 * 10, 100)}%` }}
                  />
                </div>
                <p className="text-[11px] text-[color:var(--text-muted)] mt-2">
                  {artist.totalSales.toLocaleString()} sales from {fmtNum(artist.totalStreams)} streams
                </p>
              </div>

              {/* Avg revenue per sale */}
              <div className="p-4 bg-[color:var(--bg-input)] rounded-xl border border-[color:var(--border-subtle)]">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-[color:var(--text-muted)] mb-2">Avg. Revenue per Sale</p>
                <p className="text-2xl font-bold text-success tracking-tight">
                  ${artist.totalSales > 0
                    ? (artist.totalRevenue / artist.totalSales).toFixed(2)
                    : "0.00"}
                </p>
              </div>
            </div>
          )}

          {/* SOCIAL & CONTACT */}
          {tab === "social" && (
            <div className="flex flex-col gap-4">
              {/* Contact */}
              <div>
                <p className="text-[10px] font-semibold tracking-widest uppercase text-[color:var(--text-muted)] mb-3">Contact</p>
                <div className="flex flex-col gap-2">
                  {[
                    { icon: <Mail size={13} />, label: "Email", value: artist.email, href: `mailto:${artist.email}` },
                    artist.phone && { icon: <Phone size={13} />, label: "Phone", value: artist.phone, href: `tel:${artist.phone}` },
                    artist.website && { icon: <Globe size={13} />, label: "Website", value: artist.website, href: artist.website },
                    artist.managementCompany && { icon: <Building2 size={13} />, label: "Management", value: artist.managementCompany, href: null },
                    artist.bookingEmail && { icon: <Mail size={13} />, label: "Booking", value: artist.bookingEmail, href: `mailto:${artist.bookingEmail}` },
                  ].filter(Boolean).map((row: any) => (
                    <div key={row.label} className="flex items-center gap-3 p-3 bg-[color:var(--bg-input)] rounded-xl border border-[color:var(--border-subtle)]">
                      <span className="text-[color:var(--text-muted)] flex-shrink-0">{row.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-[color:var(--text-muted)] uppercase tracking-wide">{row.label}</p>
                        <p className="text-sm text-[color:var(--text-secondary)] truncate">{row.value}</p>
                      </div>
                      {row.href && (
                        <a href={row.href} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                          <ExternalLink size={12} className="text-[color:var(--text-muted)] hover:text-foreground transition-colors" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Socials */}
              {artist.socials.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold tracking-widest uppercase text-[color:var(--text-muted)] mb-3">Social Profiles</p>
                  <div className="flex flex-col gap-2">
                    {artist.socials.map(s => {
                      const meta = SOCIAL_META[s.platform];
                      return (
                        <a
                          key={s.platform}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="flex items-center gap-3 p-3 bg-[color:var(--bg-input)] rounded-xl border border-[color:var(--border-subtle)] hover:border-[color:var(--border-default)] transition-colors group"
                        >
                          <span className="text-[color:var(--text-muted)] group-hover:text-foreground transition-colors">
                            {meta.icon}
                          </span>
                          <span className="flex-1 text-sm text-[color:var(--text-secondary)] truncate group-hover:text-foreground transition-colors">
                            {meta.label}
                          </span>
                          <ExternalLink size={11} className="text-[color:var(--text-muted)] group-hover:text-foreground transition-colors flex-shrink-0" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
