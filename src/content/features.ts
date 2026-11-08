import { BarChart3, History, LayoutGrid, ShieldCheck, Sparkles, Trash2, type LucideIcon } from "lucide-react";

export interface Feature {
  icon: LucideIcon;
  title: string;
  body: string;
}

/** What the app does (matches storageCleaner's README). */
export const FEATURES: Feature[] = [
  {
    icon: LayoutGrid,
    title: "Full disk report",
    body: "An interactive space map and a size-sorted folder tree, plus the largest files and file types. A whole drive scans in seconds.",
  },
  {
    icon: ShieldCheck,
    title: "A safety rating on everything",
    body: "Every file and folder is rated Safe, Review, Unknown or Protected, and each rating tells you why.",
  },
  {
    icon: Sparkles,
    title: "Recommended cleanups",
    body: "Ready-made plans ranked by space, safety and how long things have sat unused: “You can safely free 23 GB.”",
  },
  {
    icon: Trash2,
    title: "Safe deletion",
    body: "Deleted items go to the Recycle Bin or Trash. System folders are blocked, and every path is checked again right before it is deleted.",
  },
  {
    icon: History,
    title: "History and restore",
    body: "Every cleanup is logged. Restore any of it from the trash with one click.",
  },
  {
    icon: BarChart3,
    title: "Free-space analytics",
    body: "A graph of free space on every drive over time, so you see what grew and when.",
  },
];
