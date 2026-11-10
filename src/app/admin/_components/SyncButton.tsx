"use client";

import { useActionState } from "react";
import { syncNowAction } from "@/admin/actions";
import { BUTTON_PRIMARY } from "./button-style";
import { useActionToast } from "./useActionToast";

export function SyncButton() {
  const [state, run, pending] = useActionState(syncNowAction, null);
  useActionToast(state);
  return (
    <form action={run}>
      <button type="submit" disabled={pending} className={BUTTON_PRIMARY}>
        {pending ? "Syncing..." : "Sync now"}
      </button>
    </form>
  );
}
