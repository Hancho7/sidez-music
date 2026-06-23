// components/pricing/BulkPricingModal.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, TrendingDown, DollarSign, RotateCcw, Eye } from "lucide-react";
import type { PricingRow } from "@/services/pricing/types";

type BulkMode = "increase" | "decrease" | "fixed" | "restore";

interface BulkPricingModalProps {
  open: boolean;
  rows: PricingRow[];
  onClose: () => void;
  onApply: (ids: string[], mode: BulkMode, value: number, license: string) => void;
}

const LICENSE_OPTIONS = ["Basic", "Premium", "Unlimited", "Exclusive", "All Licenses"];

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
            className="fixed inset-0 z-[500]"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(3px)" }}
          />

          <motion.div
            key="bulk-modal"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col z-[501] overflow-hidden"
            style={{ width: "min(640px,95vw)", maxHeight: "88vh", background: "#111111", border: "1px solid #1f1f1f", borderRadius: 16 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 flex-shrink-0" style={{ borderBottom: "1px solid #1f1f1f" }}>
              <div>
                <h2 className="text-[17px] font-bold m-0 tracking-[-0.02em]" style={{ color: "#f5f5f5" }}>Bulk Update Prices</h2>
                <p className="text-xs mt-0.5 m-0" style={{ color: "#525252" }}>{selectedIds.length} track{selectedIds.length !== 1 ? "s" : ""} selected</p>
              </div>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer" style={{ background: "#1a1a1a", border: "1px solid #2e2e2e", color: "#525252" }}>
                <X size={15} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.06) transparent" }}>

              {step === "configure" ? (
                <div className="flex flex-col gap-6">
                  {/* Mode */}
                  <div>
                    <SectionLabel>Update Mode</SectionLabel>
                    <div className="grid grid-cols-2 gap-2">
                      {MODES.map(m => (
                        <button key={m.id} onClick={() => setMode(m.id)}
                          className="flex items-start gap-3 p-3 rounded-xl cursor-pointer text-left transition-all"
                          style={{
                            background: mode === m.id ? "rgba(255,255,255,0.08)" : "#1a1a1a",
                            border: `1px solid ${mode === m.id ? "rgba(255,255,255,0.2)" : "#2e2e2e"}`,
                          }}>
                          <div className="mt-0.5" style={{ color: mode === m.id ? "#f5f5f5" : "#525252" }}>{m.icon}</div>
                          <div>
                            <div className="text-sm font-semibold" style={{ color: mode === m.id ? "#f5f5f5" : "#a3a3a3" }}>{m.label}</div>
                            <div className="text-[11px] mt-0.5" style={{ color: "#525252" }}>{m.desc}</div>
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
                        <select value={license} onChange={e => setLicense(e.target.value)}
                          className="w-full px-3 py-2.5 text-sm rounded-lg outline-none cursor-pointer"
                          style={{ background: "#1a1a1a", border: "1px solid #2e2e2e", color: "#f5f5f5", fontFamily: "inherit" }}>
                          {LICENSE_OPTIONS.map(l => <option key={l}>{l}</option>)}
                        </select>
                      </div>
                      <div>
                        <SectionLabel>{mode === "fixed" ? "Fixed Price ($)" : "Amount (%)"}</SectionLabel>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: "#525252" }}>
                            {mode === "fixed" ? "$" : "%"}
                          </span>
                          <input type="number" value={value} onChange={e => setValue(e.target.value)} min={0}
                            className="w-full pl-7 pr-3 py-2.5 text-sm rounded-lg outline-none"
                            style={{ background: "#1a1a1a", border: "1px solid #2e2e2e", color: "#f5f5f5", fontFamily: "inherit" }}
                            onFocus={e => (e.currentTarget.style.borderColor = "#ffffff")}
                            onBlur={e => (e.currentTarget.style.borderColor = "#2e2e2e")}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Track selection */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <SectionLabel>Select Tracks</SectionLabel>
                      <button onClick={toggleAll} className="text-xs cursor-pointer" style={{ color: "#a3a3a3", background: "none", border: "none" }}>
                        {selectedIds.length === rows.length ? "Deselect all" : "Select all"}
                      </button>
                    </div>
                    <div className="flex flex-col gap-1 max-h-[240px] overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.06) transparent" }}>
                      {rows.map(r => (
                        <button key={r.id} onClick={() => toggleRow(r.id)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-left transition-colors"
                          style={{
                            background: selectedIds.includes(r.id) ? "rgba(255,255,255,0.06)" : "transparent",
                            border: `1px solid ${selectedIds.includes(r.id) ? "rgba(255,255,255,0.12)" : "transparent"}`,
                          }}>
                          <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                            style={{ background: selectedIds.includes(r.id) ? "#ffffff" : "#1a1a1a", border: "1px solid #2e2e2e" }}>
                            {selectedIds.includes(r.id) && <div style={{ width: 8, height: 8, borderRadius: 2, background: "#080808" }} />}
                          </div>
                          <img src={r.coverImage} alt={r.trackTitle} style={{ width: 32, height: 32, borderRadius: 6, objectFit: "cover" }} />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold truncate" style={{ color: "#f5f5f5" }}>{r.trackTitle}</div>
                            <div className="text-[11px]" style={{ color: "#525252" }}>{r.artistName} · {r.genre}</div>
                          </div>
                          <div className="text-xs" style={{ color: "#525252" }}>
                            {r.basicPrice ? `$${r.basicPrice}` : "No pricing"}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // Preview step
                <div className="flex flex-col gap-4">
                  <div className="rounded-xl p-4" style={{ background: "#1a1a1a", border: "1px solid #2e2e2e" }}>
                    <div className="text-sm font-bold mb-3" style={{ color: "#f5f5f5" }}>Preview Changes</div>
                    <div className="flex flex-col gap-2">
                      {rows.filter(r => selectedIds.includes(r.id)).slice(0, 5).map(r => (
                        <div key={r.id} className="flex items-center gap-3 text-sm">
                          <img src={r.coverImage} alt={r.trackTitle} style={{ width: 28, height: 28, borderRadius: 5, objectFit: "cover" }} />
                          <span className="flex-1" style={{ color: "#a3a3a3" }}>{r.trackTitle}</span>
                          <span style={{ color: "#525252" }}>${r.basicPrice ?? "—"}</span>
                          <span style={{ color: "#737373" }}>→</span>
                          <span style={{ color: "#f5f5f5", fontWeight: 600 }}>
                            {mode === "fixed" ? `$${value}` :
                              mode === "increase" ? `$${Math.round((r.basicPrice ?? 0) * (1 + Number(value) / 100))}` :
                                mode === "decrease" ? `$${Math.round((r.basicPrice ?? 0) * (1 - Number(value) / 100))}` :
                                  "Default"}
                          </span>
                        </div>
                      ))}
                      {selectedIds.length > 5 && <div className="text-xs" style={{ color: "#525252" }}>+{selectedIds.length - 5} more tracks</div>}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ borderTop: "1px solid #1f1f1f" }}>
              <button onClick={() => step === "preview" ? setStep("configure") : onClose()}
                className="px-4 py-2.5 text-sm font-medium rounded-lg cursor-pointer transition-colors"
                style={{ background: "transparent", border: "1px solid #1f1f1f", color: "#a3a3a3" }}>
                {step === "preview" ? "Back" : "Cancel"}
              </button>

              <div className="flex gap-2.5">
                {step === "configure" ? (
                  <button
                    onClick={() => setStep("preview")}
                    disabled={selectedIds.length === 0}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg cursor-pointer transition-colors"
                    style={{ background: selectedIds.length > 0 ? "rgba(255,255,255,0.08)" : "#1a1a1a", color: selectedIds.length > 0 ? "#f5f5f5" : "#525252", border: "1px solid #2e2e2e" }}
                  >
                    <Eye size={14} /> Preview Changes
                  </button>
                ) : (
                  <button
                    onClick={handleApply}
                    disabled={applying}
                    className="px-5 py-2.5 text-sm font-semibold rounded-lg cursor-pointer transition-colors"
                    style={{ background: "#ffffff", color: "#080808", opacity: applying ? 0.7 : 1 }}
                  >
                    {applying ? "Applying…" : `Apply to ${selectedIds.length} track${selectedIds.length !== 1 ? "s" : ""}`}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] font-bold uppercase tracking-[0.07em] mb-2" style={{ color: "#525252" }}>{children}</div>;
}
