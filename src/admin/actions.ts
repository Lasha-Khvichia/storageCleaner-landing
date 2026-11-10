"use server";

import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { guardAction, type ActionState } from "./action-guard.ts";
import { getAdminContext } from "./current-admin.ts";
import { ADMIN_COOKIE, cookieOptions } from "./cookie-options.ts";
import { isSameOrigin } from "./origin.ts";

const CHANGES = { hide: "hidden", show: "shown", remove: "removed", restore: "restored" } as const;

function isChange(value: unknown): value is keyof typeof CHANGES {
  return typeof value === "string" && Object.hasOwn(CHANGES, value);
}

/** Hide, show, remove or restore one release (form fields: id, change). */
export async function changeReleaseAction(_previous: ActionState | null, form: FormData): Promise<ActionState> {
  const guarded = await guardAction();
  if (!guarded.allowed) return guarded.state;
  const id = Number(form.get("id"));
  const change = form.get("change");
  if (!Number.isSafeInteger(id) || id < 1 || !isChange(change)) return { ok: false, message: "Invalid request." };
  const result = await guarded.api.change(id, change);
  if (!result.ok) return { ok: false, message: result.message };
  revalidatePath("/admin");
  return { ok: true, message: `Version ${result.data.version} ${CHANGES[change]}.` };
}

/** Run the GitHub sync now. */
export async function syncNowAction(): Promise<ActionState> {
  const guarded = await guardAction();
  if (!guarded.allowed) return guarded.state;
  const result = await guarded.api.syncNow();
  if (!result.ok) return { ok: false, message: result.message };
  revalidatePath("/admin");
  return { ok: true, message: `Sync finished: ${result.data.result ?? "no result"}.` };
}

/** Delete the session cookie (POST, same-origin only). */
export async function logoutAction(): Promise<void> {
  const context = await getAdminContext();
  if (context.state !== "unconfigured" && isSameOrigin(await headers(), context.config.origin)) {
    (await cookies()).set(ADMIN_COOKIE, "", cookieOptions(0));
  }
  redirect("/admin");
}
