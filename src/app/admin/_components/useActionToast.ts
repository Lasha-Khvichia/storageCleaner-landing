"use client";

import { useEffect, useRef } from "react";
import type { ActionState } from "@/admin/action-guard";
import { useShowToast } from "./ToastProvider";

/** Shows a toast once for each new `useActionState` result object. */
export function useActionToast(state: ActionState | null): void {
  const show = useShowToast();
  const shown = useRef<ActionState | null>(null);
  useEffect(() => {
    if (state === null || state === shown.current) return;
    shown.current = state;
    show(state.ok, state.message);
  }, [state, show]);
}
