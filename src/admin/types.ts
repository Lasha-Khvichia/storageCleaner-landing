/** What the backend's admin API returns (see the backend's src/admin/admin-response.dto.ts). */
import type { Installer } from "../releases/types.ts";

export interface AdminRelease {
  id: number;
  version: string;
  prerelease: string | null;
  releasedAt: string;
  notesUrl: string;
  hidden: boolean;
  removedAt: string | null;
  githubReleaseId: number | null;
  createdAt: string;
  updatedAt: string;
  installers: Installer[];
}

export type AuditAction = "hide" | "show" | "remove" | "restore" | "sync";

export interface AuditEntry {
  id: number;
  at: string;
  githubUserId: number;
  githubLogin: string;
  action: AuditAction;
  releaseId: number | null;
  detail: string | null;
}

export interface SyncStatus {
  running: boolean;
  startedAt: string | null;
  finishedAt: string | null;
  result: string | null;
  counts: { added: number; updated: number; skipped: number };
}
