// components/customers/CustomerFormModal.tsx

"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Customer, CustomerFormData, CustomerStatus } from "@/services/customers/types";
import Button from "@/components/ui/Button";

interface Props {
  open: boolean;
  customer: Customer | null;
  onClose: () => void;
  onSave: (data: CustomerFormData, id?: string) => Promise<void>;
}

const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany",
  "France", "Nigeria", "Ghana", "South Africa", "Brazil", "Japan", "South Korea",
];
const LANGUAGES = ["English", "Spanish", "French", "German", "Portuguese", "Japanese", "Korean"];
const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "NGN", "BRL"];

const STATUS_OPTIONS: { value: CustomerStatus; label: string }[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "SUSPENDED", label: "Suspended" },
  { value: "ARCHIVED", label: "Archived" },
];

function emptyForm(): CustomerFormData {
  return {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    country: "",
    language: "English",
    currency: "USD",
    status: "ACTIVE",
    isVip: false,
    isVerified: false,
    marketingConsent: false,
  };
}

function customerToForm(c: Customer): CustomerFormData {
  return {
    firstName: c.firstName,
    lastName: c.lastName,
    username: c.username,
    email: c.email,
    phone: c.phone || "",
    country: c.country,
    language: c.language,
    currency: c.currency,
    status: c.status,
    isVip: c.isVip,
    isVerified: c.isVerified,
    marketingConsent: c.marketingConsent,
  };
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-semibold text-[color:var(--text-secondary)] block mb-1.5">{children}</label>;
}

function FormInput({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        {...props}
        className="w-full bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-lg text-foreground text-sm font-inherit px-3 py-2.5 outline-none transition-colors focus:border-accent placeholder:text-[color:var(--text-muted)]"
      />
    </div>
  );
}

function FormSelect({ label, children, value, onChange }: {
  label: string;
  children: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-[color:var(--bg-input)] border border-[color:var(--border-subtle)] rounded-lg text-foreground text-sm font-inherit px-3 py-2.5 pr-9 outline-none transition-colors focus:border-accent appearance-none cursor-pointer [&>option]:bg-surface"
        >
          {children}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)] pointer-events-none" />
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[color:var(--text-muted)] border-b border-[color:var(--border-subtle)] pb-2.5 mb-4">
      {children}
    </div>
  );
}

import { ChevronDown } from "lucide-react";

export default function CustomerFormModal({ open, customer, onClose, onSave }: Props) {
  const [form, setForm] = useState<CustomerFormData>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerFormData, string>>>({});

  useEffect(() => {
    if (open) {
      setForm(customer ? customerToForm(customer) : emptyForm());
      setErrors({});
    }
  }, [open, customer]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!open) return null;

  const set = (key: keyof CustomerFormData, value: unknown) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    if (!form.username.trim()) e.username = "Username is required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email is required";
    if (!form.country) e.country = "Country is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave(form, customer?.id);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/65 z-[390] backdrop-blur-sm" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(560px,95vw)] max-h-[92vh] bg-surface border border-[#31386d] rounded-[20px] z-[400] flex flex-col shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[color:var(--border-subtle)] flex-shrink-0">
          <div>
            <div className="text-[17px] font-bold text-foreground">
              {customer ? "Edit Customer" : "Create Customer"}
            </div>
            <div className="text-xs text-[color:var(--text-muted)] mt-0.5">
              {customer ? `Editing ${customer.firstName} ${customer.lastName}` : "Add a new customer"}
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg border-0 bg-transparent cursor-pointer flex items-center justify-center text-[color:var(--text-muted)] hover:bg-elevated hover:text-foreground transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="flex flex-col gap-4">
            <SectionTitle>Basic Information</SectionTitle>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormInput
                label="First Name *"
                placeholder="John"
                value={form.firstName}
                onChange={e => set("firstName", e.target.value)}
              />
              {errors.firstName && <span className="text-[11px] text-danger -mt-2">{errors.firstName}</span>}
              <FormInput
                label="Last Name *"
                placeholder="Doe"
                value={form.lastName}
                onChange={e => set("lastName", e.target.value)}
              />
              {errors.lastName && <span className="text-[11px] text-danger -mt-2">{errors.lastName}</span>}
            </div>

            <FormInput
              label="Username *"
              placeholder="johndoe"
              value={form.username}
              onChange={e => set("username", e.target.value)}
            />
            {errors.username && <span className="text-[11px] text-danger -mt-2">{errors.username}</span>}

            <FormInput
              label="Email *"
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={e => set("email", e.target.value)}
            />
            {errors.email && <span className="text-[11px] text-danger -mt-2">{errors.email}</span>}

            <FormInput
              label="Phone"
              placeholder="+1 555 123 4567"
              value={form.phone}
              onChange={e => set("phone", e.target.value)}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <FormSelect label="Country *" value={form.country} onChange={v => set("country", v)}>
                <option value="" className="bg-surface">Select country</option>
                {COUNTRIES.map(c => <option key={c} value={c} className="bg-surface">{c}</option>)}
              </FormSelect>
              {errors.country && <span className="text-[11px] text-danger -mt-2">{errors.country}</span>}
              <FormSelect label="Language" value={form.language} onChange={v => set("language", v)}>
                {LANGUAGES.map(l => <option key={l} value={l} className="bg-surface">{l}</option>)}
              </FormSelect>
              <FormSelect label="Currency" value={form.currency} onChange={v => set("currency", v)}>
                {CURRENCIES.map(c => <option key={c} value={c} className="bg-surface">{c}</option>)}
              </FormSelect>
            </div>

            <SectionTitle>Status & Preferences</SectionTitle>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormSelect label="Status" value={form.status} onChange={v => set("status", v as CustomerStatus)}>
                {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value} className="bg-surface">{s.label}</option>)}
              </FormSelect>
              <div className="flex items-end gap-4 pb-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isVip}
                    onChange={e => set("isVip", e.target.checked)}
                    className="accent-accent w-4 h-4 cursor-pointer"
                  />
                  <span className="text-sm text-[color:var(--text-secondary)]">VIP</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isVerified}
                    onChange={e => set("isVerified", e.target.checked)}
                    className="accent-accent w-4 h-4 cursor-pointer"
                  />
                  <span className="text-sm text-[color:var(--text-secondary)]">Verified</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.marketingConsent}
                    onChange={e => set("marketingConsent", e.target.checked)}
                    className="accent-accent w-4 h-4 cursor-pointer"
                  />
                  <span className="text-sm text-[color:var(--text-secondary)]">Marketing</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-[color:var(--border-subtle)] flex-shrink-0">
          <Button onClick={onClose} variant="secondary" size="md">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={saving}
            variant="primary"
            size="md"
            loading={saving}
          >
            {saving ? "Saving..." : customer ? "Save Changes" : "Create Customer"}
          </Button>
        </div>
      </div>
    </>
  );
}
