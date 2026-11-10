/** Every Server Action starts here: same-origin check, then a valid admin session. */
import { headers } from "next/headers";
import { adminApi } from "./admin-api.ts";
import { getAdminContext } from "./current-admin.ts";
import { isSameOrigin } from "./origin.ts";

export interface ActionState {
  ok: boolean;
  message: string;
}

type Guarded = { allowed: true; api: ReturnType<typeof adminApi> } | { allowed: false; state: ActionState };

const refuse = (message: string): Guarded => ({ allowed: false, state: { ok: false, message } });

export async function guardAction(): Promise<Guarded> {
  const context = await getAdminContext();
  if (context.state === "unconfigured") return refuse("Admin is not configured.");
  if (!isSameOrigin(await headers(), context.config.origin)) return refuse("Request refused: wrong origin.");
  if (context.state !== "signed-in") return refuse("Your session has ended. Sign in again.");
  const { apiUrl, serviceKey } = context.config;
  return { allowed: true, api: adminApi({ apiUrl, serviceKey, token: context.session.token }) };
}
