import { FAQ } from "@/content/faq";
import { SectionHeading } from "./SectionHeading";

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-[var(--sc-content-width)] px-6 py-20">
      <SectionHeading
        kicker="Questions"
        title="Frequently asked questions"
        intro="Short answers about what storageCleaner does and what it deletes."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {FAQ.map(({ question, answer }) => (
          <article key={question} className="glass rounded-card p-6">
            <h3 className="text-base font-semibold">{question}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
