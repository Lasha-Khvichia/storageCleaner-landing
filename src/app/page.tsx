import { SiteHeader } from "@/components/header/SiteHeader";
import { Hero } from "@/components/hero/Hero";
import { Features } from "@/components/sections/Features";
import { Platforms } from "@/components/sections/Platforms";
import { Safety } from "@/components/sections/Safety";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { getLatestRelease } from "@/releases/latest-release.ts";

/** The landing page. Release data comes from one place (src/releases). */
export default async function Home() {
  const release = await getLatestRelease();
  return (
    <>
      <SiteHeader release={release} />
      <main>
        <Hero release={release} />
        <Features />
        <Safety />
        <Platforms release={release} />
      </main>
      <SiteFooter release={release} />
    </>
  );
}
