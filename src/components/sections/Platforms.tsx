import type { OsId, Release } from "@/releases/types.ts";
import { formatBytes } from "@/releases/format-release.ts";
import { OS_NAME, OsIcon } from "../OsIcon";
import { DownloadsUnavailable } from "./DownloadsUnavailable";
import { SectionHeading } from "./SectionHeading";

const HOW_TO: Record<OsId, string> = {
  windows: "Run the setup and choose who to install for. Windows may say “unknown publisher”: click More info → Run anyway.",
  linux: "Double-click the .deb to install it from your software manager, or make the AppImage executable and run it.",
};

/** One card per OS with a direct button for each of its installers. */
export function Platforms({ release }: { release: Release | null }) {
  if (!release) return <DownloadsUnavailable />;
  const oses: OsId[] = ["windows", "linux"];
  return (
    <section id="platforms" className="mx-auto max-w-[var(--sc-content-width)] px-6 py-20">
      <SectionHeading
        kicker={`Download v${release.version}`}
        title="Made for Windows and Linux"
        intro="Each version follows its own system: the Recycle Bin or the Trash, its system folders, its drives and its words."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {oses.map((os) => (
          <article key={os} className="glass flex flex-col rounded-card p-7">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-control bg-surface-raised text-accent-300">
                <OsIcon os={os} className="h-5 w-5" />
              </span>
              <h3 className="text-xl font-semibold">{OS_NAME[os]}</h3>
            </div>
            <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">{HOW_TO[os]}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {release.installers
                .filter((i) => i.os === os)
                .map((i, n) => (
                  <a
                    key={i.id}
                    href={i.url}
                    className={
                      n === 0
                        ? "btn-primary inline-flex h-11 items-center rounded-full px-5 text-sm font-semibold text-white"
                        : "inline-flex h-11 items-center rounded-full border border-line bg-surface px-5 text-sm font-medium hover:bg-surface-raised"
                    }
                  >
                    {i.label} · {formatBytes(i.sizeBytes)}
                  </a>
                ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
