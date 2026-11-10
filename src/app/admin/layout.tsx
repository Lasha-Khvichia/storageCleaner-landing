import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  alternates: { canonical: null },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <main className="mx-auto w-full max-w-5xl px-4 py-8 text-fg sm:px-6">{children}</main>;
}
