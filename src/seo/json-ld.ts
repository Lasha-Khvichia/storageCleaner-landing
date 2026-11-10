import { FAQ } from "../content/faq.ts";
import type { Release } from "../releases/types.ts";
import { SITE_DESCRIPTION, SITE_NAME } from "./site-info.ts";

type JsonLd = Record<string, unknown>;

/** JSON for a <script type="application/ld+json">: `<` is escaped so the data can never close the tag. */
export function serializeJsonLd(data: JsonLd): string {
  return JSON.stringify(data).replace(/</g, String.raw`\u003c`);
}

/** SoftwareApplication; version, date and download link only when a live release is known. */
export function buildSoftwareApplication(siteUrl: string, release: Release | null): JsonLd {
  const app: JsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: siteUrl,
    image: `${siteUrl}/opengraph-image`,
    operatingSystem: "Windows 10, Windows 11, Linux",
    applicationCategory: "UtilitiesApplication",
    offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
  };
  const first = release?.installers[0];
  if (release && first) {
    app.softwareVersion = release.version;
    app.datePublished = release.releasedAt;
    app.downloadUrl = first.url;
  }
  return app;
}

/** FAQPage from src/content/faq.ts. */
export function buildFaqPage(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}
