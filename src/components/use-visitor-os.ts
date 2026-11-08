"use client";

import { useSyncExternalStore } from "react";
import { detectOs } from "@/releases/recommend-installer.ts";
import type { OsId } from "@/releases/types.ts";

const noSubscription = () => () => {};

/**
 * The visitor's OS, read from the browser. `null` while rendering on the
 * server and for systems we have no installer for, so the first paint
 * always matches the server HTML.
 */
export function useVisitorOs(): OsId | null {
  return useSyncExternalStore(
    noSubscription,
    () => detectOs(navigator.userAgent),
    () => null,
  );
}
