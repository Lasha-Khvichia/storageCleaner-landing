import type { OsId } from "@/releases/types.ts";

/** Simple marks for each OS (lucide has no brand icons). */
export function OsIcon({ os, className = "h-4 w-4" }: { os: OsId; className?: string }) {
  if (os === "windows") {
    return (
      <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden>
        <path d="M0 2.3 6.5 1.4v6.1H0zM7.3 1.3 16 0v7.5H7.3zM0 8.4h6.5v6.2L0 13.7zM7.3 8.4H16V16l-8.7-1.2z" />
      </svg>
    );
  }
  // Linux: a terminal prompt, the most neutral mark across distributions.
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <rect x="1" y="2" width="14" height="12" rx="2.5" />
      <path d="m4 6 2.2 2L4 10M8 10.5h4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export const OS_NAME: Record<OsId, string> = { windows: "Windows", linux: "Linux" };
