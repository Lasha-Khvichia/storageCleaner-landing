"use client";

import { useActionState } from "react";
import { syncNowAction } from "@/admin/actions";
import { BUTTON_PRIMARY } from "./button-style";

export function SyncButton() {
  const [state, run, pending] = useActionState(syncNowAction, null);
  return (
    <form action={run} className="flex flex-wrap items-center gap-3">
      <button type="submit" disabled={pending} className={BUTTON_PRIMARY}>
        {pending ? "Syncing..." : "Sync now"}
      </button>
      {state && (
        <span role="status" className={state.ok ? "text-sm text-positive-300" : "text-sm text-review"}>
          {state.message}
        </span>
      )}
    </form>
  );
}
