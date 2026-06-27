// components/ui/DeviceGuard.tsx
"use client";

import { useState, useEffect } from "react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  minWidth?: number; // Default: 1024px (laptop)
}

export function DeviceGuard({
  children,
  fallback,
  minWidth = 1024
}: Props) {
  const [isValidDevice, setIsValidDevice] = useState<boolean | null>(null);

  useEffect(() => {
    const checkDevice = () => {
      setIsValidDevice(window.innerWidth >= minWidth);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => window.removeEventListener('resize', checkDevice);
  }, [minWidth]);

  // Prevent flash of content before hydration
  if (isValidDevice === null) {
    return null;
  }

  if (!isValidDevice) {
    return fallback ?? (
      <div className="flex items-center justify-center min-h-screen bg-surface p-8">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-6">💻</div>
          <h1 className="text-2xl font-bold text-foreground mb-3">
            Desktop Only
          </h1>
          <p className="text-[color:var(--text-secondary)]">
            This dashboard is optimized for laptop and desktop screens.
            Please open this page on a larger device.
          </p>
          <div className="mt-6 text-xs text-[color:var(--text-muted)]">
            Minimum width: {minWidth}px
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
