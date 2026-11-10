import type { MetadataRoute } from "next";
import { BRAND, SITE_DESCRIPTION, SITE_NAME } from "@/seo/site-info";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "browser",
    theme_color: BRAND.background,
    background_color: BRAND.background,
    icons: [{ src: "/logo.png", sizes: "256x256", type: "image/png" }],
  };
}
