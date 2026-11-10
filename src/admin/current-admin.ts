/** Who is looking at an admin page or running an action. Server-side only (reads cookies). */
import { cookies } from "next/headers";
import { readAdminConfig, type AdminConfig } from "./config.ts";
import { ADMIN_COOKIE } from "./cookie-options.ts";
import { openSession, type AdminSession } from "./session.ts";

export type AdminContext =
  | { state: "unconfigured" }
  | { state: "anonymous"; config: AdminConfig }
  | { state: "signed-in"; config: AdminConfig; session: AdminSession };

export async function getAdminContext(): Promise<AdminContext> {
  const config = readAdminConfig(process.env);
  if (config === null) return { state: "unconfigured" };
  const store = await cookies();
  const session = await openSession(store.get(ADMIN_COOKIE)?.value, config.sessionKeys);
  // A valid cookie for another GitHub id can only exist after a key leak; refuse it anyway.
  if (session === null || session.userId !== config.userId) return { state: "anonymous", config };
  return { state: "signed-in", config, session };
}
