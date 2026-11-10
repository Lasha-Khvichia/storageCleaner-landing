/** Runtime check of the backend's JSON: the network is not trusted to match the types. */
import type { Installer, Release } from "./types.ts";

type Obj = Record<string, unknown>;

const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const isText = (v: unknown): v is string => typeof v === "string" && v.length > 0;

function isHttpsUrl(v: unknown): v is string {
  if (typeof v !== "string") return false;
  try {
    return new URL(v).protocol === "https:";
  } catch {
    return false;
  }
}

export function isInstaller(v: unknown): v is Installer {
  return (
    isObj(v) &&
    isText(v.id) &&
    (v.os === "windows" || v.os === "linux") &&
    (v.kind === "nsis" || v.kind === "deb" || v.kind === "appimage") &&
    isText(v.label) &&
    isText(v.detail) &&
    isText(v.fileName) &&
    typeof v.sizeBytes === "number" &&
    Number.isFinite(v.sizeBytes) &&
    v.sizeBytes >= 0 &&
    isHttpsUrl(v.url)
  );
}

export function isRelease(v: unknown): v is Release {
  return (
    isObj(v) &&
    isText(v.version) &&
    /^\d+(\.\d+)*$/.test(v.version) &&
    isText(v.releasedAt) &&
    !Number.isNaN(Date.parse(v.releasedAt)) &&
    isHttpsUrl(v.notesUrl) &&
    Array.isArray(v.installers) &&
    v.installers.every(isInstaller)
  );
}
