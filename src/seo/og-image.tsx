import { ImageResponse } from "next/og";
import type { Release } from "@/releases/types.ts";
import { BRAND, SITE_NAME } from "./site-info";

const OG_SIZE = { width: 1200, height: 630 };

/** The 1200x630 share image in the Ember colours; the version badge only when a release is known. */
export function renderOgImage(release: Release | null): ImageResponse {
  const badge = release ? `v${release.version}  ·  Free for Windows and Linux` : "Free for Windows and Linux";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: `radial-gradient(circle at 85% 10%, rgba(255,122,47,0.28), ${BRAND.background} 60%)`,
          color: BRAND.text,
        }}
      >
        <div style={{ display: "flex", fontSize: 40, fontWeight: 700, color: BRAND.accentLight }}>{SITE_NAME}</div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 36, fontSize: 88, fontWeight: 800, lineHeight: 1.05 }}>
          <span>See what fills your disk.</span>
          <span style={{ color: BRAND.accent }}>Free it safely.</span>
        </div>
        <div style={{ display: "flex", marginTop: 48, fontSize: 32, color: BRAND.muted }}>{badge}</div>
        <div
          style={{ display: "flex", marginTop: 28, fontSize: 26, color: BRAND.positive }}
        >
          Safe, Review, Protected: every item rated, nothing deleted without you.
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
