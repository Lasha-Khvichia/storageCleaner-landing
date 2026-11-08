export type SafetyLevel = "safe" | "review" | "unknown" | "protected";

export interface SafetyLevelInfo {
  level: SafetyLevel;
  name: string;
  body: string;
  examples: string;
  /** Tailwind classes from src/styles/theme.css. */
  text: string;
  dot: string;
}

/** The four ratings, worded as in the app's Settings → "How safety ratings work". */
export const SAFETY_LEVELS: SafetyLevelInfo[] = [
  {
    level: "safe",
    name: "Safe",
    body: "Rebuilt automatically or never needed again.",
    examples: "Caches, temp files, crash dumps, node_modules, build output",
    text: "text-safe",
    dot: "bg-safe",
  },
  {
    level: "review",
    name: "Review",
    body: "Probably removable, but it's your data. Look first.",
    examples: "Downloads, old installers, logs, large files untouched for years",
    text: "text-review",
    dot: "bg-review",
  },
  {
    level: "unknown",
    name: "Unknown",
    body: "No rule matched. Only delete it if you know what it is.",
    examples: "Everything no rule recognises",
    text: "text-neutral-400",
    dot: "bg-unknown",
  },
  {
    level: "protected",
    name: "Protected",
    body: "Deleting it would break the system or your programs. Always blocked.",
    examples: "Windows, /usr, Program Files, ~/.config, system backups, drive roots",
    text: "text-protected",
    dot: "bg-protected",
  },
];
