// components/customers/CustomerFormModal.tsx
"use client";

import { useState, useEffect } from "react";
import type { Customer, CustomerFormData, CustomerStatus } from "@/services/customers/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { ModalClose, SectionTitle, ModalFooter } from "@/components/ui/ModalPrimitives";

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
    firstName: "", lastName: "", username: "", email: "", phone: "",
    country: "", language: "English", currency: "USD",
    status: "ACTIVE", isVip: false, isVerified: false, marketingConsent: false,
  };
}

function customerToForm(c: Customer): CustomerFormData {
  return {
    firstName: c.firstName, lastName: c.lastName, username: c.username,
    email: c.email, phone: c.phone || "", country: c.country,
    language: c.language, currency: c.currency, status: c.status,
    isVip: c.isVip, isVerified: c.isVerified, marketingConsent: c.marketingConsent,
  };
}

export default function CustomerFormModal({ open, customer, onClose, onSave }: Props) {
  const [form, setForm] = useState<CustomerFormData>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerFormData, string>>>({});


  useEffect(() => {
    if (open) { setForm(customer ? customerToForm(customer) : emptyForm()); setErrors({}); }
  }, [open, customer]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
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
    try { await onSave(form, customer?.id); onClose(); }
    finally { setSaving(false); }
  };

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/65 z-[390] backdrop-blur-sm" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(560px,95vw)] max-h-[92vh] bg-surface border border-[#31386d] rounded-[20px] z-[400] flex flex-col shadow-[0_24px_80px_rgba(0,0,0,0.6)]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[color:var(--border-subtle)] shrink-0">
          <div>
            <p className="text-[17px] font-bold text-foreground">{customer ? "Edit Customer" : "Create Customer"}</p>
            <p className="text-xs text-[color:var(--text-muted)] mt-0.5">{customer ? `Editing ${customer.firstName} ${customer.lastName}` : "Add a new customer"}</p>
          </div>
          <ModalClose onClose={onClose} />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-4">
          <SectionTitle>Basic Information</SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="First Name *" placeholder="John" value={form.firstName} onChange={e => set("firstName", e.target.value)} error={errors.firstName} />
            <Input label="Last Name *" placeholder="Doe" value={form.lastName} onChange={e => set("lastName", e.target.value)} error={errors.lastName} />
          </div>

          <Input label="Username *" placeholder="johndoe" value={form.username} onChange={e => set("username", e.target.value)} error={errors.username} />
          <Input label="Email *" type="email" placeholder="john@example.com" value={form.email} onChange={e => set("email", e.target.value)} error={errors.email} />
          <Input label="Phone" placeholder="+1 555 123 4567" value={form.phone} onChange={e => set("phone", e.target.value)} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Select label="Country *" value={form.country} onChange={v => set("country", v)} error={errors.country}>
              <option value="" className="bg-surface">Select country</option>
              {COUNTRIES.map(c => <option key={c} value={c} className="bg-surface">{c}</option>)}
            </Select>
            <Select label="Language" value={form.language} onChange={v => set("language", v)}>
              {LANGUAGES.map(l => <option key={l} value={l} className="bg-surface">{l}</option>)}
            </Select>
            <Select label="Currency" value={form.currency} onChange={v => set("currency", v)}>
              {CURRENCIES.map(c => <option key={c} value={c} className="bg-surface">{c}</option>)}
            </Select>
          </div>

          <SectionTitle>Status & Preferences</SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Select label="Status" value={form.status} onChange={v => set("status", v as CustomerStatus)}>
              {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value} className="bg-surface">{s.label}</option>)}
            </Select>
            <div className="flex items-end gap-4 pb-1">
              {[["isVip", "VIP"], ["isVerified", "Verified"], ["marketingConsent", "Marketing"]].map(([k, l]) => (
                <label key={k} className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={form[k as keyof CustomerFormData] as boolean} onChange={e => set(k as keyof CustomerFormData, e.target.checked)} className="accent-accent w-4 h-4 cursor-pointer" />
                  <span className="text-sm text-[color:var(--text-secondary)]">{l}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <ModalFooter
          onClose={onClose}
          onSave={handleSubmit}
          saving={saving}
          saveLabel={customer ? "Save Changes" : "Create Customer"}
        />
      </div>
    </>
  );
}
