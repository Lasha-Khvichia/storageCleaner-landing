import type { AdminRelease } from "@/admin/types";
import { formatTime } from "@/admin/format-time";
import { ReleaseButtons } from "./ReleaseButtons";

function visibility(release: AdminRelease): string {
  if (release.removedAt !== null) return "Removed";
  return release.hidden ? "Hidden" : "Visible";
}

export function ReleaseRow({ release }: { release: AdminRelease }) {
  const removed = release.removedAt !== null;
  return (
    <tr className="border-t border-line align-top">
      <th scope="row" className="px-3 py-3 text-left font-medium">
        {release.version}
      </th>
      <td className="px-3 py-3 text-muted">{formatTime(release.releasedAt)}</td>
      <td className="px-3 py-3">{visibility(release)}</td>
      <td className="px-3 py-3 text-muted">{release.installers.length}</td>
      <td className="px-3 py-3">
        <ReleaseButtons id={release.id} version={release.version} hidden={release.hidden} removed={removed} />
      </td>
    </tr>
  );
}
