import { getLatestRelease } from "@/releases/latest-release.ts";
import { renderOgImage } from "@/seo/og-image";

export const alt = "storageCleaner: see what fills your disk and free it safely. Free for Windows and Linux.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 60;

export default async function TwitterImage() {
  return renderOgImage(await getLatestRelease());
}
