import type { AdminRelease } from "@/admin/types";
import { ReleaseRow } from "./ReleaseRow";

const HEADINGS = ["Version", "Released", "Status", "Installers", "Actions"];

export function ReleaseTable({ releases }: { releases: AdminRelease[] }) {
  if (releases.length === 0) return <p className="text-sm text-muted">No versions yet. Run a sync.</p>;
  return (
    <div className="overflow-x-auto rounded-card border border-line bg-surface">
      <table className="w-full min-w-[40rem] text-sm">
        <caption className="sr-only">All versions, including hidden and removed ones</caption>
        <thead className="text-left text-muted">
          <tr>
            {HEADINGS.map((heading) => (
              <th key={heading} scope="col" className="px-3 py-2 font-medium">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {releases.map((release) => (
            <ReleaseRow key={release.id} release={release} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
