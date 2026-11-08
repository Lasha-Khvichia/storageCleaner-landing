/** Kicker + title + intro used at the top of every section. */
export function SectionHeading({ kicker, title, intro }: { kicker: string; title: string; intro: string }) {
  return (
    <div className="mb-12 max-w-2xl">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent-400">{kicker}</p>
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      <p className="mt-4 text-lg leading-relaxed text-muted">{intro}</p>
    </div>
  );
}
