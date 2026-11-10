import { ALL_RELEASES_URL } from "@/releases/links.ts";
import { SectionHeading } from "./SectionHeading";

/** Shown instead of the installer cards when the release data cannot be loaded. */
export function DownloadsUnavailable() {
  return (
    <section id="platforms" className="mx-auto max-w-[var(--sc-content-width)] px-6 py-20">
      <SectionHeading
        kicker="Download"
        title="Made for Windows and Linux"
        intro="Downloads are temporarily unavailable on this page. You can still get every version from GitHub."
      />
      <a
        href={ALL_RELEASES_URL}
        className="btn-primary inline-flex h-11 items-center rounded-full px-5 text-sm font-semibold text-white"
      >
        Open the releases on GitHub
      </a>
    </section>
  );
}
