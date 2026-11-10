import type { SyncStatus } from "@/admin/types";
import { formatTime } from "@/admin/format-time";
import { SyncButton } from "./SyncButton";

function describe(status: SyncStatus): string {
  if (status.running) return "A sync is running now.";
  if (status.finishedAt === null) return "No sync has run since the backend started.";
  const { added, updated, skipped } = status.counts;
  const counts = `added ${added}, updated ${updated}, skipped ${skipped}`;
  return `Last sync ${formatTime(status.finishedAt)}: ${status.result ?? "no result"} (${counts}).`;
}

export function SyncPanel({ status }: { status: SyncStatus | null }) {
  return (
    <section aria-labelledby="sync-heading" className="mb-10 rounded-card border border-line bg-surface p-4">
      <h2 id="sync-heading" className="text-lg font-semibold">
        GitHub sync
      </h2>
      <p className="my-2 text-sm text-muted">{status ? describe(status) : "Sync status is unavailable."}</p>
      <SyncButton />
    </section>
  );
}
