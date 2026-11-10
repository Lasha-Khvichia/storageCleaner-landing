/** Page numbers for the admin lists: parsing the URL, clamping, links and the "Showing" text. */
export const PAGE_SIZE = 20;
/** The backend answers 400 for a page above this. */
export const MAX_PAGE = 10000;

export type PageParam = "versions" | "audit";
export interface PageState {
  versions: number;
  audit: number;
}
export type PageItem = number | "gap";

/** Only 1 to 5 digits and at least 1 count (capped at MAX_PAGE); anything else is page 1. */
export function parsePageParam(raw: string | string[] | undefined): number {
  if (typeof raw !== "string" || !/^[0-9]{1,5}$/.test(raw)) return 1;
  return Math.min(MAX_PAGE, Math.max(1, Number(raw)));
}

export function lastPage(total: number): number {
  return Math.max(1, Math.ceil(total / PAGE_SIZE));
}

/** The last page when the asked page is past the end of a non-empty list. */
export function clampPage(page: number, total: number): number {
  return total > 0 ? Math.min(page, lastPage(total)) : page;
}

/** `/admin` with each page param left out while it is 1. */
export function adminHref(pages: PageState): string {
  const query = [
    pages.versions > 1 ? `versions=${pages.versions}` : "",
    pages.audit > 1 ? `audit=${pages.audit}` : "",
  ].filter(Boolean);
  return query.length === 0 ? "/admin" : `/admin?${query.join("&")}`;
}

/** First, last, current and its neighbours; "gap" stands for skipped numbers. */
export function pageNumbers(current: number, last: number): PageItem[] {
  const wanted = [...new Set([1, current - 1, current, current + 1, last])]
    .filter((n) => n >= 1 && n <= last)
    .sort((a, b) => a - b);
  const items: PageItem[] = [];
  wanted.forEach((n, index) => {
    const before = wanted[index - 1];
    if (before !== undefined && n - before === 2) items.push(before + 1);
    else if (before !== undefined && n - before > 2) items.push("gap");
    items.push(n);
  });
  return items;
}

export function showingText(page: number, total: number): string {
  if (total === 0) return "No entries";
  const from = (page - 1) * PAGE_SIZE + 1;
  return `Showing ${from}–${Math.min(page * PAGE_SIZE, total)} of ${total}`;
}
