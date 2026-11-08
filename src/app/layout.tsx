import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "storageCleaner: see what fills your disk, free it safely",
  description:
    "Free disk analyzer and safe cleaner for Windows and Linux. Scan whole drives, see what uses your space, and delete only what is safe.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
