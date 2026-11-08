import { Lock } from "lucide-react";
import { SAFETY_LEVELS } from "@/content/safety-levels";
import { SectionHeading } from "./SectionHeading";

export function Safety() {
  return (
    <section id="safety" className="mx-auto max-w-[var(--sc-content-width)] px-6 py-20">
      <SectionHeading
        kicker="Safety first"
        title="It tells you what is safe, and why"
        intro="Every file and folder gets one of four ratings, each with a reason you can read. The same colours mean the same thing everywhere in the app."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SAFETY_LEVELS.map((s) => (
          <article key={s.level} className="glass rounded-card p-6">
            <span className={`inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold ${s.text}`}>
              <span className={`h-2 w-2 rounded-full ${s.dot}`} />
              {s.name}
            </span>
            <p className="mt-4 text-sm font-medium text-fg">{s.body}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.examples}</p>
          </article>
        ))}
      </div>
      <p className="mt-6 flex items-start gap-2 text-sm text-muted">
        <Lock className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" aria-hidden />
        Safety checks run in the app&apos;s core and are repeated right before each deletion, so nothing in the interface
        can skip them. Links are never followed.
      </p>
    </section>
  );
}
