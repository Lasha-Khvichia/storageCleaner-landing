import Link from "next/link";
import { adminHref, lastPage, pageNumbers, showingText, type PageParam, type PageState } from "@/admin/paging";

const ITEM = "inline-flex h-8 min-w-8 items-center justify-center rounded-control border px-2 text-sm";
const LINK = `${ITEM} border-line bg-surface text-fg hover:bg-surface-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400`;
const CURRENT = `${ITEM} border-accent-500 bg-accent-500 text-fg`;
const OFF = `${ITEM} border-line text-muted opacity-50`;

interface PagerProps {
  label: string;
  param: PageParam;
  pages: PageState;
  total: number;
}

export function Pager({ label, param, pages, total }: PagerProps) {
  const current = pages[param];
  const last = lastPage(total);
  const href = (n: number) => adminHref({ ...pages, [param]: n });
  const step = (text: string, target: number, enabled: boolean) =>
    enabled ? (
      <Link href={href(target)} scroll={false} className={`${LINK} w-24`}>
        {text}
      </Link>
    ) : (
      <span aria-disabled="true" className={`${OFF} w-24`}>
        {text}
      </span>
    );
  return (
    <nav aria-label={label} className="mt-3 flex min-h-8 flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-muted">{showingText(current, total)}</p>
      {last > 1 && (
        <div className="flex flex-wrap items-center gap-1">
          {step("Previous", current - 1, current > 1)}
          {pageNumbers(current, last).map((item, index) =>
            item === "gap" ? (
              <span key={`gap-${index}`} className="px-1 text-muted">
                …
              </span>
            ) : item === current ? (
              <span key={item} aria-current="page" className={CURRENT}>
                {item}
              </span>
            ) : (
              <Link key={item} href={href(item)} scroll={false} aria-label={`Page ${item}`} className={LINK}>
                {item}
              </Link>
            ),
          )}
          {step("Next", current + 1, current < last)}
        </div>
      )}
    </nav>
  );
}
