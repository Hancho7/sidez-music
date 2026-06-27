// components/pricing/BulkPricingModal.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, TrendingDown, DollarSign, RotateCcw, Eye } from "lucide-react";
import type { PricingRow } from "@/services/pricing/types";
import Button from "@/components/ui/Button";

type BulkMode = "increase" | "decrease" | "fixed" | "restore";

interface BulkPricingModalProps {
  open: boolean;
  rows: PricingRow[];
  onClose: () => void;
  onApply: (ids: string[], mode: BulkMode, value: number, license: string) => void;
}

const LICENSE_OPTIONS = ["Basic", "Premium", "Unlimited", "Exclusive", "All Licenses"];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-bold uppercase tracking-widest text-[color:var(--text-muted)] mb-2">
      {children}
    </div>
  );
}

export default function BulkPricingModal({ open, rows, onClose, onApply }: BulkPricingModalProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [mode, setMode] = useState<BulkMode>("increase");
  const [value, setValue] = useState("10");
  const [license, setLicense] = useState("All Licenses");
  const [step, setStep] = useState<"configure" | "preview">("configure");
  const [applying, setApplying] = useState(false);

  const toggleAll = () =>
    setSelectedIds(prev => prev.length === rows.length ? [] : rows.map(r => r.id));

  const toggleRow = (id: string) =>
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleApply = async () => {
    setApplying(true);
    await new Promise(r => setTimeout(r, 700));
    onApply(selectedIds, mode, Number(value), license);
    setApplying(false);
    onClose();
    setStep("configure");
    setSelectedIds([]);
  };

  const MODES: { id: BulkMode; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: "increase", label: "Increase %", icon: <TrendingUp size={15} />, desc: "Raise prices by a percentage" },
    { id: "decrease", label: "Decrease %", icon: <TrendingDown size={15} />, desc: "Lower prices by a percentage" },
    { id: "fixed", label: "Set Fixed Price", icon: <DollarSign size={15} />, desc: "Set exact price for all selected" },
    { id: "restore", label: "Restore Default", icon: <RotateCcw size={15} />, desc: "Reset to license plan defaults" },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="bulk-bg"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[500]"
          />

          <motion.div
            key="bulk-modal"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(640px,95vw)] max-h-[88vh] bg-surface border border-[color:var(--border-subtle)] rounded-[16px] z-[501] flex flex-col overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[color:var(--border-subtle)] shrink-0">
              <div>
                <p className="text-[17px] font-bold text-foreground">Bulk Update Prices</p>
                <p className="text-xs text-[color:var(--text-muted)] mt-0.5">{selectedIds.length} track{selectedIds.length !== 1 ? "s" : ""} selected</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer bg-elevated border border-[color:var(--border-subtle)] text-[color:var(--text-muted)] hover:text-foreground transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-thin">

              {step === "configure" ? (
                <div className="flex flex-col gap-6">
                  {/* Mode selector */}
                  <div>
                    <SectionLabel>Update Mode</SectionLabel>
                    <div className="grid grid-cols-2 gap-2">
                      {MODES.map(m => (
                        <button
                          key={m.id}
                          onClick={() => setMode(m.id)}
                          className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer text-left transition-all border ${mode === m.id ? "bg-elevated border-[color:var(--border-default)]" : "bg-[color:var(--bg-input)] border-[color:var(--border-subtle)] hover:border-[color:var(--border-default)]"}`}
                        >
                          <div className={`mt-0.5 ${mode === m.id ? "text-foreground" : "text-[color:var(--text-muted)]"}`}>{m.icon}</div>
                          <div>
                            <p className={`text-sm font-semibold ${mode === m.id ? "text-foreground" : "text-[color:var(--text-secondary)]"}`}>{m.label}</p>
                            <p className="text-[11px] text-[color:var(--text-muted)] mt-0.5">{m.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* License + Value */}
                  {mode !== "restore" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <SectionLabel>License Tier</SectionLabel>
                        <div className="relative">
                          <select
                            value={license}
                            onChange={e => setLicense(e.target.value)}
                            className="w-full bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl text-sm text-foreground font-inherit px-3.5 py-2.5 pr-9 outline-none focus:border-accent appearance-none cursor-pointer [&>option]:bg-surface"
                          >
                            {LICENSE_OPTIONS.map(l => <option key={l}>{l}</option>)}
                          </select>
                        </div>
                      </div>
                      <div>
                        <SectionLabel>{mode === "fixed" ? "Fixed Price ($)" : "Amount (%)"}</SectionLabel>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[color:var(--text-muted)]">{mode === "fixed" ? "$" : "%"}</span>
                          <input
                            type="number"
                            value={value}
                            onChange={e => setValue(e.target.value)}
                            min={0}
                            className="w-full pl-7 pr-3 py-2.5 text-sm rounded-xl bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] text-foreground font-inherit outline-none focus:border-accent transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Track selection */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <SectionLabel>Select Tracks</SectionLabel>
                      <button onClick={toggleAll} className="text-xs text-[color:var(--text-muted)] hover:text-foreground cursor-pointer bg-transparent border-0 transition-colors">
                        {selectedIds.length === rows.length ? "Deselect all" : "Select all"}
                      </button>
                    </div>
                    <div className="flex flex-col gap-1 max-h-[240px] overflow-y-auto">
                      {rows.map(r => (
                        <button
                          key={r.id}
                          onClick={() => toggleRow(r.id)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-left transition-all border ${selectedIds.includes(r.id) ? "bg-elevated border-[color:var(--border-default)]" : "bg-transparent border-transparent hover:bg-elevated/50"}`}
                        >
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${selectedIds.includes(r.id) ? "bg-foreground border-foreground" : "bg-transparent border-[color:var(--border-default)]"}`}>
                            {selectedIds.includes(r.id) && <div className="w-2 h-2 rounded-sm bg-surface" />}
                          </div>
                          <img src={r.coverImage} alt={r.trackTitle} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{r.trackTitle}</p>
                            <p className="text-[11px] text-[color:var(--text-muted)]">{r.artistName} · {r.genre}</p>
                          </div>
                          <span className="text-xs text-[color:var(--text-muted)] shrink-0">
                            {r.basicPrice ? `$${r.basicPrice}` : "No pricing"}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Preview */
                <div className="flex flex-col gap-4">
                  <div className="bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-xl p-4">
                    <p className="text-sm font-bold text-foreground mb-3">Preview Changes</p>
                    <div className="flex flex-col gap-2">
                      {rows.filter(r => selectedIds.includes(r.id)).slice(0, 5).map(r => (
                        <div key={r.id} className="flex items-center gap-3 text-sm">
                          <img src={r.coverImage} alt={r.trackTitle} className="w-7 h-7 rounded-md object-cover shrink-0" />
                          <span className="flex-1 text-[color:var(--text-secondary)]">{r.trackTitle}</span>
                          <span className="text-[color:var(--text-muted)]">${r.basicPrice ?? "—"}</span>
                          <span className="text-[color:var(--text-muted)]">→</span>
                          <span className="font-semibold text-foreground">
                            {mode === "fixed" ? `$${value}` :
                              mode === "increase" ? `$${Math.round((r.basicPrice ?? 0) * (1 + Number(value) / 100))}` :
                                mode === "decrease" ? `$${Math.round((r.basicPrice ?? 0) * (1 - Number(value) / 100))}` :
                                  "Default"}
                          </span>
                        </div>
                      ))}
                      {selectedIds.length > 5 && (
                        <p className="text-xs text-[color:var(--text-muted)]">+{selectedIds.length - 5} more tracks</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-[color:var(--border-subtle)] shrink-0">
              <Button
                variant="secondary"
                size="md"
                onClick={() => step === "preview" ? setStep("configure") : onClose()}
              >
                {step === "preview" ? "Back" : "Cancel"}
              </Button>

              {step === "configure" ? (
                <Button
                  variant="secondary"
                  size="md"
                  icon={<Eye size={14} />}
                  onClick={() => setStep("preview")}
                  disabled={selectedIds.length === 0}
                >
                  Preview Changes
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleApply}
                  loading={applying}
                >
                  {applying ? "Applying…" : `Apply to ${selectedIds.length} track${selectedIds.length !== 1 ? "s" : ""}`}
                </Button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
