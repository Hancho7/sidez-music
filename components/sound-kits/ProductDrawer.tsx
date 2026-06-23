// components/sound-kits/ProductDrawer.tsx
"use client";

import { useState, useEffect } from "react";
import {
  X, Pencil, Star, Music2, FileArchive, FileAudio, FileText, File,
  Download, TrendingUp, ShoppingCart, RefreshCw, Clock, Globe, Tag,
  ChevronDown, Upload, Trash2, Eye, RotateCcw, Users, MonitorSmartphone,
} from "lucide-react";
import type { DigitalProduct, ProductFile, ProductVersion, ProductStatus } from "@/services/sound-kits/types";
import { CATEGORY_LABELS, getMockDownloads } from "@/services/sound-kits/mock-data";

interface Props {
  product: DigitalProduct | null;
  onClose: () => void;
  onEdit: (p: DigitalProduct) => void;
}

type Tab = "overview" | "files" | "pricing" | "analytics" | "versions" | "downloads";

const TABS: { key: Tab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "files", label: "Files" },
  { key: "pricing", label: "Pricing" },
  { key: "analytics", label: "Analytics" },
  { key: "versions", label: "Versions" },
  { key: "downloads", label: "Downloads" },
];

const STATUS_CLASSES: Record<ProductStatus, string> = {
  published: "bg-success/10 text-success",
  draft: "bg-[color:var(--color-warning)]/10 text-[color:var(--color-warning)]",
  archived: "bg-white/10 text-white/40",
  scheduled: "bg-accent-cyan/10 text-accent-cyan",
};

const FILE_ICON: Record<string, React.ReactNode> = {
  zip: <FileArchive size={14} className="text-[color:var(--color-warning)]" />,
  audio: <FileAudio size={14} className="text-accent-cyan" />,
  pdf: <FileText size={14} className="text-danger" />,
  project: <File size={14} className="text-accent" />,
  midi: <Music2 size={14} className="text-[color:var(--accent-magenta)]" />,
  image: <File size={14} className="text-[color:var(--text-muted)]" />,
};

function fmtBytes(b: number) {
  if (b >= 1e9) return `${(b / 1e9).toFixed(1)} GB`;
  if (b >= 1e6) return `${(b / 1e6).toFixed(0)} MB`;
  return `${(b / 1e3).toFixed(0)} KB`;
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 py-2 border-b border-[color:var(--border-subtle)]/40 last:border-0">
      <span className="text-[10px] font-semibold tracking-widest uppercase text-[color:var(--text-muted)]">{label}</span>
      <span className="text-sm text-[color:var(--text-secondary)]">{value}</span>
    </div>
  );
}

function MiniBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-[color:var(--text-secondary)]">{label}</span>
        <span className="font-semibold text-foreground">{value.toLocaleString()}</span>
      </div>
      <div className="h-1.5 rounded-full bg-elevated overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${max > 0 ? Math.min((value / max) * 100, 100) : 0}%`, background: color }} />
      </div>
    </div>
  );
}

