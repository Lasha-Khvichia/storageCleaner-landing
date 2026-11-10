import type { AuditEntry } from "@/admin/types";
import { formatTime } from "@/admin/format-time";

export function AuditLog({ entries }: { entries: AuditEntry[] }) {
  return (
    <section aria-labelledby="audit-heading" className="mt-10">
      <h2 id="audit-heading" className="mb-3 text-lg font-semibold">
        Audit log
      </h2>
      {entries.length === 0 ? (
        <p className="text-sm text-muted">Nothing has been changed yet.</p>
      ) : (
        <ul className="divide-y divide-line rounded-card border border-line bg-surface text-sm">
          {entries.map((entry) => (
            <li key={entry.id} className="flex flex-wrap gap-x-3 gap-y-1 px-3 py-2">
              <time dateTime={entry.at} className="text-muted">
                {formatTime(entry.at)}
              </time>
              <strong>{entry.githubLogin}</strong>
              <span>{entry.action}</span>
              {entry.releaseId !== null && <span className="text-muted">release #{entry.releaseId}</span>}
              {entry.detail && <span className="text-muted">{entry.detail}</span>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
