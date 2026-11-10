/** Runtime checks of the backend's admin JSON: the network is not trusted to match the types. */
import { isInstaller } from "../releases/release-guard.ts";
import type { AdminRelease, AuditEntry, SyncStatus } from "./types.ts";

type Obj = Record<string, unknown>;

const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const isText = (v: unknown): v is string => typeof v === "string" && v.length > 0;
const isInt = (v: unknown): v is number => typeof v === "number" && Number.isInteger(v);
const isTime = (v: unknown): v is string => isText(v) && !Number.isNaN(Date.parse(v));
const orNull = <T>(check: (v: unknown) => v is T) => (v: unknown): v is T | null => v === null || check(v);
const isCount = (v: unknown): v is number => isInt(v) && v >= 0;

export function isAdminRelease(v: unknown): v is AdminRelease {
  return (
    isObj(v) &&
    isInt(v.id) &&
    isText(v.version) &&
    orNull(isText)(v.prerelease) &&
    isTime(v.releasedAt) &&
    isText(v.notesUrl) &&
    typeof v.hidden === "boolean" &&
    orNull(isTime)(v.removedAt) &&
    orNull(isInt)(v.githubReleaseId) &&
    isTime(v.createdAt) &&
    isTime(v.updatedAt) &&
    Array.isArray(v.installers) &&
    v.installers.every(isInstaller)
  );
}

export const isAdminReleaseList = (v: unknown): v is AdminRelease[] => Array.isArray(v) && v.every(isAdminRelease);

const ACTIONS = ["hide", "show", "remove", "restore", "sync"];

function isAuditEntry(v: unknown): v is AuditEntry {
  return (
    isObj(v) &&
    isInt(v.id) &&
    isTime(v.at) &&
    isInt(v.githubUserId) &&
    isText(v.githubLogin) &&
    typeof v.action === "string" &&
    ACTIONS.includes(v.action) &&
    orNull(isInt)(v.releaseId) &&
    (v.detail === null || typeof v.detail === "string")
  );
}

export const isAuditList = (v: unknown): v is AuditEntry[] => Array.isArray(v) && v.every(isAuditEntry);

export function isSyncStatus(v: unknown): v is SyncStatus {
  return (
    isObj(v) &&
    typeof v.running === "boolean" &&
    orNull(isTime)(v.startedAt) &&
    orNull(isTime)(v.finishedAt) &&
    (v.result === null || typeof v.result === "string") &&
    isObj(v.counts) &&
    isCount(v.counts.added) &&
    isCount(v.counts.updated) &&
    isCount(v.counts.skipped)
  );
}
