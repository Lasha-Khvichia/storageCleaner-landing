import { FEATURES } from "@/content/features";
import { SectionHeading } from "./SectionHeading";

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-[var(--sc-content-width)] px-6 py-20">
      <SectionHeading
        kicker="Features"
        title="Everything you need to win your disk back"
        intro="A full report of what uses your space, an honest rating for every item, and deletes you can undo."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, body }) => (
          <article key={title} className="glass rounded-card p-6">
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-control bg-accent-950 text-accent-300">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <h3 className="text-base font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
