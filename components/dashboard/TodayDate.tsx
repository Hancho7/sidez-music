// components/dashboard/TodayDate.tsx
"use client";

import { useState, useEffect } from "react";

export default function TodayDate() {
  const [label, setLabel] = useState<string>("");

  // Only runs on the client, so server HTML leaves this empty and React
  // fills it in after hydration — no mismatch.
  useEffect(() => {
    setLabel(
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    );
  }, []);

  if (!label) return null;

  return (
    <span className="text-sm text-[color:var(--text-muted)]">{label}</span>
  );
}