export default function ProductDrawer({ product, onClose, onEdit }: Props) {
  const [tab, setTab] = useState<Tab>("overview");
  const [downloads] = useState(() => product ? getMockDownloads(product.id) : []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (product) setTab("overview"); }, [product?.id]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  if (!product) return null;

  const analytics = product.analytics;
  const displayPrice = product.salePrice ?? product.price;
  const maxCountry = analytics ? Math.max(...analytics.topCountries.map(c => c.downloads), 1) : 1;

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[350]" />

      <aside className="fixed top-0 right-0 bottom-0 w-[500px] bg-surface border-l border-[color:var(--border-subtle)] z-[360] flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[color:var(--border-subtle)] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-elevated flex items-center justify-center shrink-0 border border-[color:var(--border-subtle)]">
              {product.thumbnail
                ? <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover" />
                : <Music2 size={14} className="text-[color:var(--text-muted)]" />
              }
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-foreground truncate">{product.name}</span>
                {product.featured && <Star size={12} className="text-[color:var(--color-warning)] fill-current shrink-0" />}
              </div>
              <p className="text-[11px] font-mono text-[color:var(--text-muted)]">{product.sku} · v{product.currentVersion}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_CLASSES[product.status]}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
            </span>
            <button onClick={() => onEdit(product)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[color:var(--border-default)] bg-transparent text-[color:var(--text-secondary)] text-xs font-semibold cursor-pointer hover:bg-elevated hover:text-foreground transition-colors">
              <Pencil size={11} /> Edit
            </button>
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center bg-transparent border-0 cursor-pointer text-[color:var(--text-muted)] hover:bg-elevated hover:text-foreground transition-colors">
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[color:var(--border-subtle)] px-5 shrink-0 overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-2.5 text-xs font-semibold whitespace-nowrap border-0 bg-transparent cursor-pointer transition-colors border-b-2 -mb-px
                ${tab === t.key ? "text-accent border-accent" : "text-[color:var(--text-muted)] border-transparent hover:text-foreground"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">

          {/* OVERVIEW */}
          {tab === "overview" && (
            <div className="flex flex-col gap-4">
              {/* Thumbnail */}
              <div className="w-full aspect-video rounded-xl overflow-hidden bg-elevated flex items-center justify-center border border-[color:var(--border-subtle)]">
                {product.thumbnail
                  ? <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover" />
                  : <div className="flex flex-col items-center gap-2">
                    <Music2 size={32} className="text-[color:var(--text-muted)]" />
                    <p className="text-xs text-[color:var(--text-muted)]">No thumbnail</p>
                  </div>
                }
              </div>

              {/* Tags */}
              {product.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {product.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-elevated border border-[color:var(--border-subtle)] text-[11px] text-[color:var(--text-secondary)]">
                      <Tag size={9} className="text-[color:var(--text-muted)]" /> {tag}
                    </span>
                  ))}
                </div>
              )}

              {product.shortDescription && (
                <p className="text-sm text-[color:var(--text-secondary)] leading-relaxed">{product.shortDescription}</p>
              )}

              <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
                <MetaRow label="Category" value={CATEGORY_LABELS[product.category]} />
                <MetaRow label="SKU" value={<span className="font-mono">{product.sku}</span>} />
                <MetaRow label="Slug" value={<span className="font-mono text-accent">/{product.slug}</span>} />
                <MetaRow label="Version" value={`v${product.currentVersion}`} />
                <MetaRow label="Created" value={fmtDate(product.createdAt)} />
                <MetaRow label="Updated" value={fmtDate(product.updatedAt)} />
                <MetaRow label="Files" value={`${product.files.length} asset${product.files.length !== 1 ? "s" : ""}`} />
                <MetaRow label="Featured" value={product.featured ? "Yes" : "No"} />
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Downloads", value: (analytics?.totalDownloads ?? 0).toLocaleString(), color: "text-accent", icon: <Download size={12} /> },
                  { label: "Revenue", value: `$${(analytics?.totalRevenue ?? 0).toLocaleString()}`, color: "text-success", icon: <TrendingUp size={12} /> },
                  { label: "Orders", value: (analytics?.totalOrders ?? 0).toLocaleString(), color: "text-accent-cyan", icon: <ShoppingCart size={12} /> },
                ].map(s => (
                  <div key={s.label} className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-3.5">
                    <div className={`flex items-center gap-1 mb-1 ${s.color}`}>{s.icon}</div>
                    <div className={`text-base font-bold ${s.color}`}>{s.value}</div>
                    <div className="text-[11px] text-[color:var(--text-muted)] mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FILES */}
          {tab === "files" && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-[color:var(--text-muted)]">{product.files.length} file{product.files.length !== 1 ? "s" : ""}</p>
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-accent/30 bg-accent/10 text-accent text-xs font-semibold cursor-pointer hover:bg-accent/20 transition-colors">
                  <Upload size={12} /> Upload File
                </button>
              </div>

              {product.files.map(file => (
                <div key={file.id} className={`bg-[color:var(--bg-input)] border rounded-xl p-4 ${file.isPrimary ? "border-accent/30" : "border-[color:var(--border-subtle)]"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-elevated flex items-center justify-center shrink-0">
                        {FILE_ICON[file.fileType] ?? <File size={14} />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-semibold text-foreground truncate">{file.filename}</p>
                          {file.isPrimary && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-accent/10 text-accent uppercase tracking-wide">Main</span>}
                        </div>
                        <p className="text-[11px] text-[color:var(--text-muted)] mt-0.5">{fmtBytes(file.size)} · v{file.version} · {fmtDate(file.uploadedAt)}</p>
                        <p className="text-[10px] font-mono text-[color:var(--text-muted)] mt-0.5 truncate">{file.checksum}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button className="w-7 h-7 rounded-lg flex items-center justify-center bg-transparent border-0 cursor-pointer text-[color:var(--text-muted)] hover:bg-elevated hover:text-foreground transition-colors" title="Preview">
                        <Eye size={12} />
                      </button>
                      <button className="w-7 h-7 rounded-lg flex items-center justify-center bg-transparent border-0 cursor-pointer text-[color:var(--text-muted)] hover:bg-elevated hover:text-foreground transition-colors" title="Replace">
                        <RefreshCw size={12} />
                      </button>
                      <button className="w-7 h-7 rounded-lg flex items-center justify-center bg-transparent border-0 cursor-pointer text-[color:var(--text-muted)] hover:bg-danger/10 hover:text-danger transition-colors" title="Delete">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[color:var(--border-subtle)]/40 flex items-center gap-4 text-[11px] text-[color:var(--text-muted)]">
                    <span className="flex items-center gap-1"><Download size={10} />{file.downloadCount.toLocaleString()} downloads</span>
                    <span className="uppercase font-semibold">{file.fileType}</span>
                  </div>
                </div>
              ))}

              {/* Drop zone */}
              <div className="border-2 border-dashed border-[color:var(--border-default)] rounded-xl py-8 flex flex-col items-center gap-2 text-center cursor-pointer hover:border-accent transition-colors">
                <Upload size={20} className="text-[color:var(--text-muted)]" />
                <p className="text-sm font-semibold text-[color:var(--text-secondary)]">Drop files here or click to upload</p>
                <p className="text-xs text-[color:var(--text-muted)]">ZIP, MP3, WAV, PDF, MIDI — max 2 GB</p>
              </div>
            </div>
          )}

          {/* PRICING */}
          {tab === "pricing" && (
            <div className="flex flex-col gap-4">
              {/* Price hero */}
              <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-2xl p-5 flex items-start justify-between">
                <div>
                  <p className="text-[10px] text-[color:var(--text-muted)] mb-1">Current Price</p>
                  {product.price === 0
                    ? <div className="text-3xl font-black text-success">FREE</div>
                    : <div className="text-3xl font-black text-foreground">${displayPrice.toFixed(2)}</div>
                  }
                  {product.salePrice !== null && (
                    <p className="text-sm text-[color:var(--text-muted)] line-through mt-1">Was ${product.price.toFixed(2)}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-[color:var(--text-muted)] mb-1">Revenue</p>
                  <div className="text-xl font-bold text-success">${(analytics?.totalRevenue ?? 0).toLocaleString()}</div>
                </div>
              </div>

              <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
                <MetaRow label="Listed Price" value={product.price === 0 ? "Free" : `$${product.price.toFixed(2)} ${product.currency}`} />
                <MetaRow label="Sale Price" value={product.salePrice !== null ? `$${product.salePrice.toFixed(2)}` : "No sale"} />
                <MetaRow label="Currency" value={product.currency} />
                <MetaRow label="Download Limit" value={product.downloadLimit === null ? "Unlimited" : `${product.downloadLimit}x per customer`} />
                <MetaRow label="Coupons Allowed" value={product.couponsEnabled ? "Yes" : "No"} />
                <MetaRow label="License Required" value={product.licenseRequired ? "Yes" : "No"} />
              </div>
            </div>
          )}

          {/* ANALYTICS */}
          {tab === "analytics" && analytics && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Total Downloads", value: analytics.totalDownloads.toLocaleString(), color: "text-accent", icon: <Download size={13} /> },
                  { label: "Total Revenue", value: `$${analytics.totalRevenue.toLocaleString()}`, color: "text-success", icon: <TrendingUp size={13} /> },
                  { label: "Total Orders", value: analytics.totalOrders.toLocaleString(), color: "text-accent-cyan", icon: <ShoppingCart size={13} /> },
                  { label: "Conversion Rate", value: `${analytics.conversionRate}%`, color: "text-[color:var(--accent-magenta)]", icon: <Globe size={13} /> },
                  { label: "Total Refunds", value: analytics.totalRefunds.toLocaleString(), color: "text-danger", icon: <RefreshCw size={13} /> },
                  { label: "Repeat Buyers", value: `${analytics.repeatBuyers}%`, color: "text-[color:var(--color-warning)]", icon: <Users size={13} /> },
                ].map(kpi => (
                  <div key={kpi.label} className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-3.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center bg-current/10 mb-2 ${kpi.color}`}>{kpi.icon}</div>
                    <div className={`text-base font-bold ${kpi.color}`}>{kpi.value}</div>
                    <div className="text-[11px] text-[color:var(--text-muted)] mt-0.5">{kpi.label}</div>
                  </div>
                ))}
              </div>

              {/* Downloads over time */}
              <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-[color:var(--text-muted)] mb-3">Downloads Over Time</p>
                <div className="flex flex-col gap-2">
                  {analytics.downloadsOverTime.map(p => {
                    const max = Math.max(...analytics.downloadsOverTime.map(x => x.count), 1);
                    return (
                      <MiniBar key={p.date} label={new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} value={p.count} max={max} color="var(--accent-purple)" />
                    );
                  })}
                </div>
              </div>

              {/* Top countries */}
              <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-[color:var(--text-muted)] mb-3">Top Countries</p>
                <div className="flex flex-col gap-2">
                  {analytics.topCountries.map(c => (
                    <MiniBar key={c.country} label={c.country} value={c.downloads} max={maxCountry} color="var(--accent-cyan)" />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VERSIONS */}
          {tab === "versions" && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-[color:var(--text-muted)]">{product.versions.length} version{product.versions.length !== 1 ? "s" : ""}</p>
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-accent/30 bg-accent/10 text-accent text-xs font-semibold cursor-pointer hover:bg-accent/20 transition-colors">
                  <Upload size={12} /> New Version
                </button>
              </div>

              {product.versions.map((v, i) => (
                <div key={v.id} className={`bg-[color:var(--bg-input)] border rounded-xl p-4 ${i === 0 ? "border-accent/30" : "border-[color:var(--border-subtle)]"}`}>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-foreground">v{v.version}</span>
                        {i === 0 && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-accent/10 text-accent uppercase tracking-wide">Latest</span>}
                      </div>
                      <p className="text-[11px] text-[color:var(--text-muted)] mt-0.5">{fmtDate(v.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-[color:var(--text-muted)] flex items-center gap-1">
                        <Download size={10} />{v.downloadCount.toLocaleString()}
                      </span>
                      {i > 0 && (
                        <button className="ml-2 inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold bg-elevated border border-[color:var(--border-subtle)] text-[color:var(--text-muted)] cursor-pointer hover:bg-[color:var(--bg-overlay)] hover:text-foreground transition-colors">
                          <RotateCcw size={10} /> Rollback
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-[color:var(--text-secondary)] leading-relaxed mb-2">{v.releaseNotes}</p>
                  <div className="flex flex-wrap gap-1">
                    {v.updatedFiles.map(f => (
                      <span key={f} className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-elevated text-[color:var(--text-muted)] border border-[color:var(--border-subtle)]">{f}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* DOWNLOADS */}
          {tab === "downloads" && (
            <div className="flex flex-col gap-2.5">
              <p className="text-[11px] text-[color:var(--text-muted)]">{downloads.length} recent downloads</p>
              {downloads.map(dl => (
                <div key={dl.id} className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{dl.customerName}</p>
                      <p className="text-[11px] text-[color:var(--text-muted)]">{dl.customerEmail}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-[10px] text-accent">{dl.orderId}</p>
                      <p className="text-[10px] text-[color:var(--text-muted)] mt-0.5">v{dl.version}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[color:var(--border-subtle)]/40 text-[11px] text-[color:var(--text-muted)]">
                    <span className="flex items-center gap-1"><MonitorSmartphone size={10} />{dl.device}</span>
                    <span className="flex items-center gap-1"><Clock size={10} />{new Date(dl.downloadedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                    <span className={`font-semibold ${dl.remainingDownloads === 0 ? "text-danger" : "text-[color:var(--text-secondary)]"}`}>
                      {dl.remainingDownloads} left
                    </span>
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
