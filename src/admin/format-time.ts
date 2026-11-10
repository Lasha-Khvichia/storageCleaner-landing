/** "2026-11-10 14:05 UTC" from an ISO timestamp; fixed zone so server and browser always agree. */
export function formatTime(iso: string): string {
  return `${new Date(iso).toISOString().slice(0, 16).replace("T", " ")} UTC`;
}
