/** The backend admin routes, one function each. Server-side only. */
import { isAdminRelease, isAdminReleaseList, isAuditList, isSyncStatus } from "./admin-guard.ts";
import { PAGE_SIZE } from "./paging.ts";
import { callBackend, callBackendPage, type BackendAccess } from "./api-client.ts";

export type ReleaseChange = "hide" | "show" | "remove" | "restore";

const paging = (page: number) => `page=${page}&pageSize=${PAGE_SIZE}`;

export function adminApi(access: BackendAccess) {
  return {
    releases: (page: number) => callBackendPage(access, { method: "GET", path: `/releases?${paging(page)}`, guard: isAdminReleaseList }),
    audit: (page: number) => callBackendPage(access, { method: "GET", path: `/audit?${paging(page)}`, guard: isAuditList }),
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
