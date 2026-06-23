// components/dashboard/DashboardSkeletons.tsx

function Pulse({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`bg-gradient-to-r from-[#1a1f3a] via-[#242b50] to-[#1a1f3a] bg-[length:200%_100%] animate-[shimmer_1.6s_infinite] rounded-lg ${className || ""}`}
      style={style}
    />
  );
}

export function KpiSkeleton() {
  return (
    <>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }`}</style>
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-surface border border-[color:var(--border-subtle)] rounded-[16px] p-5 flex flex-col gap-3.5">
            <div className="flex justify-between">
              <div className="flex flex-col gap-2">
                <Pulse style={{ width: 80, height: 10 }} />
                <Pulse style={{ width: 120, height: 26 }} />
              </div>
              <Pulse style={{ width: 80, height: 32 }} />
            </div>
            <Pulse style={{ width: 100, height: 18 }} />
          </div>
        ))}
      </div>
    </>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-surface border border-[color:var(--border-subtle)] rounded-[18px] p-6">
      <div className="flex justify-between mb-6">
        <div className="flex flex-col gap-2">
          <Pulse style={{ width: 120, height: 10 }} />
          <Pulse style={{ width: 160, height: 28 }} />
          <Pulse style={{ width: 100, height: 14 }} />
        </div>
        <Pulse style={{ width: 160, height: 38, borderRadius: 10 }} />
      </div>
      <Pulse style={{ width: "100%", height: 240, borderRadius: 12 }} />
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="bg-surface border border-[color:var(--border-subtle)] rounded-[18px] p-6">
      <div className="flex justify-between items-center mb-5">
        <div className="flex flex-col gap-2">
          <Pulse style={{ width: 80, height: 10 }} />
          <Pulse style={{ width: 120, height: 18 }} />
        </div>
        <Pulse style={{ width: 36, height: 36, borderRadius: 10 }} />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4 py-3 border-b border-[#1a2038] items-center">
          <Pulse style={{ width: 20, height: 14 }} />
          <Pulse style={{ width: 130, height: 14 }} />
          <Pulse style={{ width: 80, height: 14 }} />
          <Pulse style={{ width: 50, height: 14 }} />
          <Pulse style={{ width: 60, height: 14 }} />
          <Pulse style={{ width: 50, height: 14 }} />
        </div>
      ))}
    </div>
  );
}

export function ActivitySkeleton() {
  return (
    <div className="bg-surface border border-[color:var(--border-subtle)] rounded-[18px] p-6">
      <div className="flex justify-between items-center mb-5">
        <div className="flex flex-col gap-2">
          <Pulse style={{ width: 80, height: 10 }} />
          <Pulse style={{ width: 100, height: 18 }} />
        </div>
        <Pulse style={{ width: 60, height: 20 }} />
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex gap-3 py-3 border-b border-[#1a2038] items-center">
          <Pulse style={{ width: 32, height: 32, borderRadius: 9 }} />
          <div className="flex-1 flex flex-col gap-1.5">
            <Pulse style={{ width: 60, height: 12 }} />
            <Pulse style={{ width: "80%", height: 13 }} />
          </div>
          <Pulse style={{ width: 50, height: 12 }} />
        </div>
      ))}
    </div>
  );
}

export function SystemSkeleton() {
  return (
    <div className="bg-surface border border-[color:var(--border-subtle)] rounded-[18px] p-6">
      <div className="flex flex-col gap-2 mb-5">
        <Pulse style={{ width: 100, height: 10 }} />
        <Pulse style={{ width: 140, height: 18 }} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-input border border-[color:var(--border-subtle)] rounded-xl p-4 flex flex-col gap-2.5">
            <Pulse style={{ width: 34, height: 34, borderRadius: 9 }} />
            <div className="flex flex-col gap-1.5">
              <Pulse style={{ width: 80, height: 20 }} />
              <Pulse style={{ width: 100, height: 12 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
