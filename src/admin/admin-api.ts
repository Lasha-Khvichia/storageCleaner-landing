/** The backend admin routes, one function each. Server-side only. */
import { isAdminRelease, isAdminReleaseList, isAuditList, isSyncStatus } from "./admin-guard.ts";
import { callBackend, type BackendAccess } from "./api-client.ts";

export type ReleaseChange = "hide" | "show" | "remove" | "restore";

export function adminApi(access: BackendAccess) {
  return {
    releases: () => callBackend(access, { method: "GET", path: "/releases", guard: isAdminReleaseList }),
    audit: (limit = 50) => callBackend(access, { method: "GET", path: `/audit?limit=${limit}`, guard: isAuditList }),
    syncStatus: () => callBackend(access, { method: "GET", path: "/sync-status", guard: isSyncStatus }),
    syncNow: () => callBackend(access, { method: "POST", path: "/sync", guard: isSyncStatus, timeoutMs: 45000 }),
    change: (id: number, change: ReleaseChange) => {
      const base = { guard: isAdminRelease, path: `/releases/${id}` };
      if (change === "hide" || change === "show") {
        return callBackend(access, { ...base, method: "PATCH", body: { hidden: change === "hide" } });
      }
      return callBackend(access, { ...base, method: "POST", path: `${base.path}/${change}` });
    },
  };
}
