import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { BRAND, SITE_DESCRIPTION, SITE_NAME } from "@/seo/site-info";
import { SITE_URL } from "@/seo/site-url";
import "@/styles/globals.css";

const TITLE = "storageCleaner: free disk cleaner for Windows and Linux";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: `%s · ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  creator: SITE_NAME,
  category: "utilities",
  keywords: ["disk cleaner", "disk analyzer", "free up disk space", "Windows", "Linux", "storage cleaner"],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: "/",
    title: TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: SITE_DESCRIPTION },
};

export const viewport: Viewport = { themeColor: BRAND.background, colorScheme: "dark" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
