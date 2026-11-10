import type { MetadataRoute } from "next";
import { getLatestRelease } from "@/releases/latest-release.ts";
import { SITE_URL } from "@/seo/site-url";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const release = await getLatestRelease();
  return [
    {
      url: SITE_URL,
      lastModified: release ? new Date(release.releasedAt) : undefined,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
