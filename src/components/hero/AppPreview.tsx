/** A small picture of the app's dashboard, built from the same tokens. */
const BREAKDOWN = [
  { label: "Safe", size: "3.81 GB", share: 4, dot: "bg-safe" },
  { label: "Review", size: "1.60 GB", share: 2, dot: "bg-review" },
  { label: "Unknown", size: "7.84 GB", share: 9, dot: "bg-unknown" },
  { label: "Protected", size: "78.8 GB", share: 85, dot: "bg-protected" },
];

const TILES = [
  { label: "Free space", value: "5.23 GB", tone: "text-accent-400" },
  { label: "Safe to free now", value: "559 MB", tone: "text-positive-300" },
  { label: "Files scanned", value: "1,820,383", tone: "text-fg" },
];

export function AppPreview() {
  return (
    <div className="glass rounded-panel p-5" aria-hidden>
      <div className="mb-4 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
        ))}
        <span className="ml-3 text-xs text-muted">storageCleaner / Scan &amp; Explore</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {TILES.map((t) => (
          <div key={t.label} className="rounded-card border border-line bg-surface p-3.5">
            <p className="text-[11px] text-muted">{t.label}</p>
            <p className={`mt-1 text-lg font-bold tabular-nums ${t.tone}`}>{t.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-card border border-line bg-surface p-4">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted">Safety breakdown</p>
        <div className="flex h-2 overflow-hidden rounded-full">
          {BREAKDOWN.map((b) => (
            <span key={b.label} className={b.dot} style={{ width: `${b.share}%` }} />
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
          {BREAKDOWN.map((b) => (
            <span key={b.label} className="flex items-center gap-1.5 text-muted">
              <span className={`h-2 w-2 rounded-full ${b.dot}`} />
              {b.label} <span className="font-semibold text-fg">{b.size}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
