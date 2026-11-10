import { SiteHeader } from "@/components/header/SiteHeader";
import { Hero } from "@/components/hero/Hero";
import { Faq } from "@/components/sections/Faq";
import { Features } from "@/components/sections/Features";
import { Platforms } from "@/components/sections/Platforms";
import { Safety } from "@/components/sections/Safety";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { getLatestRelease } from "@/releases/latest-release.ts";
import { JsonLd } from "@/seo/JsonLd";
import { buildFaqPage, buildSoftwareApplication } from "@/seo/json-ld";
import { SITE_URL } from "@/seo/site-url";

/**
 * Rebuild the page at most every 60 s, even when the backend could not be
 * reached at build time. Without this, a build that got no release (backend
 * asleep, env var missing) stays static with the "downloads unavailable"
 * fallback until the next deploy. Must be a literal; keep it equal to
 * REVALIDATE_SECONDS in src/releases/latest-release.ts.
 */
export const revalidate = 60;

/** The landing page. Release data comes from one place (src/releases). */
export default async function Home() {
  const release = await getLatestRelease();
  return (
    <>
      <JsonLd data={buildSoftwareApplication(SITE_URL, release)} />
      <JsonLd data={buildFaqPage()} />
      <SiteHeader release={release} />
      <main>
        <Hero release={release} />
        <Features />
        <Safety />
        <Platforms release={release} />
        <Faq />
      </main>
      <SiteFooter release={release} />
    </>
  );
}
